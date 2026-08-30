"use client";

/* OFM Jobs "Post a job" as a step-by-step wizard (the pattern every leading
   ATS uses — Workable, Employment Hero, Zillow, Oyster, Upwork): a connected
   progress stepper up top, one focused step of the form in the middle, and
   Back / Continue nav pinned at the bottom. This beat shows the **Tests** step
   — where the role's skill tests are chosen — with Details and Requirements
   already complete. DashboardShell (Kanban chrome), OFM (Kibo) primitives. */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpenText,
  Keyboard,
  Gauge,
  Mic,
  Headphones,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardShell from "@/components/screens/ofm/DashboardShell";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── the progress stepper ──────────────────────────────────── */

type StepState = "done" | "active" | "upcoming";
const STEPS: { label: string; state: StepState }[] = [
  { label: "Details", state: "done" },
  { label: "Requirements", state: "done" },
  { label: "Tests", state: "active" },
  { label: "Review", state: "upcoming" },
];

const POP = [0.34, 1.56, 0.64, 1] as const;
const nodeDelay = (i: number) => 0.1 + i * 0.26;
/* the active step's index — how far the green progress line should reach */
const ACTIVE_INDEX = STEPS.findIndex((s) => s.state === "active");
/* circle centres sit at ((i + 0.5)/n); the fill runs first→active centre */
const FILL_PCT =
  ((ACTIVE_INDEX + 0.5 - 0.5) / (STEPS.length - 1)) * (100 - 100 / STEPS.length);

function StepCircle({ state, n }: { state: StepState; n: number }) {
  if (state === "done") {
    return (
      <span className="relative z-10 flex size-8 items-center justify-center rounded-full bg-primary">
        <Check className="size-4 text-primary-foreground" strokeWidth={3} />
      </span>
    );
  }
  if (state === "active") {
    return (
      <span className="relative z-10 flex size-8 items-center justify-center rounded-full bg-primary text-ofm-label font-semibold text-primary-foreground ring-4 ring-ofm-100">
        {n}
      </span>
    );
  }
  return (
    <span className="relative z-10 flex size-8 items-center justify-center rounded-full border-2 border-border bg-background text-ofm-label font-semibold text-muted-foreground">
      {n}
    </span>
  );
}

function Stepper({ reduced }: { reduced: boolean }) {
  const half = 100 / STEPS.length / 2; // half a column, in %
  return (
    <div className="relative">
      {/* the connecting track, first circle centre → last circle centre */}
      <div
        className="absolute top-4 h-0.5 -translate-y-1/2 rounded-full bg-border"
        style={{ left: `${half}%`, right: `${half}%` }}
      />
      {/* the green progress, filling up to the active step */}
      <motion.div
        className="absolute top-4 h-0.5 origin-left -translate-y-1/2 rounded-full bg-primary"
        style={{ left: `${half}%`, width: `${FILL_PCT}%` }}
        initial={reduced ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={reduced ? { duration: 0 } : { duration: 0.85, ease: "easeInOut", delay: 0.25 }}
      />
      {/* the step nodes with labels below */}
      <div className="relative flex">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={reduced ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={reduced ? { duration: 0 } : { duration: 0.3, ease: POP, delay: nodeDelay(i) }}
            className="flex flex-1 flex-col items-center"
          >
            <StepCircle state={s.state} n={i + 1} />
            <span
              className={`mt-2 text-ofm-label ${
                s.state === "active"
                  ? "font-semibold text-primary"
                  : s.state === "done"
                  ? "font-medium text-foreground"
                  : "font-medium text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── recommended tests (the step body) ─────────────────────── */

type Test = { id: string; icon: typeof Mic; title: string; desc: string; mins: number };
const TESTS: Test[] = [
  { id: "eng", icon: BookOpenText, title: "Intermediate English B1", desc: "Reading & grammar from real chat snippets.", mins: 8 },
  { id: "typ", icon: Keyboard, title: "Typing Test", desc: "Speed and accuracy on a timed passage.", mins: 6 },
  { id: "spd", icon: Gauge, title: "Internet Speed Test", desc: "Live download, upload and ping.", mins: 2 },
  { id: "vrb", icon: Mic, title: "Verbal Test", desc: "A spoken answer to a scenario, AI-scored.", mins: 4 },
  { id: "lst", icon: Headphones, title: "Listening Test", desc: "Audio comprehension: catch what's said.", mins: 4 },
];

function Toggle({ on }: { on: boolean }) {
  return (
    <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${on ? "bg-primary" : "bg-input"}`}>
      <span className={`absolute top-0.5 size-5 rounded-full bg-background shadow transition-[left] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? "left-[22px]" : "left-0.5"}`} />
    </span>
  );
}

function TestRow({ t, on, first }: { t: Test; on: boolean; first: boolean }) {
  return (
    <div className={`flex items-center gap-3.5 px-5 py-3.5 transition-colors ${on ? "bg-ofm-50/50" : ""} ${first ? "" : "border-t border-border"}`}>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ofm-50">
        <t.icon className="size-5 text-primary" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="text-ofm-body font-semibold text-foreground">{t.title}</h4>
          <span className="flex items-center gap-1 text-ofm-caption font-medium text-primary">
            <Check className="size-3.5" strokeWidth={2.5} />
            Recommended
          </span>
        </div>
        <p className="mt-0.5 text-ofm-caption text-muted-foreground">
          {t.desc} · ±{t.mins} min
        </p>
      </div>
      <div className="flex items-center gap-2.5">
        <span className={`text-ofm-label font-medium ${on ? "text-primary" : "text-muted-foreground"}`}>
          {on ? "Enabled" : "Disabled"}
        </span>
        <Toggle on={on} />
      </div>
    </div>
  );
}

/* ── the screen ────────────────────────────────────────────── */

export default function JobPostTests() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState<Set<string>>(new Set(["eng", "typ"]));

  useEffect(() => {
    if (reduced) {
      setEnabled(new Set(["eng", "typ", "spd"]));
      return;
    }
    const t = setTimeout(() => setEnabled((s) => new Set(s).add("spd")), 2400);
    return () => clearTimeout(t);
  }, [reduced]);

  const enabledCount = TESTS.filter((t) => enabled.has(t.id)).length;
  const totalMins = TESTS.filter((t) => enabled.has(t.id)).reduce((a, t) => a + t.mins, 0);

  return (
    <div className="absolute inset-0">
      <DashboardShell
        activeNav="Jobs"
        headerLeft={
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="shrink-0 text-ofm-body text-muted-foreground">Jobs</span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground/60" strokeWidth={2} />
            <span className="truncate text-ofm-display font-semibold text-foreground">Post a job</span>
            <Badge variant="secondary" className="ml-1.5 translate-y-px rounded-md px-2 py-0.5 text-ofm-micro font-medium leading-none">Draft</Badge>
          </div>
        }
      >
        <div className="flex h-full flex-col bg-background">
          {/* progress stepper */}
          <div className="shrink-0 border-b px-8 py-5">
            <div className="mx-auto max-w-[680px]">
              <Stepper reduced={!!reduced} />
            </div>
          </div>

          {/* step body */}
          <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: reduced ? 0 : 1.15 }}
              className="mx-auto w-[720px]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-ofm-hero font-semibold text-foreground">Add skill tests</h2>
                  <p className="mt-1 text-ofm-body text-muted-foreground">
                    Tailored to Virtual Chatter. Toggle the ones candidates must clear to apply.
                  </p>
                </div>
                <Button variant="outline" className="shrink-0 gap-1.5 border-ofm-300 text-primary">
                  Browse Test Library
                </Button>
              </div>

              {/* the recommended tests */}
              <Card className="mt-5 overflow-hidden p-0 shadow-none">
                {TESTS.map((t, i) => (
                  <motion.div
                    key={t.id}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE, delay: reduced ? 0 : 1.4 + i * 0.07 }}
                  >
                    <TestRow t={t} on={enabled.has(t.id)} first={i === 0} />
                  </motion.div>
                ))}
                <div className="flex items-center justify-between border-t border-border bg-muted/40 px-5 py-3">
                  <span className="text-ofm-caption text-muted-foreground">
                    Candidates must clear <span className="font-semibold text-foreground">{enabledCount} tests</span> to apply
                  </span>
                  <span className="text-ofm-caption font-medium text-primary">
                    ~{totalMins} min total
                  </span>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* wizard nav */}
          <div className="shrink-0 border-t px-8 py-4">
            <div className="mx-auto flex w-[720px] items-center justify-between">
              <Button variant="outline" className="gap-1.5">
                <ChevronLeft className="size-4" strokeWidth={2} />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="text-muted-foreground">Save as draft</Button>
                <Button className="gap-1.5">
                  Continue
                  <ChevronRight className="size-4" strokeWidth={2} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DashboardShell>
    </div>
  );
}
