"use client";

/* f9 — "The employer's view." Everyone who tested, one row each, five
   columns of proof plus a combined score. The demo sorts by combined and
   the rows reorder; verified badges are the ones that travel to the board. */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  BadgeCheck,
  ChevronRight,
  Flag,
  Kanban,
} from "lucide-react";
import DashboardShell from "@/components/screens/ofm/DashboardShell";

const EASE = [0.22, 1, 0.36, 1] as const;

type Row = {
  name: string;
  role: string;
  scores: [number, number, number, number, number]; // EN, Verbal, Listening, Speed(Mbps), Typing(WPM)
  combined: number;
  flagged?: number; // index into scores that's flagged for retry
};

/* Application order; the demo re-sorts by combined. Names match the
   pipeline board so the two case studies read as one product. */
const ROWS: Row[] = [
  { name: "James Wilson", role: "Chatter", scores: [71, 68, 75, 45, 61], combined: 69 },
  { name: "Noah Bennett", role: "Support Agent", scores: [76, 82, 80, 18, 59], combined: 71, flagged: 3 },
  { name: "Sarah Chen", role: "Senior Chatter", scores: [92, 88, 95, 87, 72], combined: 91 },
  { name: "Priya Patel", role: "Chatter", scores: [89, 91, 86, 71, 64], combined: 84 },
  { name: "David Kim", role: "Chatter", scores: [87, 74, 82, 92, 82], combined: 83 },
  { name: "Marcus Johnson", role: "Chatter", scores: [84, 79, 88, 64, 68], combined: 81 },
];

const COLS = ["English", "Verbal", "Listening", "Speed", "Typing"];
const UNITS = ["", "", "", " Mbps", " WPM"];

const GRID = "grid grid-cols-[minmax(0,1.6fr)_repeat(5,minmax(0,1fr))_120px] items-center gap-2";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("");
}

export default function ResultsTable() {
  const reduceMotion = useReducedMotion();
  const [sorted, setSorted] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setSorted(true);
      return;
    }
    const t = setTimeout(() => setSorted(true), 2200);
    return () => clearTimeout(t);
  }, [reduceMotion]);

  const rows = sorted
    ? [...ROWS].sort((a, b) => b.combined - a.combined)
    : ROWS;

  return (
    <div className="absolute inset-0">
      <DashboardShell
        activeNav="Candidates"
        headerLeft={
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="shrink-0 text-ofm-body text-zinc-400">
              Virtual Chatter
            </span>
            <ChevronRight className="size-4 shrink-0 text-zinc-300" strokeWidth={2} />
            <span className="truncate text-ofm-display font-semibold text-zinc-900">
              Test results
            </span>
          </div>
        }
      >
        <div className="flex h-full flex-col overflow-hidden px-5 py-4">
          <div className="flex items-center justify-between pb-3">
            <span className="text-ofm-label text-zinc-500">
              6 candidates tested · sorted by{" "}
              <span className="font-medium text-zinc-700">
                {sorted ? "combined score" : "most recent"}
              </span>
            </span>
            <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200/70 px-2.5 py-1.5 text-ofm-label font-medium text-zinc-600 hover:bg-zinc-50">
              <Kanban className="size-4 text-zinc-400" strokeWidth={1.75} />
              Back to pipeline
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-zinc-200/70 bg-white">
            {/* header row */}
            <div className={`${GRID} border-b border-zinc-200/70 bg-zinc-50/70 px-5 py-2.5`}>
              <span className="text-ofm-caption font-medium text-zinc-500">
                Candidate
              </span>
              {COLS.map((c) => (
                <span key={c} className="text-ofm-caption font-medium text-zinc-500">
                  {c}
                </span>
              ))}
              <span
                className={`flex items-center gap-1 text-ofm-caption font-semibold transition-colors duration-300 ${
                  sorted ? "text-ofm-700" : "text-zinc-500"
                }`}
              >
                Combined
                {sorted && <ArrowDown className="size-3" strokeWidth={2.5} />}
              </span>
            </div>

            {rows.map((row) => (
              <motion.div
                key={row.name}
                layout
                transition={{ duration: 0.6, ease: EASE }}
                className={`${GRID} border-b border-zinc-100 px-5 py-2.5 last:border-b-0`}
              >
                {/* candidate */}
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-ofm-micro font-semibold text-zinc-500">
                    {initials(row.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1 text-ofm-body font-medium leading-tight text-zinc-800">
                      <span className="truncate">{row.name}</span>
                      <BadgeCheck className="size-4 shrink-0 text-ofm-600" strokeWidth={2} />
                    </span>
                    <span className="block truncate text-ofm-caption leading-tight text-zinc-400">
                      {row.role}
                    </span>
                  </span>
                </span>

                {/* five proofs */}
                {row.scores.map((s, i) => (
                  <span key={i} className="text-ofm-body tabular-nums">
                    {row.flagged === i ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-ofm-caption font-medium text-amber-700">
                        <Flag className="size-3" strokeWidth={2.5} />
                        Retry sent
                      </span>
                    ) : (
                      <span className="text-zinc-700">
                        {s}
                        <span className="text-zinc-400">{UNITS[i]}</span>
                      </span>
                    )}
                  </span>
                ))}

                {/* combined */}
                <span
                  className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-ofm-label font-semibold tabular-nums ${
                    row.combined >= 80
                      ? "bg-ofm-50 text-ofm-700"
                      : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {row.combined}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </DashboardShell>
    </div>
  );
}
