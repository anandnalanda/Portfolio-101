"use client";

/* f3 — "The job, with a gate." The candidate (Maria) opens the Virtual Chatter
   posting in Find work: the full listing she'd actually apply from — company,
   the ask, responsibilities — with the required verified skills as the gate in
   the right rail. Two are already held (green ticks, carried from earlier
   tests), two are still locked, so Apply stays disabled until the bar is met.

   Adapted from the Kanban JobPostScreen, but candidate POV: no preview banner,
   no employer stats; the rail is the gate. OFM (Kibo) candidate system. */

import {
  BookOpenText,
  Mic,
  Gauge,
  Keyboard,
  Check,
  Lock,
  Bookmark,
  ChevronRight,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CandidateShell from "./CandidateShell";

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
  /** verified score, present only if the candidate already holds it */
  held?: string;
};
const REQS: Req[] = [
  { icon: BookOpenText, label: "English", bar: "≥ 80", held: "92 · verified" },
  { icon: Keyboard, label: "Typing", bar: "≥ 60 WPM", held: "68 WPM · verified" },
  { icon: Mic, label: "Verbal", bar: "≥ 75" },
  { icon: Gauge, label: "Internet speed", bar: "≥ 25 Mbps" },
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

export default function GatedJob() {
  const held = REQS.filter((r) => r.held).length;
  const missing = REQS.length - held;

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

            {/* labeled facts strip */}
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

          {/* ── the gate (right rail) ── */}
          <aside className="w-[320px] shrink-0">
            <div className="sticky top-4 mt-4 overflow-hidden rounded-xl border border-zinc-200/70 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-200/70 bg-zinc-50/60 px-4 py-3">
                <span className="flex items-center gap-1.5 text-ofm-label font-semibold text-zinc-800">
                  <BadgeCheck className="size-4 text-ofm-600" strokeWidth={2} />
                  Verified skills required
                </span>
                <span className="text-ofm-caption font-medium tabular-nums text-zinc-500">
                  {held} of {REQS.length} met
                </span>
              </div>

              <div>
                {REQS.map((r, i) => (
                  <div
                    key={r.label}
                    className={`flex items-center gap-3 px-4 py-3 ${
                      i > 0 ? "border-t border-zinc-100" : ""
                    } ${r.held ? "bg-ofm-50/40" : ""}`}
                  >
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                        r.held ? "bg-ofm-100" : "bg-zinc-100"
                      }`}
                    >
                      <r.icon
                        className={`size-5 ${r.held ? "text-ofm-700" : "text-zinc-400"}`}
                        strokeWidth={1.75}
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-ofm-label font-medium leading-tight text-zinc-800">
                        {r.label}
                      </span>
                      <span
                        className={`mt-0.5 block truncate text-ofm-caption leading-tight ${
                          r.held ? "text-ofm-700" : "text-zinc-400"
                        }`}
                      >
                        {r.held ?? `Requires ${r.bar}`}
                      </span>
                    </span>
                    {r.held ? (
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-ofm-600">
                        <Check className="size-3 text-white" strokeWidth={3} />
                      </span>
                    ) : (
                      <Button variant="outline" size="sm" className="shrink-0">
                        Take test
                        <ArrowRight strokeWidth={2} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 border-t border-zinc-200/70 p-4">
                <Button disabled className="flex-1">
                  <Lock strokeWidth={2} />
                  Apply
                </Button>
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
