"use client";

/* d1 — "Test the job, not trivia." The test library, browsed with a live
   preview: pick a test and see the actual question a candidate gets. The
   proof is in the content — a real customer chat message, not a quiz. The
   preview cycles English → Verbal so the variety shows. DashboardShell
   (Kanban chrome), Kibo inner. */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpenText,
  Mic,
  Headphones,
  Gauge,
  Keyboard,
  MessageSquare,
  ChevronRight,
  Plus,
} from "lucide-react";
import DashboardShell from "@/components/screens/ofm/DashboardShell";

const EASE = [0.22, 1, 0.36, 1] as const;

type Test = {
  icon: typeof Mic;
  label: string;
  verifies: string;
};

const TESTS: Test[] = [
  { icon: BookOpenText, label: "English", verifies: "Clean chat English" },
  { icon: Mic, label: "Verbal", verifies: "Holds a call" },
  { icon: Headphones, label: "Listening", verifies: "Catches what's said" },
  { icon: Gauge, label: "Internet speed", verifies: "Stays online" },
  { icon: Keyboard, label: "Typing", verifies: "Keeps up on chats" },
  { icon: MessageSquare, label: "Sales pitch", verifies: "Upsells with tone" },
];

/* Real preview content — the actual item a candidate sees. */
type Preview = {
  kind: string;
  who: string;
  message: string;
  prompt: string;
  options: string[];
  answer: number;
};

const PREVIEWS: Record<string, Preview> = {
  English: {
    kind: "Reading & grammar",
    who: "Customer",
    message:
      "Hey! I ordered the blue hoodie last Tuesday but it still ___ shipped. Can you check?",
    prompt: "Which word completes the customer's message?",
    options: ["hasn't", "doesn't", "wasn't", "isn't"],
    answer: 0,
  },
  Verbal: {
    kind: "Spoken answer",
    who: "Customer",
    message:
      "Two weeks and still no refund?? This is honestly ridiculous, I want my money back today.",
    prompt: "Say how you'd respond, out loud. AI scores fluency & clarity.",
    options: ["Record your answer"],
    answer: -1,
  },
};

/* the two the preview cycles through */
const CYCLE = ["English", "Verbal"];

export default function DecisionLibrary() {
  const reduced = useReducedMotion();
  const [sel, setSel] = useState(0); // index into CYCLE

  useEffect(() => {
    if (reduced) return;
    const iv = setInterval(() => setSel((s) => (s + 1) % CYCLE.length), 3600);
    return () => clearInterval(iv);
  }, [reduced]);

  const activeLabel = CYCLE[sel];
  const p = PREVIEWS[activeLabel];

  return (
    <div className="absolute inset-0">
      <DashboardShell
        headerLeft={
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="shrink-0 text-ofm-body text-zinc-400">Virtual Chatter</span>
            <ChevronRight className="size-4 shrink-0 text-zinc-300" strokeWidth={2} />
            <span className="truncate text-ofm-display font-semibold text-zinc-900">
              Test library
            </span>
          </div>
        }
      >
        <div className="flex h-full items-start justify-center overflow-hidden px-5 py-5">
          <div className="w-[900px]">
            <div className="pb-4">
              <h2 className="text-ofm-title font-semibold text-zinc-900">
                Test the job, not trivia
              </h2>
              <p className="mt-0.5 text-ofm-label text-zinc-500">
                Every test is a slice of the real shift. Preview any one and
                you&apos;ll see the actual question.
              </p>
            </div>

            <div className="flex gap-4">
              {/* left: the library list */}
              <div className="w-[276px] shrink-0 overflow-hidden rounded-xl border border-zinc-200/70 bg-white">
                <div className="border-b border-zinc-100 px-4 py-2.5">
                  <span className="text-ofm-caption font-semibold uppercase tracking-[0.08em] text-zinc-400">
                    Chat-work tests
                  </span>
                </div>
                {TESTS.map((t) => {
                  const active = t.label === activeLabel;
                  return (
                    <div
                      key={t.label}
                      className={`flex items-center gap-3 px-4 py-3 transition-colors duration-300 ${
                        active ? "bg-ofm-50" : ""
                      } ${t.label !== TESTS[0].label ? "border-t border-zinc-100" : ""}`}
                    >
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                          active ? "bg-ofm-100" : "bg-zinc-50"
                        }`}
                      >
                        <t.icon
                          className={`size-[18px] ${active ? "text-ofm-700" : "text-zinc-400"}`}
                          strokeWidth={1.75}
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-ofm-body font-medium leading-tight ${
                            active ? "text-zinc-900" : "text-zinc-700"
                          }`}
                        >
                          {t.label}
                        </span>
                        <span className="block truncate text-ofm-caption leading-tight text-zinc-400">
                          {t.verifies}
                        </span>
                      </span>
                      {active && (
                        <motion.span
                          layoutId="lib-caret"
                          className="size-1.5 rounded-full bg-ofm-600"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* right: live preview of the real question */}
              <div className="flex-1 overflow-hidden rounded-xl border border-zinc-200/70 bg-white">
                <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/60 px-5 py-2.5">
                  <span className="flex items-center gap-2 text-ofm-caption font-semibold uppercase tracking-[0.08em] text-zinc-500">
                    {activeLabel} · {p.kind}
                  </span>
                  <span className="rounded-full bg-ofm-50 px-2.5 py-0.5 text-ofm-micro font-semibold text-ofm-700">
                    A real chat scenario
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeLabel}
                    initial={reduced ? false : { opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="px-6 py-5"
                  >
                    {/* the customer message, as they'd really get it */}
                    <div className="flex items-end gap-2.5">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-ofm-micro font-semibold text-zinc-500">
                        C
                      </span>
                      <div className="rounded-2xl rounded-bl-md bg-zinc-100 px-4 py-2.5 text-ofm-body leading-relaxed text-zinc-700">
                        {p.message}
                      </div>
                    </div>

                    <p className="mt-4 text-ofm-body font-medium text-zinc-800">
                      {p.prompt}
                    </p>

                    {/* options / recorder */}
                    {p.answer >= 0 ? (
                      <div className="mt-3 flex flex-col gap-2">
                        {p.options.map((opt, i) => (
                          <div
                            key={opt}
                            className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 ${
                              i === p.answer
                                ? "border-ofm-500 bg-ofm-50"
                                : "border-zinc-200/70"
                            }`}
                          >
                            <span
                              className={`flex size-5 items-center justify-center rounded-full border ${
                                i === p.answer
                                  ? "border-ofm-600 bg-ofm-600"
                                  : "border-zinc-300"
                              }`}
                            >
                              {i === p.answer && (
                                <span className="size-2 rounded-full bg-white" />
                              )}
                            </span>
                            <span
                              className={`text-ofm-body ${
                                i === p.answer
                                  ? "font-medium text-zinc-900"
                                  : "text-zinc-600"
                              }`}
                            >
                              {opt}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-3 flex items-center gap-3 rounded-lg border border-zinc-200/70 px-4 py-3">
                        <span className="flex size-10 items-center justify-center rounded-full bg-ofm-600">
                          <Mic className="size-5 text-white" strokeWidth={2} />
                        </span>
                        <div className="flex h-8 flex-1 items-center gap-[3px]">
                          {Array.from({ length: 34 }).map((_, i) => (
                            <span
                              key={i}
                              className="w-[3px] rounded-full bg-zinc-200"
                              style={{ height: 4 + Math.abs(Math.sin(i * 1.7)) * 22 }}
                            />
                          ))}
                        </div>
                        <span className="text-ofm-caption text-zinc-400">0:00</span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* footer: what it proves + require */}
                <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/40 px-6 py-3.5">
                  <span className="text-ofm-caption text-zinc-500">
                    Exactly what the candidate sees on shift — no brain-teasers.
                  </span>
                  <button className="flex items-center gap-1.5 rounded-lg bg-ofm-600 px-3.5 py-2 text-ofm-label font-medium text-white hover:bg-ofm-700">
                    <Plus className="size-4" strokeWidth={2.2} />
                    Require this test
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardShell>
    </div>
  );
}
