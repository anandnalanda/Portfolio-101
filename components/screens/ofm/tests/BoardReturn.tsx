"use client";

/* f10 — "Back on the board." The verified result lands where hiring already
   lives: Sarah Chen's card opens over the pipeline, her claimed chips flip
   to verified scores, and the AI match relabels itself evidence-based.
   Testing and pipeline become one flow. Reuses the Kanban PipelineBoard. */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
  BookOpenText,
  Mic,
  Headphones,
  Gauge,
  Keyboard,
  ChevronRight,
} from "lucide-react";
import DashboardShell from "@/components/screens/ofm/DashboardShell";
import PipelineBoard from "@/components/screens/ofm/kanban/PipelineBoard";

const EASE = [0.22, 1, 0.36, 1] as const;

/* claimed → verified, staggered */
const CHIPS = [
  { claimed: "Fluent English", verified: "English 92 · verified" },
  { claimed: "Fast typist", verified: "Typing 72 WPM · verified" },
  { claimed: "Great on calls", verified: "Verbal 88 · verified" },
];

const MINI = [
  { icon: BookOpenText, label: "English", value: "92" },
  { icon: Mic, label: "Verbal", value: "88" },
  { icon: Headphones, label: "Listening", value: "95" },
  { icon: Gauge, label: "Speed", value: "87" },
  { icon: Keyboard, label: "Typing", value: "72" },
];

function ScoreRing({ value }: { value: number }) {
  const r = 15.5;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className="relative flex size-[68px] items-center justify-center">
      <svg viewBox="0 0 36 36" className="size-full -rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" stroke="#f4f4f5" strokeWidth="3" />
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          stroke="#006E42"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>
      <span className="absolute text-ofm-display font-bold text-zinc-900">
        {value}
      </span>
    </div>
  );
}

export default function BoardReturn() {
  const reduceMotion = useReducedMotion();
  const [flipped, setFlipped] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setFlipped(CHIPS.length);
      return;
    }
    const t = CHIPS.map((_, i) =>
      setTimeout(() => setFlipped(i + 1), 1600 + i * 700),
    );
    return () => t.forEach(clearTimeout);
  }, [reduceMotion]);

  const allFlipped = flipped >= CHIPS.length;

  return (
    <div className="absolute inset-0">
      <DashboardShell>
        <PipelineBoard />
      </DashboardShell>

      {/* Sarah's card, opened over the board */}
      <div className="kibo absolute inset-0 z-30 flex items-center justify-center bg-zinc-900/20 p-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="w-[560px] overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-xl"
        >
          {/* header */}
          <div className="flex items-start justify-between px-6 pb-5 pt-6">
            <div className="flex items-center gap-3.5">
              <span className="flex size-12 items-center justify-center rounded-full bg-ofm-50 text-ofm-title font-semibold text-ofm-700">
                SC
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-ofm-display font-semibold text-zinc-900">
                    Sarah Chen
                  </h3>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-ofm-micro font-medium text-zinc-600">
                    Applied
                  </span>
                </div>
                <p className="mt-0.5 text-ofm-body text-zinc-500">
                  Senior Chatter · applied 2d ago
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ScoreRing value={92} />
              <AnimatePresence mode="wait">
                <motion.span
                  key={allFlipped ? "evidence" : "ai"}
                  initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className={`text-ofm-micro font-medium uppercase tracking-wide ${
                    allFlipped ? "text-ofm-700" : "text-zinc-400"
                  }`}
                >
                  {allFlipped ? "Evidence-based" : "AI match"}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* claimed → verified chips */}
          <div className="border-t border-zinc-200/70 px-6 py-4">
            <span className="text-ofm-caption font-medium uppercase tracking-[0.08em] text-zinc-400">
              Skills
            </span>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {CHIPS.map((chip, i) => {
                const verified = i < flipped;
                return (
                  <AnimatePresence key={chip.claimed} mode="wait">
                    <motion.span
                      key={verified ? "v" : "c"}
                      initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-ofm-caption font-medium ${
                        verified
                          ? "bg-ofm-50 text-ofm-700"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {verified ? (
                        <BadgeCheck className="size-3.5" strokeWidth={2.25} />
                      ) : (
                        <span className="text-zinc-400">?</span>
                      )}
                      {verified ? chip.verified : chip.claimed}
                    </motion.span>
                  </AnimatePresence>
                );
              })}
            </div>
          </div>

          {/* the scorecard, right there */}
          <div className="border-t border-zinc-200/70 bg-zinc-50/60 px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="text-ofm-caption font-medium uppercase tracking-[0.08em] text-zinc-400">
                Skills check · completed
              </span>
              <button className="flex items-center gap-0.5 text-ofm-caption font-medium text-ofm-700 hover:text-ofm-800">
                Full scorecard
                <ChevronRight className="size-3.5" strokeWidth={2.25} />
              </button>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {MINI.map((m) => (
                <div
                  key={m.label}
                  className="flex flex-col items-center rounded-lg border border-zinc-200/70 bg-white py-2.5"
                >
                  <m.icon className="size-4 text-ofm-600" strokeWidth={1.75} />
                  <span className="mt-1 text-ofm-body font-semibold tabular-nums text-zinc-900">
                    {m.value}
                  </span>
                  <span className="text-ofm-micro text-zinc-400">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
