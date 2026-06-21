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

type SectionType = "intro" | "critique" | "refinement" | "summary" | "story" | "product" | "closing";

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
    title: "Staple Tables",
    content:
      "From manual data correction chaos to AI-powered interactive mapping workflows.",
    highlight: null,
  },
  {
    id: "challenge",
    type: "story",
    title: "10,000 documents a month.",
    content:
      "150+ daily users processing thousands of documents, with usage analytics revealing extraction workflows riddled with failure points. Users abandoned complex extraction tasks after 3 failed attempts — a 73% abandonment rate.",
    highlight: null,
  },
  {
    id: "research",
    type: "story",
    title: "The research.",
    content:
      "Task observation sessions documenting current workflows and competitive research evaluating Google Vision, Nanonets, and 8 enterprise alternatives. Key finding: 97% accuracy is achievable when AI understands header structure and business context.",
    highlight: null,
  },
  {
    id: "insight",
    type: "story",
    title: "Visual feedback changes everything.",
    content:
      "Real-time guidance reduces user uncertainty by 60%. The gap wasn't in AI capability — it was in how users interacted with and corrected extraction results.",
    highlight: null,
  },
  {
    id: "extracted-fields",
    type: "product",
    title: "Optimizing extracted fields.",
    content:
      "An iterative design process emphasizing user feedback and technical collaboration. Colors chosen to be differentiable by color-blind users, validated through competitive research across Google Vision, Nanonets, and similar tools.",
    highlight: null,
  },
  {
    id: "table-structure",
    type: "product",
    title: "Clarity in the table.",
    content:
      "Transformed the table structure for exceptional clarity and intuitive organization, empowering users to effortlessly interpret and utilize extracted data.",
    highlight: null,
  },
  {
    id: "ai-extraction",
    type: "product",
    title: "Interactive AI-powered extraction.",
    content:
      "The core innovation transforms table extraction from a black-box process into an interactive, visual workflow where enterprise users maintain control while benefiting from AI assistance.",
    highlight: null,
  },
  {
    id: "detection",
    type: "product",
    title: "AI visual table detection.",
    content:
      "Intelligent identification and highlighting of table boundaries with confidence scoring. Users select and map column headers directly with business context awareness.",
    highlight: null,
  },
  {
    id: "field-mapping",
    type: "product",
    title: "Smart field mapping.",
    content:
      "Drag-and-drop assignment of data fields with AI-powered suggestions and validation. Real-time population preview with instant accuracy indicators on extracted line items.",
    highlight: null,
  },
  {
    id: "impact",
    type: "closing",
    title: "The numbers.",
    content:
      "50% reduction in time spent correcting extraction errors. 30-40% improvement in overall extraction accuracy reducing downstream operational costs. 3x faster document processing workflows.",
    highlight: null,
  },
  {
    id: "support",
    type: "closing",
    title: "73% fewer support tickets.",
    content:
      "IT support tickets related to table extraction and document processing dropped by 73%, enabling accelerated business decision-making across the organization.",
    highlight: null,
  },
  {
    id: "testimonial",
    type: "closing",
    title: "From the users.",
    content:
      "\"The new table extraction feels like magic for our finance team. What used to take our analysts 20 minutes per invoice now takes 3 minutes with higher accuracy.\"",
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
                (section.type === "story" && prev?.type !== "story") ||
                (section.type === "product" && prev?.type !== "product") ||
                (section.type === "closing" && prev?.type !== "closing");
              const groupLabel =
                section.type === "story"
                  ? "The Story"
                  : section.type === "product"
                  ? "The Product"
                  : section.type === "closing"
                  ? "Reflection"
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
                        : section.id === "testimonial"
                        ? "sm"
                        : "md"
                    }
                    onActive={handleActive}
                  >
                    {section.content}
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
