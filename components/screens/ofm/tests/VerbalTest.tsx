"use client";

/* f7 — "Verbal." A scenario on screen, a recorder underneath: the candidate
   says their answer out loud. A live waveform runs while recording and the timer
   climbs; the take then lands as a playback row with Submit. AI scores fluency
   and clarity, and says why.

   Case-study beat: a synthetic cursor taps record, the waveform comes alive and
   the timer climbs, then it taps stop and submits the take.

   Mobbin refs: OpenPhone/Quo recorder (centered waveform + stop + timer),
   Apple Notes playback row, Speak/Beside speaking prompts. OFM (Kibo) system. */

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { Mic, Square, Play, RotateCcw, Check, Clock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import TestChrome from "./TestChrome";

const EASE = [0.22, 1, 0.36, 1] as const;

/* fixed bar heights (0..1), tapered toward the centre like a real voice trace */
const N = 56;
const BARS = Array.from({ length: N }, (_, i) => {
  const env = Math.sin((i / (N - 1)) * Math.PI); // 0 → 1 → 0
  const r = Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6));
  return (0.2 + 0.8 * r) * (0.35 + 0.65 * env);
});

type Phase = "idle" | "recording" | "review" | "done";

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

/* the live recording trace — bars pulse when active, flatten when not */
function LiveWave({ active }: { active: boolean }) {
  return (
    <div className="flex h-16 items-center justify-center gap-[3px]">
      {BARS.map((h, i) => (
        <motion.span
          key={i}
          className={`w-[3px] rounded-full ${active ? "bg-ofm-500" : "bg-zinc-200"}`}
          animate={active ? { height: [5, 6 + h * 54, 5] } : { height: 5 }}
          transition={
            active
              ? {
                  duration: 0.8 + (i % 5) * 0.12,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: (i % 7) * 0.06,
                }
              : { duration: 0.3, ease: EASE }
          }
        />
      ))}
    </div>
  );
}

/* the recorded take, as a static playback trace that fills the row */
function StaticWave() {
  return (
    <div className="flex h-9 flex-1 items-center justify-between">
      {BARS.map((h, i) => (
        <span
          key={i}
          className="w-[3px] shrink-0 rounded-full bg-zinc-300"
          style={{ height: 4 + h * 22 }}
        />
      ))}
    </div>
  );
}

export default function VerbalTest() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [retakesLeft, setRetakesLeft] = useState(1);
  const [pressSubmit, setPressSubmit] = useState(false);
  const [pressRetake, setPressRetake] = useState(false);
  const [ripple, setRipple] = useState({ x: 0, y: 0, n: 0 });

  const rootRef = useRef<HTMLDivElement>(null);
  const recordRef = useRef<HTMLButtonElement>(null);
  const reRecordRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef<HTMLDivElement>(null);
  const cursor = useAnimationControls();

  /* the timer climbs while recording */
  useEffect(() => {
    if (phase !== "recording") return;
    const iv = setInterval(() => setElapsed((e) => e + 1), 340);
    return () => clearInterval(iv);
  }, [phase]);

  /* the cursor: tap record → let it run → tap stop → submit */
  useEffect(() => {
    if (reduceMotion) {
      setElapsed(14);
      setPhase("review");
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const sleep = (ms: number) =>
      new Promise<void>((res) => timers.push(setTimeout(res, ms)));

    const centerOf = (el: HTMLElement | null) => {
      const root = rootRef.current;
      if (!root || !el) return { x: 410, y: 360 };
      const r = root.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      const scale = r.width / 820 || 1;
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
      await sleep(900);
      if (cancelled) return;

      // first take — tap record, let it run a good while
      let p = centerOf(recordRef.current);
      await clickAt(p.x, p.y);
      if (cancelled) return;
      setElapsed(0);
      setPhase("recording");
      await sleep(6400); // a fuller answer, spoken
      if (cancelled) return;
      p = centerOf(recordRef.current);
      await clickAt(p.x, p.y);
      if (cancelled) return;
      setPhase("review");
      await sleep(1700); // the take settles

      if (cancelled) return;
      // spend the one retake → back to the ready state, not straight into recording
      p = centerOf(reRecordRef.current);
      await clickAt(p.x, p.y);
      if (cancelled) return;
      setPressRetake(true);
      await sleep(160);
      setPressRetake(false);
      setRetakesLeft(0);
      setElapsed(0);
      setPhase("idle");
      await sleep(1100); // ready — the record button is back
      if (cancelled) return;
      // tap record to start the second take
      p = centerOf(recordRef.current);
      await clickAt(p.x, p.y);
      if (cancelled) return;
      setPhase("recording");
      await sleep(5400); // the second, better take
      if (cancelled) return;
      p = centerOf(recordRef.current);
      await clickAt(p.x, p.y);
      if (cancelled) return;
      setPhase("review");
      await sleep(1800);

      if (cancelled) return;
      // submit
      p = centerOf(submitRef.current);
      await clickAt(p.x, p.y);
      if (cancelled) return;
      setPressSubmit(true);
      await sleep(160);
      setPressSubmit(false);
      setPhase("done");
      await sleep(500);
      await cursor.start({ opacity: 0, transition: { duration: 0.5, ease: EASE } });
    }

    play();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [reduceMotion, cursor]);

  const clock = `0:${String(elapsed).padStart(2, "0")}`;
  const reviewing = phase === "review" || phase === "done";

  return (
    <TestChrome test="Verbal" topRight={<TimeChip />}>
      <div ref={rootRef} className="relative flex w-[820px] flex-col">
        {/* header */}
        <div className="mb-3">
          <span className="text-ofm-label font-semibold uppercase tracking-[0.08em] text-zinc-400">
            Spoken answer
          </span>
        </div>

        {/* card */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="rounded-2xl border border-zinc-200/60 bg-white p-10 shadow-[0_2px_4px_rgba(24,24,27,0.03),0_18px_44px_-24px_rgba(24,24,27,0.20)]"
        >
          <p className="text-ofm-title font-semibold text-zinc-900">
            A customer&apos;s been waiting two weeks for a refund and they&apos;re
            upset. Say, out loud, how you&apos;d respond.
          </p>

          {/* the scenario, as the message they'd face */}
          <div className="mt-5 flex items-end gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/nora.jpg"
              alt="Nora"
              className="size-10 shrink-0 rounded-full object-cover ring-1 ring-black/5"
            />
            <div className="flex flex-col items-start gap-1">
              <span className="px-1 text-ofm-caption font-medium text-zinc-400">
                Nora
              </span>
              <div className="max-w-[520px] rounded-2xl rounded-bl-md bg-zinc-100 px-5 py-3.5 text-[17px] leading-relaxed text-zinc-800">
                Two weeks and still no refund?? This is honestly ridiculous. I
                want my money back today.
              </div>
            </div>
          </div>

          {/* recorder */}
          <div className="mt-8 rounded-2xl border border-zinc-200/60 bg-zinc-50/60 px-6 py-7">
            {reviewing ? (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="flex flex-col gap-5"
              >
                {/* playback row */}
                <div className="flex items-center gap-4 rounded-xl border border-zinc-200/70 bg-white px-4 py-3 shadow-sm">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ofm-600 text-white">
                    <Play className="ml-0.5 size-4" strokeWidth={2} fill="currentColor" />
                  </span>
                  <StaticWave />
                  <span className="shrink-0 text-ofm-label tabular-nums text-zinc-500">
                    {clock}
                  </span>
                </div>

                {/* actions, then the submitted confirmation */}
                {phase === "done" ? (
                  <div className="flex items-center justify-center gap-2 text-ofm-label font-semibold text-ofm-700">
                    <span className="flex size-5 items-center justify-center rounded-full bg-ofm-600">
                      <Check className="size-3 text-white" strokeWidth={3} />
                    </span>
                    Answer submitted · scoring now
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <motion.div
                      ref={reRecordRef}
                      animate={{ scale: pressRetake ? 0.95 : 1 }}
                      transition={{ duration: 0.18, ease: EASE }}
                    >
                      <Button
                        variant="ghost"
                        disabled={retakesLeft === 0}
                        className="text-zinc-500"
                      >
                        <RotateCcw strokeWidth={2} />
                        {retakesLeft > 0
                          ? `Re-record · ${retakesLeft} left`
                          : "No retakes left"}
                      </Button>
                    </motion.div>
                    <motion.div
                      ref={submitRef}
                      animate={{ scale: pressSubmit ? 0.95 : 1 }}
                      transition={{ duration: 0.18, ease: EASE }}
                    >
                      <Button>Submit answer</Button>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <LiveWave active={phase === "recording"} />

                <button
                  ref={recordRef}
                  className={`flex size-16 items-center justify-center rounded-full shadow-sm transition-colors duration-300 ${
                    phase === "recording" ? "bg-red-600" : "bg-ofm-600"
                  }`}
                >
                  {phase === "recording" ? (
                    <Square className="size-5 text-white" fill="currentColor" />
                  ) : (
                    <Mic className="size-6 text-white" strokeWidth={2} />
                  )}
                </button>

                {phase === "recording" ? (
                  <span className="flex items-center gap-2 text-ofm-label font-medium tabular-nums text-red-600">
                    <span className="size-2 rounded-full bg-red-500" />
                    {clock}
                  </span>
                ) : (
                  <span className="text-ofm-label text-zinc-400">
                    Tap to record your answer
                  </span>
                )}
              </div>
            )}
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
              initial={{ opacity: 0, x: 420, y: 520 }}
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
