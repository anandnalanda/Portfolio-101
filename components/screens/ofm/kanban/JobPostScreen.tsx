"use client";

/* Full Flow · beat 2 — "See the post the way applicants do."

   The employer opens one of their roles and views the posting itself: the ask,
   the company, the apply button candidates tap. A thin preview bar makes clear
   this is the employer's own view, and a right rail ties the public post back
   to the live pipeline. OFM Kibo system, inside DashboardShell. */

import { useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  Eye,
  Pencil,
  Bookmark,
  Check,
  ArrowRight,
  Sparkle,
} from "lucide-react";
import DashboardShell from "@/components/screens/ofm/DashboardShell";

const Crumbs = (
  <div className="flex min-w-0 items-center gap-1.5">
    <button className="shrink-0 text-ofm-body font-normal text-zinc-400 hover:text-zinc-600">
      Jobs
    </button>
    <ChevronRight className="size-4 shrink-0 text-zinc-300" strokeWidth={2} />
    <span className="truncate text-ofm-display font-semibold text-zinc-900">
      Virtual Chatter
    </span>
  </div>
);

const DO = [
  "Run live fan conversations across your shift, always in the creator's voice.",
  "Build rapport with regulars and keep retention high week over week.",
  "Turn warm conversations into PPV unlocks and tips without being pushy.",
];

const LOOK = [
  "Excellent written English and fast, accurate typing.",
  "Experience with fan platforms or high-volume DM sales.",
  "Reliable availability, including night and weekend shifts.",
];

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-7">
      <h3 className="text-ofm-title font-semibold text-zinc-900">{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {items.map((t) => (
          <li key={t} className="flex gap-2.5 text-ofm-body leading-relaxed text-zinc-600">
            <Check className="mt-1 size-4 shrink-0 text-ofm-500" strokeWidth={2.4} />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function JobPostScreen() {
  /* scrollbar shows only while actively scrolling */
  const [scrolling, setScrolling] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    },
    [],
  );

  return (
    <DashboardShell activeNav="Jobs" headerLeft={Crumbs}>
      <div className="flex h-full flex-col">
        {/* employer preview banner — emerald because preview is a STATE
            (Contra shows the same moment as a tinted full-width banner) */}
        <div className="flex shrink-0 items-center justify-between border-b border-ofm-200/70 bg-ofm-50 px-5 py-2">
          <span className="flex items-center gap-2 text-ofm-caption font-medium text-ofm-700">
            <Eye className="size-3.5 text-ofm-600" strokeWidth={2} />
            Preview · this is how applicants see your posting
          </span>
          <button className="flex h-7 items-center gap-1.5 rounded-lg border border-ofm-200/70 bg-white px-2.5 text-ofm-label font-medium text-ofm-700 hover:bg-ofm-100/50">
            <Pencil className="size-3.5 text-ofm-500" strokeWidth={2} />
            Edit posting
          </button>
        </div>

        {/* body */}
        <div
          onScroll={() => {
            setScrolling(true);
            if (hideTimer.current) clearTimeout(hideTimer.current);
            hideTimer.current = setTimeout(() => setScrolling(false), 800);
          }}
          style={{ scrollbarColor: scrolling ? "#d4d4d8 transparent" : "transparent transparent" }}
          className={`min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full ${
            scrolling
              ? "[&::-webkit-scrollbar-thumb]:bg-zinc-300"
              : "[&::-webkit-scrollbar-thumb]:bg-transparent"
          }`}
        >
          <div className="mx-auto flex max-w-[1000px] gap-10 px-5 py-4">
            {/* posting */}
            <article className="min-w-0 flex-1">
              {/* company — mt is article reading-rhythm, not canvas gutter */}
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
                <span className="text-ofm-label font-medium text-zinc-500">Acme Studio</span>
              </div>

              <h1 className="mt-4 text-ofm-hero font-semibold text-zinc-900">
                Virtual Chatter
              </h1>

              {/* labeled facts strip (Braintrust pattern) — scannable, no icon soup */}
              <div className="mt-5 flex overflow-hidden rounded-xl border border-zinc-200/70">
                {[
                  ["Location", "Remote · Worldwide"],
                  ["Type", "Full-time"],
                  ["Posted", "2 weeks ago"],
                  ["Pay", "$1.5k – $2.5k/mo + bonus"],
                ].map(([k, v], i) => (
                  <div
                    key={k}
                    className={`flex-1 px-4 py-3 ${i > 0 ? "border-l border-zinc-200/70" : ""}`}
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

              {/* actions (what candidates tap) */}
              <div className="mt-5 flex items-center gap-2.5">
                <button className="flex items-center gap-2 rounded-lg bg-ofm-600 px-5 py-2.5 text-ofm-body font-semibold text-white shadow-sm hover:bg-ofm-700">
                  Apply now
                  <ArrowRight className="size-4" strokeWidth={2.2} />
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-zinc-200/70 px-3.5 py-2.5 text-ofm-body font-medium text-zinc-600 hover:bg-zinc-50">
                  <Bookmark className="size-4 text-zinc-400" strokeWidth={2} />
                  Save
                </button>
              </div>

              <div className="mt-7 border-t border-zinc-200/70" />

              <div className="mt-7">
                <h3 className="text-ofm-title font-semibold text-zinc-900">About the role</h3>
                <p className="mt-3 text-ofm-body leading-relaxed text-zinc-600">
                  We&apos;re hiring chatters to run real-time fan conversations for the
                  creators we manage. You&apos;ll keep each creator&apos;s voice, turn regulars
                  into loyal fans, and grow revenue one conversation at a time. This is a
                  high-ownership seat on a small chat team that cares about quality.
                </p>
              </div>

              <Section title="What you'll do" items={DO} />
              <Section title="What we're looking for" items={LOOK} />

              <div className="mt-7 flex flex-wrap gap-2">
                {["Written English", "Sales", "Retention", "PPV", "Night shifts"].map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-zinc-100 px-2 py-1 text-ofm-label font-medium text-zinc-600"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* about the agency (Contra pattern) */}
              <div className="mt-7 rounded-xl border border-zinc-200/70 bg-zinc-50/60 p-4">
                <p className="text-ofm-label font-semibold text-zinc-900">About Acme Studio</p>
                <p className="mt-1.5 text-ofm-label leading-relaxed text-zinc-600">
                  Acme Studio is a creator management agency running chat, content, and
                  marketing for the creators it represents. Small remote team, high
                  standards, and a chat operation that never sleeps.
                </p>
              </div>
            </article>

            {/* employer rail */}
            <aside className="w-[280px] shrink-0">
              <div className="sticky top-4 mt-4 rounded-xl border border-zinc-200/70 bg-white p-4 shadow-sm">
                <p className="text-ofm-label font-semibold text-zinc-900">Your posting</p>
                <p className="mt-1 flex items-center gap-1.5 text-ofm-caption text-zinc-400">
                  <span className="size-1.5 rounded-full bg-ofm-500" />
                  Live · Acme Studio
                </p>

                {/* stats — open cells, hairline partitions only */}
                <div className="mt-4 grid grid-cols-2">
                  {[
                    ["Applicants", "142"],
                    ["New this week", "12"],
                    ["Top AI match", "92"],
                    ["Interviewing", "8"],
                  ].map(([k, v], i) => (
                    <div
                      key={k}
                      className={`${i % 2 === 1 ? "border-l border-zinc-200/70 pl-4" : "pr-4"} ${
                        i > 1 ? "border-t border-zinc-200/70 pt-3" : "pb-3"
                      }`}
                    >
                      {k === "Top AI match" ? (
                        <p className="flex items-center gap-1 text-ofm-display font-semibold leading-none tabular-nums text-ofm-700">
                          {v}
                          <Sparkle className="size-3 text-ofm-500" strokeWidth={2.5} />
                        </p>
                      ) : (
                        <p className="text-ofm-display font-semibold leading-none tabular-nums text-zinc-900">
                          {v}
                        </p>
                      )}
                      <p className="mt-1.5 text-ofm-caption text-zinc-400">{k}</p>
                    </div>
                  ))}
                </div>

                <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-ofm-200/70 bg-white py-2.5 text-ofm-label font-semibold text-ofm-700 hover:bg-ofm-50/60">
                  View pipeline
                  <ArrowRight className="size-4" strokeWidth={2.2} />
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
