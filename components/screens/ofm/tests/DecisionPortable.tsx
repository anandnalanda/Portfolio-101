"use client";

/* d5 — "Prove it once, carry it everywhere." The employer opens a candidate
   and finds proof that was earned once and reused: verified badges that
   predate this job, already attached, no re-testing asked. DashboardShell
   (Kanban chrome), Kibo inner. */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpenText,
  Mic,
  Gauge,
  Keyboard,
  ChevronRight,
  BadgeCheck,
  Layers,
} from "lucide-react";
import DashboardShell from "@/components/screens/ofm/DashboardShell";

const EASE = [0.22, 1, 0.36, 1] as const;

const BADGES = [
  { icon: BookOpenText, label: "English", score: "92", when: "verified 3 wks ago" },
  { icon: Keyboard, label: "Typing", score: "68 WPM", when: "verified 3 wks ago" },
  { icon: Gauge, label: "Internet speed", score: "87 Mbps", when: "verified 1 wk ago" },
  { icon: Mic, label: "Verbal", score: "88", when: "verified 2 days ago" },
];

export default function DecisionPortable() {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(reduced ? BADGES.length : 0);

  useEffect(() => {
    if (reduced) return;
    const t = BADGES.map((_, i) =>
      setTimeout(() => setShown((n) => Math.max(n, i + 1)), 400 + i * 160)
    );
    return () => t.forEach(clearTimeout);
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
              Maria Reyes
            </span>
          </div>
        }
      >
        <div className="flex h-full items-start justify-center overflow-hidden px-5 py-5">
          <div className="w-[620px]">
            <div className="pb-4">
              <h2 className="text-ofm-title font-semibold text-zinc-900">
                Proven once, already here
              </h2>
              <p className="mt-0.5 text-ofm-label text-zinc-500">
                Maria didn&apos;t test for you. She tested for herself, and the
                proof travelled.
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-zinc-200/70 bg-white">
              {/* identity */}
              <div className="flex items-center gap-4 px-6 py-5">
                <span className="flex size-14 items-center justify-center rounded-full bg-ofm-100 text-ofm-title font-semibold text-ofm-700">
                  MR
                </span>
                <div className="flex-1">
                  <h3 className="text-ofm-display font-semibold text-zinc-900">
                    Maria Reyes
                  </h3>
                  <p className="mt-0.5 text-ofm-body text-zinc-500">
                    Chat support · applied to Virtual Chatter
                  </p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-ofm-50 px-3 py-1.5 text-ofm-label font-semibold text-ofm-700">
                  <BadgeCheck className="size-4" strokeWidth={2} />
                  4 verified
                </span>
              </div>

              {/* the portable badges */}
              <div className="border-t border-zinc-100 bg-zinc-50/50 px-6 py-4">
                <span className="text-ofm-caption font-medium uppercase tracking-[0.08em] text-zinc-400">
                  Verified skills, earned before this job
                </span>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  {BADGES.map((b, i) => (
                    <motion.div
                      key={b.label}
                      initial={false}
                      animate={{ opacity: i < shown ? 1 : 0, y: i < shown ? 0 : 8 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="flex items-center gap-3 rounded-lg border border-zinc-200/70 bg-white px-3 py-2.5"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ofm-50">
                        <b.icon className="size-[18px] text-ofm-600" strokeWidth={1.75} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5 text-ofm-label font-semibold leading-tight text-zinc-800">
                          {b.label} {b.score}
                          <BadgeCheck className="size-3.5 text-ofm-600" strokeWidth={2} />
                        </span>
                        <span className="block truncate text-ofm-caption leading-tight text-zinc-400">
                          {b.when}
                        </span>
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* reuse note */}
              <div className="flex items-center gap-2.5 border-t border-zinc-100 px-6 py-3.5">
                <Layers className="size-4 shrink-0 text-ofm-600" strokeWidth={2} />
                <span className="text-ofm-caption text-zinc-500">
                  The same four scores already unlocked{" "}
                  <span className="font-semibold text-zinc-700">3 other roles</span>{" "}
                  she applied to. Tested once, reused everywhere.
                </span>
              </div>
            </div>
          </div>
        </div>
      </DashboardShell>
    </div>
  );
}
