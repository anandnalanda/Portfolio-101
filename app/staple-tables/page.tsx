"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Spectral } from "next/font/google";
import { StapleWordmark } from "../staple-chat/StapleWordmark";
import ScaleVisual from "./ScaleVisual";
import ResearchVisual from "./ResearchVisual";
import PrinciplesVisual from "./PrinciplesVisual";
import OutcomeVisual from "./OutcomeVisual";
import ScaledCanvas from "@/components/screens/_ui/ScaledCanvas";
import StapleTablesScreen, {
  type Variant,
} from "@/components/screens/staple-tables/StapleTablesScreen";

/* Staple brand color — the deep teal from the logo. */
const BRAND = "#003B4A";

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
});

/* ------------------------------------------------------------------ */
/*  Section data                                                       */
/* ------------------------------------------------------------------ */

type SectionType = "intro" | "story" | "research" | "product" | "closing";

interface Section {
  id: string;
  type: SectionType;
  title: string;
  content: string;
  /** Optional scannable points rendered as a bullet list under the lead. */
  bullets?: string[];
  highlight: {
    top: number;
    left: number;
    width: number;
    height: number;
  } | null;
}

/* Case-study meta, shown as a small header row under the opening title. */
const META = [
  { label: "Client", value: "StapleAI" },
  { label: "Role", value: "Lead Designer" },
  { label: "Year", value: "2024" },
];

const sections: Section[] = [
  {
    id: "open",
    type: "intro",
    title: "Staple Tables",
    content: `Staple Tables pulls structured data out of documents like invoices. The extraction itself worked. The problem was everything after it: reading the result and correcting it. As lead designer, I rebuilt the two surfaces where that happens, the extracted fields and the extracted table.`,
    highlight: null,
  },

  /* ---- The Problem: the "before" state, one beat per broken surface ---- */
  {
    id: "scale",
    type: "story",
    title: "Ten thousand documents a month.",
    content: `This was not a demo. Staple Tables sat inside real operational volume, and every one of those documents ended at a human review screen.`,
    bullets: [
      `150+ daily users processing 10,000+ documents a month.`,
      `Invoices, receipts, and operational reports, all funnelling into the same review step.`,
      `At that scale, every extra second on the review screen multiplies into days.`,
    ],
    highlight: null,
  },
  {
    id: "problem-fields",
    type: "story",
    title: "The fields were a flat wall.",
    content: `The extracted fields came back as one long list where nothing stood out. Finding the number that mattered meant reading every row.`,
    bullets: [
      `Poor visual hierarchy: every field carried the same weight.`,
      `No validation cues: you could not see which fields had been mapped.`,
      `Limited context: no sense of what to do next, approve, edit, or move on.`,
    ],
    highlight: null,
  },
  {
    id: "problem-table",
    type: "story",
    title: "The table fought the reader.",
    content: `The extracted line-item table was worse. It was dense and flat, and gave the eye nothing to hold on to.`,
    bullets: [
      `No hierarchy: nothing separated important data from the rest.`,
      `Cramped layout: minimal padding made it hard to scan across a row.`,
      `No colour: everything read at the same importance.`,
    ],
    highlight: null,
  },
  {
    id: "problem-toolbar",
    type: "story",
    title: "The toolbar tried to be everything.",
    content: `The top bar crammed the whole product into one row, and still left power users stuck.`,
    bullets: [
      `Complete, Reject, Label, zoom, and Export sat as equal-weight buttons, next to the search, notifications, and your profile.`,
      `The one action that actually mattered, the review decision, was lost in the crowd.`,
      `And you could only see one document at a time. To reach the next, you went back and opened it again. No quick jump for power users.`,
    ],
    highlight: null,
  },
  /* ---- Discovery: evidence before pixels ---- */
  {
    id: "research-methods",
    type: "research",
    title: "Three ways into the problem.",
    content: `I grounded the redesign in evidence rather than taste.`,
    bullets: [
      `Usage analytics across 150+ daily users and 10,000+ monthly documents.`,
      `Task observation sessions documenting the real extraction workflow and where it failed.`,
      `A competitive teardown of Google Vision, Nanonets, and three enterprise alternatives.`,
    ],
    highlight: null,
  },
  {
    id: "principles",
    type: "research",
    title: "Three rules for the redesign.",
    content: `Every change that follows, on both surfaces, obeys one of three rules.`,
    bullets: [
      `Hierarchy first: the important number should find you, not the other way around.`,
      `Colour with meaning: categories you can see, chosen to work for colour-blind users too.`,
      `Room to breathe: white space as a scanning tool, not decoration.`,
    ],
    highlight: null,
  },

  /* ---- The Redesign: Feature 1 (fields), broken into moves ---- */
  {
    id: "fields-groups",
    type: "product",
    title: "Feature 1: Structure for the fields.",
    content: `I rebuilt the extracted-fields panel around structure, colour, and space. Instead of one flat list, related fields now sit in logical groups, each with a coloured indicator, in a layout with room to breathe.`,
    bullets: [
      `Grouped related fields together, with coloured bars categorising each type at a glance.`,
      `A palette benchmarked to stay distinguishable for colour-blind users.`,
      `Generous spacing so the data has a clear shape and any field is quick to scan and locate.`,
    ],
    highlight: null,
  },
  {
    id: "fields-locate",
    type: "product",
    title: "Feature 2: See where each value came from.",
    content: `Extraction is only trustworthy if you can check it. Click any field and its exact source is highlighted on the document with a bounding box, so a reviewer can see where the value was read from and correct it in place.`,
    bullets: [
      `Click a field to locate and box its source text on the page.`,
      `Wrong or missing? Edit the value, or re-key it, right on the spot.`,
      `Verify at a glance instead of hunting through the document.`,
    ],
    highlight: null,
  },

  /* ---- The Redesign: Feature 2 (table), broken into moves ---- */
  {
    id: "table-grid",
    type: "product",
    title: "Feature 3: A grid you can read.",
    content: `The line-item table got the same treatment, rebuilt around clarity. Open it and the document steps aside, so the extracted rows sit right below the source they came from.`,
    bullets: [
      `A clean, modern grid with aligned columns, and subtle zebra striping to keep the eye on the right line across a wide row.`,
      `It mirrors the source document, so you can reconcile the extraction row against row.`,
    ],
    highlight: null,
  },
  {
    id: "table-headers",
    type: "product",
    title: "Headers you can remap.",
    content: `The columns read in plain language, but the real point is what happens when the extractor guesses one wrong.`,
    bullets: [
      `Every header is a dropdown: if a column lands under the wrong field, remap it in one click, no re-running the model.`,
      `Plain words over raw keys, so a non-technical reviewer can verify an extraction at a glance, and fix it without help.`,
    ],
    highlight: null,
  },
  {
    id: "toolbar-fix",
    type: "product",
    title: "Feature 4: A toolbar that knows its place.",
    content: `I split the toolbar by altitude, and gave power users a way through.`,
    bullets: [
      `The document's actions drop into a floating bar over the page, with Complete as the clear primary.`,
      `The top bar keeps only global chrome: a universal search, notifications, and your profile.`,
      `That search doubles as the quick jump: open any document without going back first.`,
    ],
    highlight: null,
  },

  {
    id: "doc-switch",
    type: "product",
    title: "Feature 5: Jump between documents.",
    content: `Reviewing a batch meant going Back to the list and hunting for the next file every time. I put the whole queue right beside the document.`,
    bullets: [
      `A thumbnail rail down the left shows every document in the batch, the current one highlighted.`,
      `Click any page to jump straight to it, no trip back through the list.`,
    ],
    highlight: null,
  },

  /* ---- The Outcome ---- */
  {
    id: "results",
    type: "closing",
    title: "The results.",
    content: `The review step went from a chore to a glance, and the win carried past the review screen into organisation-level numbers.`,
    bullets: [
      `50% less time spent correcting extraction errors.`,
      `30 to 40% higher extraction accuracy.`,
      `3x faster document-processing workflows.`,
      `73% fewer IT support tickets tied to table extraction.`,
      `Handles more diverse document types, viable across industries.`,
    ],
    highlight: null,
  },
  {
    id: "testimonials",
    type: "closing",
    title: "In their words.",
    content: `The teams felt it before the dashboards did.`,
    bullets: [
      `"I can see exactly where every value was read from now, so approving an extraction is a glance instead of a hunt through the page."`,
      `"The line items finally read like a spreadsheet, and when a column lands wrong I just remap the header. No re-running anything."`,
      `"The whole batch sits right beside the document. I move down the queue instead of bouncing back to a list every time."`,
    ],
    highlight: null,
  },
];

const ease = [0.22, 1, 0.36, 1];

/* Beats that render the live extraction workspace, and the state it shows.
   (More beats plug in here as we design them.) */
type Region = "fields" | "table" | "toolbar" | "review" | "rail" | null;
const WORKSPACE_BEATS: Record<
  string,
  { fields: Variant; toolbar: Variant; table: Variant | null; highlight: Region }
> = {
  /* The problem beats: the old screen, spotlighting each broken surface. */
  "problem-fields": { fields: "before", toolbar: "before", table: null, highlight: "fields" },
  "problem-table": { fields: "before", toolbar: "before", table: "before", highlight: "table" },
  "problem-toolbar": { fields: "before", toolbar: "before", table: null, highlight: "toolbar" },
  /* Feature 1 — the redesigned fields. Only the fields panel changes here; the
     toolbar stays in its current (pre-redesign) state, actions in the top bar.
     The toolbar itself is redesigned later, in Feature 3. */
  "fields-groups": { fields: "after", toolbar: "before", table: null, highlight: "fields" },
  "fields-locate": { fields: "after", toolbar: "before", table: null, highlight: "fields" },
  /* Feature 3 — the redesigned line-item table. Same layout as Features 1–2
     (fields docked right, current toolbar); the sheet docks over the document. */
  "table-grid": { fields: "after", toolbar: "before", table: "after", highlight: "table" },
  "table-headers": { fields: "after", toolbar: "before", table: "after", highlight: "table" },
  /* Feature 3 — the redesigned toolbar. */
  "toolbar-fix": { fields: "after", toolbar: "after", table: null, highlight: "toolbar" },
  /* Feature 5 — the document thumbnail rail for quick switching. */
  "doc-switch": { fields: "after", toolbar: "after", table: null, highlight: "rail" },
};

/* What the right-hand panel shows for each beat: which product surface, and
   what the highlight focuses on. The real Staple Tables screens (extraction
   workspace + fields panel + line-item table) slot into these states; until
   then the panel previews the plan so every beat drives a distinct right side. */
/* Group label shown above the first section of each type (mirrors the Staple
   Chat case study's "The Story / The Decisions / The Outcome" rhythm). */
function groupLabelFor(type: SectionType): string | null {
  return type === "story"
    ? "The Problem"
    : type === "research"
    ? "Discovery"
    : type === "product"
    ? "The Redesign"
    : type === "closing"
    ? "The Outcome"
    : null;
}

/* ------------------------------------------------------------------ */
/*  NarrativeSection component                                         */
/* ------------------------------------------------------------------ */

interface NarrativeSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  /** Scannable points shown as a bullet list beneath the lead paragraph. */
  bullets?: string[];
  titleSize?: "lg" | "md" | "sm";
  /** Render the title in the Spectral serif (used for the opening title). */
  serif?: boolean;
  /** Selected/highlighted state, controlled by the page-level scroll-spy. */
  active?: boolean;
  /** Jump-to: click the section to scroll it into the active position. */
  onNavigate?: () => void;
  /** Small meta rows (Client / Year) shown under the opening title. */
  meta?: { label: string; value: string }[];
}

function NarrativeSection({
  id,
  title,
  children,
  bullets,
  titleSize = "md",
  serif = false,
  active = false,
  onNavigate,
  meta,
}: NarrativeSectionProps) {
  const titleClass =
    titleSize === "lg"
      ? "text-[28px] tracking-[-0.02em] leading-tight"
      : titleSize === "sm"
      ? "text-[22px] tracking-[-0.01em]"
      : "text-[18px]";

  const handleCardClick = () => {
    if (window.getSelection()?.toString()) return;
    onNavigate?.();
  };

  return (
    <div data-section={id} className="mb-6">
      <div
        onClick={onNavigate ? handleCardClick : undefined}
        className={`group py-4 px-4 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] border-l-[2.4px] ${
          onNavigate ? "cursor-pointer" : ""
        } ${
          active
            ? "border-l-txt-secondary bg-surface-muted opacity-100"
            : `border-l-transparent opacity-[0.75] ${
                onNavigate ? "hover:opacity-100 hover:bg-black/[0.02]" : ""
              }`
        }`}
      >
        <h2
          className={`mb-2 text-txt-heading ${titleClass} ${
            serif ? `${spectral.className} font-normal` : "font-semibold"
          }`}
        >
          {onNavigate ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate();
              }}
              className="text-left transition-colors hover:text-txt-primary focus-visible:outline-none focus-visible:underline"
            >
              {title}
            </button>
          ) : (
            title
          )}
        </h2>
        {meta && (
          <div className="mb-3 flex gap-8">
            {meta.map((m) => (
              <div key={m.label}>
                <div className="text-[11px] uppercase tracking-[0.1em] text-txt-secondary">
                  {m.label}
                </div>
                <div className="text-[14px] font-medium text-txt-heading">{m.value}</div>
              </div>
            ))}
          </div>
        )}
        <div className="text-[15px] leading-[1.7] text-txt-primary">
          {children && <p>{children}</p>}
          {bullets && bullets.length > 0 && (
            <ul
              className={`${
                children ? "mt-2.5" : ""
              } list-disc space-y-1.5 pl-[18px] marker:text-txt-secondary`}
            >
              {bullets.map((b, i) => (
                <li key={i} className="pl-1">
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function StapleTablesPage() {
  const [activeId, setActiveId] = useState(sections[0].id);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 200;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
  };

  // Scroll-spy: the last section whose top has crossed a fixed line near the
  // top of the viewport is the active beat. Coalesced to one layout read per
  // frame so scrolling never thrashes layout.
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      let current = sections[0].id;
      for (const s of sections) {
        const el = sectionRefs.current[s.id];
        if (el && el.getBoundingClientRect().top <= 220) current = s.id;
      }
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 120
      ) {
        current = sections[sections.length - 1].id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const activeSection =
    sections.find((s) => s.id === activeId) ?? sections[0];

  // Keep the outgoing beat's visual mounted while its wrapper fades out, so
  // beat changes actually crossfade instead of hard-cutting to an empty layer.
  const [fadingId, setFadingId] = useState<string | null>(null);
  const prevIdRef = useRef(activeId);
  useEffect(() => {
    if (prevIdRef.current === activeId) return;
    setFadingId(prevIdRef.current);
    prevIdRef.current = activeId;
    const t = setTimeout(() => setFadingId(null), 600);
    return () => clearTimeout(t);
  }, [activeId]);

  const workspaceId = WORKSPACE_BEATS[activeSection.id]
    ? activeSection.id
    : fadingId && WORKSPACE_BEATS[fadingId]
      ? fadingId
      : null;
  const outcomeId = ["results", "testimonials"].includes(activeSection.id)
    ? activeSection.id
    : fadingId && ["results", "testimonials"].includes(fadingId)
      ? fadingId
      : null;

  const renderSections = () =>
    sections.map((section, i) => {
      const prev = i > 0 ? sections[i - 1] : null;
      const showGroupHeading =
        section.type !== "intro" && section.type !== prev?.type;
      const groupLabel = groupLabelFor(section.type);
      return (
        <div
          key={section.id}
          ref={(el) => {
            sectionRefs.current[section.id] = el;
          }}
        >
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
            bullets={section.bullets}
            meta={section.id === "open" ? META : undefined}
            serif={section.id === "open"}
            active={section.id === activeId}
            onNavigate={() => scrollToSection(section.id)}
            titleSize={section.id === "open" ? "lg" : "md"}
          >
            {section.content}
          </NarrativeSection>
        </div>
      );
    });

  const ContinueReading = () => (
    <div className="mt-10">
      <h4 className="text-[12px] font-normal text-txt-secondary uppercase tracking-[0.08em] mb-2 pl-4">
        Continue Reading
      </h4>
      {[
        {
          title: "Staple Chat",
          descriptor: "Ask questions of your data in plain language.",
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
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="flex max-lg:flex-col">
        {/* Left: scrolling narrative */}
        <div className="w-full lg:w-[480px] lg:flex-shrink-0 bg-surface relative">
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

            {renderSections()}

            <ContinueReading />
          </div>
        </div>

        {/* Right: sticky artifact panel */}
        <div className="flex-1 min-w-0 max-lg:hidden">
          <div className="sticky top-0 h-screen pl-2 pr-[28px] py-[28px] flex flex-col">
            <div className="flex-1 rounded-3xl bg-[#f5f0eb] p-[28px] flex flex-col">
              <div
                className="relative flex-1 min-h-0 flex items-center justify-center"
                style={{ containerType: "size" }}
              >
                <div
                  className="relative rounded-2xl bg-white shadow-lg overflow-hidden"
                  style={{
                    aspectRatio: "1440 / 900",
                    width: "min(100%, calc(100cqh * (1440 / 900)))",
                  }}
                >
                  {/* Landing beat: the brand logo on the brand color — the
                      same opening as the Staple Chat case study. */}
                  <div
                    className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity] motion-reduce:transition-none ${
                      activeSection.id === "open"
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                    style={{ background: BRAND }}
                  >
                    <StapleWordmark className="w-[62%] max-w-[520px] text-white" />
                  </div>
                  {/* Scale beat: the "10,000 documents" funnel diagram. */}
                  <div
                    className={`absolute inset-0 z-10 transition-opacity duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity] motion-reduce:transition-none ${
                      activeSection.id === "scale"
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                  >
                    {(activeSection.id === "scale" || fadingId === "scale") && <ScaleVisual />}
                  </div>
                  {/* Research beat: the three-method evidence triptych. */}
                  <div
                    className={`absolute inset-0 z-10 transition-opacity duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity] motion-reduce:transition-none ${
                      activeSection.id === "research-methods"
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                  >
                    {(activeSection.id === "research-methods" || fadingId === "research-methods") && (
                      <ScaledCanvas>
                        <ResearchVisual />
                      </ScaledCanvas>
                    )}
                  </div>
                  {/* Principles beat: three rules, each proven on a specimen. */}
                  <div
                    className={`absolute inset-0 z-10 transition-opacity duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity] motion-reduce:transition-none ${
                      activeSection.id === "principles"
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                  >
                    {(activeSection.id === "principles" || fadingId === "principles") && (
                      <ScaledCanvas>
                        <PrinciplesVisual />
                      </ScaledCanvas>
                    )}
                  </div>
                  {/* Workspace beats: the live Staple Tables extraction screen. */}
                  <div
                    className={`absolute inset-0 z-10 transition-opacity duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity] motion-reduce:transition-none ${
                      WORKSPACE_BEATS[activeSection.id]
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                  >
                    {workspaceId && (
                      <ScaledCanvas>
                        <StapleTablesScreen
                          fieldsVariant={WORKSPACE_BEATS[workspaceId].fields}
                          /* Feature 1 (the redesigned fields) docks the panel on
                             the right, document on the left, like the product. */
                          /* All Redesign features share the product's real
                             layout: fields docked right of the document. */
                          fieldsSide={
                            workspaceId.startsWith("fields-") ||
                            workspaceId.startsWith("table-") ||
                            workspaceId === "toolbar-fix" ||
                            workspaceId === "doc-switch"
                              ? "right"
                              : "left"
                          }
                          /* The click-to-locate beat auto-selects a field so the
                             bounding box + editor demonstrate themselves. */
                          demoField={workspaceId === "fields-locate" ? "Merchant_Address" : undefined}
                          /* The remap beat auto-opens a column header dropdown so
                             the re-mapping affordance demonstrates itself. */
                          demoHeader={workspaceId === "table-headers" ? "Unit price" : undefined}
                          /* The quick-switch beat shows the document thumbnail rail. */
                          docRail={workspaceId === "doc-switch"}
                          toolbarVariant={WORKSPACE_BEATS[workspaceId].toolbar}
                          tableVariant={WORKSPACE_BEATS[workspaceId].table}
                          highlight={WORKSPACE_BEATS[workspaceId].highlight}
                        />
                      </ScaledCanvas>
                    )}
                  </div>
                  {/* The Outcome beats: a clean results surface (metrics, impact,
                      testimonials) in the product's design language. */}
                  <div
                    className={`absolute inset-0 z-10 transition-opacity duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity] motion-reduce:transition-none ${
                      ["results", "testimonials"].includes(activeSection.id)
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                  >
                    {outcomeId && (
                      <ScaledCanvas>
                        <OutcomeVisual beat={outcomeId} />
                      </ScaledCanvas>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
