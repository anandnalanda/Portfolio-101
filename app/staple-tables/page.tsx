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
    title: "Refining Staple Tables",
    content:
      "A design critique and refinement of the Staple Tables interface — the structured data extraction view for documents. This walkthrough covers how the table layout, filtering controls, and export actions evolved from a dense prototype to a cleaner, more scannable product.",
    highlight: null,
  },
  {
    id: "table-header-density",
    type: "critique",
    title: "Table Header Density",
    content:
      "The header row packs too much into a tight space. Column labels, sort arrows, resize handles, and type badges all compete within each cell. The heavy bottom border and dark background make the header feel like a wall separating the toolbar from the data below.",
    highlight: { top: 18, left: 24, width: 76, height: 9 },
  },
  {
    id: "column-layout",
    type: "critique",
    title: "Column Layout",
    content:
      "Five columns are distributed evenly regardless of content width. The Document column — often the longest value — gets the same space as Status, which holds a single badge. This wastes horizontal real estate and forces truncation where it hurts most.",
    highlight: { top: 27, left: 24, width: 76, height: 48 },
  },
  {
    id: "row-spacing",
    type: "critique",
    title: "Row Spacing",
    content:
      "Each row has generous vertical padding and a full-width divider. Combined with the large checkbox and document icon per row, only six or seven records fit on screen. Users extracting data from dozens of documents spend more time scrolling than scanning.",
    highlight: { top: 27, left: 24, width: 76, height: 48 },
  },
  {
    id: "filter-controls",
    type: "critique",
    title: "Filter Controls",
    content:
      "The filter bar stretches across the full content width with four separate dropdowns, a date picker, and a search field — all rendered at full size simultaneously. Most users only filter by one or two dimensions, yet the controls permanently occupy valuable vertical space.",
    highlight: { top: 10, left: 24, width: 76, height: 8 },
  },
  {
    id: "data-type-indicators",
    type: "critique",
    title: "Data Type Indicators",
    content:
      "Each cell shows a tiny type icon (text, number, date, currency) alongside the value. While informative, these icons create visual noise at scale — fifty cells means fifty small icons competing with the actual data. The type information is useful on hover, not at rest.",
    highlight: { top: 27, left: 24, width: 76, height: 48 },
  },
  {
    id: "export-actions",
    type: "critique",
    title: "Export Actions",
    content:
      "Export options are scattered: a download button in the toolbar, a share icon in the header, and a context-menu export on each row. Three paths to the same action with inconsistent formatting. Users hesitate, unsure which export gives them what they need.",
    highlight: { top: 80, left: 24, width: 76, height: 20 },
  },
  {
    id: "refinement-headers",
    type: "refinement",
    title: "Streamlining Headers",
    content:
      "Reduced the header to clean text labels with a subtle underline on the sorted column. Type badges moved to a tooltip on hover. The header now reads as a quiet guide rather than a competing data row.",
    highlight: { top: 17, left: 24, width: 76, height: 8 },
  },
  {
    id: "refinement-density",
    type: "refinement",
    title: "Optimizing Row Density",
    content:
      "Cut row padding by 35% and replaced full-width dividers with hairline separators. Removed per-row icons, relying on the column header for context. The result: twelve or more records visible without scrolling — nearly double the original.",
    highlight: { top: 25, left: 24, width: 76, height: 52 },
  },
  {
    id: "refinement-filters",
    type: "refinement",
    title: "Simplifying Filters",
    content:
      "Four dropdowns collapsed into a single unified search bar with inline filter chips. Users type naturally and the interface suggests filters. The bar expands only when focused, reclaiming vertical space when idle.",
    highlight: { top: 10, left: 24, width: 76, height: 7 },
  },
  {
    id: "refinement-export",
    type: "refinement",
    title: "Cleaner Export Flow",
    content:
      "All export options consolidated into one clearly labeled button at the top right. Clicking it opens a dropdown with format choices (CSV, Excel, PDF) and a row-count summary. One path, zero ambiguity.",
    highlight: { top: 80, left: 24, width: 76, height: 20 },
  },
  {
    id: "summary",
    type: "summary",
    title: "",
    content:
      "The refinements targeted density and clarity — making every row, header, and control earn its visual weight. Filters became conversational, exports became singular, and the table itself became the hero. The interface now lets users focus on the data, not the chrome around it.",
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
          <span className="px-2 py-1 rounded text-black/40 text-[9px]">Chats</span>
          <span className="px-2 py-1 rounded bg-black/10 font-semibold text-[9px]">Tables</span>
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
        <div className="w-[24%] border-r border-black/[0.06] p-2 flex flex-col gap-1 bg-gray-50/40 shrink-0 overflow-hidden">
          <div className="text-[8px] font-semibold text-black/30 uppercase tracking-wider px-1 mb-1">Documents</div>
          {["Q3 Revenue Report", "Invoice Batch #412", "Vendor Contracts", "Tax Filing 2024", "Payroll Summary"].map(
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
                  {i === 0 ? "24 rows · 2m ago" : `${(i + 1) * 8} rows · ${i}h ago`}
                </div>
              </div>
            )
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Filter bar */}
          <div className="flex items-center gap-1.5 p-2 border-b border-black/[0.06] shrink-0">
            <div className="h-5 px-2 rounded border border-black/10 bg-white flex items-center">
              <span className="text-[8px] text-black/30">Type ▾</span>
            </div>
            <div className="h-5 px-2 rounded border border-black/10 bg-white flex items-center">
              <span className="text-[8px] text-black/30">Status ▾</span>
            </div>
            <div className="h-5 px-2 rounded border border-black/10 bg-white flex items-center">
              <span className="text-[8px] text-black/30">Date ▾</span>
            </div>
            <div className="h-5 px-2 rounded border border-black/10 bg-white flex items-center">
              <span className="text-[8px] text-black/30">Pages ▾</span>
            </div>
            <div className="flex-1 h-5 rounded border border-black/10 bg-white px-2 flex items-center">
              <span className="text-[8px] text-black/25">Search rows...</span>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-5 gap-0 border-b-2 border-black/10 bg-gray-50 shrink-0">
              {["Document", "Type", "Pages", "Extracted", "Status"].map((col) => (
                <div key={col} className="px-2 py-1.5 text-[8px] font-bold text-black/60 uppercase tracking-wider flex items-center gap-1">
                  <span>{col}</span>
                  <span className="text-[7px] text-black/20">↕</span>
                </div>
              ))}
            </div>

            {/* Table rows */}
            {[
              { doc: "Q3 Revenue Report", type: "📄 PDF", pages: "12", extracted: "89 fields", status: "Complete" },
              { doc: "Invoice Batch #412", type: "📊 XLSX", pages: "3", extracted: "24 fields", status: "Complete" },
              { doc: "Vendor Contracts", type: "📄 PDF", pages: "47", extracted: "156 fields", status: "In Progress" },
              { doc: "Tax Filing 2024", type: "📋 DOC", pages: "8", extracted: "41 fields", status: "Pending" },
              { doc: "Payroll Summary", type: "📊 XLSX", pages: "5", extracted: "62 fields", status: "Complete" },
              { doc: "Board Deck Q3", type: "📄 PDF", pages: "22", extracted: "—", status: "Queued" },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-5 gap-0 border-b border-black/[0.06]">
                <div className="px-2 py-2 text-[9px] flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded border border-black/10 shrink-0" />
                  <span className="truncate font-medium">{row.doc}</span>
                </div>
                <div className="px-2 py-2 text-[9px] text-black/50">{row.type}</div>
                <div className="px-2 py-2 text-[9px] text-black/50">{row.pages}</div>
                <div className="px-2 py-2 text-[9px] text-black/50">{row.extracted}</div>
                <div className="px-2 py-2 text-[9px]">
                  <span className={`px-1.5 py-0.5 rounded text-[7px] font-semibold ${
                    row.status === "Complete" ? "bg-green-100 text-green-700" :
                    row.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                    row.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-500"
                  }`}>{row.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Export bar */}
          <div className="border-t border-black/[0.06] p-2 shrink-0 flex items-center justify-between">
            <div className="text-[8px] text-black/30">6 documents · 97 pages total</div>
            <div className="flex items-center gap-1.5">
              <div className="h-5 px-2 rounded border border-black/10 bg-white flex items-center">
                <span className="text-[8px] text-black/40">↗ Share</span>
              </div>
              <div className="h-5 px-2 rounded bg-black/80 flex items-center">
                <span className="text-[8px] text-white font-medium">⬇ Download</span>
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
            <span className="font-bold text-[10px]">Staple</span>
          </div>
          <div className="flex items-center gap-3 text-[9px]">
            <span className="text-black/35">Chats</span>
            <span className="font-semibold text-black/80 border-b border-black/80 pb-0.5">Tables</span>
          </div>
        </div>
        <div className="w-5 h-5 rounded-full bg-black/10" />
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar - cleaner */}
        <div className="w-[24%] border-r border-black/[0.04] p-2 flex flex-col gap-0.5 shrink-0 overflow-hidden">
          <div className="text-[8px] font-semibold text-black/30 uppercase tracking-wider px-2 mb-1">Documents</div>
          {["Q3 Revenue Report", "Invoice Batch #412", "Vendor Contracts", "Tax Filing 2024", "Payroll Summary"].map(
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
          {/* Unified search/filter bar */}
          <div className="px-3 py-2 border-b border-black/[0.04] shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-6 rounded-lg border border-black/[0.06] bg-gray-50/50 px-2 flex items-center gap-1.5">
                <span className="text-[8px] text-black/25">Filter or search...</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded-md bg-black/[0.04] text-[8px] text-black/50">PDF</span>
                <span className="px-1.5 py-0.5 rounded-md bg-black/[0.04] text-[8px] text-black/50">Complete</span>
              </div>
            </div>
          </div>

          {/* Table - cleaner */}
          <div className="flex-1 overflow-hidden">
            {/* Table header - simplified */}
            <div className="grid grid-cols-[2fr_0.8fr_0.6fr_1fr_0.8fr] gap-0 border-b border-black/[0.04] shrink-0">
              {["Document", "Type", "Pages", "Extracted", "Status"].map((col, i) => (
                <div key={col} className="px-3 py-1.5 text-[8px] font-semibold text-black/40 tracking-wider flex items-center">
                  <span>{col}</span>
                  {i === 0 && <span className="ml-1 text-[7px] text-black/20">↓</span>}
                </div>
              ))}
            </div>

            {/* Table rows - tighter */}
            {[
              { doc: "Q3 Revenue Report", type: "PDF", pages: "12", extracted: "89 fields", status: "Complete" },
              { doc: "Invoice Batch #412", type: "XLSX", pages: "3", extracted: "24 fields", status: "Complete" },
              { doc: "Vendor Contracts", type: "PDF", pages: "47", extracted: "156 fields", status: "In Progress" },
              { doc: "Tax Filing 2024", type: "DOC", pages: "8", extracted: "41 fields", status: "Pending" },
              { doc: "Payroll Summary", type: "XLSX", pages: "5", extracted: "62 fields", status: "Complete" },
              { doc: "Board Deck Q3", type: "PDF", pages: "22", extracted: "—", status: "Queued" },
              { doc: "Lease Agreement", type: "PDF", pages: "15", extracted: "73 fields", status: "Complete" },
              { doc: "Benefits Enrollment", type: "DOC", pages: "6", extracted: "28 fields", status: "Complete" },
              { doc: "Audit Trail Q2", type: "PDF", pages: "31", extracted: "112 fields", status: "Complete" },
              { doc: "Insurance Policy", type: "PDF", pages: "9", extracted: "36 fields", status: "In Progress" },
              { doc: "NDA — Acme Corp", type: "PDF", pages: "4", extracted: "18 fields", status: "Complete" },
              { doc: "Travel Expense Oct", type: "XLSX", pages: "2", extracted: "15 fields", status: "Complete" },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-[2fr_0.8fr_0.6fr_1fr_0.8fr] gap-0 border-b border-black/[0.02]">
                <div className="px-3 py-[5px] text-[9px] truncate font-medium text-black/80">{row.doc}</div>
                <div className="px-3 py-[5px] text-[9px] text-black/40">{row.type}</div>
                <div className="px-3 py-[5px] text-[9px] text-black/40">{row.pages}</div>
                <div className="px-3 py-[5px] text-[9px] text-black/40">{row.extracted}</div>
                <div className="px-3 py-[5px] text-[9px]">
                  <span className={`text-[8px] font-medium ${
                    row.status === "Complete" ? "text-green-600/70" :
                    row.status === "In Progress" ? "text-blue-600/70" :
                    row.status === "Pending" ? "text-amber-600/70" :
                    "text-black/30"
                  }`}>{row.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Export - consolidated */}
          <div className="p-2 shrink-0">
            <div className="flex items-center justify-between">
              <div className="text-[8px] text-black/25">12 documents · 164 pages</div>
              <div className="h-6 px-3 rounded-lg bg-black/80 flex items-center">
                <span className="text-[8px] text-white font-medium">Export ▾</span>
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

export default function StapleTablesPage() {
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
