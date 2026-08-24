"use client";

/* Full Flow · beat 3 — "The person behind the card."

   Open an applicant and the board steps aside for the whole picture. One panel
   absorbs the auditable score (skills / experience / role fit), the practical
   remote-hire facts, languages, work history, and the resume. Slides over a
   lightly veiled board. OFM Kibo system, inside DashboardShell. */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronRight,
  X,
  Sparkle,
  MessageSquare,
  ArrowRight,
  MoreHorizontal,
  MapPin,
  CalendarDays,
  Clock,
  FileText,
  Download,
} from "lucide-react";
import DashboardShell from "@/components/screens/ofm/DashboardShell";
import PipelineBoard, {
  dp,
  signals,
  type Candidate,
} from "@/components/screens/ofm/kanban/PipelineBoard";

const SARAH: Candidate = {
  name: "Sarah Chen",
  role: "Senior Chatter",
  ago: "2d",
  score: 92,
  skills: ["88 WPM", "Retention", "PPV", "Upsells"],
  img: "photo-1494790108377-be9c29b29330",
};

const Crumbs = (
  <div className="flex min-w-0 items-center gap-1.5">
    <button className="shrink-0 text-ofm-body font-normal text-zinc-400 hover:text-zinc-600">
      Jobs
    </button>
    <ChevronRight className="size-4 shrink-0 text-zinc-300" strokeWidth={2} />
    <button className="shrink-0 text-ofm-body font-normal text-zinc-400 hover:text-zinc-600">
      Virtual Chatter
    </button>
    <ChevronRight className="size-4 shrink-0 text-zinc-300" strokeWidth={2} />
    <span className="truncate text-ofm-display font-semibold text-zinc-900">Sarah Chen</span>
  </div>
);

type Pt = { x: number; y: number };
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* macOS-style demo cursor — same pattern as the chat/edit-stages beats */
function Cursor({ entry, target, pressed }: { entry: Pt; target: Pt; pressed: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 z-40"
      initial={{ x: entry.x, y: entry.y, opacity: 0 }}
      animate={{ x: target.x, y: target.y, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.75, ease: EASE, opacity: { duration: 0.3 } }}
    >
      {pressed && (
        <motion.span
          className="absolute -left-1.5 -top-1.5 block size-7 rounded-full bg-ofm-500/25"
          initial={{ scale: 0, opacity: 0.7 }}
          animate={{ scale: 1.7, opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      )}
      <motion.svg
        width="22"
        height="22"
        viewBox="0 0 20 20"
        fill="none"
        animate={{ scale: pressed ? 0.82 : 1 }}
        transition={{ duration: 0.12 }}
        style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.25))" }}
      >
        <path
          d="M3 2 L3 16.5 L6.8 12.9 L9.2 18.2 L11.6 17.1 L9.2 11.9 L14.4 11.9 Z"
          fill="#18181b"
          stroke="#ffffff"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.div>
  );
}

function Bar({ label, v }: { label: string; v: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-ofm-label font-medium text-zinc-600">{label}</span>
        <span className="text-ofm-label font-semibold tabular-nums text-zinc-900">{v}</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
        <div className="h-full rounded-full bg-ofm-500" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

export default function CandidateProfileScreen() {
  const sig = signals(SARAH);
  const reduceMotion = useReducedMotion();
  /* scrollbar shows only while actively scrolling (parity with JobPostScreen) */
  const [scrolling, setScrolling] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    },
    [],
  );

  /* choreography: cursor glides to Sarah's card, clicks, panel slides in,
     then the panel body tours the profile (scroll down, hold, return) */
  const rootRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const scrollRaf = useRef(0);
  const [cardPt, setCardPt] = useState<Pt | null>(null);
  const [pressed, setPressed] = useState(false);
  const [cursorGone, setCursorGone] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setOpen(true);
      return;
    }
    const easeInOut = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const tweenScroll = (to: number, dur: number, done?: () => void) => {
      const el = bodyRef.current;
      if (!el) return;
      const from = el.scrollTop;
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        el.scrollTop = from + (to - from) * easeInOut(p);
        if (p < 1) scrollRaf.current = requestAnimationFrame(step);
        else done?.();
      };
      scrollRaf.current = requestAnimationFrame(step);
    };
    const timers: ReturnType<typeof setTimeout>[] = [];
    /* tour the profile once the panel has settled */
    timers.push(
      setTimeout(() => {
        const el = bodyRef.current;
        if (!el) return;
        const max = el.scrollHeight - el.clientHeight;
        if (max <= 0) return;
        tweenScroll(max, 3200, () => {
          timers.push(setTimeout(() => tweenScroll(0, 900), 900));
        });
      }, 2900),
    );
    timers.push(
      setTimeout(() => {
        const root = rootRef.current;
        const canvas = root?.closest("[data-stage-canvas]") as HTMLElement | null;
        const el = root?.querySelector('[data-card="Sarah Chen"]');
        if (root && el) {
          /* cursor coords must be relative to the shell's content slot (the
             cursor's positioning container), NOT the stage canvas — the slot
             sits 264px (sidebar) + 60px (toolbar) into the canvas. The canvas
             is only used to derive the current stage scale. */
          const rr = root.getBoundingClientRect();
          const er = el.getBoundingClientRect();
          const scale = canvas ? canvas.getBoundingClientRect().width / 1440 : 1;
          setCardPt({
            x: (er.left - rr.left + er.width / 2) / (scale || 1),
            y: (er.top - rr.top + er.height / 2) / (scale || 1),
          });
        } else {
          setOpen(true); // fallback: no target found, open directly
        }
      }, 500),
    );
    timers.push(setTimeout(() => setPressed(true), 1550));
    timers.push(setTimeout(() => setOpen(true), 1750));
    timers.push(setTimeout(() => setCursorGone(true), 2300));
    return () => {
      timers.forEach(clearTimeout);
      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current);
    };
  }, [reduceMotion]);

  return (
    <DashboardShell activeNav="Jobs" headerLeft={Crumbs}>
      {/* board behind — fully visible until the click; recedes under a light
          veil once the panel opens (side-peek pattern) */}
      <div ref={rootRef} className="pointer-events-none absolute inset-0">
        <PipelineBoard />
      </div>
      {/* system scrim — same light zinc veil as the Edit-stages modal */}
      {open && (
        <motion.div
          className="absolute inset-0 bg-zinc-900/10"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* demo cursor — click on Sarah's card triggers the panel */}
      <AnimatePresence>
        {cardPt && !cursorGone && !reduceMotion && (
          <Cursor
            entry={{ x: cardPt.x - 60, y: cardPt.y + 180 }}
            target={cardPt}
            pressed={pressed}
          />
        )}
      </AnimatePresence>

      {/* detached slide-over — enters fully from the right edge; floating-
          overlay elevation matches the chat widget's */}
      {open && (
      <motion.aside
        className="absolute inset-y-3 right-3 flex w-[560px] flex-col overflow-hidden rounded-xl border border-zinc-200/70 bg-white shadow-[0_24px_70px_-15px_rgba(0,0,0,0.3)]"
        initial={reduceMotion ? false : { x: 600 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
      >
        {/* header — avatar optically centered on the text block; score chip
            anchored to the name line (board-card idiom); close pinned to the
            panel corner */}
        <div className="relative flex items-center gap-4 border-b border-zinc-200/70 px-5 py-5">
          <button className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100">
            <X className="size-4" strokeWidth={2} />
          </button>
          <span className="relative shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dp(SARAH.img)}
              alt=""
              className="size-14 rounded-full object-cover ring-1 ring-zinc-200/70"
            />
            {/* online — Fiverr-style presence dot */}
            <span className="absolute bottom-0.5 right-0.5 size-3 rounded-full bg-ofm-500 ring-2 ring-white" />
          </span>
          <div className="min-w-0 flex-1 pr-8">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-ofm-display font-semibold leading-tight text-zinc-900">
                {SARAH.name}
              </h2>
              <span className="flex shrink-0 items-center gap-0.5 rounded-md bg-ofm-900 py-0.5 pl-1 pr-1.5 text-ofm-label font-bold tabular-nums text-white">
                <Sparkle className="size-2.5" strokeWidth={2.5} fill="currentColor" />
                {SARAH.score}
              </span>
            </div>
            <p className="mt-0.5 text-ofm-body text-zinc-500">{SARAH.role}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-ofm-caption text-zinc-400">
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" strokeWidth={2} />
                San Francisco, CA
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays className="size-3.5" strokeWidth={2} />
                Applied {SARAH.ago} ago
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" strokeWidth={2} />
                Avg response 5 min
              </span>
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="flex items-center gap-2 border-b border-zinc-200/70 px-5 py-3">
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-ofm-600 py-2 text-ofm-label font-semibold text-white hover:bg-ofm-700">
            <MessageSquare className="size-4" strokeWidth={2} />
            Message
          </button>
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-200/70 py-2 text-ofm-label font-medium text-zinc-700 hover:bg-zinc-50">
            Move stage
            <ArrowRight className="size-4 text-zinc-400" strokeWidth={2} />
          </button>
          <button className="flex size-9 items-center justify-center rounded-lg border border-zinc-200/70 text-zinc-400 hover:bg-zinc-50">
            <MoreHorizontal className="size-4" strokeWidth={2} />
          </button>
        </div>

        {/* body */}
        <div
          ref={bodyRef}
          onScroll={() => {
            setScrolling(true);
            if (hideTimer.current) clearTimeout(hideTimer.current);
            hideTimer.current = setTimeout(() => setScrolling(false), 800);
          }}
          style={{ scrollbarColor: scrolling ? "#d4d4d8 transparent" : "transparent transparent" }}
          className={`min-h-0 flex-1 overflow-y-auto px-5 py-4 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full ${
            scrolling
              ? "[&::-webkit-scrollbar-thumb]:bg-zinc-300"
              : "[&::-webkit-scrollbar-thumb]:bg-transparent"
          }`}
        >
          {/* match breakdown */}
          <section className="rounded-xl border border-zinc-200/70 bg-zinc-50/40 p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-ofm-label font-semibold text-zinc-900">
                <Sparkle className="size-4 text-ofm-600" strokeWidth={2} fill="currentColor" />
                AI match breakdown
              </span>
              <span className="text-ofm-caption text-zinc-400">Why {SARAH.score}?</span>
            </div>
            <div className="mt-4 space-y-3.5">
              {sig.map((s) => (
                <Bar key={s.label} label={s.label} v={s.v} />
              ))}
            </div>
            <p className="mt-4 border-t border-zinc-200/70 pt-3 text-ofm-caption leading-relaxed text-zinc-500">
              Strong written-English and retention signal, senior chatter experience, and a
              role fit that closely matches the posting. A fast first pass, not the final word.
            </p>
          </section>

          {/* about */}
          <section className="mt-5">
            <h3 className="text-ofm-label font-semibold text-zinc-900">About</h3>
            <p className="mt-2 text-ofm-body leading-relaxed text-zinc-600">
              Senior chatter with four years across two agencies, focused on retention and
              PPV conversion. Holds a creator&apos;s voice across hundreds of conversations.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SARAH.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-zinc-100 px-2 py-1 text-ofm-label font-medium text-zinc-600"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>

          {/* practical facts — remote-hire essentials, labeled-strip idiom */}
          <section className="mt-5">
            <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-zinc-200/70">
              {[
                ["Employment", "Full time"],
                ["Experience", "4 years"],
                ["Time zone", "PST (UTC-8)"],
                ["Internet", "45 Mbps"],
                ["Computer", "MacBook Air"],
                ["Payment", "PayPal"],
              ].map(([k, v], i) => (
                <div
                  key={k}
                  className={`px-4 py-3 ${i % 3 !== 0 ? "border-l border-zinc-200/70" : ""} ${
                    i > 2 ? "border-t border-zinc-200/70" : ""
                  }`}
                >
                  <p className="text-ofm-micro font-medium uppercase tracking-[0.06em] text-zinc-400">
                    {k}
                  </p>
                  <p className="mt-1 text-ofm-label font-semibold text-zinc-900">{v}</p>
                </div>
              ))}
            </div>
          </section>

          {/* languages */}
          <section className="mt-5">
            <h3 className="text-ofm-label font-semibold text-zinc-900">Languages</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {["English · C2", "Spanish · B1"].map((l) => (
                <span
                  key={l}
                  className="rounded-md bg-zinc-100 px-2 py-1 text-ofm-label font-medium text-zinc-600"
                >
                  {l}
                </span>
              ))}
            </div>
          </section>

          {/* work experience */}
          <section className="mt-5">
            <h3 className="text-ofm-label font-semibold text-zinc-900">Work experience</h3>
            <div className="mt-2 space-y-2">
              {[
                {
                  role: "Senior Chatter",
                  org: "Luna Management",
                  period: "2023 – Present · 2 yrs",
                  desc: "Ran night-shift chats for six creators. Held the team's top retention rate four quarters straight.",
                  chips: ["Retention", "Night shift"],
                },
                {
                  role: "Chatter",
                  org: "Halo Agency",
                  period: "2021 – 2023 · 2 yrs",
                  desc: "First chat seat. Learned voice matching and upsell pacing across three creator accounts.",
                  chips: ["Voice matching", "Upsells"],
                },
              ].map((job) => (
                <div key={job.org} className="rounded-lg border border-zinc-200/70 p-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block truncate text-ofm-label font-semibold text-zinc-900">
                        {job.role}
                      </span>
                      <span className="block truncate text-ofm-caption font-medium text-ofm-700">
                        {job.org}
                      </span>
                    </span>
                    <span className="shrink-0 text-ofm-caption text-zinc-400">{job.period}</span>
                  </div>
                  <p className="mt-2 text-ofm-caption leading-relaxed text-zinc-600">
                    {job.desc}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {job.chips.map((c) => (
                      <span
                        key={c}
                        className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-ofm-caption font-medium text-zinc-500"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* resume */}
          <section className="mt-5">
            <h3 className="text-ofm-label font-semibold text-zinc-900">Resume</h3>
            <div className="mt-2 flex items-center gap-3 rounded-lg border border-zinc-200/70 px-3 py-2.5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
                <FileText className="size-5" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-ofm-label font-medium text-zinc-900">
                  Sarah-Chen-Resume.pdf
                </span>
                <span className="block text-ofm-caption text-zinc-400">248 KB · PDF</span>
              </span>
              <button className="flex size-8 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100">
                <Download className="size-4" strokeWidth={2} />
              </button>
            </div>
          </section>

        </div>
      </motion.aside>
      )}
    </DashboardShell>
  );
}
