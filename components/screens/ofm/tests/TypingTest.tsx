"use client";

/* f7 — "Typing." The same timed passage for everyone, so scores compare.
   Words light up as if typed behind a blinking caret while live WPM and
   accuracy tick up and the clock runs down. */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import TestChrome from "./TestChrome";

const PASSAGE =
  "Thanks for reaching out! I've checked your order and the hoodie left our warehouse this morning, so it should arrive within three business days. I'll send the tracking link to this chat right away, and if anything changes I will update you here first.".split(
    " ",
  );

const TICK_MS = 170; // one word "typed" per tick
const STOP_AT = Math.floor(PASSAGE.length * 0.72); // hold mid-passage

export default function TypingTest() {
  const reduceMotion = useReducedMotion();
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setTyped(STOP_AT);
      return;
    }
    const start = setTimeout(() => {
      const iv = setInterval(() => {
        setTyped((n) => {
          if (n >= STOP_AT) {
            clearInterval(iv);
            return n;
          }
          return n + 1;
        });
      }, TICK_MS);
    }, 1000);
    return () => clearTimeout(start);
  }, [reduceMotion]);

  const frac = typed / STOP_AT;
  const wpm = typed === 0 ? 0 : Math.round(46 + frac * 22); // settles at 68
  const accuracy = typed === 0 ? 100 : Math.round(100 - frac * 3); // ~97
  const secondsLeft = 60 - Math.round(frac * 22);

  const stats = [
    { label: "WPM", value: String(wpm), strong: true },
    { label: "Accuracy", value: `${accuracy}%`, strong: false },
    {
      label: "Time left",
      value:
        secondsLeft >= 60
          ? "1:00"
          : `0:${String(secondsLeft).padStart(2, "0")}`,
      strong: false,
    },
  ];

  return (
    <TestChrome step={5}>
      <div className="w-[620px]">
        <div className="rounded-xl border border-zinc-200/70 bg-white shadow-sm">
          <div className="flex items-center justify-between px-8 pt-6">
            <span className="text-ofm-caption font-medium uppercase tracking-[0.08em] text-zinc-400">
              Timed passage
            </span>
            <span className="text-ofm-caption text-zinc-400">
              Same passage for every candidate
            </span>
          </div>

          {/* live counters */}
          <div className="mt-4 grid grid-cols-3 border-y border-zinc-200/70">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col items-center py-4 ${
                  i > 0 ? "border-l border-zinc-200/70" : ""
                }`}
              >
                <span className="text-ofm-caption text-zinc-400">{s.label}</span>
                <span
                  className={`mt-1 text-[26px] font-semibold tabular-nums leading-none ${
                    s.strong ? "text-ofm-600" : "text-zinc-800"
                  }`}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </div>

          {/* passage */}
          <div className="px-8 pb-8 pt-6">
            <p className="text-[17px] leading-[1.9] text-zinc-300">
              {PASSAGE.map((word, i) => (
                <span key={i}>
                  <span
                    className={
                      i < typed
                        ? "text-zinc-800 transition-colors duration-150"
                        : undefined
                    }
                  >
                    {word}
                  </span>
                  {i === typed - 1 && (
                    <motion.span
                      className="ml-[1px] inline-block h-[1.1em] w-[2px] translate-y-[3px] bg-ofm-600"
                      animate={reduceMotion ? undefined : { opacity: [1, 0, 1] }}
                      transition={{ duration: 0.9, repeat: Infinity }}
                    />
                  )}{" "}
                </span>
              ))}
            </p>
          </div>
        </div>
        <p className="mt-3 text-center text-ofm-caption text-zinc-400">
          One number the employer already understands
        </p>
      </div>
    </TestChrome>
  );
}
