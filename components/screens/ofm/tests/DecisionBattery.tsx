"use client";

/* d1 — "Test the job, not trivia." The employer's skills-check reference for
   the role: each of the five tests mapped to the real thing the work needs,
   and a sample of what it asks. DashboardShell (Kanban chrome), Kibo inner. */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpenText,
  Mic,
  Headphones,
  Gauge,
  Keyboard,
  ChevronRight,
} from "lucide-react";
import DashboardShell from "@/components/screens/ofm/DashboardShell";

const EASE = [0.22, 1, 0.36, 1] as const;

const TESTS = [
  {
    icon: BookOpenText,
    label: "English",
    verifies: "Reads and writes clean chat English",
    sample: "“It still ___ shipped.” → hasn't",
  },
  {
    icon: Mic,
    label: "Verbal",
    verifies: "Holds a call without freezing",
    sample: "Answer an angry-refund scenario, out loud",
  },
  {
    icon: Headphones,
    label: "Listening",
    verifies: "Catches what a customer actually said",
    sample: "Play a voice note → what are they asking?",
  },
  {
    icon: Gauge,
    label: "Internet speed",
    verifies: "Stays online through a shift",
    sample: "Live download · upload · ping",
  },
  {
    icon: Keyboard,
    label: "Typing",
    verifies: "Keeps up across three chats at once",
    sample: "Timed passage, WPM + accuracy",
  },
];

export default function DecisionBattery() {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(reduced ? TESTS.length : 0);

  useEffect(() => {
    if (reduced) return;
    const t = TESTS.map((_, i) =>
      setTimeout(() => setShown((n) => Math.max(n, i + 1)), 300 + i * 180)
    );
    return () => t.forEach(clearTimeout);
  }, [reduced]);

  return (
    <div className="absolute inset-0">
      <DashboardShell
        headerLeft={
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="shrink-0 text-ofm-body text-zinc-400">Virtual Chatter</span>
            <ChevronRight className="size-4 shrink-0 text-zinc-300" strokeWidth={2} />
            <span className="truncate text-ofm-display font-semibold text-zinc-900">
              Skills check
            </span>
          </div>
        }
      >
        <div className="flex h-full items-start justify-center overflow-hidden px-5 py-5">
          <div className="w-[680px]">
            <div className="pb-4">
              <h2 className="text-ofm-title font-semibold text-zinc-900">
                What each test proves
              </h2>
              <p className="mt-0.5 text-ofm-label text-zinc-500">
                Five tests, each mapped to the work itself, and nothing it
                doesn&apos;t.
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-zinc-200/70 bg-white">
              {TESTS.map((t, i) => (
                <motion.div
                  key={t.label}
                  initial={false}
                  animate={{
                    opacity: i < shown ? 1 : 0,
                    y: i < shown ? 0 : 8,
                  }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className={`flex items-center gap-4 px-5 py-4 ${
                    i > 0 ? "border-t border-zinc-100" : ""
                  }`}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ofm-50">
                    <t.icon className="size-5 text-ofm-600" strokeWidth={1.75} />
                  </span>
                  <div className="w-[150px] shrink-0">
                    <span className="block text-ofm-body font-semibold text-zinc-900">
                      {t.label}
                    </span>
                    <span className="block text-ofm-caption text-zinc-400">
                      Verifies
                    </span>
                  </div>
                  <span className="flex-1 text-ofm-body text-zinc-700">
                    {t.verifies}
                  </span>
                  <span className="shrink-0 rounded-lg bg-zinc-50 px-3 py-1.5 text-ofm-caption text-zinc-500 ring-1 ring-zinc-200/70">
                    {t.sample}
                  </span>
                </motion.div>
              ))}
            </div>

            <p className="mt-3 pl-1 text-ofm-caption text-zinc-400">
              No brain-teasers, no trivia, only what a chat shift actually
              asks of someone.
            </p>
          </div>
        </div>
      </DashboardShell>
    </div>
  );
}
