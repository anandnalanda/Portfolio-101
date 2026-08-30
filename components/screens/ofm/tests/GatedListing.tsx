"use client";

/* d2 — "Proof to apply, not proof to shortlist." The candidate (Maria Reyes)
   viewing the Virtual Chatter listing on the OFM job board. The employer's
   required skills — set at post time — are the gate: Apply is locked until she
   clears them, and among everyone who does, the employer still decides.

   A two-column job-listing hero (content + a locked Apply card), modelled on
   real job boards — Wellfound's "improve your odds" eligibility note, Upwork's
   required-to-apply gate, Remote's content/sidebar split (Mobbin refs).
   CandidateShell chrome. Replaces the old funnel diagram. */

import { useEffect, useState } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import {
  BookOpenText,
  Keyboard,
  Mic,
  Gauge,
  Check,
  Lock,
  BadgeCheck,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import CandidateShell from "./CandidateShell";

const EASE = [0.22, 1, 0.36, 1] as const;

type Req = {
  icon: typeof Mic;
  label: string;
  bar: string;
  /** A verified score already on the candidate's profile clears this row. */
  held?: { score: string };
};

/* Two are already verified (from earlier tests); two are missing → gate shut.
   Kept consistent with the f3 gated-job screen (same job, same candidate). */
const REQS: Req[] = [
  { icon: BookOpenText, label: "English", bar: "≥ 80", held: { score: "92 · verified" } },
  { icon: Keyboard, label: "Typing", bar: "≥ 60 WPM", held: { score: "68 WPM · verified" } },
  { icon: Mic, label: "Verbal", bar: "≥ 75" },
  { icon: Gauge, label: "Internet speed", bar: "≥ 25 Mbps" },
];

const MET = REQS.filter((r) => r.held).length;
const REMAINING = REQS.length - MET;

/* The fake company mark used across the candidate-facing screens. */
function AcmeMark() {
  return (
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
  );
}

export default function GatedListing() {
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(reduced ? REQS.length : 0);
  const [blocked, setBlocked] = useState(0);
  const applyCtrl = useAnimationControls();

  /* Reveal the requirement rows, then knock on the locked door on a slow loop
     so a mid-dwell arrival still sees it refuse. */
  useEffect(() => {
    if (reduced) {
      setRevealed(REQS.length);
      return;
    }
    setRevealed(0);
    setBlocked(0);
    const timers = REQS.map((_, i) =>
      setTimeout(() => setRevealed((n) => Math.max(n, i + 1)), 350 + i * 180)
    );
    const firstKnock = 350 + REQS.length * 180 + 650;
    const t0 = setTimeout(() => setBlocked((n) => n + 1), firstKnock);
    const iv = setInterval(() => setBlocked((n) => n + 1), 4600);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(t0);
      clearInterval(iv);
    };
  }, [reduced]);

  /* The blocked "door refuses" nudge: a short shake on the locked Apply. */
  useEffect(() => {
    if (!blocked || reduced) return;
    applyCtrl.start({
      x: [0, -5, 5, -3, 3, 0],
      transition: { duration: 0.5, ease: EASE },
    });
  }, [blocked, reduced, applyCtrl]);

  return (
    <CandidateShell activeTab="Find work">
      <div className="flex h-full items-center justify-center overflow-hidden px-6 py-5">
        <div className="flex w-full max-w-[1000px] items-start gap-5">
          {/* ── LEFT: the listing ── */}
          <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-zinc-200/70 bg-white shadow-sm">
            {/* header */}
            <div className="px-6 pb-5 pt-6">
              <div className="flex items-center gap-3.5">
                <AcmeMark />
                <div className="min-w-0">
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
              <p className="mt-4 max-w-[52ch] text-ofm-body leading-relaxed text-zinc-600">
                Handle live customer chats for a growing DTC brand — up to three
                conversations at once, in clear, friendly English. Fully remote,
                flexible hours.
              </p>
            </div>

            {/* required verified skills — the gate, in the open */}
            <div className="border-t border-zinc-200/70 bg-zinc-50/50 px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-ofm-label font-semibold text-zinc-800">
                  <BadgeCheck className="size-4 text-ofm-600" strokeWidth={2} />
                  Verified skills required to apply
                </span>
                <span className="text-ofm-caption font-medium tabular-nums text-zinc-500">
                  {MET} of {REQS.length} met
                </span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-ofm-micro text-zinc-400">
                <ShieldCheck className="size-3.5" strokeWidth={2} />
                Set by Acme when this job was posted
              </p>

              <div className="mt-3.5 space-y-2">
                {REQS.map((r, i) => {
                  const held = !!r.held;
                  return (
                    <motion.div
                      key={r.label}
                      initial={false}
                      animate={{
                        opacity: revealed > i ? 1 : 0,
                        y: revealed > i ? 0 : 8,
                      }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className={`flex items-center gap-3 rounded-lg border px-3.5 py-2.5 ${
                        held ? "border-ofm-200 bg-ofm-50" : "border-zinc-200/70 bg-white"
                      }`}
                    >
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                          held ? "bg-ofm-100" : "bg-zinc-100"
                        }`}
                      >
                        <r.icon
                          className={`size-[18px] ${held ? "text-ofm-700" : "text-zinc-400"}`}
                          strokeWidth={1.75}
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-ofm-label font-semibold leading-tight text-zinc-800">
                          {r.label}{" "}
                          <span className="font-normal text-zinc-400">{r.bar}</span>
                        </span>
                        <span
                          className={`block truncate text-ofm-caption leading-tight ${
                            held ? "text-ofm-700" : "text-zinc-400"
                          }`}
                        >
                          {held ? r.held!.score : "Not proven yet"}
                        </span>
                      </span>
                      {held ? (
                        <span className="flex items-center gap-1.5 rounded-full bg-ofm-600 px-2.5 py-1 text-ofm-micro font-semibold text-white">
                          <Check className="size-3.5" strokeWidth={3} />
                          Cleared
                        </span>
                      ) : (
                        <button className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-ofm-micro font-semibold text-zinc-600 shadow-sm transition-colors hover:bg-zinc-50">
                          Take test
                          <ArrowRight className="size-3.5" strokeWidth={2.25} />
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT: the locked Apply card ── */}
          <aside className="w-[300px] shrink-0 overflow-hidden rounded-xl border border-zinc-200/70 bg-white shadow-sm">
            <div className="px-5 pb-5 pt-5">
              <h2 className="text-ofm-title font-semibold text-zinc-900">
                Apply to Acme
              </h2>
              <p className="mt-0.5 text-ofm-caption text-zinc-500">
                Proof clears before you apply — not after a shortlist.
              </p>

              {/* progress toward the bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-ofm-caption">
                  <span className="font-medium text-zinc-600">Requirements met</span>
                  <span className="font-semibold tabular-nums text-zinc-800">
                    {MET} / {REQS.length}
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                  <motion.div
                    className="h-full rounded-full bg-ofm-500"
                    initial={false}
                    animate={{ width: `${(MET / REQS.length) * 100}%` }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
                  />
                </div>
              </div>

              {/* the gate note — you're short of the bar */}
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
                <TriangleAlert className="mt-px size-4 shrink-0 text-amber-500" strokeWidth={2} />
                <span className="text-ofm-caption leading-snug text-amber-700">
                  You&apos;re {REMAINING} tests short of the bar. Clear them to
                  unlock Apply.
                </span>
              </div>

              {/* the locked door */}
              <motion.button
                animate={applyCtrl}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-200 py-2.5 text-ofm-body font-semibold text-zinc-400"
              >
                <Lock className="size-4" strokeWidth={2.25} />
                Clear {REMAINING} more to apply
              </motion.button>
              <button className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-ofm-600 py-2.5 text-ofm-body font-semibold text-ofm-700 transition-colors hover:bg-ofm-50">
                Take the {REMAINING} tests
                <ArrowRight className="size-4" strokeWidth={2.25} />
              </button>
            </div>

            {/* the human still decides */}
            <div className="flex items-start gap-2 border-t border-zinc-100 bg-zinc-50/60 px-5 py-3.5">
              <BadgeCheck className="mt-px size-4 shrink-0 text-ofm-600" strokeWidth={2} />
              <span className="text-ofm-caption leading-snug text-zinc-500">
                Clear the bar to apply. Among everyone who does,{" "}
                <span className="font-medium text-zinc-700">Acme decides</span> who
                to hire.
              </span>
            </div>
          </aside>
        </div>
      </div>
    </CandidateShell>
  );
}
