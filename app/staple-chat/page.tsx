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
    title: "Refining Staple Chat",
    content:
      "A design critique and refinement of the Staple Chat dashboard — the conversational AI interface for document analysis. This walkthrough covers what worked, what needed improvement, and how the interface evolved from a functional prototype to a polished product.",
    highlight: null,
  },
  {
    id: "nav-bar",
    type: "critique",
    title: "Navigation Bar",
    content:
      "The top navigation carries too much visual weight. Four tabs compete for attention alongside the logo, search, and profile. The active state is a heavy filled background that dominates the header. Users reported not knowing where they were in the app.",
    highlight: { top: 0, left: 0, width: 100, height: 10.5 },
  },
  {
    id: "sidebar",
    type: "critique",
    title: "Conversation Sidebar",
    content:
      "The sidebar lists conversations with inconsistent density. Each item shows a title, preview text, timestamp, and document count — too many competing signals. The selected state barely differs from the rest, making it hard to track your position.",
    highlight: { top: 10.5, left: 0, width: 30, height: 89.5 },
  },
  {
    id: "metrics",
    type: "critique",
    title: "Metrics Overload",
    content:
      "Four separate stat cards span the top of the content area. Each has its own border, background, icon, label, and value — creating a wall of competing boxes. Users glance at metrics, they don't study them. This layout demands study.",
    highlight: { top: 10.5, left: 30, width: 70, height: 17 },
  },
  {
    id: "chat-density",
    type: "critique",
    title: "Chat Message Density",
    content:
      "Messages have generous padding and large avatars, pushing conversation context off-screen. Users analyzing documents need to reference earlier messages frequently. Every extra scroll breaks their train of thought.",
    highlight: { top: 27.5, left: 30, width: 70, height: 32 },
  },
  {
    id: "ai-cards",
    type: "critique",
    title: "AI Response Cards",
    content:
      "Analysis results sit inside bordered cards with drop shadows — a card-in-card pattern that adds visual nesting without aiding comprehension. The borders compete with the content and create a cluttered, boxy feel.",
    highlight: { top: 59.5, left: 30, width: 70, height: 22 },
  },
  {
    id: "input-area",
    type: "critique",
    title: "Input Area",
    content:
      "The input field is undersized relative to its importance — it's the primary interaction point. Action buttons are scattered across the full width. The file attachment icon is small and easy to miss, despite being a core workflow.",
    highlight: { top: 81.5, left: 30, width: 70, height: 18.5 },
  },
  {
    id: "refinement-nav",
    type: "refinement",
    title: "Simplifying Navigation",
    content:
      "Reduced to two primary tabs with a subtle underline active state. Search moved into the content area where it's contextually relevant. The header now breathes — logo, tabs, and profile icon with generous spacing.",
    highlight: { top: 0, left: 0, width: 100, height: 10.5 },
  },
  {
    id: "refinement-metrics",
    type: "refinement",
    title: "Consolidating Metrics",
    content:
      "Four cards became a single inline metrics bar — values separated by dots with tiny inline sparklines. Same information, a fraction of the visual space. Users can glance and move on.",
    highlight: { top: 10.5, left: 30, width: 70, height: 11 },
  },
  {
    id: "refinement-chat",
    type: "refinement",
    title: "Tightening the Chat Flow",
    content:
      "Reduced message padding by 40% and replaced large avatars with small inline indicators. Added subtle time-based grouping. The result: 60% more conversation visible without scrolling.",
    highlight: { top: 21.5, left: 30, width: 70, height: 42 },
  },
  {
    id: "refinement-input",
    type: "refinement",
    title: "Elevating the Input",
    content:
      "The input field is now taller with a visible file-drop zone. Action buttons are grouped on the right. Placeholder text guides the interaction. It finally looks as important as it is.",
    highlight: { top: 82, left: 30, width: 70, height: 18 },
  },
  {
    id: "summary",
    type: "summary",
    title: "",
    content:
      "The refinements focused on density and hierarchy — reducing visual noise while preserving all functionality. Every pixel now earns its place. The result is an interface that lets the AI conversation take center stage, not the chrome around it.",
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
          <span className="font-bold text-[10px]">Staple</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="px-2 py-1 rounded bg-black/10 font-semibold text-[9px]">Chats</span>
          <span className="px-2 py-1 rounded text-black/40 text-[9px]">Documents</span>
          <span className="px-2 py-1 rounded text-black/40 text-[9px]">Analytics</span>
          <span className="px-2 py-1 rounded text-black/40 text-[9px]">Settings</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-5 rounded border border-black/10 bg-white" />
          <div className="w-5 h-5 rounded-full bg-black/10" />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className="w-[30%] border-r border-black/[0.06] p-2 flex flex-col gap-1 bg-gray-50/40 shrink-0 overflow-hidden">
          <div className="text-[8px] font-semibold text-black/30 uppercase tracking-wider px-1 mb-1">Recent</div>
          {["Q3 Revenue Analysis", "Invoice Batch #847", "Budget Forecast", "Sales Pipeline", "Marketing Report"].map(
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
                  {i === 0 ? "3 docs · 2m ago" : `${i + 1} docs · ${i}h ago`}
                </div>
              </div>
            )
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Metrics */}
          <div className="grid grid-cols-4 gap-1.5 p-2 border-b border-black/[0.06] shrink-0">
            {[
              { label: "Documents", value: "1,247", icon: "📄" },
              { label: "Queries", value: "89", icon: "💬" },
              { label: "Accuracy", value: "94%", icon: "✓" },
              { label: "Avg Time", value: "1.2s", icon: "⏱" },
            ].map((m) => (
              <div
                key={m.label}
                className="border border-black/[0.08] rounded-lg p-1.5 bg-white"
              >
                <div className="text-[8px] text-black/40">{m.icon} {m.label}</div>
                <div className="font-bold text-[12px] mt-0.5">{m.value}</div>
              </div>
            ))}
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-3 flex flex-col gap-3 overflow-hidden">
            {/* User message */}
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 shrink-0 flex items-center justify-center text-[8px]">U</div>
              <div className="bg-gray-50 rounded-xl px-3 py-2 max-w-[80%]">
                <div className="text-[9px]">Show me the key findings from the Q3 revenue report</div>
                <div className="text-[7px] text-black/25 mt-1">2:34 PM</div>
              </div>
            </div>

            {/* AI response with cards */}
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-black/80 shrink-0 flex items-center justify-center text-[8px] text-white">AI</div>
              <div className="flex flex-col gap-1.5 max-w-[85%]">
                <div className="bg-gray-50 rounded-xl px-3 py-2">
                  <div className="text-[9px]">Here are the key findings from the Q3 report:</div>
                </div>
                <div className="border border-black/10 rounded-lg p-2 shadow-sm bg-white">
                  <div className="text-[8px] font-semibold">📈 Revenue Growth</div>
                  <div className="text-[8px] text-black/50 mt-0.5">Revenue grew 23% YoY to $4.2M</div>
                </div>
                <div className="border border-black/10 rounded-lg p-2 shadow-sm bg-white">
                  <div className="text-[8px] font-semibold">⚠️ Risk Factor</div>
                  <div className="text-[8px] text-black/50 mt-0.5">Supply chain delays in APAC region</div>
                </div>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-black/[0.06] p-2 shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-7 rounded-lg border border-black/10 bg-white px-2 flex items-center">
                <span className="text-[8px] text-black/25">Type a message...</span>
              </div>
              <div className="w-6 h-6 rounded bg-black/[0.04] flex items-center justify-center text-[10px]">📎</div>
              <div className="w-6 h-6 rounded bg-black/80 flex items-center justify-center text-[10px] text-white">➤</div>
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
            <span className="font-bold text-[10px]">Staple</span>
          </div>
          <div className="flex items-center gap-3 text-[9px]">
            <span className="font-semibold text-black/80 border-b border-black/80 pb-0.5">Chats</span>
            <span className="text-black/35">Documents</span>
          </div>
        </div>
        <div className="w-5 h-5 rounded-full bg-black/10" />
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar - cleaner */}
        <div className="w-[30%] border-r border-black/[0.04] p-2 flex flex-col gap-0.5 shrink-0 overflow-hidden">
          <div className="text-[8px] font-semibold text-black/30 uppercase tracking-wider px-2 mb-1">Recent</div>
          {["Q3 Revenue Analysis", "Invoice Batch #847", "Budget Forecast", "Sales Pipeline", "Marketing Report"].map(
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

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Metrics - consolidated bar */}
          <div className="px-3 py-2 border-b border-black/[0.04] shrink-0">
            <div className="flex items-center gap-3 text-[9px] text-black/50">
              <span><strong className="text-black/70">1,247</strong> docs</span>
              <span className="text-black/15">·</span>
              <span><strong className="text-black/70">89</strong> queries</span>
              <span className="text-black/15">·</span>
              <span><strong className="text-black/70">94%</strong> accuracy</span>
              <span className="text-black/15">·</span>
              <span className="text-[8px]">▲ 12%</span>
            </div>
          </div>

          {/* Chat messages - tighter */}
          <div className="flex-1 p-3 flex flex-col gap-2 overflow-hidden">
            {/* User message */}
            <div className="flex gap-2 items-start">
              <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />
              <div>
                <div className="text-[9px]">Show me the key findings from the Q3 revenue report</div>
              </div>
            </div>

            {/* AI response - no cards */}
            <div className="flex gap-2 items-start">
              <div className="w-1 h-1 rounded-full bg-black/60 mt-1.5 shrink-0" />
              <div className="flex flex-col gap-1">
                <div className="text-[9px] text-black/70">Here are the key findings from the Q3 report:</div>
                <div className="text-[9px] pl-2 border-l-[2.4px] border-black/[0.08]">
                  <div className="font-medium">Revenue grew 23% YoY to $4.2M</div>
                  <div className="text-black/40 mt-0.5">Driven by enterprise segment expansion</div>
                </div>
                <div className="text-[9px] pl-2 border-l-[2.4px] border-amber-300/40">
                  <div className="font-medium">Risk: Supply chain delays</div>
                  <div className="text-black/40 mt-0.5">APAC region — 2 week average delay</div>
                </div>
                <div className="text-[9px] pl-2 border-l-[2.4px] border-black/[0.08]">
                  <div className="font-medium">Net retention at 118%</div>
                  <div className="text-black/40 mt-0.5">Up from 112% in Q2</div>
                </div>
              </div>
            </div>

            {/* Second exchange - tighter */}
            <div className="flex gap-2 items-start mt-1">
              <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />
              <div className="text-[9px]">Break down the APAC risk by sub-region</div>
            </div>
            <div className="flex gap-2 items-start">
              <div className="w-1 h-1 rounded-full bg-black/60 mt-1.5 shrink-0" />
              <div className="text-[9px] text-black/70">
                <div>Southeast Asia accounts for 68% of the delay...</div>
              </div>
            </div>
          </div>

          {/* Input - elevated */}
          <div className="p-2 shrink-0">
            <div className="rounded-xl border border-black/[0.08] bg-gray-50/50 p-2">
              <div className="h-6 flex items-center">
                <span className="text-[9px] text-black/25">Ask about your documents...</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-1.5 text-[8px] text-black/30">
                  <span className="px-1.5 py-0.5 rounded bg-black/[0.04]">📎 Attach</span>
                </div>
                <div className="w-6 h-5 rounded-lg bg-black/80 flex items-center justify-center text-[9px] text-white">➤</div>
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

export default function StapleChatPage() {
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
                  title: "Staple Tables",
                  descriptor: "Structured data extraction from documents.",
                  href: "/staple-tables",
                },
                {
                  title: "Kanban and AI",
                  descriptor: "Hiring pipeline with AI-ranked candidates.",
                  href: "/kanban-and-ai",
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
