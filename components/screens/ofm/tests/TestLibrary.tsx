"use client";

/* f2 — "A library, not a quiz you build." The shared catalog the employer
   pulls required skills from: standardized, reusable tests, the same scale on
   every job. Mid-demo one card is picked and its pass mark set. OFM system. */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpenText,
  Mic,
  Headphones,
  Gauge,
  Keyboard,
  MessageSquare,
  ChevronRight,
  Check,
  Plus,
  BadgeCheck,
} from "lucide-react";
import DashboardShell from "@/components/screens/ofm/DashboardShell";

const EASE = [0.22, 1, 0.36, 1] as const;

type Test = {
  icon: typeof Mic;
  label: string;
  blurb: string;
  scale: string;
};

const TESTS: Test[] = [
  { icon: BookOpenText, label: "English", blurb: "Reading & grammar from real chat snippets", scale: "0–100" },
  { icon: Mic, label: "Verbal", blurb: "A spoken answer to a scenario, AI-scored", scale: "0–100" },
  { icon: Headphones, label: "Listening", blurb: "Audio comprehension, catch what's said", scale: "0–100" },
  { icon: Gauge, label: "Internet speed", blurb: "Live download, upload and ping", scale: "Mbps" },
  { icon: Keyboard, label: "Typing", blurb: "Timed passage, live WPM and accuracy", scale: "WPM" },
  { icon: MessageSquare, label: "Sales pitch", blurb: "An upsell reply, scored for tone", scale: "0–100" },
];

/* the card the demo picks (Verbal), landing back on the job post */
const PICK = 1;

export default function TestLibrary() {
  const reduced = useReducedMotion();
  const [picked, setPicked] = useState(false);

  useEffect(() => {
    if (reduced) {
      setPicked(true);
      return;
    }
    const t = setTimeout(() => setPicked(true), 1600);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <div className="absolute inset-0">
      <DashboardShell
        headerLeft={
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="shrink-0 text-ofm-body text-zinc-400">New job</span>
            <ChevronRight className="size-4 shrink-0 text-zinc-300" strokeWidth={2} />
            <span className="truncate text-ofm-display font-semibold text-zinc-900">
              Test library
            </span>
          </div>
        }
      >
        <div className="flex h-full flex-col overflow-hidden px-6 py-5">
          <div className="flex items-center justify-between pb-4">
            <div>
              <h2 className="text-ofm-title font-semibold text-zinc-900">
                Pick a skill to require
              </h2>
              <p className="mt-0.5 text-ofm-label text-zinc-500">
                Standardized across OFM, so a score means the same on every job.
              </p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-ofm-50 px-2.5 py-1 text-ofm-caption font-medium text-ofm-700">
              <BadgeCheck className="size-4" strokeWidth={2} />
              Verified &amp; comparable
            </span>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-2 gap-3">
            {TESTS.map((t, i) => {
              const isPicked = picked && i === PICK;
              return (
                <motion.div
                  key={t.label}
                  initial={false}
                  animate={
                    isPicked ? { scale: reduced ? 1 : [1, 1.02, 1] } : { scale: 1 }
                  }
                  transition={{ duration: 0.4, ease: EASE }}
                  className={`relative flex flex-col rounded-xl border bg-white p-4 transition-colors duration-300 ${
                    isPicked ? "border-ofm-500 ring-1 ring-ofm-500/30" : "border-zinc-200/70"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-ofm-50">
                      <t.icon className="size-5 text-ofm-600" strokeWidth={1.75} />
                    </span>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-ofm-micro font-medium text-zinc-500">
                      {t.scale}
                    </span>
                  </div>
                  <h3 className="mt-3 text-ofm-body font-semibold text-zinc-900">
                    {t.label}
                  </h3>
                  <p className="mt-1 flex-1 text-ofm-caption leading-snug text-zinc-500">
                    {t.blurb}
                  </p>
                  <button
                    className={`mt-3 flex items-center justify-center gap-1.5 rounded-lg py-2 text-ofm-label font-medium transition-colors duration-300 ${
                      isPicked
                        ? "bg-ofm-600 text-white"
                        : "border border-zinc-200/70 text-zinc-600"
                    }`}
                  >
                    {isPicked ? (
                      <>
                        <Check className="size-4" strokeWidth={2.5} />
                        Required · ≥ 75
                      </>
                    ) : (
                      <>
                        <Plus className="size-4" strokeWidth={2.2} />
                        Require this
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </DashboardShell>
    </div>
  );
}
