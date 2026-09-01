"use client";

/* f3 — "English." Reading and grammar framed as the messages the job actually
   sends: a chat snippet with a blank, four options, a "3 of 10" marker. An
   invisible candidate answers, and the next question slides in. OFM system. */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import TestChrome from "./TestChrome";

const EASE = [0.22, 1, 0.36, 1] as const;

const QUESTIONS = [
  {
    n: 3,
    snippet:
      "Hey! I ordered the blue hoodie last Tuesday but it still ___ shipped. Can you check what's going on?",
    prompt: "Which word completes the customer's message?",
    options: ["hasn't", "doesn't", "wasn't", "isn't"],
    answer: 0,
  },
  {
    n: 4,
    snippet:
      "No worries at all, thanks for sorting that out so quickly, you've been really helpful!",
    prompt: "What is the customer's tone?",
    options: ["Frustrated", "Satisfied", "Confused", "Impatient"],
    answer: 1,
  },
];

export default function EnglishTest() {
  const reduceMotion = useReducedMotion();
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    if (reduceMotion) {
      setQi(1);
      setPicked(QUESTIONS[1].answer);
      return;
    }
    const t = [
      // answer question 1, slide, answer question 2, hold
      setTimeout(() => setPicked(QUESTIONS[0].answer), 1800),
      setTimeout(() => {
        setQi(1);
        setPicked(null);
      }, 2800),
      setTimeout(() => setPicked(QUESTIONS[1].answer), 4800),
    ];
    return () => t.forEach(clearTimeout);
  }, [reduceMotion]);

  const q = QUESTIONS[qi];

  return (
    <TestChrome step={1}>
      <div className="w-[620px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={qi}
            initial={reduceMotion ? false : { opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="rounded-xl border border-zinc-200/70 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between px-8 pt-6">
              <span className="text-ofm-caption font-medium uppercase tracking-[0.08em] text-zinc-400">
                Reading &amp; grammar
              </span>
              <span className="text-ofm-caption tabular-nums text-zinc-400">
                {q.n} of 10
              </span>
            </div>

            {/* the chat snippet the question hangs off */}
            <div className="px-8 pt-4">
              <div className="flex items-end gap-2.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-ofm-micro font-semibold text-zinc-500">
                  C
                </span>
                <div className="rounded-2xl rounded-bl-md bg-zinc-100 px-4 py-2.5 text-ofm-body leading-relaxed text-zinc-700">
                  {q.snippet}
                </div>
              </div>
            </div>

            <p className="px-8 pt-5 text-ofm-body font-medium text-zinc-800">
              {q.prompt}
            </p>

            <div className="flex flex-col gap-2 px-8 pb-8 pt-3">
              {q.options.map((opt, i) => {
                const isPicked = picked === i;
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
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2, ease: EASE }}
                          className="size-2 rounded-full bg-white"
                        />
                      )}
                    </span>
                    <span
                      className={`text-ofm-body ${
                        isPicked ? "font-medium text-zinc-900" : "text-zinc-600"
                      }`}
                    >
                      {opt}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
        <p className="mt-3 text-center text-ofm-caption text-zinc-400">
          Answers advance on their own · scored against the key the moment it
          ends
        </p>
      </div>
    </TestChrome>
  );
}
