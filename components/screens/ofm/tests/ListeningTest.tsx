"use client";

/* f8 — "Listening." A customer's voice message you can play back, then a
   comprehension question with the options in view the whole time. The half of
   the job that isn't typing. Plays twice at most; auto-scored against the key.

   Case-study beat: a synthetic cursor plays the clip (playhead sweeps, timer
   climbs), then picks the right answer and moves on.

   Mobbin refs: Preply (player on top, options below, gated action), Nibble
   (waveform + choices), Duolingo "what do you hear". OFM (Kibo) system. */

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Headphones,
  Pause,
  Play,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TestChrome from "./TestChrome";

const EASE = [0.22, 1, 0.36, 1] as const;
const TOTAL = 8;
const CLIP = 18; // clip length in seconds
const PLAY_MS = 4600; // stage time to play the clip through

/* fixed bar heights (0..1), tapered toward the centre like a real voice trace */
const N = 60;
const BARS = Array.from({ length: N }, (_, i) => {
  const env = Math.sin((i / (N - 1)) * Math.PI);
  const r = Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6));
  return (0.2 + 0.8 * r) * (0.35 + 0.65 * env);
});

const PROMPT = "What is the customer asking you to do?";
const OPTIONS = [
  "Cancel the order and refund it",
  "Change the delivery address before it ships",
  "Add a second item to the order",
  "Confirm the courier's phone number",
];
const ANSWER = 1;

function TimeChip() {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-zinc-200/70 bg-white px-3 py-1.5 text-ofm-caption font-medium text-zinc-500">
      <Clock className="size-3.5 text-zinc-400" strokeWidth={2} />
      2 min
    </span>
  );
}

/* macOS-style arrow, tip anchored at (2,2) so the motion x/y is the click point */
function CursorArrow() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 2 L2 18.5 L6.6 14.2 L9.7 21.2 L12.6 19.9 L9.5 13 L15.8 12.9 Z"
        fill="#18181b"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ListeningTest() {
  const reduceMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [fill, setFill] = useState(0); // 0..1 playback progress
  const [playsLeft, setPlaysLeft] = useState(2);
  const [picked, setPicked] = useState<number | null>(null);
  const [pressNext, setPressNext] = useState(false);
  const [ripple, setRipple] = useState({ x: 0, y: 0, n: 0 });

  const rootRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLElement | null)[]>([]);
  const nextRef = useRef<HTMLDivElement>(null);
  const cursor = useAnimationControls();

  /* the green fill advances smoothly (per-frame) while the clip plays */
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const f = Math.min(1, (t - start) / PLAY_MS);
      setFill(f);
      if (f < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  /* the cursor: play the clip → pick the answer → move on */
  useEffect(() => {
    if (reduceMotion) {
      setPlaysLeft(1);
      setPicked(ANSWER);
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const sleep = (ms: number) =>
      new Promise<void>((res) => timers.push(setTimeout(res, ms)));

    const centerOf = (el: HTMLElement | null) => {
      const root = rootRef.current;
      if (!root || !el) return { x: 430, y: 320 };
      const r = root.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      const scale = r.width / 860 || 1;
      return {
        x: (b.left + b.width / 2 - r.left) / scale,
        y: (b.top + b.height / 2 - r.top) / scale,
      };
    };

    const clickAt = async (x: number, y: number, moveMs = 0.7) => {
      await cursor.start({
        x: x - 4,
        y: y - 3,
        opacity: 1,
        transition: { duration: moveMs, ease: EASE },
      });
      if (cancelled) return;
      await cursor.start({ scale: 0.82, transition: { duration: 0.1 } });
      if (cancelled) return;
      setRipple((r) => ({ x, y, n: r.n + 1 }));
      await cursor.start({ scale: 1, transition: { duration: 0.16, ease: EASE } });
    };

    async function play() {
      await sleep(1000);
      if (cancelled) return;
      // play the clip
      let p = centerOf(playRef.current);
      await clickAt(p.x, p.y);
      if (cancelled) return;
      setPlaysLeft(1);
      setPlaying(true);
      await sleep(PLAY_MS + 300);
      if (cancelled) return;
      setPlaying(false);
      setFill(0);
      await sleep(700);
      if (cancelled) return;
      // pick the answer
      p = centerOf(optionRefs.current[ANSWER]);
      await clickAt(p.x, p.y);
      if (cancelled) return;
      setPicked(ANSWER);
      await sleep(750);
      if (cancelled) return;
      // move on
      p = centerOf(nextRef.current);
      await clickAt(p.x, p.y);
      if (cancelled) return;
      setPressNext(true);
      await sleep(160);
      setPressNext(false);
      await sleep(400);
      await cursor.start({ opacity: 0, transition: { duration: 0.5, ease: EASE } });
    }

    play();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [reduceMotion, cursor]);

  const clock = `0:${String(Math.round(fill * CLIP)).padStart(2, "0")}`;
  const answered = picked !== null;

  return (
    <TestChrome test="Listening" topRight={<TimeChip />}>
      <div ref={rootRef} className="relative flex w-[860px] flex-col">
        {/* progress header */}
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-ofm-label font-semibold uppercase tracking-[0.08em] text-zinc-400">
            Listening &middot; comprehension
          </span>
          <span className="text-ofm-label tabular-nums text-zinc-400">
            Question <span className="font-semibold text-zinc-600">4</span> of{" "}
            {TOTAL}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-ofm-500"
            style={{ width: `${(4 / TOTAL) * 100}%` }}
          />
        </div>

        {/* card */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="mt-5 rounded-2xl border border-zinc-200/60 bg-white p-10 shadow-[0_2px_4px_rgba(24,24,27,0.03),0_18px_44px_-24px_rgba(24,24,27,0.20)]"
        >
          {/* player */}
          <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50/60 px-5 py-4">
            <div className="mb-3 flex items-center gap-2 text-ofm-caption font-medium text-zinc-500">
              <Headphones className="size-3.5 text-zinc-400" strokeWidth={2} />
              Voice message from a customer
              <span className="ml-auto text-zinc-400">
                {playsLeft} {playsLeft === 1 ? "play" : "plays"} left
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                ref={playRef}
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-ofm-600 text-white shadow-sm"
              >
                {playing ? (
                  <Pause className="size-5" fill="currentColor" />
                ) : (
                  <Play className="ml-0.5 size-5" fill="currentColor" />
                )}
              </button>
              {/* waveform — the played lines themselves fill green */}
              <div className="flex h-9 flex-1 items-center justify-between">
                {BARS.map((h, i) => {
                  const played = i / (N - 1) <= fill;
                  return (
                    <span
                      key={i}
                      className={`w-[3px] shrink-0 rounded-full transition-colors duration-300 ease-out ${
                        played ? "bg-ofm-500" : "bg-zinc-300"
                      }`}
                      style={{ height: 4 + h * 22 }}
                    />
                  );
                })}
              </div>
              <span className="shrink-0 text-ofm-label tabular-nums text-zinc-500">
                {clock} / 0:{CLIP}
              </span>
            </div>
          </div>

          {/* question — options in view the whole time */}
          <p className="mt-8 text-ofm-title font-semibold text-zinc-900">
            {PROMPT}
          </p>
          <div className="mt-4 flex flex-col gap-2.5">
            {OPTIONS.map((opt, i) => {
              const isPicked = picked === i;
              return (
                <div
                  key={opt}
                  ref={(el) => {
                    optionRefs.current[i] = el;
                  }}
                  className={`flex items-center gap-3.5 rounded-xl border px-4 py-3.5 transition-all duration-300 ${
                    isPicked
                      ? "border-ofm-500 bg-ofm-50 shadow-[0_0_0_1px_rgba(0,110,66,0.22)]"
                      : "border-zinc-200/70 bg-white hover:border-zinc-300"
                  }`}
                >
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-ofm-label font-semibold transition-colors duration-300 ${
                      isPicked
                        ? "bg-ofm-600 text-white"
                        : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span
                    className={`text-ofm-body ${
                      isPicked
                        ? "font-semibold text-zinc-900"
                        : "font-medium text-zinc-700"
                    }`}
                  >
                    {opt}
                  </span>
                </div>
              );
            })}
          </div>

          {/* navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-6">
            <Button variant="ghost" className="text-zinc-500">
              <ChevronLeft strokeWidth={2} />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="text-zinc-500">
                Skip
              </Button>
              <motion.div
                ref={nextRef}
                animate={{ scale: pressNext ? 0.95 : 1 }}
                transition={{ duration: 0.18, ease: EASE }}
              >
                <Button disabled={!answered}>
                  Next
                  <ChevronRight strokeWidth={2} />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-ofm-caption text-zinc-400">
          <ShieldAlert className="size-3.5 shrink-0" strokeWidth={2} />
          Stay on this tab. Switching away or leaving the window is flagged
        </p>

        {/* autoplay cursor + click ripple (case-study beat only) */}
        {!reduceMotion && (
          <>
            {ripple.n > 0 && (
              <motion.span
                key={ripple.n}
                initial={{ scale: 0, opacity: 0.4 }}
                animate={{ scale: 2.4, opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                style={{ left: ripple.x, top: ripple.y }}
                className="pointer-events-none absolute z-40 -ml-4 -mt-4 size-8 rounded-full bg-ofm-400"
              />
            )}
            <motion.div
              animate={cursor}
              initial={{ opacity: 0, x: 430, y: 540 }}
              className="pointer-events-none absolute left-0 top-0 z-50"
            >
              <CursorArrow />
            </motion.div>
          </>
        )}
      </div>
    </TestChrome>
  );
}
