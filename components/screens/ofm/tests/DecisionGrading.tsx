"use client";

/* d3 — "Grade it the moment it's done." A candidate's battery, graded the
   instant it finished, sorted by how each score was reached: measured (hard
   numbers), auto-scored against a key, and AI-scored with its reasoning shown.
   DashboardShell (Kanban chrome), Kibo inner. */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpenText,
  Mic,
  Headphones,
  Gauge,
  Keyboard,
  ChevronRight,
  Ruler,
  KeyRound,
  Sparkles,
} from "lucide-react";
import DashboardShell from "@/components/screens/ofm/DashboardShell";

const EASE = [0.22, 1, 0.36, 1] as const;

const GROUPS = [
  {
    tag: "Measured",
    tagIcon: Ruler,
    note: "Numbers, not opinions",
    rows: [
      { icon: Keyboard, label: "Typing", value: "68 WPM · 97%" },
      { icon: Gauge, label: "Internet speed", value: "87 Mbps" },
    ],
  },
  {
    tag: "Auto-scored against a key",
    tagIcon: KeyRound,
    note: "Marked the instant it ends",
    rows: [
      { icon: BookOpenText, label: "English", value: "92 / 100" },
      { icon: Headphones, label: "Listening", value: "95 / 100" },
    ],
  },
];

const VERBAL_NOTE =
  "Clear, calm phrasing. De-escalated the refund scenario without over-promising a timeline.";

export default function DecisionGrading() {
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState(reduced ? VERBAL_NOTE.length : 0);

  useEffect(() => {
    if (reduced) return;
    let i = 0;
    const start = setTimeout(() => {
      const iv = setInterval(() => {
        i += 2;
        setTyped(i);
        if (i >= VERBAL_NOTE.length) clearInterval(iv);
      }, 24);
    }, 900);
    return () => clearTimeout(start);
  }, [reduced]);

  return (
    <div className="absolute inset-0">
      <DashboardShell
        activeNav="Candidates"
        headerLeft={
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="shrink-0 text-ofm-body text-zinc-400">Applicants</span>
            <ChevronRight className="size-4 shrink-0 text-zinc-300" strokeWidth={2} />
            <span className="truncate text-ofm-display font-semibold text-zinc-900">
              Maria Reyes · graded
            </span>
          </div>
        }
      >
        <div className="flex h-full items-start justify-center overflow-hidden px-5 py-5">
          <div className="w-[640px]">
            <div className="pb-4">
              <h2 className="text-ofm-title font-semibold text-zinc-900">
                Graded the moment it finished
              </h2>
              <p className="mt-0.5 text-ofm-label text-zinc-500">
                The machine marks what it can, the instant it can. No queue.
              </p>
            </div>

            <div className="space-y-3">
              {GROUPS.map((g) => (
                <div
                  key={g.tag}
                  className="overflow-hidden rounded-xl border border-zinc-200/70 bg-white"
                >
                  <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50/60 px-5 py-2.5">
                    <g.tagIcon className="size-4 text-zinc-400" strokeWidth={2} />
                    <span className="text-ofm-caption font-semibold uppercase tracking-[0.08em] text-zinc-500">
                      {g.tag}
                    </span>
                    <span className="ml-auto text-ofm-caption text-zinc-400">
                      {g.note}
                    </span>
                  </div>
                  {g.rows.map((r, i) => (
                    <div
                      key={r.label}
                      className={`flex items-center gap-3 px-5 py-2.5 ${
                        i > 0 ? "border-t border-zinc-100" : ""
                      }`}
                    >
                      <span className="flex size-8 items-center justify-center rounded-lg bg-ofm-50">
                        <r.icon className="size-4 text-ofm-600" strokeWidth={1.75} />
                      </span>
                      <span className="flex-1 text-ofm-body font-medium text-zinc-800">
                        {r.label}
                      </span>
                      <span className="text-ofm-body font-semibold tabular-nums text-zinc-900">
                        {r.value}
                      </span>
                    </div>
                  ))}
                </div>
              ))}

              {/* AI-scored, with its reasoning typing out */}
              <div className="overflow-hidden rounded-xl border border-ofm-200 bg-white">
                <div className="flex items-center gap-2 border-b border-ofm-100 bg-ofm-50/60 px-5 py-2.5">
                  <Sparkles className="size-4 text-ofm-600" strokeWidth={2} />
                  <span className="text-ofm-caption font-semibold uppercase tracking-[0.08em] text-ofm-700">
                    AI-scored, with reasons
                  </span>
                  <span className="ml-auto text-ofm-caption text-ofm-600">
                    Never a number from nowhere
                  </span>
                </div>
                <div className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-ofm-50">
                      <Mic className="size-4 text-ofm-600" strokeWidth={1.75} />
                    </span>
                    <span className="flex-1 text-ofm-body font-medium text-zinc-800">
                      Verbal
                    </span>
                    <span className="text-ofm-body font-semibold tabular-nums text-zinc-900">
                      88 / 100
                    </span>
                  </div>
                  <p className="ml-11 mt-2 rounded-lg bg-zinc-50 px-3 py-2 text-ofm-caption leading-relaxed text-zinc-600">
                    <span className="font-medium text-zinc-700">Why:</span>{" "}
                    {VERBAL_NOTE.slice(0, typed)}
                    {typed < VERBAL_NOTE.length && (
                      <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-ofm-600" />
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardShell>
    </div>
  );
}
