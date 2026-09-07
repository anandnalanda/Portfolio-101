"use client";

/* f12 — "Application unlocked." The same job Maria opened in f3, now after the
   tests: the two skills she just proved (Verbal, Internet speed) flip to
   verified, the gate reads 4 of 4, the lock falls away, and Apply turns live —
   one tap files an application that's already proven.

   Mirrors GatedJob (f3): candidate shell, the full posting, the gate in the
   right rail. Only the rail's state changes. OFM (Kibo) candidate system. */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpenText,
  Mic,
  Gauge,
  Keyboard,
  Check,
  Lock,
  Bookmark,
  ChevronRight,
  Loader2,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CandidateShell from "./CandidateShell";

const EASE = [0.22, 1, 0.36, 1] as const;

const Crumbs = (
  <div className="flex min-w-0 items-center gap-1.5">
    <button className="shrink-0 text-ofm-body font-normal text-zinc-400 hover:text-zinc-600">
      Find work
    </button>
    <ChevronRight className="size-4 shrink-0 text-zinc-300" strokeWidth={2} />
    <span className="truncate text-ofm-display font-semibold text-zinc-900">
      Virtual Chatter
    </span>
  </div>
);

const DO = [
  "Run live fan conversations across your shift, always in the creator's voice.",
  "Calm refund and delivery threads without over-promising a timeline.",
  "Keep several chats moving at once without dropping a single one.",
];

const LOOK = [
  "Excellent written English and fast, accurate typing.",
  "A clear, steady spoken manner for the occasional voice reply.",
  "A stable connection and reliable availability across shifts.",
];

type Req = {
  icon: typeof Mic;
  label: string;
  bar: string;
  score: string;
  /** already verified before this beat; the other two flip during it */
  preheld?: boolean;
};
const REQS: Req[] = [
  { icon: BookOpenText, label: "English", bar: "≥ 80", score: "92 · verified", preheld: true },
  { icon: Keyboard, label: "Typing", bar: "≥ 60 WPM", score: "68 WPM · verified", preheld: true },
  { icon: Mic, label: "Verbal", bar: "≥ 75", score: "88 · verified" },
  { icon: Gauge, label: "Internet speed", bar: "≥ 25 Mbps", score: "87 Mbps · verified" },
];

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-7">
      <h3 className="text-ofm-title font-semibold text-zinc-900">{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {items.map((t) => (
          <li
            key={t}
            className="flex gap-2.5 text-ofm-body leading-relaxed text-zinc-600"
          >
            <Check className="mt-1 size-4 shrink-0 text-ofm-500" strokeWidth={2.4} />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ApplicationUnlocked() {
  const reduced = useReducedMotion();
  const pending = REQS.filter((r) => !r.preheld);
  const [flipped, setFlipped] = useState(0); // how many pending skills verified
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (reduced) {
      setFlipped(pending.length);
      setApplied(true);
      return;
    }
    const t = [
      setTimeout(() => setFlipped(1), 1000),
      setTimeout(() => setFlipped(2), 1900),
      setTimeout(() => setApplied(true), 3200),
    ];
    return () => t.forEach(clearTimeout);
  }, [reduced, pending.length]);

  let pIdx = -1;
  const isMet = (r: Req) => {
    if (r.preheld) return true;
    pIdx += 1;
    return pIdx < flipped;
  };
  const allMet = flipped >= pending.length;
  const metCount = REQS.filter((r) => r.preheld).length + flipped;

  return (
    <CandidateShell activeTab="Find work" headerLeft={Crumbs}>
      <div className="h-full overflow-y-auto [scrollbar-width:thin]">
        <div className="mx-auto flex max-w-[1040px] gap-10 px-5 py-4">
          {/* ── the posting ── */}
          <article className="min-w-0 flex-1">
            <div className="mt-4 flex items-center gap-2.5">
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-lg shadow-sm ring-1 ring-black/5"
                style={{
                  backgroundImage:
                    "radial-gradient(at 18% 18%, #818cf8 0px, transparent 55%), radial-gradient(at 82% 12%, #f0abfc 0px, transparent 50%), radial-gradient(at 85% 88%, #22d3ee 0px, transparent 55%), radial-gradient(at 15% 90%, #fb7185 0px, transparent 55%)",
                  backgroundColor: "#7c3aed",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="2.4" />
                  <circle cx="12" cy="12" r="2.6" fill="#fff" />
                </svg>
              </span>
              <span className="text-ofm-label font-medium text-zinc-500">
                Acme Studio
              </span>
            </div>

            <h1 className="mt-4 text-ofm-hero font-semibold text-zinc-900">
              Virtual Chatter
            </h1>

            <div className="mt-5 flex overflow-hidden rounded-xl border border-zinc-200/70">
              {[
                ["Location", "Remote · Worldwide"],
                ["Type", "Full-time"],
                ["Posted", "2 weeks ago"],
                ["Pay", "$4–6 / hr + bonus"],
              ].map(([k, v], i) => (
                <div
                  key={k}
                  className={`flex-1 px-4 py-3 ${
                    i > 0 ? "border-l border-zinc-200/70" : ""
                  }`}
                >
                  <p className="text-ofm-micro font-medium uppercase tracking-[0.06em] text-zinc-400">
                    {k}
                  </p>
                  <p className="mt-1 whitespace-nowrap text-ofm-label font-semibold text-zinc-900">
                    {v}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-7 border-t border-zinc-200/70" />

            <div className="mt-7">
              <h3 className="text-ofm-title font-semibold text-zinc-900">
                About the role
              </h3>
              <p className="mt-3 text-ofm-body leading-relaxed text-zinc-600">
                Acme Studio is hiring chat operators to run live fan
                conversations for the creators we manage. You&apos;ll keep each
                creator&apos;s voice, calm the tense threads, and juggle several
                chats at once, all in fast, clean English. A high-ownership seat
                on a small chat team that cares about quality.
              </p>
            </div>

            <Section title="What you'll do" items={DO} />
            <Section title="What we're looking for" items={LOOK} />

            <div className="mt-7 flex flex-wrap gap-2">
              {["Written English", "Chat support", "De-escalation", "Typing", "Night shifts"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-md bg-zinc-100 px-2 py-1 text-ofm-label font-medium text-zinc-600"
                  >
                    {t}
                  </span>
                ),
              )}
            </div>

            <div className="mt-7 rounded-xl border border-zinc-200/70 bg-zinc-50/60 p-4">
              <p className="text-ofm-label font-semibold text-zinc-900">
                About Acme Studio
              </p>
              <p className="mt-1.5 text-ofm-label leading-relaxed text-zinc-600">
                Acme Studio is a creator management agency running chat, content,
                and marketing for the creators it represents. Small remote team,
                high standards, and a chat operation that never sleeps.
              </p>
            </div>
          </article>

          {/* ── the gate, now cleared (right rail) ── */}
          <aside className="w-[320px] shrink-0">
            <div className="sticky top-4 mt-4 overflow-hidden rounded-xl border border-zinc-200/70 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-200/70 bg-zinc-50/60 px-4 py-3">
                <span className="flex items-center gap-1.5 text-ofm-label font-semibold text-zinc-800">
                  <BadgeCheck className="size-4 text-ofm-600" strokeWidth={2} />
                  Verified skills required
                </span>
                <span
                  className={`text-ofm-caption font-medium tabular-nums transition-colors duration-300 ${
                    allMet ? "text-ofm-700" : "text-zinc-500"
                  }`}
                >
                  {metCount} of {REQS.length} met
                </span>
              </div>

              <div>
                {REQS.map((r, i) => {
                  const met = isMet(r);
                  return (
                    <motion.div
                      key={r.label}
                      initial={false}
                      animate={met && !r.preheld ? { scale: reduced ? 1 : [1, 1.02, 1] } : {}}
                      transition={{ duration: 0.35, ease: EASE }}
                      className={`flex items-center gap-3 px-4 py-3 transition-colors duration-300 ${
                        i > 0 ? "border-t border-zinc-100" : ""
                      } ${met ? "bg-ofm-50/40" : ""}`}
                    >
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 ${
                          met ? "bg-ofm-100" : "bg-zinc-100"
                        }`}
                      >
                        <r.icon
                          className={`size-5 ${met ? "text-ofm-700" : "text-zinc-400"}`}
                          strokeWidth={1.75}
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-ofm-label font-medium leading-tight text-zinc-800">
                          {r.label}
                        </span>
                        <span
                          className={`mt-0.5 block truncate text-ofm-caption leading-tight transition-colors duration-300 ${
                            met ? "text-ofm-700" : "text-zinc-400"
                          }`}
                        >
                          {met ? r.score : "Verifying…"}
                        </span>
                      </span>
                      {met ? (
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-ofm-600">
                          <Check className="size-3 text-white" strokeWidth={3} />
                        </span>
                      ) : (
                        <Loader2 className="size-4 shrink-0 animate-spin text-zinc-300" strokeWidth={2.5} />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 border-t border-zinc-200/70 p-4">
                <motion.div
                  className="flex-1"
                  initial={false}
                  animate={
                    allMet && !applied && !reduced ? { scale: [1, 1.03, 1] } : {}
                  }
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <Button disabled={!allMet} className="w-full">
                    {applied ? (
                      <>
                        <Check strokeWidth={2.5} />
                        Applied
                      </>
                    ) : allMet ? (
                      "Apply"
                    ) : (
                      <>
                        <Lock strokeWidth={2} />
                        Apply
                      </>
                    )}
                  </Button>
                </motion.div>
                <Button variant="outline">
                  <Bookmark strokeWidth={2} />
                  Save
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </CandidateShell>
  );
}
