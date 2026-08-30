"use client";

/* d4 — "A score you can trust." An explainable score: the number opens into
   how it was reached, the pass mark is the employer's to set, and a weak
   connection is flagged for a retry, not scored as a fail. DashboardShell
   (Kanban chrome), Kibo inner. */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpenText,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Flag,
} from "lucide-react";
import DashboardShell from "@/components/screens/ofm/DashboardShell";

const EASE = [0.22, 1, 0.36, 1] as const;

const REASONS = [
  { label: "Grammar & spelling", value: 96 },
  { label: "Tone match", value: 90 },
  { label: "Reading comprehension", value: 89 },
];

export default function DecisionTrust() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => setOpen(true), 900);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <div className="absolute inset-0">
      <DashboardShell
        activeNav="Candidates"
        headerLeft={
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="shrink-0 text-ofm-body text-zinc-400">Maria Reyes</span>
            <ChevronRight className="size-4 shrink-0 text-zinc-300" strokeWidth={2} />
            <span className="truncate text-ofm-display font-semibold text-zinc-900">
              English · score
            </span>
          </div>
        }
      >
        <div className="flex h-full items-start justify-center overflow-hidden px-5 py-5">
          <div className="w-[600px]">
            <div className="pb-4">
              <h2 className="text-ofm-title font-semibold text-zinc-900">
                A score you can open
              </h2>
              <p className="mt-0.5 text-ofm-label text-zinc-500">
                Every number shows its work, and a bad day is a retake, not a
                verdict.
              </p>
            </div>

            {/* the explainable score */}
            <div className="overflow-hidden rounded-xl border border-zinc-200/70 bg-white">
              <div className="flex items-center gap-3 px-5 py-4">
                <span className="flex size-10 items-center justify-center rounded-lg bg-ofm-50">
                  <BookOpenText className="size-5 text-ofm-600" strokeWidth={1.75} />
                </span>
                <div className="flex-1">
                  <span className="block text-ofm-body font-semibold text-zinc-900">
                    English
                  </span>
                  <span className="block text-ofm-caption text-zinc-400">
                    Auto-scored against the key
                  </span>
                </div>
                <span className="flex items-center gap-1.5 rounded-lg bg-ofm-50 px-2.5 py-1.5 text-ofm-body font-semibold tabular-nums text-ofm-700">
                  92 / 100
                  <ChevronDown
                    className={`size-4 transition-transform duration-300 ${
                      open ? "rotate-180" : ""
                    }`}
                    strokeWidth={2}
                  />
                </span>
              </div>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="overflow-hidden border-t border-zinc-100 bg-zinc-50/50"
                  >
                    <div className="space-y-2.5 px-5 py-4">
                      <span className="text-ofm-caption font-medium uppercase tracking-[0.08em] text-zinc-400">
                        How it was reached
                      </span>
                      {REASONS.map((r) => (
                        <div key={r.label}>
                          <div className="mb-1 flex items-center justify-between text-ofm-caption">
                            <span className="text-zinc-600">{r.label}</span>
                            <span className="font-semibold tabular-nums text-zinc-700">
                              {r.value}
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
                            <motion.div
                              className="h-full rounded-full bg-ofm-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${r.value}%` }}
                              transition={{ duration: 0.6, ease: EASE }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* pass mark set by the employer */}
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-zinc-200/70 bg-white px-5 py-3.5">
              <span className="flex-1 text-ofm-label text-zinc-600">
                Pass mark for this role
              </span>
              <span className="text-ofm-caption text-zinc-400">
                yours to set
              </span>
              <button className="flex items-center gap-1 rounded-lg border border-zinc-200/70 px-3 py-1.5 text-ofm-label font-semibold tabular-nums text-zinc-700 hover:bg-zinc-50">
                ≥ 80
                <ChevronDown className="size-3.5 text-zinc-400" strokeWidth={2} />
              </button>
            </div>

            {/* flagged for retry, not failed */}
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/60 px-5 py-3.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                <Flag className="size-4 text-amber-600" strokeWidth={2} />
              </span>
              <div className="flex-1">
                <span className="block text-ofm-label font-medium leading-tight text-zinc-800">
                  Internet speed · flagged, not failed
                </span>
                <span className="block text-ofm-caption leading-tight text-zinc-500">
                  A weak reading offered a retry, kept visible, never buried in
                  an average.
                </span>
              </div>
              <button className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-ofm-label font-medium text-amber-700 ring-1 ring-amber-200">
                <RotateCcw className="size-3.5" strokeWidth={2} />
                Retry
              </button>
            </div>
          </div>
        </div>
      </DashboardShell>
    </div>
  );
}
