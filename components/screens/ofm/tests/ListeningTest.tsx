"use client";

/* f5 — "Listening." An audio clip plays through once, then the comprehension
   question reveals beneath it. The half of the job that isn't typing. */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Headphones, Pause, Play } from "lucide-react";
import TestChrome from "./TestChrome";

const EASE = [0.22, 1, 0.36, 1] as const;
const CLIP_SECONDS = 18;
const PLAY_MS = 3600; // scrubber runs the clip in ~3.6s of stage time

const OPTIONS = [
  "Cancel the order and refund it",
  "Change the delivery address before it ships",
  "Add a second item to the order",
  "Complain about the courier",
];

export default function ListeningTest() {
  const reduceMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [picked, setPicked] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setDone(true);
      setPicked(true);
      return;
    }
    const t = [
      setTimeout(() => setPlaying(true), 900),
      setTimeout(() => {
        setPlaying(false);
        setDone(true);
      }, 900 + PLAY_MS),
      setTimeout(() => setPicked(true), 900 + PLAY_MS + 1600),
    ];
    return () => t.forEach(clearTimeout);
  }, [reduceMotion]);

  const clock = done ? `0:${CLIP_SECONDS}` : "0:00";

  return (
    <TestChrome step={3}>
      <div className="w-[620px]">
        <div className="rounded-xl border border-zinc-200/70 bg-white shadow-sm">
          <div className="flex items-center justify-between px-8 pt-6">
            <span className="text-ofm-caption font-medium uppercase tracking-[0.08em] text-zinc-400">
              Audio comprehension
            </span>
            <span className="text-ofm-caption text-zinc-400">
              Plays up to 2 times
            </span>
          </div>

          {/* player */}
          <div className="px-8 pt-4">
            <div className="flex items-center gap-4 rounded-lg border border-zinc-200/70 bg-zinc-50 px-4 py-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ofm-600">
                {playing ? (
                  <Pause className="size-4 fill-white text-white" />
                ) : (
                  <Play className="ml-0.5 size-4 fill-white text-white" />
                )}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-ofm-caption text-zinc-500">
                  <Headphones className="size-3.5 text-zinc-400" strokeWidth={2} />
                  A customer voice note
                  <span className="ml-auto tabular-nums">
                    {clock} / 0:{CLIP_SECONDS}
                  </span>
                </div>
                {/* scrubber */}
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
                  <motion.div
                    className="h-full rounded-full bg-ofm-500"
                    initial={{ width: reduceMotion ? "100%" : "0%" }}
                    animate={{ width: playing || done ? "100%" : "0%" }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { duration: PLAY_MS / 1000, ease: "linear" }
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* question — reveals once the clip ends */}
          <div className="px-8 pb-8 pt-5">
            {done ? (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <p className="text-ofm-body font-medium text-zinc-800">
                  What is the customer asking for?
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  {OPTIONS.map((opt, i) => {
                    const isPicked = picked && i === 1;
                    return (
                      <div
                        key={opt}
                        className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 transition-colors duration-300 ${
                          isPicked
                            ? "border-ofm-500 bg-ofm-50"
                            : "border-zinc-200/70 bg-white"
                        }`}
                      >
                        <span
                          className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                            isPicked
                              ? "border-ofm-600 bg-ofm-600"
                              : "border-zinc-300 bg-white"
                          }`}
                        >
                          {isPicked && (
                            <Check className="size-3 text-white" strokeWidth={3} />
                          )}
                        </span>
                        <span
                          className={`text-ofm-body ${
                            isPicked
                              ? "font-medium text-zinc-900"
                              : "text-zinc-600"
                          }`}
                        >
                          {opt}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center gap-2 py-6 text-ofm-body text-zinc-400">
                <span className="size-1.5 rounded-full bg-zinc-300" />
                The question appears when the clip ends
              </div>
            )}
          </div>
        </div>
        <p className="mt-3 text-center text-ofm-caption text-zinc-400">
          Auto-scored · no employer time spent
        </p>
      </div>
    </TestChrome>
  );
}
