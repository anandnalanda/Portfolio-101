"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Spectral } from "next/font/google";

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
});

/* ------------------------------------------------------------------ */
/*  Section data                                                       */
/* ------------------------------------------------------------------ */

type SectionType = "intro" | "critique" | "refinement" | "summary";

interface Section {
  id: string;
  type: SectionType;
  title: string;
  content: string;
  highlight: {
    top: number;
    left: number;
    width: number;
    height: number;
  } | null;
}

const sections: Section[] = [
  {
    id: "intro",
    type: "intro",
    title: "Refining Kanban and AI",
    content:
      "A design critique and refinement of the Kanban hiring pipeline — a board interface where recruiters track candidates across stages while AI ranks applicants by fit. This walkthrough covers what worked, what needed improvement, and how the interface evolved from a dense prototype to a focused hiring tool.",
    highlight: null,
  },
  {
    id: "board-header",
    type: "critique",
    title: "Board Header Clutter",
    content:
      "The board header packs too many controls into a single row — job title, department tag, filter dropdowns, sort options, and a search field all compete for attention. The hierarchy is flat, making it hard to distinguish primary context from secondary actions. Recruiters waste time parsing the toolbar before they can focus on candidates.",
    highlight: { top: 0, left: 0, width: 100, height: 13 },
  },
  {
    id: "column-overflow",
    type: "critique",
    title: "Column Overflow",
    content:
      "Columns don't communicate capacity. The 'Applied' column shows 12 candidates in a scrollable list with no indication of total count or overflow. Recruiters can't gauge pipeline health at a glance — they have to scroll each column to understand volume, which defeats the purpose of a board view.",
    highlight: { top: 13, left: 0, width: 25, height: 87 },
  },
  {
    id: "card-density",
    type: "critique",
    title: "Card Information Density",
    content:
      "Each candidate card displays name, role, source, date applied, tags, and an avatar — six data points in a small space. The visual weight is uniform across all fields, so nothing stands out. Recruiters need to identify candidates quickly; instead, they're reading miniature resumes on every card.",
    highlight: { top: 13, left: 25, width: 25, height: 50 },
  },
  {
    id: "ai-ranking",
    type: "critique",
    title: "AI Ranking Visibility",
    content:
      "The AI match score is buried as a small badge in the bottom-right corner of each card — the same visual weight as the date label. This is the platform's differentiator, yet it reads as metadata. Recruiters reported not noticing the scores until their second week of use.",
    highlight: { top: 13, left: 50, width: 25, height: 50 },
  },
  {
    id: "drag-handle",
    type: "critique",
    title: "Drag Handle Affordance",
    content:
      "Cards lack a visible drag affordance. The entire card is draggable, but nothing signals this — no grip dots, no cursor change preview, no hover lift. New users click cards expecting a detail view and accidentally trigger drags. The interaction model is invisible.",
    highlight: { top: 63, left: 25, width: 50, height: 24 },
  },
  {
    id: "candidate-preview",
    type: "critique",
    title: "Candidate Preview",
    content:
      "Clicking a card opens a full-page detail view, breaking the board context entirely. Recruiters lose their spatial position and must navigate back to continue triaging. A preview that maintains board context would let them review and act without losing their place.",
    highlight: { top: 13, left: 75, width: 25, height: 87 },
  },
  {
    id: "refinement-header",
    type: "refinement",
    title: "Simplifying the Board Header",
    content:
      "The header now leads with the job title at full weight, followed by a subtle department pill. Filters collapsed into a single dropdown with active-filter count badge. Search moved to a keyboard shortcut. The toolbar dropped from seven elements to three.",
    highlight: { top: 0, left: 0, width: 100, height: 13 },
  },
  {
    id: "refinement-cards",
    type: "refinement",
    title: "Tighter Card Layout",
    content:
      "Cards reduced to three elements: name, current role, and AI score. Source and date moved to the detail panel. A subtle left-border color encodes stage progress. The result: cards scan in under a second, and the board feels lighter without losing essential information.",
    highlight: { top: 13, left: 0, width: 50, height: 55 },
  },
  {
    id: "refinement-ai",
    type: "refinement",
    title: "Surfacing AI Rankings",
    content:
      "The AI match score is now the most prominent element on each card — a colored bar on the left edge with a numeric score. High-match candidates pulse with a subtle green accent. Column headers show average match scores, giving recruiters pipeline quality at a glance.",
    highlight: { top: 13, left: 50, width: 50, height: 55 },
  },
  {
    id: "refinement-drag",
    type: "refinement",
    title: "Improving Drag Interactions",
    content:
      "Cards now show grip dots on the left edge on hover, with a gentle lift shadow on grab. Drop zones highlight with a dashed border and stage-colored tint. The detail preview opens in a slide-over panel, keeping the board visible underneath for spatial context.",
    highlight: { top: 68, left: 0, width: 100, height: 32 },
  },
  {
    id: "summary",
    type: "summary",
    title: "",
    content:
      "The refinements centered on surfacing what matters — AI scores, candidate identity, and pipeline health — while removing everything that competed for attention. The board now reads like a dashboard, not a spreadsheet. Recruiters can triage faster because the interface prioritizes decision-making over data display.",
    highlight: null,
  },
];

const ease = [0.22, 1, 0.36, 1];

/* ------------------------------------------------------------------ */
/*  Dashboard mockups                                                  */
/* ------------------------------------------------------------------ */

function DashboardBefore() {
  return (
    <div className="w-full h-full flex flex-col text-[10px] leading-tight bg-white rounded-xl overflow-hidden border border-black/[0.08]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-black/[0.06] bg-gray-50/80 shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[10px]">Senior Engineer</span>
          <span className="px-1.5 py-0.5 rounded bg-blue-100 text-[8px] text-blue-700">Engineering</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="px-2 py-1 rounded bg-black/[0.06] text-[8px]">Filter</span>
          <span className="px-2 py-1 rounded bg-black/[0.06] text-[8px]">Sort</span>
          <span className="px-2 py-1 rounded bg-black/[0.06] text-[8px]">Group</span>
          <div className="w-20 h-5 rounded border border-black/10 bg-white ml-1 flex items-center px-1.5">
            <span className="text-[8px] text-black/25">Search...</span>
          </div>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Applied */}
        <div className="w-[25%] border-r border-black/[0.06] flex flex-col min-h-0">
          <div className="px-2 py-1.5 border-b border-black/[0.06] bg-gray-50/40 shrink-0">
            <span className="font-semibold text-[9px]">Applied</span>
          </div>
          <div className="flex-1 p-1.5 flex flex-col gap-1 overflow-hidden">
            {["Sarah Chen", "Marcus Johnson", "Priya Patel", "James Wilson"].map((name, i) => (
              <div key={name} className="border border-black/[0.08] rounded-lg p-1.5 bg-white">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-black/10 shrink-0" />
                  <div>
                    <div className="text-[8px] font-medium">{name}</div>
                    <div className="text-[7px] text-black/40">Frontend Dev</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[7px] text-black/30">LinkedIn · 3d ago</span>
                  <span className="px-1 py-0.5 rounded bg-black/[0.04] text-[7px] text-black/40">{92 - i * 7}%</span>
                </div>
                <div className="flex gap-0.5 mt-1">
                  <span className="px-1 py-0.5 rounded bg-gray-100 text-[6px] text-black/40">React</span>
                  <span className="px-1 py-0.5 rounded bg-gray-100 text-[6px] text-black/40">TS</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Screening */}
        <div className="w-[25%] border-r border-black/[0.06] flex flex-col min-h-0">
          <div className="px-2 py-1.5 border-b border-black/[0.06] bg-gray-50/40 shrink-0">
            <span className="font-semibold text-[9px]">Screening</span>
          </div>
          <div className="flex-1 p-1.5 flex flex-col gap-1 overflow-hidden">
            {["Aisha Rahman", "David Kim", "Elena Volkov"].map((name, i) => (
              <div key={name} className="border border-black/[0.08] rounded-lg p-1.5 bg-white">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-black/10 shrink-0" />
                  <div>
                    <div className="text-[8px] font-medium">{name}</div>
                    <div className="text-[7px] text-black/40">Backend Eng</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[7px] text-black/30">Referral · 5d ago</span>
                  <span className="px-1 py-0.5 rounded bg-black/[0.04] text-[7px] text-black/40">{88 - i * 5}%</span>
                </div>
                <div className="flex gap-0.5 mt-1">
                  <span className="px-1 py-0.5 rounded bg-gray-100 text-[6px] text-black/40">Node</span>
                  <span className="px-1 py-0.5 rounded bg-gray-100 text-[6px] text-black/40">Go</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interview */}
        <div className="w-[25%] border-r border-black/[0.06] flex flex-col min-h-0">
          <div className="px-2 py-1.5 border-b border-black/[0.06] bg-gray-50/40 shrink-0">
            <span className="font-semibold text-[9px]">Interview</span>
          </div>
          <div className="flex-1 p-1.5 flex flex-col gap-1 overflow-hidden">
            {["Tomoko Sato", "Ryan O'Brien"].map((name, i) => (
              <div key={name} className="border border-black/[0.08] rounded-lg p-1.5 bg-white">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-black/10 shrink-0" />
                  <div>
                    <div className="text-[8px] font-medium">{name}</div>
                    <div className="text-[7px] text-black/40">Full Stack</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[7px] text-black/30">Indeed · 1w ago</span>
                  <span className="px-1 py-0.5 rounded bg-black/[0.04] text-[7px] text-black/40">{95 - i * 4}%</span>
                </div>
                <div className="flex gap-0.5 mt-1">
                  <span className="px-1 py-0.5 rounded bg-gray-100 text-[6px] text-black/40">React</span>
                  <span className="px-1 py-0.5 rounded bg-gray-100 text-[6px] text-black/40">Python</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offer */}
        <div className="w-[25%] flex flex-col min-h-0">
          <div className="px-2 py-1.5 border-b border-black/[0.06] bg-gray-50/40 shrink-0">
            <span className="font-semibold text-[9px]">Offer</span>
          </div>
          <div className="flex-1 p-1.5 flex flex-col gap-1 overflow-hidden">
            {["Liam Carter"].map((name) => (
              <div key={name} className="border border-black/[0.08] rounded-lg p-1.5 bg-white">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-black/10 shrink-0" />
                  <div>
                    <div className="text-[8px] font-medium">{name}</div>
                    <div className="text-[7px] text-black/40">Frontend Dev</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[7px] text-black/30">Direct · 2w ago</span>
                  <span className="px-1 py-0.5 rounded bg-black/[0.04] text-[7px] text-black/40">97%</span>
                </div>
                <div className="flex gap-0.5 mt-1">
                  <span className="px-1 py-0.5 rounded bg-gray-100 text-[6px] text-black/40">React</span>
                  <span className="px-1 py-0.5 rounded bg-gray-100 text-[6px] text-black/40">Next.js</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardAfter() {
  return (
    <div className="w-full h-full flex flex-col text-[10px] leading-tight bg-white rounded-xl overflow-hidden border border-black/[0.08]">
      {/* Header - simplified */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-black/[0.04] shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[11px]">Senior Engineer</span>
          <span className="px-1.5 py-0.5 rounded-full bg-black/[0.04] text-[8px] text-black/50">Engineering</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded-lg bg-black/[0.04] text-[8px] text-black/50">Filters <span className="ml-0.5 px-1 py-0.5 rounded-full bg-black/10 text-[7px]">2</span></span>
          <div className="w-5 h-5 rounded-full bg-black/10" />
        </div>
      </div>

      {/* Kanban columns - cleaner */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Applied */}
        <div className="w-[25%] border-r border-black/[0.04] flex flex-col min-h-0">
          <div className="px-2 py-1.5 border-b border-black/[0.04] shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[9px] text-black/70">Applied</span>
              <span className="text-[8px] text-black/30">4</span>
            </div>
            <span className="text-[7px] text-black/25">avg 82%</span>
          </div>
          <div className="flex-1 p-1.5 flex flex-col gap-1 overflow-hidden">
            {[
              { name: "Sarah Chen", role: "Frontend Dev", score: 92 },
              { name: "Marcus Johnson", role: "Frontend Dev", score: 85 },
              { name: "Priya Patel", role: "Frontend Dev", score: 78 },
              { name: "James Wilson", role: "Frontend Dev", score: 71 },
            ].map((c) => (
              <div key={c.name} className="rounded-lg p-1.5 bg-white border border-black/[0.05] flex items-center gap-1.5">
                <div className={`w-0.5 h-6 rounded-full ${c.score >= 85 ? "bg-emerald-400" : c.score >= 75 ? "bg-amber-300" : "bg-black/10"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[8px] font-semibold truncate">{c.name}</div>
                  <div className="text-[7px] text-black/35">{c.role}</div>
                </div>
                <span className={`text-[9px] font-bold ${c.score >= 85 ? "text-emerald-600" : c.score >= 75 ? "text-amber-600" : "text-black/30"}`}>{c.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Screening */}
        <div className="w-[25%] border-r border-black/[0.04] flex flex-col min-h-0">
          <div className="px-2 py-1.5 border-b border-black/[0.04] shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[9px] text-black/70">Screening</span>
              <span className="text-[8px] text-black/30">3</span>
            </div>
            <span className="text-[7px] text-black/25">avg 83%</span>
          </div>
          <div className="flex-1 p-1.5 flex flex-col gap-1 overflow-hidden">
            {[
              { name: "Aisha Rahman", role: "Backend Eng", score: 88 },
              { name: "David Kim", role: "Backend Eng", score: 83 },
              { name: "Elena Volkov", role: "Backend Eng", score: 78 },
            ].map((c) => (
              <div key={c.name} className="rounded-lg p-1.5 bg-white border border-black/[0.05] flex items-center gap-1.5">
                <div className={`w-0.5 h-6 rounded-full ${c.score >= 85 ? "bg-emerald-400" : c.score >= 75 ? "bg-amber-300" : "bg-black/10"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[8px] font-semibold truncate">{c.name}</div>
                  <div className="text-[7px] text-black/35">{c.role}</div>
                </div>
                <span className={`text-[9px] font-bold ${c.score >= 85 ? "text-emerald-600" : c.score >= 75 ? "text-amber-600" : "text-black/30"}`}>{c.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interview */}
        <div className="w-[25%] border-r border-black/[0.04] flex flex-col min-h-0">
          <div className="px-2 py-1.5 border-b border-black/[0.04] shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[9px] text-black/70">Interview</span>
              <span className="text-[8px] text-black/30">2</span>
            </div>
            <span className="text-[7px] text-black/25">avg 93%</span>
          </div>
          <div className="flex-1 p-1.5 flex flex-col gap-1 overflow-hidden">
            {[
              { name: "Tomoko Sato", role: "Full Stack", score: 95 },
              { name: "Ryan O'Brien", role: "Full Stack", score: 91 },
            ].map((c) => (
              <div key={c.name} className="rounded-lg p-1.5 bg-white border border-black/[0.05] flex items-center gap-1.5">
                <div className={`w-0.5 h-6 rounded-full ${c.score >= 85 ? "bg-emerald-400" : c.score >= 75 ? "bg-amber-300" : "bg-black/10"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[8px] font-semibold truncate">{c.name}</div>
                  <div className="text-[7px] text-black/35">{c.role}</div>
                </div>
                <span className={`text-[9px] font-bold ${c.score >= 85 ? "text-emerald-600" : c.score >= 75 ? "text-amber-600" : "text-black/30"}`}>{c.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Offer */}
        <div className="w-[25%] flex flex-col min-h-0">
          <div className="px-2 py-1.5 border-b border-black/[0.04] shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[9px] text-black/70">Offer</span>
              <span className="text-[8px] text-black/30">1</span>
            </div>
            <span className="text-[7px] text-black/25">avg 97%</span>
          </div>
          <div className="flex-1 p-1.5 flex flex-col gap-1 overflow-hidden">
            {[
              { name: "Liam Carter", role: "Frontend Dev", score: 97 },
            ].map((c) => (
              <div key={c.name} className="rounded-lg p-1.5 bg-white border border-black/[0.05] flex items-center gap-1.5">
                <div className={`w-0.5 h-6 rounded-full ${c.score >= 85 ? "bg-emerald-400" : c.score >= 75 ? "bg-amber-300" : "bg-black/10"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[8px] font-semibold truncate">{c.name}</div>
                  <div className="text-[7px] text-black/35">{c.role}</div>
                </div>
                <span className={`text-[9px] font-bold ${c.score >= 85 ? "text-emerald-600" : c.score >= 75 ? "text-amber-600" : "text-black/30"}`}>{c.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  NarrativeSection component                                         */
/* ------------------------------------------------------------------ */

interface NarrativeSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  titleSize?: "lg" | "md" | "sm";
  onActive?: (id: string) => void;
}

function NarrativeSection({
  id,
  title,
  children,
  titleSize = "md",
  onActive,
}: NarrativeSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
          onActive?.(id);
        } else {
          setIsActive(false);
        }
      },
      { rootMargin: "-49% 0px -49% 0px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [id, onActive]);

  const titleClass =
    titleSize === "lg"
      ? "text-[28px] tracking-[-0.02em] leading-tight"
      : titleSize === "sm"
      ? "text-[22px] tracking-[-0.01em]"
      : "text-[18px]";

  return (
    <div ref={ref} data-section={id} className="mb-6">
      <div
        className={`py-4 px-4 transition-all duration-[250ms] ease-out border-l-[2.4px] ${
          isActive
            ? "border-l-txt-secondary bg-surface-muted opacity-100"
            : "border-l-transparent opacity-[0.75]"
        }`}
      >
        <h2 className={`font-semibold text-txt-heading mb-2 ${titleClass}`}>
          {title}
        </h2>
        <p className="text-[15px] leading-[1.7] text-txt-primary">{children}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function KanbanAndAIPage() {
  const [activeSection, setActiveSection] = useState<string>("intro");
  const [showAfter, setShowAfter] = useState(false);

  const handleActive = useCallback((id: string) => {
    setActiveSection(id);
  }, []);

  // Auto-switch to "after" when scrolling into refinement sections
  useEffect(() => {
    const section = sections.find((s) => s.id === activeSection);
    if (section) {
      if (section.type === "refinement" || section.type === "summary") {
        setShowAfter(true);
      } else if (section.type === "critique" || section.type === "intro") {
        setShowAfter(false);
      }
    }
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-white">
      {/* Two-column layout */}
      <div className="flex max-lg:flex-col">
        {/* Left: scrolling narrative */}
        <div className="w-full md:w-[440px] lg:w-[480px] md:flex-shrink-0 bg-surface relative">

          <div className="px-6 py-16 md:px-10">
            {/* Back link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease }}
              className="mb-2 pl-4"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[14px] text-txt-secondary hover:text-txt-heading transition-colors"
              >
                <span>←</span>
                Home
              </Link>
            </motion.div>

            {sections.map((section, i) => {
              const prev = i > 0 ? sections[i - 1] : null;
              const showGroupHeading =
                (section.type === "critique" && prev?.type !== "critique") ||
                (section.type === "refinement" && prev?.type !== "refinement") ||
                (section.type === "summary" && prev?.type !== "summary");
              const groupLabel =
                section.type === "critique"
                  ? "Critique"
                  : section.type === "refinement"
                  ? "Refinement"
                  : section.type === "summary"
                  ? "Summary"
                  : null;

              return (
                <div key={section.id}>
                  {showGroupHeading && groupLabel && (
                    <div className="mt-12 mb-4 pl-4">
                      <h3
                        className={`${spectral.className} text-[24px] text-txt-heading pb-[2px] tracking-[-1px]`}
                      >
                        {groupLabel}
                      </h3>
                      <div className="border-b border-surface-border" />
                    </div>
                  )}
                  <NarrativeSection
                    id={section.id}
                    title={section.title}
                    titleSize={
                      section.type === "intro"
                        ? "lg"
                        : section.type === "summary"
                        ? "sm"
                        : "md"
                    }
                    onActive={handleActive}
                  >
                    {section.content}
                    {section.type === "summary" && (
                      <div className="mt-4">
                        <div className="inline-flex rounded-full bg-black/[0.06] p-0.5">
                          <button
                            onClick={() => setShowAfter(false)}
                            className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                              !showAfter
                                ? "bg-white text-txt-heading shadow-sm"
                                : "text-txt-secondary"
                            }`}
                          >
                            Before
                          </button>
                          <button
                            onClick={() => setShowAfter(true)}
                            className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                              showAfter
                                ? "bg-white text-txt-heading shadow-sm"
                                : "text-txt-secondary"
                            }`}
                          >
                            After
                          </button>
                        </div>
                      </div>
                    )}
                  </NarrativeSection>
                </div>
              );
            })}

            {/* Continue Reading */}
            <div className="mt-16">
              <h4 className="text-[12px] font-normal text-txt-secondary uppercase tracking-[0.08em] mb-2 pl-4">
                Continue Reading
              </h4>
              {[
                {
                  title: "Staple Chat",
                  descriptor: "Conversational AI for document analysis.",
                  href: "/staple-chat",
                },
                {
                  title: "Staple Tables",
                  descriptor: "Structured data extraction from documents.",
                  href: "/staple-tables",
                },
                {
                  title: "OFM Jobs Tests",
                  descriptor: "Assessment system with AI-powered hiring.",
                  href: "/ofm-jobs-tests",
                },
              ].map((project) => (
                <Link
                  key={project.title}
                  href={project.href}
                  className="block py-4 pl-4 border-b border-surface-border hover:bg-black/[0.02] transition-all duration-[250ms] ease-out"
                >
                  <h5 className="text-[15px] font-semibold text-txt-heading">
                    {project.title}
                  </h5>
                  <p className="text-[13px] text-txt-secondary mt-0.5">
                    {project.descriptor}
                  </p>
                </Link>
              ))}
            </div>

          </div>
        </div>

        {/* Right: sticky artifact panel */}
        <div className="flex-1 min-w-0 max-lg:hidden">
          <div className="sticky top-0 h-screen pl-2 pr-[28px] py-[28px] flex flex-col">
            {/* Beige panel */}
            <div className="flex-1 rounded-[32px] bg-[#f5f0eb] p-[28px] flex flex-col">
              {/* Dashboard container */}
              <div className="relative flex-1 min-h-0 bg-white rounded-[32px] shadow-lg overflow-hidden">
                {/* Before/After dashboards */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={showAfter ? "after" : "before"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease }}
                    className="absolute inset-0"
                  >
                    {showAfter ? <DashboardAfter /> : <DashboardBefore />}
                  </motion.div>
                </AnimatePresence>

                {/* Highlight overlays */}
                {sections.map(
                  (section) =>
                    section.highlight && (
                      <motion.div
                        key={section.id}
                        className="absolute pointer-events-none z-10"
                        style={{
                          top: `${section.highlight.top}%`,
                          left: `${section.highlight.left}%`,
                          width: `${section.highlight.width}%`,
                          height: `${section.highlight.height}%`,
                        }}
                        animate={{
                          opacity: activeSection === section.id ? 1 : 0,
                        }}
                        transition={{ duration: 0.35, ease }}
                      >
                        <div
                          className={`w-full h-full rounded-lg border ${
                            sections.find((s) => s.id === section.id)?.type ===
                            "refinement"
                              ? "bg-emerald-400/[0.12] border-emerald-400/30"
                              : "bg-red-400/[0.15] border-red-400/30"
                          }`}
                        />
                      </motion.div>
                    )
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Mobile artifact (shown inline on small screens) */}
      <div className="lg:hidden px-4 pb-10">
        <div className="rounded-2xl bg-[#f5f0eb] p-4">
          <div className="relative aspect-[4/3] bg-white rounded-[32px] shadow-lg overflow-hidden">
            {showAfter ? <DashboardAfter /> : <DashboardBefore />}
          </div>
        </div>
      </div>
    </div>
  );
}
