"use client";

/* f1 — "Pick the tests, send the invite." The employer builds the battery
   from the role: five toggles, each scaffolding its pass-mark row inline
   when switched on, then one link to send. Lives in the Kibo shell. */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpenText,
  Mic,
  Headphones,
  Gauge,
  Keyboard,
  ChevronDown,
  ChevronRight,
  Link2,
} from "lucide-react";
import DashboardShell from "@/components/screens/ofm/DashboardShell";

const EASE = [0.22, 1, 0.36, 1] as const;

type Row = {
  icon: typeof Mic;
  label: string;
  detail: string;
  passMark: string;
  timeLimit: string;
};

const ROWS: Row[] = [
  { icon: BookOpenText, label: "English", detail: "Reading & grammar", passMark: "80 / 100", timeLimit: "3 min" },
  { icon: Mic, label: "Verbal", detail: "One spoken answer, AI-scored", passMark: "75 / 100", timeLimit: "2 min" },
  { icon: Headphones, label: "Listening", detail: "A clip, then questions", passMark: "80 / 100", timeLimit: "2 min" },
  { icon: Gauge, label: "Internet speed", detail: "Measured, not judged", passMark: "25 Mbps", timeLimit: "1 min" },
  { icon: Keyboard, label: "Typing", detail: "WPM and accuracy on a clock", passMark: "60 WPM", timeLimit: "2 min" },
];

/* Verbal starts off; the demo toggles it on and its pass-mark row scaffolds. */
const TOGGLE_INDEX = 1;

function Switch({ on }: { on: boolean }) {
  return (
    <span
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-300 ${
        on ? "bg-ofm-600" : "bg-zinc-200"
      }`}
    >
      <span
        className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-[left] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          on ? "left-[18px]" : "left-0.5"
        }`}
      />
    </span>
  );
}

export default function SetupScreen() {
  const reduceMotion = useReducedMotion();
  const [verbalOn, setVerbalOn] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setVerbalOn(true);
      return;
    }
    const t = setTimeout(() => setVerbalOn(true), 1800);
    return () => clearTimeout(t);
  }, [reduceMotion]);

  return (
    <div className="absolute inset-0">
      <DashboardShell
        headerLeft={
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="shrink-0 text-ofm-body text-zinc-400">Jobs</span>
            <ChevronRight className="size-4 shrink-0 text-zinc-300" strokeWidth={2} />
            <span className="shrink-0 text-ofm-body text-zinc-400">
              Virtual Chatter
            </span>
            <ChevronRight className="size-4 shrink-0 text-zinc-300" strokeWidth={2} />
            <span className="truncate text-ofm-display font-semibold text-zinc-900">
              Skills check
            </span>
          </div>
        }
      >
        <div className="flex h-full items-start justify-center overflow-hidden px-5 py-4">
          <div className="w-[640px]">
            <div className="rounded-xl border border-zinc-200/70 bg-white shadow-sm">
              <div className="flex items-start justify-between px-6 pb-4 pt-5">
                <div>
                  <h2 className="text-ofm-title font-semibold text-zinc-900">
                    Tests for this role
                  </h2>
                  <p className="mt-0.5 text-ofm-label text-zinc-500">
                    Pick what the work actually needs. One link covers the lot.
                  </p>
                </div>
                <span className="rounded-full bg-ofm-50 px-2.5 py-1 text-ofm-caption font-medium tabular-nums text-ofm-700">
                  {(verbalOn ? 5 : 4)} of 5 on · ~10 min
                </span>
              </div>

              <div className="border-t border-zinc-200/70">
                {ROWS.map((row, i) => {
                  const on = i === TOGGLE_INDEX ? verbalOn : true;
                  return (
                    <div
                      key={row.label}
                      className={i > 0 ? "border-t border-zinc-100" : ""}
                    >
                      <div className="flex items-center gap-3 px-6 py-2.5">
                        <Switch on={on} />
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-50">
                          <row.icon
                            className={`size-4 ${on ? "text-ofm-600" : "text-zinc-400"}`}
                            strokeWidth={1.75}
                          />
                        </span>
                        <span className="flex-1">
                          <span
                            className={`block text-ofm-body font-medium leading-tight ${
                              on ? "text-zinc-800" : "text-zinc-400"
                            }`}
                          >
                            {row.label}
                          </span>
                          <span className="block text-ofm-caption leading-tight text-zinc-400">
                            {row.detail}
                          </span>
                        </span>
                      </div>
                      {/* pass-mark row scaffolds in when the test is on */}
                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.div
                            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="flex items-center gap-2 pb-2.5 pl-[104px] pr-6">
                              <span className="text-ofm-caption text-zinc-400">
                                Pass mark
                              </span>
                              <button className="flex items-center gap-1 rounded-md border border-zinc-200/70 px-2 py-1 text-ofm-caption font-medium tabular-nums text-zinc-700 hover:bg-zinc-50">
                                {row.passMark}
                                <ChevronDown className="size-3 text-zinc-400" strokeWidth={2} />
                              </button>
                              <span className="ml-3 text-ofm-caption text-zinc-400">
                                Time limit
                              </span>
                              <button className="flex items-center gap-1 rounded-md border border-zinc-200/70 px-2 py-1 text-ofm-caption font-medium tabular-nums text-zinc-700 hover:bg-zinc-50">
                                {row.timeLimit}
                                <ChevronDown className="size-3 text-zinc-400" strokeWidth={2} />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* send */}
              <div className="flex items-center justify-between border-t border-zinc-200/70 px-6 py-4">
                <span className="text-ofm-label text-zinc-500">
                  Or invite straight from a candidate&apos;s card on the board.
                </span>
                <button className="flex items-center gap-1.5 rounded-lg bg-ofm-600 px-3 py-2 text-ofm-label font-medium text-white hover:bg-ofm-700">
                  <Link2 className="size-4" strokeWidth={2} />
                  Copy invite link
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardShell>
    </div>
  );
}
