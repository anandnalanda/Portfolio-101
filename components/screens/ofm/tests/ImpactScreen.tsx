"use client";

/* impact — "The filter moved to the front." The closing outcome, read as an
   insights screen: pre-qualified applicants, the skill-surprise gone, and a
   before/after funnel showing the filter that used to sit at the interview
   now sitting at the application. A 'stays on OFM' card closes the loop.
   DashboardShell (Kanban chrome), Kibo inner. Bars grow on scroll-in. */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronRight,
  Users,
  BadgeCheck,
  TrendingDown,
  Repeat,
  Check,
  ArrowRight,
  Sparkle,
} from "lucide-react";
import DashboardShell from "@/components/screens/ofm/DashboardShell";

const EASE = [0.22, 1, 0.36, 1] as const;

const Crumbs = (
  <div className="flex min-w-0 items-center gap-1.5">
    <span className="shrink-0 text-ofm-body text-zinc-400">Virtual Chatter</span>
    <ChevronRight className="size-4 shrink-0 text-zinc-300" strokeWidth={2} />
    <span className="truncate text-ofm-display font-semibold text-zinc-900">
      Testing impact
    </span>
  </div>
);

const STATS = [
  { icon: Users, label: "Verified applicants", value: "142", sub: "every one cleared the bar" },
  { icon: BadgeCheck, label: "Proof before apply", value: "100%", sub: "gated at post time" },
  { icon: TrendingDown, label: "Skill surprises", value: "0", sub: "caught at the gate, not the call" },
  { icon: Repeat, label: "Hiring on OFM", value: "1 flow", sub: "post to offer, on-platform" },
];

const MAX = 142;

/* Before: the filter sat at the interview, so most interviews were spent
   discovering people who couldn't do the work. After: the gate pre-filters,
   so every interview is with someone already verified. */
type Row = { stage: string; count: number; tone: "brand" | "muted" | "warn" };

const BEFORE: Row[] = [
  { stage: "Applied", count: 142, tone: "muted" },
  { stage: "Interviewed", count: 40, tone: "muted" },
  { stage: "Could do the job", count: 12, tone: "warn" },
];

const AFTER: Row[] = [
  { stage: "Applied, verified", count: 38, tone: "brand" },
  { stage: "Interviewed", count: 12, tone: "brand" },
  { stage: "Hired", count: 4, tone: "brand" },
];

const LOOP = [
  "One login, post to offer",
  "Scores land straight on the board",
  "Reused across every role",
];

function Funnel({
  title,
  note,
  rows,
  grown,
  delayBase,
}: {
  title: string;
  note: string;
  rows: Row[];
  grown: boolean;
  delayBase: number;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h4 className="text-ofm-label font-semibold text-zinc-700">{title}</h4>
        <span className="text-ofm-caption text-zinc-400">{note}</span>
      </div>
      <div className="mt-3 space-y-3.5">
        {rows.map((r, i) => (
          <div key={r.stage}>
            <div className="flex items-center justify-between">
              <span className="text-ofm-caption text-zinc-500">{r.stage}</span>
              <span className="text-ofm-caption font-semibold tabular-nums text-zinc-700">
                {r.count}
              </span>
            </div>
            <div className="mt-1 h-7 w-full overflow-hidden rounded-lg bg-zinc-100/70">
              <motion.div
                className={`h-full rounded-lg ${
                  r.tone === "brand"
                    ? "bg-gradient-to-r from-ofm-600 to-ofm-500"
                    : r.tone === "warn"
                    ? "bg-amber-400"
                    : "bg-zinc-300"
                }`}
                initial={false}
                animate={{ width: grown ? `${Math.max((r.count / MAX) * 100, 3)}%` : "0%" }}
                transition={{ duration: 0.6, ease: EASE, delay: delayBase + i * 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ImpactScreen() {
  const reduced = useReducedMotion();
  const [grown, setGrown] = useState(!!reduced);

  useEffect(() => {
    if (reduced) {
      setGrown(true);
      return;
    }
    setGrown(false);
    const t = setTimeout(() => setGrown(true), 350);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <div className="absolute inset-0">
      <DashboardShell activeNav="Analytics" headerLeft={Crumbs}>
        <div className="h-full overflow-y-auto px-6 py-5">
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
                    <Icon className="size-4 text-ofm-500" strokeWidth={2} />
                    {s.label}
                  </div>
                  <p className="mt-2 text-ofm-display font-semibold leading-none tabular-nums text-zinc-900">
                    {s.value}
                  </p>
                  <p className="mt-1.5 text-ofm-caption font-medium text-ofm-600">{s.sub}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-[1.6fr_1fr] gap-5">
            {/* the filter moved to the front */}
            <section className="rounded-xl border border-zinc-200/70 bg-white p-5 shadow-sm">
              <div className="flex items-baseline justify-between">
                <h3 className="text-ofm-title font-semibold text-zinc-900">
                  The filter moved to the front
                </h3>
                <span className="text-ofm-caption text-zinc-400">
                  Same role, before &amp; after tests
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-6">
                <Funnel
                  title="Before — filter at the interview"
                  note="too late"
                  rows={BEFORE}
                  grown={grown}
                  delayBase={0}
                />
                <Funnel
                  title="After — filter at the application"
                  note="up front"
                  rows={AFTER}
                  grown={grown}
                  delayBase={0.35}
                />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-6">
                <p className="flex items-start gap-1.5 rounded-lg bg-amber-50 px-2.5 py-2 text-ofm-caption leading-snug text-amber-700">
                  <TrendingDown className="mt-0.5 size-3.5 shrink-0" strokeWidth={2.2} />
                  28 interviews spent finding out someone couldn&apos;t do the work.
                </p>
                <p className="flex items-start gap-1.5 rounded-lg bg-ofm-50 px-2.5 py-2 text-ofm-caption leading-snug text-ofm-700">
                  <Check className="mt-0.5 size-3.5 shrink-0" strokeWidth={2.4} />
                  Every interview was with someone already verified.
                </p>
              </div>
            </section>

            {/* stays on OFM */}
            <div className="flex flex-col gap-5">
              <section className="rounded-xl border border-ofm-200 bg-ofm-50/50 p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Repeat className="size-4 text-ofm-600" strokeWidth={2} />
                  <h3 className="text-ofm-title font-semibold text-zinc-900">Stays on OFM</h3>
                </div>
                <p className="mt-0.5 text-ofm-caption text-ofm-700">
                  Testing and pipeline became one flow.
                </p>
                <div className="mt-4 space-y-2.5">
                  {LOOP.map((l) => (
                    <div key={l} className="flex items-start gap-2">
                      <Check className="mt-px size-4 shrink-0 text-ofm-600" strokeWidth={2.5} />
                      <span className="text-ofm-caption leading-snug text-zinc-700">{l}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="flex-1 rounded-xl border border-zinc-200/70 bg-white p-5 shadow-sm">
                <h3 className="text-ofm-title font-semibold text-zinc-900">
                  Post → ranked pool
                </h3>
                <p className="mt-0.5 text-ofm-caption text-zinc-400">
                  No manual screen in between.
                </p>
                <div className="mt-4 flex items-center gap-2 text-ofm-caption font-medium text-zinc-600">
                  <span className="rounded-md bg-zinc-100 px-2 py-1">Open post</span>
                  <ArrowRight className="size-3.5 text-zinc-300" strokeWidth={2.2} />
                  <span className="rounded-md bg-zinc-100 px-2 py-1">Gated apply</span>
                  <ArrowRight className="size-3.5 text-zinc-300" strokeWidth={2.2} />
                  <span className="rounded-md bg-ofm-600 px-2 py-1 text-white">Verified pool</span>
                </div>
                <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-zinc-100 px-2.5 py-2 text-ofm-caption leading-snug text-zinc-600">
                  <BadgeCheck className="mt-0.5 size-3.5 shrink-0 text-ofm-600" strokeWidth={2.2} />
                  The interview became the reward for passing, not where you found
                  the truth.
                </p>
              </section>
            </div>
          </div>

          {/* closing thesis */}
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-ofm-200 bg-gradient-to-r from-ofm-50 to-white px-5 py-4 shadow-sm">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ofm-100">
              <Sparkle className="size-5 text-ofm-600" strokeWidth={1.75} />
            </span>
            <p className="text-ofm-label text-zinc-700">
              From open post to signed offer, hiring now runs start to finish on
              OFM — so the platform earns a seat at every hire.
            </p>
          </div>
        </div>
      </DashboardShell>
    </div>
  );
}
