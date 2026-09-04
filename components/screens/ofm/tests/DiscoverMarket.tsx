"use client";

/* Discover — the "Discover" nav destination, and the scene for beats d3–d5.
   A full-width feed of the verified marketplace; clicking a candidate slides a
   detail overlay in from the right. The `phase` prop drives which beat this is:
     feed     (d3) — the market, overlay closed
     trust    (d4) — overlay open on Test result, the "you can trust it" layer
     portable (d5) — overlay open on Test result, the "carry it everywhere" layer
   Kibo system (zinc + ofm). */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";
import DashboardShell from "@/components/screens/ofm/DashboardShell";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  POOL,
  FeedRow,
  CandidateDrawer,
  type Phase,
  type Tab,
} from "./candidateShared";

const Crumbs = (
  <div className="flex min-w-0 items-center gap-1.5">
    <span className="truncate text-ofm-display font-semibold text-zinc-900">
      Discover
    </span>
  </div>
);

export default function DiscoverMarket({ phase = "feed" }: { phase?: Phase }) {
  const reduced = useReducedMotion();
  const overlayPhase = phase !== "feed";
  // the overlay beats play as a real interaction. d4 (trust): a cursor clicks
  // Maria's row and the detail slides in. The Experience and Portable beats
  // continue from there — the overlay is ALREADY open (carried over from the
  // previous beat) and the cursor only clicks the next tab. Reduced-motion
  // just shows the resolved state.
  const cursorDemo = phase !== "feed" && !reduced;
  const clicksTab: Tab | null =
    phase === "portable"
      ? "Test result"
      : phase === "experience"
      ? "Experience"
      : null;
  // the tab each tab-click beat picks up from (story continuity: d4 ended on
  // Overview; the Experience beat ended on Experience)
  const carriedTab: Tab = phase === "portable" ? "Experience" : "Overview";

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(overlayPhase && (!cursorDemo || !!clicksTab));
  const [demoTab, setDemoTab] = useState<Tab | null>(null);
  const [demoStage, setDemoStage] = useState<
    | "idle"
    | "hover"
    | "press"
    | "open"
    | "tabMove"
    | "tabPress"
    | "tabDone"
    | "done"
  >("idle");

  // sync overlay state to the beat's phase on (re)mount
  useEffect(() => {
    setSelected(0);
    setOpen(overlayPhase && (!cursorDemo || !!clicksTab));
    setDemoTab(null);
  }, [overlayPhase, cursorDemo, clicksTab]);

  // the scripted cursor sequence
  useEffect(() => {
    if (!cursorDemo) return;
    setDemoStage("idle");
    setSelected(0);

    if (clicksTab) {
      // overlay-only: already open on the carried tab; cursor clicks the next
      setOpen(true);
      setDemoTab(carriedTab);
      const timers = [
        setTimeout(() => setDemoStage("tabMove"), 400),
        setTimeout(() => setDemoStage("tabPress"), 1300),
        setTimeout(() => {
          setDemoStage("tabDone");
          setDemoTab(clicksTab);
        }, 1500),
        setTimeout(() => setDemoStage("done"), 2050),
      ];
      return () => timers.forEach(clearTimeout);
    }

    // d4 — the full interaction: cursor clicks Maria, the overlay slides in
    setOpen(false);
    setDemoTab(null);
    const timers = [
      setTimeout(() => setDemoStage("hover"), 350),
      setTimeout(() => setDemoStage("press"), 1150),
      setTimeout(() => {
        setDemoStage("open");
        setOpen(true);
      }, 1350),
      setTimeout(() => setDemoStage("done"), 1850),
    ];
    return () => timers.forEach(clearTimeout);
  }, [cursorDemo, clicksTab, carriedTab]);

  /* scores "land" one by one on open */
  const [stamped, setStamped] = useState(reduced ? POOL.length : 0);
  useEffect(() => {
    if (reduced) return;
    setStamped(0);
    const t = POOL.map((_, i) =>
      setTimeout(() => setStamped((n) => Math.max(n, i + 1)), 160 + i * 85)
    );
    return () => t.forEach(clearTimeout);
  }, [reduced]);

  const openCandidate = (i: number) => {
    setSelected(i);
    setOpen(true);
  };

  // the drawer slides in when the cursor (or the user) opens it; the tab-click
  // beats start already open — carried over from the previous beat — so no
  // slide. Reduced-motion shows it already in place.
  const slideIn = !reduced && !clicksTab;

  // the cursor is over a tab (inside the drawer) during the second click.
  // Right-anchored offset from the container edge: the drawer is a fixed 520
  // wide, so the middle (Experience) tab sits further left than Test result.
  const onTab =
    demoStage === "tabMove" ||
    demoStage === "tabPress" ||
    demoStage === "tabDone";
  const tabRight = clicksTab === "Experience" ? 374 : 270;

  return (
    <DashboardShell activeNav="Discover" headerLeft={Crumbs}>
      <div className="relative isolate flex h-full">
        {/* ── the marketplace feed (full width) ── */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="shrink-0 border-b border-zinc-200/70 px-5 py-2.5">
            <div className="flex items-center justify-between gap-3">
              <div className="relative min-w-0 flex-1">
                <Search
                  className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                  strokeWidth={2}
                />
                <Input
                  placeholder="Search skills, roles, or names"
                  className="h-8 w-full pl-8 pr-28 text-ofm-label"
                />
                {/* live result count, inside the search field */}
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ofm-caption text-zinc-500">
                  <span className="font-semibold tabular-nums text-zinc-700">
                    12,428
                  </span>{" "}
                  candidates
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-ofm-label font-medium text-zinc-600"
              >
                <SlidersHorizontal className="size-3.5" />
                Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-ofm-label font-medium text-zinc-600"
              >
                Best match
                <ChevronDown className="size-3.5 text-zinc-400" />
              </Button>
            </div>
          </div>

          <ScrollArea type="scroll" className="min-h-0 flex-1">
            {POOL.map((cand, i) => (
              <FeedRow
                key={cand.name}
                c={cand}
                active={
                  (open && i === selected) ||
                  (cursorDemo &&
                    i === 0 &&
                    (demoStage === "hover" || demoStage === "press"))
                }
                landed={stamped > i}
                onSelect={() => openCandidate(i)}
                mode="market"
              />
            ))}
          </ScrollArea>
        </div>

        {/* ── the detail overlay (slides in from the right) ── */}
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                className="absolute inset-0 bg-zinc-900/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !overlayPhase && setOpen(false)}
              />
              <motion.aside
                className="absolute bottom-0 right-0 top-0 w-[520px] border-l border-zinc-200/70 bg-white shadow-2xl"
                initial={slideIn ? { x: "100%" } : { x: 0 }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 36 }}
              >
                <CandidateDrawer
                  c={POOL[selected]}
                  phase={phase}
                  demoTab={demoTab}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ── scripted cursor. d4: clicks Maria in the feed. Tab beats: lives
            on the overlay only — glides up from mid-drawer to the next tab ── */}
        {cursorDemo && demoStage !== "idle" && demoStage !== "done" && (
          <motion.div
            className="pointer-events-none absolute top-0 z-[100]"
            style={clicksTab ? { right: tabRight } : { left: 0 }}
            initial={
              clicksTab
                ? { x: 26, y: 450, opacity: 0 }
                : { x: 470, y: 560, opacity: 0 }
            }
            animate={{
              x: clicksTab ? 0 : 232,
              y: clicksTab ? 92 : 82,
              // fade out at Maria as the overlay opens (d4); on the tab beats,
              // fade out once the tab is clicked
              opacity:
                demoStage === "open" || demoStage === "tabDone" ? 0 : 1,
              scale:
                demoStage === "press" || demoStage === "tabPress" ? 0.82 : 1,
            }}
            transition={{
              x: { type: "spring", stiffness: 90, damping: 18 },
              y: { type: "spring", stiffness: 90, damping: 18 },
              scale: { duration: 0.14 },
              opacity: { duration: 0.3 },
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 2.5l13.5 7.7-5.8 1.4-3.3 6.9L5 2.5z"
                fill="#18181b"
                stroke="#fff"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            {/* click ripple, fires on each press */}
            {(demoStage === "press" ||
              demoStage === "open" ||
              demoStage === "tabPress" ||
              demoStage === "tabDone") && (
              <motion.span
                key={onTab ? "tab" : "card"}
                className="absolute left-[4px] top-[3px] rounded-full border-2 border-ofm-600"
                initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 0.55 }}
                animate={{ width: 34, height: 34, x: -17, y: -17, opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            )}
          </motion.div>
        )}
      </div>
    </DashboardShell>
  );
}
