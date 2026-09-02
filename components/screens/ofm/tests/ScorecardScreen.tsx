"use client";

/* f8 — "The candidate's scorecard." The moment the battery ends, one card
   sums it: five rows filling in with a pass each, the AI's note on the
   spoken answer in plain words, and a "sent" tick. Nothing left to chase. */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpenText,
  Mic,
  Headphones,
  Gauge,
  Keyboard,
  Check,
  Send,
} from "lucide-react";
import TestChrome from "./TestChrome";

const EASE = [0.22, 1, 0.36, 1] as const;

const RESULTS = [
  { icon: BookOpenText, label: "English", value: "92", unit: "/ 100" },
  {
    icon: Mic,
    label: "Verbal",
    value: "88",
    unit: "/ 100",
    note: "Clear, calm phrasing. De-escalated the refund scenario without over-promising.",
  },
  { icon: Headphones, label: "Listening", value: "95", unit: "/ 100" },
  { icon: Gauge, label: "Internet speed", value: "87", unit: "Mbps" },
  { icon: Keyboard, label: "Typing", value: "68", unit: "WPM · 97%" },
];

export default function ScorecardScreen() {
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(0);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setShown(RESULTS.length);
      setSent(true);
      return;
    }
    const t: ReturnType<typeof setTimeout>[] = [];
    RESULTS.forEach((_, i) =>
      t.push(setTimeout(() => setShown(i + 1), 900 + i * 550)),
    );
    t.push(setTimeout(() => setSent(true), 900 + RESULTS.length * 550 + 500));
    return () => t.forEach(clearTimeout);
  }, [reduceMotion]);

  return (
    <TestChrome step={6}>
      <div className="w-[620px]">
        <div className="rounded-xl border border-zinc-200/70 bg-white shadow-sm">
          <div className="px-8 pb-5 pt-8">
            <h1 className="text-ofm-hero font-semibold text-zinc-900">
              All five done, here&apos;s your card
            </h1>
            <p className="mt-1.5 text-ofm-body text-zinc-500">
              Scored the moment you finished. This is exactly what Acme Studio
              sees.
            </p>
          </div>

          <div className="border-t border-zinc-200/70">
            {RESULTS.map((r, i) => {
              const visible = i < shown;
              return (
                <motion.div
                  key={r.label}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={visible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.35, ease: EASE }}
                  className={`px-8 py-2.5 ${
                    i > 0 ? "border-t border-zinc-100" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-ofm-50">
                      <r.icon className="size-4 text-ofm-600" strokeWidth={1.75} />
                    </span>
                    <span className="flex-1 text-ofm-body font-medium text-zinc-800">
                      {r.label}
                    </span>
                    <span className="text-ofm-body font-semibold tabular-nums text-zinc-900">
                      {r.value}
                      <span className="ml-1 font-normal text-zinc-400">
                        {r.unit}
                      </span>
                    </span>
                    <span
                      className={`flex items-center gap-1 rounded-full bg-ofm-50 px-2 py-0.5 text-ofm-micro font-semibold text-ofm-700 transition-opacity duration-300 ${
                        visible ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <Check className="size-3" strokeWidth={3} />
                      Pass
                    </span>
                  </div>
                  {r.note && visible && (
                    <motion.p
                      initial={reduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="ml-11 mt-1.5 rounded-lg bg-zinc-50 px-3 py-2 text-ofm-caption leading-relaxed text-zinc-500"
                    >
                      <span className="font-medium text-zinc-600">
                        AI note:
                      </span>{" "}
                      {r.note}
                    </motion.p>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* sent confirmation */}
          <div className="flex items-center gap-2.5 border-t border-zinc-200/70 px-8 py-4">
            <motion.span
              initial={reduceMotion ? false : { scale: 0.5, opacity: 0 }}
              animate={sent ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.3, ease: EASE }}
              className="flex size-6 items-center justify-center rounded-full bg-ofm-600"
            >
              <Send className="size-3 text-white" strokeWidth={2.5} />
            </motion.span>
            <span
              className={`text-ofm-body transition-opacity duration-300 ${
                sent ? "text-zinc-700 opacity-100" : "opacity-0"
              }`}
            >
              Sent to Acme Studio. Nothing else for you to do.
            </span>
          </div>
        </div>
      </div>
    </TestChrome>
  );
}
