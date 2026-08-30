"use client";

/* f3 — "The job, with a gate." The candidate's view of the listing. The
   required verified skills sit up top, honest and public; the ones the
   candidate already holds show a green tick, the ones they don't show a lock,
   and Apply stays locked until the whole bar is met. OFM candidate system. */

import {
  BookOpenText,
  Mic,
  Gauge,
  Keyboard,
  Check,
  Lock,
  MapPin,
  Clock,
  BadgeCheck,
} from "lucide-react";
import CandidateShell from "./CandidateShell";

type Req = {
  icon: typeof Mic;
  label: string;
  bar: string;
  held?: { score: string };
};

/* Two are already verified on the profile; two are still missing → gate shut. */
const REQS: Req[] = [
  { icon: BookOpenText, label: "English", bar: "≥ 80", held: { score: "92 · verified" } },
  { icon: Keyboard, label: "Typing", bar: "≥ 60 WPM", held: { score: "68 WPM · verified" } },
  { icon: Mic, label: "Verbal", bar: "≥ 75" },
  { icon: Gauge, label: "Internet speed", bar: "≥ 25 Mbps" },
];

export default function GatedJob() {
  const held = REQS.filter((r) => r.held).length;

  return (
    <CandidateShell activeTab="Find work">
      <div className="flex h-full items-start justify-center overflow-hidden px-5 py-5">
        <div className="w-[640px]">
          <div className="overflow-hidden rounded-xl border border-zinc-200/70 bg-white shadow-sm">
            {/* job header */}
            <div className="px-7 pb-5 pt-6">
              <div className="flex items-start justify-between">
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
                    <p className="mt-0.5 text-ofm-body text-zinc-500">
                      Acme Studio
                    </p>
                  </div>
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

            {/* required verified skills */}
            <div className="border-t border-zinc-200/70 bg-zinc-50/60 px-7 py-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-ofm-label font-semibold text-zinc-800">
                  <BadgeCheck className="size-4 text-ofm-600" strokeWidth={2} />
                  Verified skills required
                </span>
                <span className="text-ofm-caption font-medium tabular-nums text-zinc-500">
                  {held} of {REQS.length} met
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {REQS.map((r) => (
                  <div
                    key={r.label}
                    className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 ${
                      r.held
                        ? "border-ofm-200 bg-ofm-50"
                        : "border-zinc-200/70 bg-white"
                    }`}
                  >
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                        r.held ? "bg-ofm-100" : "bg-zinc-100"
                      }`}
                    >
                      <r.icon
                        className={`size-4 ${r.held ? "text-ofm-700" : "text-zinc-400"}`}
                        strokeWidth={1.75}
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-ofm-label font-medium leading-tight text-zinc-800">
                        {r.label}{" "}
                        <span className="font-normal text-zinc-400">{r.bar}</span>
                      </span>
                      <span
                        className={`block truncate text-ofm-caption leading-tight ${
                          r.held ? "text-ofm-700" : "text-zinc-400"
                        }`}
                      >
                        {r.held ? r.held.score : "Not proven yet"}
                      </span>
                    </span>
                    <span
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
                        r.held ? "bg-ofm-600" : "bg-zinc-200"
                      }`}
                    >
                      {r.held ? (
                        <Check className="size-3 text-white" strokeWidth={3} />
                      ) : (
                        <Lock className="size-3 text-zinc-500" strokeWidth={2.5} />
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* the gate */}
            <div className="flex items-center justify-between gap-4 px-7 py-5">
              <span className="flex items-center gap-2 text-ofm-label text-zinc-500">
                <Lock className="size-4 text-zinc-400" strokeWidth={2} />
                Clear the remaining {REQS.length - held} to unlock Apply.
              </span>
              <button className="flex items-center gap-2 rounded-lg bg-zinc-200 px-5 py-2.5 text-ofm-body font-medium text-zinc-400">
                <Lock className="size-4" strokeWidth={2} />
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </CandidateShell>
  );
}
