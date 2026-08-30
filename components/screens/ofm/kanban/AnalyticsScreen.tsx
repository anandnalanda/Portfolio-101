"use client";

/* Full Flow · beat 4 — "The whole funnel at a glance."

   Zoom out and the board reads like a dashboard: how many sit at each stage,
   the average match per column, where candidates move fast or stall. The funnel
   for one role, in the OFM Kibo system, inside DashboardShell. */

import {
  ChevronRight,
  Users,
  Sparkle,
  CalendarClock,
  TrendingUp,
  ArrowDownRight,
} from "lucide-react";
import DashboardShell from "@/components/screens/ofm/DashboardShell";

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
    <span className="truncate text-ofm-display font-semibold text-zinc-900">Insights</span>
  </div>
);

const STATS = [
  { icon: Users, label: "Total applicants", value: "142", sub: "+18 this week", tone: "text-ofm-600" },
  { icon: Sparkle, label: "Average match", value: "84", sub: "across all applicants", tone: "text-zinc-400" },
  { icon: TrendingUp, label: "In pipeline", value: "14", sub: "past screening", tone: "text-zinc-400" },
  { icon: CalendarClock, label: "Time to hire", value: "18d", sub: "2d faster than avg", tone: "text-ofm-600" },
];

const FUNNEL = [
  { stage: "Applied", count: 142, conv: null, days: "3d" },
  { stage: "Screening", count: 38, conv: 27, days: "6d" },
  { stage: "Interview", count: 12, conv: 32, days: "9d" },
  { stage: "Offer", count: 4, conv: 33, days: "4d" },
  { stage: "Hired", count: 1, conv: 25, days: "–" },
];

const MATCH = [
  { stage: "Applied", v: 79 },
  { stage: "Screening", v: 84 },
  { stage: "Interview", v: 90 },
  { stage: "Offer", v: 95 },
];

const MAX = FUNNEL[0].count;

export default function AnalyticsScreen() {
  return (
    <DashboardShell activeNav="Jobs" headerLeft={Crumbs}>
      <div className="h-full overflow-y-auto px-5 py-4">
        {/* stat cards */}
        <div className="grid grid-cols-4 gap-4">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-xl border border-zinc-200/70 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 text-ofm-caption font-medium text-zinc-400">
                  <Icon className="size-4 text-zinc-300" strokeWidth={2} />
                  {s.label}
                </div>
                <p className="mt-2 text-ofm-display font-semibold leading-none tabular-nums text-zinc-900">
                  {s.value}
                </p>
                <p className={`mt-1.5 text-ofm-caption font-medium ${s.tone}`}>{s.sub}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-[1.6fr_1fr] gap-5">
          {/* funnel */}
          <section className="rounded-xl border border-zinc-200/70 bg-white p-5 shadow-sm">
            <div className="flex items-baseline justify-between">
              <h3 className="text-ofm-title font-semibold text-zinc-900">Pipeline funnel</h3>
              <span className="text-ofm-caption text-zinc-400">Applied → Hired</span>
            </div>

            <div className="mt-5 space-y-4">
              {FUNNEL.map((f) => (
                <div key={f.stage}>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-ofm-label font-medium text-zinc-700">
                      {f.stage}
                      {f.conv !== null && (
                        <span className="flex items-center gap-0.5 text-ofm-caption font-medium text-zinc-400">
                          <ArrowDownRight className="size-3" strokeWidth={2.4} />
                          {f.conv}%
                        </span>
                      )}
                    </span>
                    <span className="text-ofm-label font-semibold tabular-nums text-zinc-900">
                      {f.count}
                    </span>
                  </div>
                  <div className="mt-1.5 h-7 w-full overflow-hidden rounded-lg bg-zinc-100/70">
                    <div
                      className="flex h-full items-center rounded-lg bg-gradient-to-r from-ofm-600 to-ofm-500"
                      style={{ width: `${Math.max((f.count / MAX) * 100, 3)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* right column */}
          <div className="flex flex-col gap-5">
            {/* avg match by stage */}
            <section className="rounded-xl border border-zinc-200/70 bg-white p-5 shadow-sm">
              <h3 className="text-ofm-title font-semibold text-zinc-900">Avg match by stage</h3>
              <p className="mt-0.5 text-ofm-caption text-zinc-400">Quality rises as they advance</p>
              <div className="mt-4 space-y-3">
                {MATCH.map((m) => (
                  <div key={m.stage} className="flex items-center gap-3">
                    <span className="w-16 shrink-0 text-ofm-caption text-zinc-500">{m.stage}</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
                      <span
                        className="block h-full rounded-full bg-ofm-500"
                        style={{ width: `${m.v}%` }}
                      />
                    </span>
                    <span className="w-6 shrink-0 text-right text-ofm-label font-semibold tabular-nums text-zinc-800">
                      {m.v}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* time in stage */}
            <section className="flex-1 rounded-xl border border-zinc-200/70 bg-white p-5 shadow-sm">
              <h3 className="text-ofm-title font-semibold text-zinc-900">Avg time in stage</h3>
              <p className="mt-0.5 text-ofm-caption text-zinc-400">Where candidates wait</p>
              <div className="mt-4 space-y-2.5">
                {FUNNEL.filter((f) => f.days !== "–").map((f) => (
                  <div
                    key={f.stage}
                    className="flex items-center justify-between border-b border-zinc-100 pb-2.5 last:border-0 last:pb-0"
                  >
                    <span className="text-ofm-label text-zinc-600">{f.stage}</span>
                    <span
                      className={`text-ofm-label font-semibold tabular-nums ${
                        f.stage === "Interview" ? "text-zinc-900" : "text-zinc-800"
                      }`}
                    >
                      {f.days}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-zinc-100 px-2.5 py-2 text-ofm-caption leading-snug text-zinc-600">
                <ArrowDownRight className="mt-0.5 size-3.5 shrink-0" strokeWidth={2.4} />
                Candidates sit longest in Interview, the stage to unblock.
              </p>
            </section>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
