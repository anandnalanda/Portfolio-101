"use client";

/* f6 — "English." Reading & grammar, staged as the live chat the job actually
   runs: a real two-message exchange where you complete the blank — first inside
   a customer's message, then inside your own reply. One progress bar tracks the
   twenty questions (Duolingo/Speak pattern); Back revisits, Skip moves on, and
   Next — which only lights up once an answer is chosen — advances. The chosen
   word drops into the sentence in green.

   Case-study beat: a synthetic cursor answers a question, clicks Next, and the
   next question slides in — repeating so the loop reads at a glance.

   Mobbin refs: Duolingo/Speak top progress bar + gated primary action; Quizlet
   lettered options; Ulta's Back · Skip/Next footer. OFM (Kibo) candidate system. */

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import TestChrome from "./TestChrome";

const EASE = [0.22, 1, 0.36, 1] as const;
const TOTAL = 20;

type Msg = {
  agent: boolean;
  text?: string;
  /** the message carrying the blank */
  before?: string;
  after?: string;
};
type Q = {
  n: number;
  prompt: string;
  /** the customer in this chat — a real face, not a placeholder letter */
  customer: { name: string; avatar: string };
  thread: Msg[];
  options: string[];
  answer: number;
};

const QUESTIONS: Q[] = [
  {
    n: 7,
    prompt: "Which word completes the customer's message?",
    customer: { name: "Daniel", avatar: "/daniel.jpg" },
    thread: [
      {
        agent: true,
        text: "Hi, you're chatting with support. What can I help you with today?",
      },
      {
        agent: false,
        before: "Hey! I ordered the blue hoodie last Tuesday but it still ",
        after: " shipped. Can you check what's going on?",
      },
    ],
    options: ["doesn't", "hasn't", "wasn't", "isn't"],
    answer: 1,
  },
  {
    n: 8,
    prompt: "Which word completes your reply?",
    customer: { name: "Aisha", avatar: "/aisha.jpg" },
    thread: [
      {
        agent: false,
        text: "Any update on my order?? It's been almost two weeks now.",
      },
      {
        agent: true,
        before: "So sorry about the wait! I'll have an update for you ",
        after: " the hour, hang tight.",
      },
    ],
    options: ["on", "at", "for", "within"],
    answer: 3,
  },
  {
    n: 9,
    prompt: "Which word completes the customer's message?",
    customer: { name: "Tomás", avatar: "/tomas.jpg" },
    thread: [
      {
        agent: true,
        text: "All sorted! It shipped this morning, so you'll have it by Friday.",
      },
      {
        agent: false,
        before: "Oh amazing, thank you! You've been really ",
        after: ". I appreciate it.",
      },
    ],
    options: ["helping", "helps", "helpful", "helped"],
    answer: 2,
  },
];

/* the blank in the sentence — an underline gap the chosen word fills */
function Blank({ word }: { word: string | null }) {
  if (word === null) {
    return (
      <span className="mx-1.5 inline-block h-[3px] w-11 -translate-y-1 rounded-full bg-zinc-300 align-baseline" />
    );
  }
  return (
    <motion.span
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="mx-0.5 rounded-md bg-ofm-100 px-1.5 font-semibold text-ofm-700"
    >
      {word}
    </motion.span>
  );
}

function Bubble({
  m,
  word,
  customer,
}: {
  m: Msg;
  word: string | null;
  customer: { name: string; avatar: string };
}) {
  const body =
    m.before !== undefined ? (
      <>
        {m.before}
        <Blank word={word} />
        {m.after}
      </>
    ) : (
      m.text
    );
  const src = m.agent ? "/maria.jpg" : customer.avatar;
  const alt = m.agent ? "Maria Reyes" : customer.name;
  return (
    <div className={`flex items-end gap-3 ${m.agent ? "flex-row-reverse" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="size-10 shrink-0 rounded-full object-cover ring-1 ring-black/5"
      />
      <div className={`flex flex-col gap-1 ${m.agent ? "items-end" : "items-start"}`}>
        <span className="px-1 text-ofm-caption font-medium text-zinc-400">
          {m.agent ? "You" : customer.name}
        </span>
        <div
          className={`max-w-[560px] px-5 py-4 text-[18px] leading-relaxed ${
            m.agent
              ? "rounded-2xl rounded-br-md bg-ofm-50 text-zinc-800"
              : "rounded-2xl rounded-bl-md bg-zinc-100 text-zinc-800"
          }`}
        >
          {body}
        </div>
      </div>
    </div>
  );
}

/* estimated time, top-right — this test stands on its own, no battery */
function TimeChip() {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-zinc-200/70 bg-white px-3 py-1.5 text-ofm-caption font-medium text-zinc-500">
      <Clock className="size-3.5 text-zinc-400" strokeWidth={2} />
      3 min
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

export default function EnglishTest() {
  const reduceMotion = useReducedMotion();
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [pressNext, setPressNext] = useState(false);
  const [ripple, setRipple] = useState({ x: 0, y: 0, n: 0 });

  /* autoplay cursor plumbing */
  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLElement | null)[]>([]);
  const nextRef = useRef<HTMLDivElement>(null);
  const cursor = useAnimationControls();

  useEffect(() => {
    if (reduceMotion) {
      setQi(QUESTIONS.length - 1);
      setPicked(QUESTIONS[QUESTIONS.length - 1].answer);
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const sleep = (ms: number) =>
      new Promise<void>((res) => timers.push(setTimeout(res, ms)));

    /* centre of an element in the container's own (unscaled) coordinate space */
    const centerOf = (el: HTMLElement | null) => {
      const root = rootRef.current;
      if (!root || !el) return { x: 460, y: 320 };
      const r = root.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      const scale = r.width / 920 || 1;
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
      await sleep(750);
      for (let i = 0; i < QUESTIONS.length && !cancelled; i++) {
        // land on the correct option, click it
        const opt = centerOf(optionRefs.current[QUESTIONS[i].answer]);
        await clickAt(opt.x, opt.y);
        if (cancelled) return;
        setPicked(QUESTIONS[i].answer);
        await sleep(780);
        if (cancelled) return;

        if (i < QUESTIONS.length - 1) {
          // move to Next, click, advance
          const nxt = centerOf(nextRef.current);
          await clickAt(nxt.x, nxt.y);
          if (cancelled) return;
          setPressNext(true);
          await sleep(160);
          setPressNext(false);
          setQi(i + 1);
          setPicked(null);
          await sleep(900); // let the new card mount + settle before measuring
        }
      }
      if (cancelled) return;
      // bow out
      await cursor.start({ opacity: 0, transition: { duration: 0.5, ease: EASE } });
    }

    play();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [reduceMotion, cursor]);

  const q = QUESTIONS[qi];
  const word = picked === null ? null : q.options[picked];
  const blankMsg = q.thread.findIndex((m) => m.before !== undefined);
  const answered = picked !== null;

  return (
    <TestChrome test="English" topRight={<TimeChip />}>
      <div ref={rootRef} className="relative flex w-[920px] flex-col">
        {/* progress header — the single, in-test progress (Duolingo/Speak) */}
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-ofm-label font-semibold uppercase tracking-[0.08em] text-zinc-400">
            Reading &amp; grammar
          </span>
          <span className="text-ofm-label tabular-nums text-zinc-400">
            Question{" "}
            <span className="font-semibold text-zinc-600">{q.n}</span> of {TOTAL}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
          <motion.div
            className="h-full rounded-full bg-ofm-500"
            initial={false}
            animate={{ width: `${(q.n / TOTAL) * 100}%` }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </div>

        {/* question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={qi}
            initial={reduceMotion ? false : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="mt-5 rounded-2xl border border-zinc-200/60 bg-white p-10 shadow-[0_2px_4px_rgba(24,24,27,0.03),0_18px_44px_-24px_rgba(24,24,27,0.20)]"
          >
            {/* the chat exchange the question hangs off */}
            <div className="flex flex-col gap-4">
              {q.thread.map((m, i) => (
                <Bubble
                  key={i}
                  m={m}
                  word={i === blankMsg ? word : null}
                  customer={q.customer}
                />
              ))}
            </div>

            <p className="mt-8 text-ofm-title font-semibold text-zinc-900">
              {q.prompt}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {q.options.map((opt, i) => {
                const isPicked = picked === i;
                return (
                  <div
                    key={opt}
                    ref={(el) => {
                      optionRefs.current[i] = el;
                    }}
                    className={`relative flex items-center justify-center rounded-xl border px-12 py-4 transition-all duration-300 ${
                      isPicked
                        ? "border-ofm-500 bg-ofm-50 shadow-[0_0_0_1px_rgba(0,110,66,0.22)]"
                        : "border-zinc-200/70 bg-white hover:border-zinc-300"
                    }`}
                  >
                    <span
                      className={`absolute left-4 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-ofm-label font-semibold transition-colors duration-300 ${
                        isPicked
                          ? "bg-ofm-600 text-white"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span
                      className={`text-[16px] ${
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

            {/* navigation — Back revisits, Skip moves on, Next needs an answer */}
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
        </AnimatePresence>

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
              initial={{ opacity: 0, x: 470, y: 560 }}
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
