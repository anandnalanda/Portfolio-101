"use client";

/* d3 — "Grade it the moment it's done." The employer's candidate pool for a
   role: everyone's tests are already graded, no queue. A list of applicants
   (each with an overall score) on the left; the selected candidate's full
   detail on the right — experience, plus the scorecard organised by how each
   test was graded (measured · auto-scored against a key · AI-scored with its
   reasoning shown). Two-pane ATS layout (Employment Hero / Workable, Mobbin
   refs), in the OFM Kibo system. DashboardShell (employer) chrome. */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronRight,
  Search,
  BadgeCheck,
  MapPin,
  Briefcase,
  Ruler,
  KeyRound,
  Sparkles,
  BookOpenText,
  Mic,
  Headphones,
  Gauge,
  Keyboard,
} from "lucide-react";
import DashboardShell from "@/components/screens/ofm/DashboardShell";
import { ScrollArea } from "@/components/ui/scroll-area";

/* ── the pool ──────────────────────────────────────────────── */
type Candidate = {
  name: string;
  initials: string;
  photo?: string;
  role: string; // experience one-liner
  years: string;
  score: number; // overall, avg of the battery
};

const POOL: Candidate[] = [
  { name: "Maria Reyes", initials: "MR", photo: "/maria.jpg", role: "Chat support", years: "3 yrs", score: 91 },
  { name: "Aisha Khan", initials: "AK", role: "Email support", years: "3 yrs", score: 90 },
  { name: "Diego Salas", initials: "DS", role: "Customer support", years: "2 yrs", score: 88 },
  { name: "Priya Nair", initials: "PN", role: "Virtual assistant", years: "4 yrs", score: 85 },
  { name: "Tomas Vega", initials: "TV", role: "Chat support", years: "1 yr", score: 82 },
  { name: "Lucas Meyer", initials: "LM", role: "Sales chat", years: "2 yrs", score: 80 },
  { name: "Hana Sato", initials: "HS", role: "Community support", years: "2 yrs", score: 78 },
];

/* ── Maria's graded battery, by how each test was scored ───── */
const GROUPS = [
  {
    tag: "Measured",
    icon: Ruler,
    note: "Numbers, not opinions",
    rows: [
      { icon: Keyboard, label: "Typing", value: "68 WPM · 97%" },
      { icon: Gauge, label: "Internet speed", value: "87 Mbps" },
    ],
  },
  {
    tag: "Auto-scored against a key",
    icon: KeyRound,
    note: "Marked the instant it ended",
    rows: [
      { icon: BookOpenText, label: "English", value: "92 / 100" },
      { icon: Headphones, label: "Listening", value: "95 / 100" },
    ],
  },
];

const VERBAL_NOTE =
  "Clear, calm phrasing. De-escalated the refund scenario without over-promising a timeline.";

const EXPERIENCE = [
  { role: "Customer Support Rep", org: "BloomCommerce", when: "2022 – 2024" },
  { role: "Live Chat Agent", org: "Nimbus Support", when: "2021 – 2022" },
];

const Crumbs = (
  <div className="flex min-w-0 items-center gap-1.5">
    <span className="shrink-0 text-ofm-body text-zinc-400">Virtual Chatter</span>
    <ChevronRight className="size-4 shrink-0 text-zinc-300" strokeWidth={2} />
    <span className="truncate text-ofm-display font-semibold text-zinc-900">
      Applicants
    </span>
  </div>
);

/* an overall-score chip, tinted by band (on-system: ofm / zinc) */
function ScoreChip({ score }: { score: number }) {
  const strong = score >= 85;
  return (
    <span
      className={`flex flex-col items-center rounded-lg px-2 py-1 tabular-nums ${
        strong ? "bg-ofm-50 text-ofm-700" : "bg-zinc-100 text-zinc-500"
      }`}
    >
      <span className="text-ofm-label font-semibold leading-none">{score}</span>
      <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.08em] opacity-70">
        avg
      </span>
    </span>
  );
}

function GradeRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mic;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <span className="flex size-8 items-center justify-center rounded-lg bg-ofm-50">
        <Icon className="size-4 text-ofm-600" strokeWidth={1.75} />
      </span>
      <span className="flex-1 text-ofm-body font-medium text-zinc-800">{label}</span>
      <span className="text-ofm-body font-semibold tabular-nums text-zinc-900">
        {value}
      </span>
    </div>
  );
}

export default function CandidatePool() {
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState(reduced ? VERBAL_NOTE.length : 0);

  useEffect(() => {
    if (reduced) return;
    setTyped(0);
    let i = 0;
    let iv: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      iv = setInterval(() => {
        i += 2;
        setTyped(i);
        if (i >= VERBAL_NOTE.length) clearInterval(iv);
      }, 22);
    }, 900);
    return () => {
      clearTimeout(start);
      if (iv) clearInterval(iv);
    };
  }, [reduced]);

  const selected = POOL[0];

  return (
    <DashboardShell activeNav="Candidates" headerLeft={Crumbs}>
      <div className="flex h-full">
        {/* ── LEFT: the pool ── */}
        <aside className="flex w-[300px] shrink-0 flex-col border-r border-zinc-200/70">
          <div className="shrink-0 border-b border-zinc-200/70 px-4 py-3">
            <div className="flex items-center justify-between">
              <h2 className="text-ofm-title font-semibold text-zinc-900">Applicants</h2>
              <span className="flex items-center gap-1 rounded-full bg-ofm-50 px-2 py-0.5 text-ofm-caption font-semibold text-ofm-700">
                <BadgeCheck className="size-3.5" strokeWidth={2} />
                38 verified
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-zinc-200/70 px-2.5 py-1.5 text-zinc-400">
              <Search className="size-3.5 shrink-0" strokeWidth={2} />
              <span className="text-ofm-label">Search · sorted by score</span>
            </div>
          </div>

          <ScrollArea type="scroll" className="min-h-0 flex-1">
            <div className="p-2">
              {POOL.map((c, i) => {
                const active = i === 0;
                return (
                  <button
                    key={c.name}
                    className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors ${
                      active ? "bg-ofm-50" : "hover:bg-zinc-50"
                    }`}
                  >
                    {c.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.photo}
                        alt={c.name}
                        className="size-9 shrink-0 rounded-full object-cover ring-1 ring-black/5"
                      />
                    ) : (
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-ofm-caption font-semibold text-zinc-500">
                        {c.initials}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-ofm-label font-semibold leading-tight ${
                          active ? "text-ofm-800" : "text-zinc-800"
                        }`}
                      >
                        {c.name}
                      </span>
                      <span className="block truncate text-ofm-caption leading-tight text-zinc-400">
                        {c.role} · {c.years}
                      </span>
                    </span>
                    <ScoreChip score={c.score} />
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </aside>

        {/* ── RIGHT: the selected candidate ── */}
        <div className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[680px] px-7 py-6">
            {/* identity */}
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selected.photo}
                alt={selected.name}
                className="size-14 rounded-full object-cover ring-1 ring-black/5"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-ofm-display font-semibold text-zinc-900">
                    {selected.name}
                  </h1>
                  <span className="flex items-center gap-1 rounded-full bg-ofm-50 px-2 py-0.5 text-ofm-caption font-semibold text-ofm-700">
                    <BadgeCheck className="size-3.5" strokeWidth={2} />
                    5 verified
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-ofm-label text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="size-4 text-zinc-400" strokeWidth={1.75} />
                    {selected.role} · {selected.years}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4 text-zinc-400" strokeWidth={1.75} />
                    Manila, PH
                  </span>
                </div>
              </div>
            </div>

            {/* test results — graded by method */}
            <div className="mt-6">
              <div className="flex items-baseline justify-between">
                <h3 className="text-ofm-title font-semibold text-zinc-900">
                  Verified test results
                </h3>
                <span className="text-ofm-caption text-zinc-400">
                  Graded the moment she finished, no queue
                </span>
              </div>

              <div className="mt-3 space-y-3">
                {GROUPS.map((g) => (
                  <div
                    key={g.tag}
                    className="overflow-hidden rounded-xl border border-zinc-200/70 bg-white"
                  >
                    <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50/60 px-4 py-2">
                      <g.icon className="size-4 text-zinc-400" strokeWidth={2} />
                      <span className="text-ofm-caption font-semibold uppercase tracking-[0.08em] text-zinc-500">
                        {g.tag}
                      </span>
                      <span className="ml-auto text-ofm-caption text-zinc-400">
                        {g.note}
                      </span>
                    </div>
                    {g.rows.map((r, i) => (
                      <div
                        key={r.label}
                        className={i > 0 ? "border-t border-zinc-100" : ""}
                      >
                        <GradeRow icon={r.icon} label={r.label} value={r.value} />
                      </div>
                    ))}
                  </div>
                ))}

                {/* AI-scored, with its reasoning typing out */}
                <div className="overflow-hidden rounded-xl border border-ofm-200 bg-white">
                  <div className="flex items-center gap-2 border-b border-ofm-100 bg-ofm-50/60 px-4 py-2">
                    <Sparkles className="size-4 text-ofm-600" strokeWidth={2} />
                    <span className="text-ofm-caption font-semibold uppercase tracking-[0.08em] text-ofm-700">
                      AI-scored, with reasons
                    </span>
                    <span className="ml-auto text-ofm-caption text-ofm-600">
                      Never a number from nowhere
                    </span>
                  </div>
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-ofm-50">
                        <Mic className="size-4 text-ofm-600" strokeWidth={1.75} />
                      </span>
                      <span className="flex-1 text-ofm-body font-medium text-zinc-800">
                        Verbal
                      </span>
                      <span className="text-ofm-body font-semibold tabular-nums text-zinc-900">
                        88 / 100
                      </span>
                    </div>
                    <p className="ml-11 mt-2 rounded-lg bg-zinc-50 px-3 py-2 text-ofm-caption leading-relaxed text-zinc-600">
                      <span className="font-medium text-zinc-700">Why:</span>{" "}
                      {VERBAL_NOTE.slice(0, typed)}
                      {typed < VERBAL_NOTE.length && (
                        <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-ofm-600" />
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* experience */}
            <div className="mt-6">
              <h3 className="text-ofm-title font-semibold text-zinc-900">Experience</h3>
              <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200/70 bg-white">
                {EXPERIENCE.map((e, i) => (
                  <div
                    key={e.role}
                    className={`flex items-center gap-3 px-4 py-3 ${
                      i > 0 ? "border-t border-zinc-100" : ""
                    }`}
                  >
                    <span className="flex size-8 items-center justify-center rounded-lg bg-zinc-100">
                      <Briefcase className="size-4 text-zinc-400" strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-ofm-label font-semibold leading-tight text-zinc-800">
                        {e.role}
                      </span>
                      <span className="block text-ofm-caption leading-tight text-zinc-400">
                        {e.org}
                      </span>
                    </span>
                    <span className="text-ofm-caption tabular-nums text-zinc-400">
                      {e.when}
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-2 border-t border-zinc-100 px-4 py-2.5">
                  <span className="text-ofm-caption font-medium uppercase tracking-[0.06em] text-zinc-400">
                    Languages
                  </span>
                  <span className="text-ofm-caption text-zinc-600">
                    English · Spanish
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
