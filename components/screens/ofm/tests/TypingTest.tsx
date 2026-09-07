"use client";

/* f10 — "Typing." A timed passage: the typed text fills in solid behind a
   blinking caret, mistyped characters show red, and the rest stays dimmed. The
   on-screen keyboard lights up key by key while live WPM, accuracy, and the
   clock tick. One number the employer already understands.

   Case-study beat: auto-types the passage — the caret advances, each key
   lights, a few slips land red, the counters climb. OFM (Kibo) system.

   Refs: Monkeytype / typing.com / Keybr (dimmed passage + caret + red errors,
   live WPM, on-screen keyboard). */

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import TestChrome from "./TestChrome";

const PASSAGE =
  "Thanks for reaching out! I've checked your order and the hoodie left our warehouse this morning, so it should arrive within three business days. I'll send the tracking link to this chat right away.";
const LEN = PASSAGE.length;
const STOP = Math.floor(LEN * 0.52); // hold mid-passage
const TICK_MS = 80; // one character per tick
const ERRORS = new Set([16, 41, 88]); // a few slips, shown red

const ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

function Keyboard({ active }: { active: string | undefined }) {
  const norm = active ? active.toUpperCase() : undefined;
  return (
    <div className="flex w-full flex-col items-center gap-1.5">
      {ROWS.map((row, r) => (
        <div key={r} className="flex gap-1.5">
          {row.split("").map((k) => {
            const on = norm === k;
            return (
              <span
                key={k}
                className={`flex size-9 items-center justify-center rounded-md text-ofm-caption font-semibold transition-colors duration-100 ${
                  on ? "bg-ofm-600 text-white" : "bg-zinc-100 text-zinc-400"
                }`}
              >
                {k}
              </span>
            );
          })}
        </div>
      ))}
      <div
        className={`h-9 w-56 rounded-md transition-colors duration-100 ${
          norm === " " ? "bg-ofm-600" : "bg-zinc-100"
        }`}
      />
    </div>
  );
}

export default function TypingTest() {
  const reduceMotion = useReducedMotion();
  const [typed, setTyped] = useState(0);
  const iv = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (reduceMotion) {
      setTyped(STOP);
      return;
    }
    const start = setTimeout(() => {
      iv.current = setInterval(() => {
        setTyped((n) => {
          if (n >= STOP) {
            clearInterval(iv.current);
            return n;
          }
          return n + 1;
        });
      }, TICK_MS);
    }, 900);
    return () => {
      clearTimeout(start);
      clearInterval(iv.current);
    };
  }, [reduceMotion]);

  const frac = typed / STOP;
  const wpm = typed === 0 ? 0 : Math.round(48 + frac * 20); // settles ~68
  const accuracy = typed === 0 ? 100 : Math.round(99 - frac * 2); // ~97
  const secondsLeft = 60 - Math.round(frac * 28);
  const activeKey = typed > 0 ? PASSAGE[typed - 1] : undefined;

  const stats = [
    { label: "WPM", value: String(wpm), strong: true },
    { label: "Accuracy", value: `${accuracy}%`, strong: false },
    {
      label: "Time left",
      value:
        secondsLeft >= 60 ? "1:00" : `0:${String(secondsLeft).padStart(2, "0")}`,
      strong: false,
    },
  ];

  return (
    <TestChrome test="Typing">
      <div className="flex w-[860px] flex-col">
        {/* header */}
        <div className="mb-3">
          <span className="text-ofm-label font-semibold uppercase tracking-[0.08em] text-zinc-400">
            Timed passage
          </span>
        </div>

        {/* card */}
        <div className="rounded-2xl border border-zinc-200/60 bg-white p-10 shadow-[0_2px_4px_rgba(24,24,27,0.03),0_18px_44px_-24px_rgba(24,24,27,0.20)]">
          {/* live counters */}
          <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-zinc-200/70">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col items-center py-4 ${
                  i > 0 ? "border-l border-zinc-200/70" : ""
                }`}
              >
                <span className="text-ofm-caption text-zinc-400">{s.label}</span>
                <span
                  className={`mt-1 text-[28px] font-semibold leading-none tabular-nums ${
                    s.strong ? "text-ofm-600" : "text-zinc-800"
                  }`}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </div>

          {/* passage */}
          <p className="mt-8 text-[21px] leading-[1.85] tracking-[-0.01em]">
            {PASSAGE.slice(0, typed)
              .split("")
              .map((ch, i) => (
                <span
                  key={i}
                  className={
                    ERRORS.has(i)
                      ? "rounded-[3px] bg-red-50 text-red-500 underline decoration-red-300 underline-offset-2"
                      : "text-zinc-800"
                  }
                >
                  {ch}
                </span>
              ))}
            <motion.span
              className="mx-[1px] inline-block h-[1.1em] w-[2px] -translate-y-[2px] rounded-full bg-ofm-600 align-middle"
              animate={reduceMotion ? undefined : { opacity: [1, 0, 1] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-zinc-300">{PASSAGE.slice(typed)}</span>
          </p>

          {/* keyboard */}
          <div className="mt-9">
            <Keyboard active={activeKey} />
          </div>
        </div>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-ofm-caption text-zinc-400">
          <ShieldAlert className="size-3.5 shrink-0" strokeWidth={2} />
          Stay on this tab. Switching away or leaving the window is flagged
        </p>
      </div>
    </TestChrome>
  );
}
