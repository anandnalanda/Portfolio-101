"use client";

/* f4 — "Verbal." A scenario on screen, a recorder underneath: the candidate
   says their answer out loud. The waveform runs while recording, then the
   take lands as a playback row with submit. AI scores it, and says why. */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Mic, Play, RotateCcw, Square } from "lucide-react";
import TestChrome from "./TestChrome";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Fixed pseudo-random bar heights so the waveform is stable across renders. */
const BARS = Array.from({ length: 36 }, (_, i) =>
  0.25 + 0.75 * Math.abs(Math.sin(i * 2.7) * Math.cos(i * 1.3)),
);

type Phase = "idle" | "recording" | "review";

export default function VerbalTest() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setPhase("review");
      setElapsed(14);
      return;
    }
    const t = [
      setTimeout(() => setPhase("recording"), 1200),
      setTimeout(() => setPhase("review"), 5600),
    ];
    return () => t.forEach(clearTimeout);
  }, [reduceMotion]);

  useEffect(() => {
    if (phase !== "recording") return;
    const iv = setInterval(() => setElapsed((e) => e + 1), 320);
    return () => clearInterval(iv);
  }, [phase]);

  const clock = `0:${String(elapsed).padStart(2, "0")}`;

  return (
    <TestChrome step={2}>
      <div className="w-[620px]">
        <div className="rounded-xl border border-zinc-200/70 bg-white shadow-sm">
          <div className="px-8 pt-6">
            <span className="text-ofm-caption font-medium uppercase tracking-[0.08em] text-zinc-400">
              Spoken answer
            </span>
            <p className="mt-3 text-ofm-body font-medium text-zinc-800">
              A customer has waited two weeks for a refund and is angry. Say,
              out loud, how you would respond.
            </p>
            {/* the scenario, as the message they'd face */}
            <div className="mt-4 flex items-end gap-2.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-ofm-micro font-semibold text-zinc-500">
                C
              </span>
              <div className="rounded-2xl rounded-bl-md bg-zinc-100 px-4 py-2.5 text-ofm-body leading-relaxed text-zinc-700">
                Two weeks and still no refund?? This is honestly ridiculous, I
                want my money back today.
              </div>
            </div>
          </div>

          {/* recorder */}
          <div className="mt-6 border-t border-zinc-200/70 px-8 py-5">
            <AnimatePresence mode="wait">
              {phase !== "review" ? (
                <motion.div
                  key="rec"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-4"
                >
                  <span
                    className={`flex size-12 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                      phase === "recording" ? "bg-red-600" : "bg-ofm-600"
                    }`}
                  >
                    {phase === "recording" ? (
                      <Square className="size-4 fill-white text-white" />
                    ) : (
                      <Mic className="size-5 text-white" strokeWidth={2} />
                    )}
                  </span>
                  {/* waveform */}
                  <div className="flex h-10 flex-1 items-center gap-[3px]">
                    {BARS.map((h, i) => (
                      <motion.span
                        key={i}
                        className={`w-[4px] rounded-full ${
                          phase === "recording" ? "bg-ofm-500" : "bg-zinc-200"
                        }`}
                        animate={
                          phase === "recording"
                            ? { height: [6, h * 36, 6] }
                            : { height: 6 }
                        }
                        transition={
                          phase === "recording"
                            ? {
                                duration: 0.9,
                                repeat: Infinity,
                                delay: (i % 9) * 0.09,
                                ease: "easeInOut",
                              }
                            : { duration: 0.3 }
                        }
                      />
                    ))}
                  </div>
                  <span
                    className={`w-10 text-right text-ofm-body tabular-nums ${
                      phase === "recording"
                        ? "font-medium text-red-600"
                        : "text-zinc-400"
                    }`}
                  >
                    {clock}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="review"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="flex items-center gap-3"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-zinc-200/70 bg-white">
                    <Play className="ml-0.5 size-4 text-zinc-600" strokeWidth={2} />
                  </span>
                  <div className="flex h-9 flex-1 items-center gap-[3px] rounded-lg bg-zinc-50 px-3">
                    {BARS.slice(0, 30).map((h, i) => (
                      <span
                        key={i}
                        className="w-[3px] rounded-full bg-zinc-300"
                        style={{ height: 4 + h * 20 }}
                      />
                    ))}
                    <span className="ml-auto text-ofm-caption tabular-nums text-zinc-400">
                      {clock}
                    </span>
                  </div>
                  <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-ofm-label font-medium text-zinc-500 hover:bg-zinc-50">
                    <RotateCcw className="size-3.5" strokeWidth={2} />
                    Retake
                  </button>
                  <button className="rounded-lg bg-ofm-600 px-4 py-2 text-ofm-label font-medium text-white hover:bg-ofm-700">
                    Submit answer
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <p className="mt-3 text-center text-ofm-caption text-zinc-400">
          AI scores fluency and clarity, and shows why · one retake allowed
        </p>
      </div>
    </TestChrome>
  );
}
