"use client";

/* f4 — "Prove it once, on your own time." The candidate's profile: verified
   skill badges that live on the person, not on any one application, plus the
   ability to take a fresh test whenever. Mid-demo a new badge lands, showing
   proactive testing builds the profile. OFM candidate system. */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpenText,
  Mic,
  Headphones,
  Gauge,
  Keyboard,
  BadgeCheck,
  Plus,
  Check,
} from "lucide-react";
import CandidateShell from "./CandidateShell";

const EASE = [0.22, 1, 0.36, 1] as const;

type Badge = { icon: typeof Mic; label: string; score: string; when: string };

/* Held from earlier; Verbal lands mid-demo (taken proactively). */
const HELD: Badge[] = [
  { icon: BookOpenText, label: "English", score: "92 / 100", when: "verified 3 wks ago" },
  { icon: Keyboard, label: "Typing", score: "68 WPM · 97%", when: "verified 3 wks ago" },
  { icon: Gauge, label: "Internet speed", score: "87 Mbps", when: "verified today" },
];
const FRESH: Badge = { icon: Mic, label: "Verbal", score: "88 / 100", when: "verified just now" };

/* Not taken yet — the "take a test" prompt. */
const TODO = { icon: Headphones, label: "Listening" };

function BadgeCard({ b, fresh }: { b: Badge; fresh?: boolean }) {
  return (
    <div
      className={`relative flex items-center gap-3 rounded-xl border px-4 py-3 ${
        fresh ? "border-ofm-500 bg-ofm-50" : "border-zinc-200/70 bg-white"
      }`}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-ofm-50">
        <b.icon className="size-5 text-ofm-600" strokeWidth={1.75} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 text-ofm-body font-semibold leading-tight text-zinc-900">
          {b.label}
          <BadgeCheck className="size-4 text-ofm-600" strokeWidth={2} />
        </span>
        <span className="block text-ofm-caption leading-tight text-zinc-500">
          {b.score} · <span className="text-zinc-400">{b.when}</span>
        </span>
      </span>
      {fresh && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="flex size-6 items-center justify-center rounded-full bg-ofm-600"
        >
          <Check className="size-3.5 text-white" strokeWidth={3} />
        </motion.span>
      )}
    </div>
  );
}

export default function VerifiedProfile() {
  const reduced = useReducedMotion();
  const [earned, setEarned] = useState(false);

  useEffect(() => {
    if (reduced) {
      setEarned(true);
      return;
    }
    const t = setTimeout(() => setEarned(true), 1700);
    return () => clearTimeout(t);
  }, [reduced]);

  const count = HELD.length + (earned ? 1 : 0);

  return (
    <CandidateShell activeTab="Profile">
      <div className="flex h-full items-start justify-center overflow-hidden px-5 py-5">
        <div className="w-[620px]">
          {/* identity */}
          <div className="flex items-center gap-4 rounded-t-xl border border-zinc-200/70 bg-white px-6 py-5">
            <span className="flex size-14 items-center justify-center rounded-full bg-ofm-100 text-ofm-title font-semibold text-ofm-700">
              MR
            </span>
            <div className="flex-1">
              <h1 className="text-ofm-hero font-semibold text-zinc-900">
                Maria Reyes
              </h1>
              <p className="mt-0.5 text-ofm-body text-zinc-500">
                Chat support · English / Spanish
              </p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-ofm-50 px-3 py-1.5 text-ofm-label font-semibold text-ofm-700">
              <BadgeCheck className="size-4" strokeWidth={2} />
              <span className="tabular-nums">{count}</span> verified
            </span>
          </div>

          {/* verified skills */}
          <div className="border-x border-zinc-200/70 bg-white px-6 pb-5 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-ofm-body font-semibold text-zinc-900">
                Verified skills
              </h2>
              <span className="text-ofm-caption text-zinc-400">
                Reused on every job that needs them
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {HELD.map((b) => (
                <BadgeCard key={b.label} b={b} />
              ))}
              <AnimatePresence initial={false}>
                {earned && (
                  <motion.div
                    initial={reduced ? false : { opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <BadgeCard b={FRESH} fresh />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* take another, proactively */}
          <div className="rounded-b-xl border border-zinc-200/70 bg-zinc-50/60 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-white ring-1 ring-zinc-200/70">
                <TODO.icon className="size-[18px] text-zinc-400" strokeWidth={1.75} />
              </span>
              <span className="flex-1">
                <span className="block text-ofm-label font-medium leading-tight text-zinc-800">
                  Add {TODO.label} to your profile
                </span>
                <span className="block text-ofm-caption leading-tight text-zinc-400">
                  Take it now, on your own time, no invite needed.
                </span>
              </span>
              <button className="flex items-center gap-1.5 rounded-lg border border-ofm-300 bg-white px-3 py-2 text-ofm-label font-medium text-ofm-700 hover:bg-ofm-50">
                <Plus className="size-4" strokeWidth={2.2} />
                Take test
              </button>
            </div>
          </div>
        </div>
      </div>
    </CandidateShell>
  );
}
