"use client";

/* f12 — "Application unlocked." Back on the gated job, the proof does its
   work: the last required skills flip to verified, the lock falls away, Apply
   turns live, and one tap files an application that's already proven. OFM
   candidate system. */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpenText,
  Mic,
  Gauge,
  Keyboard,
  Check,
  Lock,
  LockOpen,
  MapPin,
  Clock,
  BadgeCheck,
} from "lucide-react";
import CandidateShell from "./CandidateShell";

const EASE = [0.22, 1, 0.36, 1] as const;

type Req = {
  icon: typeof Mic;
  label: string;
  bar: string;
  score: string;
  /** already held before this beat; the rest flip during it */
  preheld?: boolean;
};

const REQS: Req[] = [
  { icon: BookOpenText, label: "English", bar: "≥ 80", score: "92 · verified", preheld: true },
  { icon: Keyboard, label: "Typing", bar: "≥ 60 WPM", score: "68 WPM · verified", preheld: true },
  { icon: Mic, label: "Verbal", bar: "≥ 75", score: "88 · verified" },
  { icon: Gauge, label: "Internet speed", bar: "≥ 25 Mbps", score: "87 Mbps · verified" },
];

export default function ApplicationUnlocked() {
  const reduced = useReducedMotion();
  /* how many of the not-preheld reqs have flipped to verified */
  const [flipped, setFlipped] = useState(0);
  const [applied, setApplied] = useState(false);

  const pending = REQS.filter((r) => !r.preheld);

  useEffect(() => {
    if (reduced) {
      setFlipped(pending.length);
      setApplied(true);
      return;
    }
    const t: ReturnType<typeof setTimeout>[] = [];
    pending.forEach((_, i) => t.push(setTimeout(() => setFlipped(i + 1), 800 + i * 700)));
    t.push(setTimeout(() => setApplied(true), 800 + pending.length * 700 + 700));
    return () => t.forEach(clearTimeout);
  }, [reduced, pending.length]);

  let pIdx = -1;
  const isVerified = (r: Req) => {
    if (r.preheld) return true;
    pIdx += 1;
    return pIdx < flipped;
  };
  const unlocked = flipped >= pending.length;
  const metCount = REQS.filter((r) => r.preheld).length + flipped;

  return (
    <CandidateShell activeTab="Find work">
      <div className="flex h-full items-start justify-center overflow-hidden px-5 py-5">
        <div className="w-[640px]">
          <div className="overflow-hidden rounded-xl border border-zinc-200/70 bg-white shadow-sm">
            {/* job header */}
            <div className="px-7 pb-5 pt-6">
              <div className="flex items-center gap-3.5">
                <span
                  className="flex size-12 shrink-0 items-center justify-center rounded-xl shadow-sm ring-1 ring-black/5"
                  style={{
                    backgroundImage:
                      "radial-gradient(at 20% 20%, #818cf8 0, transparent 55%), radial-gradient(at 85% 15%, #f0abfc 0, transparent 50%), radial-gradient(at 85% 90%, #22d3ee 0, transparent 55%)",
                    backgroundColor: "#7c3aed",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="2.4" />
                    <circle cx="12" cy="12" r="2.6" fill="#fff" />
                  </svg>
                </span>
                <div>
                  <h1 className="text-ofm-hero font-semibold text-zinc-900">
                    Virtual Chatter
                  </h1>
                  <p className="mt-0.5 text-ofm-body text-zinc-500">Acme Studio</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-ofm-label text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-zinc-400" strokeWidth={1.75} />
                  Remote
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4 text-zinc-400" strokeWidth={1.75} />
                  Full-time
                </span>
                <span className="font-medium text-zinc-700">$4–6 / hr</span>
              </div>
            </div>

            {/* required verified skills — flipping to met */}
            <div className="border-t border-zinc-200/70 bg-zinc-50/60 px-7 py-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-ofm-label font-semibold text-zinc-800">
                  <BadgeCheck className="size-4 text-ofm-600" strokeWidth={2} />
                  Verified skills required
                </span>
                <span className="text-ofm-caption font-medium tabular-nums text-zinc-500">
                  {metCount} of {REQS.length} met
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {REQS.map((r) => {
                  const met = isVerified(r);
                  return (
                    <motion.div
                      key={r.label}
                      initial={false}
                      animate={met ? { scale: reduced ? 1 : [1, 1.03, 1] } : {}}
                      transition={{ duration: 0.35, ease: EASE }}
                      className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 transition-colors duration-300 ${
                        met ? "border-ofm-200 bg-ofm-50" : "border-zinc-200/70 bg-white"
                      }`}
                    >
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 ${
                          met ? "bg-ofm-100" : "bg-zinc-100"
                        }`}
                      >
                        <r.icon
                          className={`size-4 ${met ? "text-ofm-700" : "text-zinc-400"}`}
                          strokeWidth={1.75}
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-ofm-label font-medium leading-tight text-zinc-800">
                          {r.label}{" "}
                          <span className="font-normal text-zinc-400">{r.bar}</span>
                        </span>
                        <span
                          className={`block truncate text-ofm-caption leading-tight transition-colors duration-300 ${
                            met ? "text-ofm-700" : "text-zinc-400"
                          }`}
                        >
                          {met ? r.score : "Not proven yet"}
                        </span>
                      </span>
                      <span
                        className={`flex size-5 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                          met ? "bg-ofm-600" : "bg-zinc-200"
                        }`}
                      >
                        {met ? (
                          <Check className="size-3 text-white" strokeWidth={3} />
                        ) : (
                          <Lock className="size-3 text-zinc-500" strokeWidth={2.5} />
                        )}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* the gate — opens */}
            <div className="flex items-center justify-between gap-4 px-7 py-5">
              <AnimatePresence mode="wait">
                {unlocked ? (
                  <motion.span
                    key="open"
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-ofm-label font-medium text-ofm-700"
                  >
                    <LockOpen className="size-4" strokeWidth={2} />
                    Bar cleared — every skill verified.
                  </motion.span>
                ) : (
                  <motion.span
                    key="shut"
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-ofm-label text-zinc-500"
                  >
                    <Lock className="size-4 text-zinc-400" strokeWidth={2} />
                    Verifying your skills…
                  </motion.span>
                )}
              </AnimatePresence>

              <motion.button
                initial={false}
                animate={{ scale: applied ? 1 : unlocked && !reduced ? [1, 1.04, 1] : 1 }}
                transition={{ duration: 0.4, ease: EASE }}
                className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-ofm-body font-medium transition-colors duration-300 ${
                  applied
                    ? "bg-ofm-50 text-ofm-700 ring-1 ring-ofm-200"
                    : unlocked
                    ? "bg-ofm-600 text-white"
                    : "bg-zinc-200 text-zinc-400"
                }`}
              >
                {applied ? (
                  <>
                    <Check className="size-4" strokeWidth={2.5} />
                    Applied
                  </>
                ) : unlocked ? (
                  "Apply"
                ) : (
                  <>
                    <Lock className="size-4" strokeWidth={2} />
                    Apply
                  </>
                )}
              </motion.button>
            </div>

            {/* proof attached */}
            <AnimatePresence>
              {applied && (
                <motion.div
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="overflow-hidden border-t border-zinc-200/70 bg-ofm-50/50"
                >
                  <p className="px-7 py-3 text-ofm-caption text-ofm-700">
                    Your four verified scores were attached automatically. You
                    applied already proven.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </CandidateShell>
  );
}
