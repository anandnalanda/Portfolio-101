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
    title: "Refining OFM Jobs Tests",
    content:
      "A design critique and refinement of the OFM Jobs Tests interface — the assessment builder for AI-powered hiring workflows. This walkthrough examines the test creation experience, from question authoring to scoring configuration, and traces how the interface evolved into a cleaner, more focused tool.",
    highlight: null,
  },
  {
    id: "builder-layout",
    type: "critique",
    title: "Test Builder Layout",
    content:
      "The builder splits into three rigid columns — test list, question editor, and settings panel — each competing for horizontal space. On standard screens the question editor is squeezed to barely 40% width, making long-form questions hard to read and edit. The layout prioritizes structure over the authoring task.",
    highlight: { top: 0, left: 0, width: 100, height: 10.5 },
  },
  {
    id: "question-types",
    type: "critique",
    title: "Question Type Selector",
    content:
      "Question types live in a floating panel with large icon tiles — multiple choice, free response, coding, video, and ranking each get their own bordered card. The panel opens as a modal overlay, breaking the author's flow. Selecting a type dismisses the panel and resets scroll position.",
    highlight: { top: 10.5, left: 0, width: 25, height: 89.5 },
  },
  {
    id: "preview-pane",
    type: "critique",
    title: "Preview Pane",
    content:
      "The preview renders in a narrow right column with its own scroll context. It shows a phone-sized viewport by default, but most candidates take tests on desktop. The preview updates lag behind edits by a noticeable beat, and there's no way to toggle between device sizes.",
    highlight: { top: 10.5, left: 70, width: 30, height: 55 },
  },
  {
    id: "scoring-rubric",
    type: "critique",
    title: "Scoring Rubric",
    content:
      "Rubric configuration hides behind a tab inside each question card. Authors must click into the question, switch to the Scoring tab, then configure point values, partial credit, and AI evaluation criteria — three levels deep. Most authors miss the partial credit options entirely.",
    highlight: { top: 10.5, left: 25, width: 45, height: 50 },
  },
  {
    id: "timer-controls",
    type: "critique",
    title: "Timer Controls",
    content:
      "Timer settings scatter across two locations — a global test duration in the header and per-question time limits inside each question's settings tab. The two systems don't visually connect. When per-question times exceed the global limit, there's no warning until the author tries to publish.",
    highlight: { top: 60.5, left: 25, width: 75, height: 20 },
  },
  {
    id: "results-dashboard",
    type: "critique",
    title: "Results Dashboard",
    content:
      "The results view mirrors the builder's three-column layout but adds a fourth panel for individual response detail. Score distributions, completion rates, and time analytics each sit in separate bordered cards with inconsistent chart styles. The density makes it hard to spot patterns at a glance.",
    highlight: { top: 80.5, left: 0, width: 100, height: 19.5 },
  },
  {
    id: "refinement-builder",
    type: "refinement",
    title: "Streamlining the Builder",
    content:
      "Collapsed the three-column layout into a focused single-column editor with a collapsible test list rail. The question editor now spans the full content width. A persistent inline toolbar replaces the settings panel — every option is one click away, not three.",
    highlight: { top: 0, left: 0, width: 100, height: 10.5 },
  },
  {
    id: "refinement-questions",
    type: "refinement",
    title: "Cleaner Question Types",
    content:
      "Replaced the modal panel with an inline type selector — a compact row of labeled icons that sits at the insertion point. Choosing a type instantly scaffolds the question block in place. The author never loses context or scroll position.",
    highlight: { top: 10.5, left: 0, width: 25, height: 72 },
  },
  {
    id: "refinement-preview",
    type: "refinement",
    title: "Unified Preview",
    content:
      "Preview now opens as a slide-over panel with device-size toggles (mobile, tablet, desktop). Updates are instant — no lag. A split-view mode lets authors edit and preview side by side without the cramped three-column squeeze.",
    highlight: { top: 10.5, left: 25, width: 75, height: 42 },
  },
  {
    id: "refinement-scoring",
    type: "refinement",
    title: "Simplified Scoring",
    content:
      "Scoring controls surface directly below each question — point value, partial credit toggle, and AI criteria in a single visible row. Global scoring rules sit in a top-level settings bar with clear conflict warnings. No more hidden tabs.",
    highlight: { top: 82, left: 0, width: 100, height: 18 },
  },
  {
    id: "summary",
    type: "summary",
    title: "",
    content:
      "The refinements prioritized authoring flow over structural symmetry — fewer columns, inline controls, and surface-level scoring. The test builder now feels like a writing tool rather than a configuration panel. Authors spend time on questions, not on navigating the interface around them.",
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
      {/* Nav */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-black/[0.06] bg-gray-50/80 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded bg-black/80" />
          <span className="font-bold text-[10px]">OFM Jobs</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="px-2 py-1 rounded bg-black/10 font-semibold text-[9px]">Tests</span>
          <span className="px-2 py-1 rounded text-black/40 text-[9px]">Candidates</span>
          <span className="px-2 py-1 rounded text-black/40 text-[9px]">Results</span>
          <span className="px-2 py-1 rounded text-black/40 text-[9px]">Settings</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-5 rounded border border-black/10 bg-white" />
          <div className="w-5 h-5 rounded-full bg-black/10" />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar — test list */}
        <div className="w-[25%] border-r border-black/[0.06] p-2 flex flex-col gap-1 bg-gray-50/40 shrink-0 overflow-hidden">
          <div className="text-[8px] font-semibold text-black/30 uppercase tracking-wider px-1 mb-1">Tests</div>
          {["Frontend Skills", "Backend Logic", "System Design", "Culture Fit", "AI/ML Quiz"].map(
            (name, i) => (
              <div
                key={name}
                className={`px-2 py-1.5 rounded text-[9px] ${
                  i === 0
                    ? "bg-black/[0.05] font-medium"
                    : "text-black/50"
                }`}
              >
                <div className="truncate">{name}</div>
                <div className="text-[7px] text-black/25 mt-0.5 truncate">
                  {i === 0 ? "12 questions · Draft" : `${(i + 1) * 4} questions · Published`}
                </div>
              </div>
            )
          )}
        </div>

        {/* Main content — question builder */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Question types panel */}
          <div className="grid grid-cols-5 gap-1 p-2 border-b border-black/[0.06] shrink-0">
            {[
              { label: "Multiple Choice", icon: "○" },
              { label: "Free Response", icon: "✎" },
              { label: "Coding", icon: "</>" },
              { label: "Video", icon: "▶" },
              { label: "Ranking", icon: "≡" },
            ].map((q) => (
              <div
                key={q.label}
                className="border border-black/[0.08] rounded-lg p-1.5 bg-white text-center"
              >
                <div className="text-[12px]">{q.icon}</div>
                <div className="text-[7px] text-black/40 mt-0.5">{q.label}</div>
              </div>
            ))}
          </div>

          {/* Question editor */}
          <div className="flex-1 p-3 flex flex-col gap-2 overflow-hidden">
            {/* Question 1 */}
            <div className="border border-black/[0.08] rounded-lg p-2 bg-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[8px] font-semibold">Q1 — Multiple Choice</span>
                <span className="text-[7px] text-black/30">10 pts</span>
              </div>
              <div className="text-[8px] text-black/60">What is the time complexity of binary search?</div>
              <div className="mt-1 flex flex-col gap-0.5">
                <div className="text-[7px] text-black/40 flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-black/20" /> O(n)</div>
                <div className="text-[7px] text-black/40 flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-black/20 bg-emerald-200" /> O(log n)</div>
                <div className="text-[7px] text-black/40 flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-black/20" /> O(n log n)</div>
              </div>
              <div className="mt-1.5 flex gap-1">
                <span className="text-[7px] px-1.5 py-0.5 rounded bg-black/[0.04] text-black/40">Scoring</span>
                <span className="text-[7px] px-1.5 py-0.5 rounded bg-black/[0.04] text-black/40">Timer</span>
              </div>
            </div>

            {/* Question 2 */}
            <div className="border border-black/[0.08] rounded-lg p-2 bg-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[8px] font-semibold">Q2 — Free Response</span>
                <span className="text-[7px] text-black/30">20 pts</span>
              </div>
              <div className="text-[8px] text-black/60">Explain the difference between REST and GraphQL.</div>
              <div className="mt-1 h-6 rounded border border-dashed border-black/10 bg-gray-50/50 flex items-center justify-center text-[7px] text-black/20">Response area</div>
            </div>
          </div>

          {/* Timer & settings bar */}
          <div className="border-t border-black/[0.06] p-2 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[8px] text-black/40">
                <span>Total: 60 min</span>
                <span className="text-black/15">|</span>
                <span>Per-question: Varies</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-14 h-5 rounded border border-black/10 bg-white flex items-center justify-center text-[8px] text-black/40">Preview</div>
                <div className="w-14 h-5 rounded bg-black/80 flex items-center justify-center text-[8px] text-white">Publish</div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview panel */}
        <div className="w-[30%] border-l border-black/[0.06] p-2 flex flex-col gap-1 bg-gray-50/30 shrink-0 overflow-hidden">
          <div className="text-[8px] font-semibold text-black/30 uppercase tracking-wider px-1 mb-1">Preview</div>
          <div className="flex-1 border border-black/[0.06] rounded-lg bg-white p-2">
            <div className="w-full mx-auto max-w-[80%]">
              <div className="text-[8px] font-semibold mb-1">Frontend Skills Test</div>
              <div className="text-[7px] text-black/40 mb-2">Question 1 of 12</div>
              <div className="text-[7px] text-black/60 mb-1">What is the time complexity of binary search?</div>
              <div className="flex flex-col gap-0.5">
                <div className="text-[7px] text-black/40 px-1.5 py-0.5 rounded border border-black/10">O(n)</div>
                <div className="text-[7px] text-black/40 px-1.5 py-0.5 rounded border border-black/10">O(log n)</div>
                <div className="text-[7px] text-black/40 px-1.5 py-0.5 rounded border border-black/10">O(n log n)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardAfter() {
  return (
    <div className="w-full h-full flex flex-col text-[10px] leading-tight bg-white rounded-xl overflow-hidden border border-black/[0.08]">
      {/* Nav - simplified */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-black/[0.04] shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-black/80" />
            <span className="font-bold text-[10px]">OFM Jobs</span>
          </div>
          <div className="flex items-center gap-3 text-[9px]">
            <span className="font-semibold text-black/80 border-b border-black/80 pb-0.5">Tests</span>
            <span className="text-black/35">Candidates</span>
          </div>
        </div>
        <div className="w-5 h-5 rounded-full bg-black/10" />
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar — collapsible rail */}
        <div className="w-[25%] border-r border-black/[0.04] p-2 flex flex-col gap-0.5 shrink-0 overflow-hidden">
          <div className="text-[8px] font-semibold text-black/30 uppercase tracking-wider px-2 mb-1">Tests</div>
          {["Frontend Skills", "Backend Logic", "System Design", "Culture Fit", "AI/ML Quiz"].map(
            (name, i) => (
              <div
                key={name}
                className={`px-2 py-1.5 rounded-lg text-[9px] ${
                  i === 0
                    ? "bg-black/[0.04] font-semibold"
                    : "text-black/40"
                }`}
              >
                <div className="truncate">{name}</div>
              </div>
            )
          )}
        </div>

        {/* Main content — streamlined builder */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Inline toolbar */}
          <div className="px-3 py-2 border-b border-black/[0.04] shrink-0">
            <div className="flex items-center gap-3 text-[9px] text-black/50">
              <span><strong className="text-black/70">12</strong> questions</span>
              <span className="text-black/15">·</span>
              <span><strong className="text-black/70">60</strong> min</span>
              <span className="text-black/15">·</span>
              <span><strong className="text-black/70">100</strong> pts</span>
              <span className="text-black/15">·</span>
              <span className="text-[8px]">Draft</span>
            </div>
          </div>

          {/* Question editor — full width */}
          <div className="flex-1 p-3 flex flex-col gap-2 overflow-hidden">
            {/* Question 1 */}
            <div className="flex gap-2 items-start">
              <div className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-medium">Q1</span>
                  <span className="text-[7px] text-black/30 px-1 py-0.5 rounded bg-black/[0.03]">Multiple Choice</span>
                  <span className="text-[7px] text-black/30 ml-auto">10 pts</span>
                </div>
                <div className="text-[9px] text-black/70">What is the time complexity of binary search?</div>
                <div className="mt-1 flex flex-col gap-0.5 pl-2 border-l-[2.4px] border-black/[0.08]">
                  <div className="text-[8px] text-black/40">O(n)</div>
                  <div className="text-[8px] font-medium text-emerald-600">O(log n) ✓</div>
                  <div className="text-[8px] text-black/40">O(n log n)</div>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[7px] text-black/30">
                  <span>Partial credit: Off</span>
                  <span className="text-black/10">·</span>
                  <span>5 min limit</span>
                </div>
              </div>
            </div>

            {/* Question 2 */}
            <div className="flex gap-2 items-start">
              <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-medium">Q2</span>
                  <span className="text-[7px] text-black/30 px-1 py-0.5 rounded bg-black/[0.03]">Free Response</span>
                  <span className="text-[7px] text-black/30 ml-auto">20 pts</span>
                </div>
                <div className="text-[9px] text-black/70">Explain the difference between REST and GraphQL.</div>
                <div className="mt-1 text-[8px] text-black/30 pl-2 border-l-[2.4px] border-black/[0.08]">AI-evaluated · Rubric: clarity, depth, examples</div>
                <div className="mt-1 flex items-center gap-2 text-[7px] text-black/30">
                  <span>Partial credit: On</span>
                  <span className="text-black/10">·</span>
                  <span>10 min limit</span>
                </div>
              </div>
            </div>

            {/* Question 3 */}
            <div className="flex gap-2 items-start">
              <div className="w-1 h-1 rounded-full bg-purple-400 mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-medium">Q3</span>
                  <span className="text-[7px] text-black/30 px-1 py-0.5 rounded bg-black/[0.03]">Coding</span>
                  <span className="text-[7px] text-black/30 ml-auto">30 pts</span>
                </div>
                <div className="text-[9px] text-black/70">Implement a debounce function in JavaScript.</div>
                <div className="mt-1 text-[8px] text-black/30 pl-2 border-l-[2.4px] border-black/[0.08]">Auto-graded · 3 test cases</div>
              </div>
            </div>

            {/* Inline add question */}
            <div className="flex items-center gap-2 mt-1 pl-3">
              <div className="flex items-center gap-1 text-[8px] text-black/25">
                <span className="w-4 h-4 rounded-full border border-dashed border-black/15 flex items-center justify-center text-[10px]">+</span>
                <span className="flex gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-black/[0.03] hover:bg-black/[0.06]">MC</span>
                  <span className="px-1.5 py-0.5 rounded bg-black/[0.03] hover:bg-black/[0.06]">Free</span>
                  <span className="px-1.5 py-0.5 rounded bg-black/[0.03] hover:bg-black/[0.06]">Code</span>
                  <span className="px-1.5 py-0.5 rounded bg-black/[0.03] hover:bg-black/[0.06]">Video</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bottom bar — simplified */}
          <div className="p-2 shrink-0">
            <div className="rounded-xl border border-black/[0.08] bg-gray-50/50 p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[8px] text-black/30">
                  <span className="px-1.5 py-0.5 rounded bg-black/[0.04]">Preview</span>
                  <span className="px-1.5 py-0.5 rounded bg-black/[0.04]">Settings</span>
                </div>
                <div className="w-14 h-5 rounded-lg bg-black/80 flex items-center justify-center text-[8px] text-white">Publish</div>
              </div>
            </div>
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

export default function OFMJobsTestsPage() {
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
                  title: "Kanban and AI",
                  descriptor: "Hiring pipeline with AI-ranked candidates.",
                  href: "/kanban-and-ai",
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
