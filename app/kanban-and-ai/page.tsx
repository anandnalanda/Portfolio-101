"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Spectral } from "next/font/google";
import PipelineBoard from "@/components/screens/ofm/kanban/PipelineBoard";
import EditStagesModal from "@/components/screens/ofm/kanban/EditStagesModal";
import MessageDock from "@/components/screens/ofm/kanban/MessageDock";
import RankFlow from "@/components/screens/ofm/kanban/RankFlow";
import DragFlow from "@/components/screens/ofm/kanban/DragFlow";
import JobsListScreen from "@/components/screens/ofm/kanban/JobsListScreen";
import JobPostScreen from "@/components/screens/ofm/kanban/JobPostScreen";
import CandidateProfileScreen from "@/components/screens/ofm/kanban/CandidateProfileScreen";
import OutcomeVisual from "@/components/screens/ofm/kanban/OutcomeVisual";
import DashboardShell from "@/components/screens/ofm/DashboardShell";
import OfmLogo from "@/components/screens/ofm/OfmLogo";
import MessageSentVisual from "@/components/screens/ofm/kanban/MessageSentVisual";

/* Deep emerald landing, drawn from the OFM `.kibo` brand hue. */
const BRAND = "#064E3B";

/* Flow beats whose right-panel screen is built. Others fall back to a
   numbered placeholder slot. */
const FLOW_COMPONENTS: Record<number, React.ComponentType> = {
  1: JobsListScreen,
  2: JobPostScreen,
  3: CandidateProfileScreen,
};

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
});

/* ------------------------------------------------------------------ */
/*  Section data                                                       */
/* ------------------------------------------------------------------ */

type SectionType = "intro" | "story" | "decision" | "flow" | "closing";

interface Section {
  id: string;
  type: SectionType;
  title: string;
  content: string;
  /** Scannable points under the lead paragraph. */
  bullets?: string[];
  /** Flow beats only: the numbered right-panel screen slot. */
  screen?: number;
}

const sections: Section[] = [
  {
    id: "open",
    type: "intro",
    title: "Kanban and AI Scoring",
    content: `OFM Jobs was good at introductions and bad at everything after. An employer could open an applicant, message them, and then the product ran out of road: no pipeline, nothing to come back to. So hiring finished where it always had, in someone's inbox, off our platform. Kanban and AI rebuilt the missing middle: a pipeline employers want to live in, with AI ranking who to open first.`,
  },

  /* ── The Story ─────────────────────────────────────────────── */
  {
    id: "ended",
    type: "story",
    title: `The product ended at "message sent."`,
    content: `See who applied, view their contacts, send a message. That was the whole journey.`,
    bullets: [
      `After the first message, there was nowhere to put the candidate.`,
      `So the moment real hiring started, it left the platform.`,
      `A job platform doesn't win on introductions. It wins when someone gets hired on it.`,
    ],
  },
  {
    id: "two",
    type: "story",
    title: `Two problems wearing one coat.`,
    content: `The leak was really two problems:`,
    bullets: [
      `No structure to hold a candidate after first contact.`,
      `Hundreds of applicants per role, and no way to tell who to open first.`,
      `Kanban answers the first. AI answers the second.`,
      `Built for someone who hires twice a year, not a full-time recruiter.`,
    ],
  },

  /* ── The Decisions ─────────────────────────────────────────── */
  {
    id: "d1",
    type: "decision",
    title: `Kanban, because the stages already existed.`,
    content: `Every employer already pictures hiring as stages, so I drew the board already in their head, not a new concept to learn:`,
    bullets: [
      `People to review`,
      `People I'm talking to`,
      `People I'm interviewing`,
      `An offer out`,
    ],
  },
  {
    id: "d2",
    type: "decision",
    title: `Let them shape the pipeline.`,
    content: `A café hires nothing like an agency. A board that only fits our idea of hiring makes employers bend around it, then leave.`,
    bullets: [
      `Stages are theirs to add, rename, and reorder.`,
      `A tool shaped to your work is a tool you stay in.`,
      `Customization is the retention mechanism.`,
    ],
  },
  {
    id: "d3",
    type: "decision",
    title: `The conversation lives on the board.`,
    content: `Messaging was where the leak began: one reply and everyone jumped to WhatsApp.`,
    bullets: [
      `The whole thread lives on the card, beside the candidate it's about.`,
      `Reach out and follow up without exporting anything.`,
      `The pipeline holds the talking, not just the tracking.`,
    ],
  },
  {
    id: "d4",
    type: "decision",
    title: `Rank, and show your work.`,
    content: `A list treats the 200th applicant like the 1st. The real question is "who do I open first?"`,
    bullets: [
      `Every candidate carries an AI match score, in the loudest spot on the card.`,
      `The board doesn't just hold candidates, it ranks them.`,
      `A score nobody understands is a score nobody trusts, so every score opens into its reasons.`,
      `Nod and move on, or overrule it, but always knowing why.`,
    ],
  },
  {
    id: "d6",
    type: "decision",
    title: `The human holds the pen.`,
    content: `AI orders the column, but a drag always wins. The score is a fast first pass, never the gatekeeper. The person hiring makes the call; a machine shouldn't quietly decide who gets seen. Suggest hard, decide never.`,
  },

  /* ── The Full Flow ─────────────────────────────────────────── */
  {
    id: "f1",
    type: "flow",
    screen: 1,
    title: `Your jobs, in one place.`,
    content: `Every role you're hiring for on one screen: who's applied, who's new, what needs you today.`,
    bullets: [
      `One row per role: status, applicants, interviews in progress, and who owns it.`,
      `A quiet pulse marks what arrived since you last looked.`,
      `Click a role and you're on its pipeline.`,
    ],
  },
  {
    id: "f2",
    type: "flow",
    screen: 2,
    title: `See the post the way applicants do.`,
    content: `Open a role and see the posting itself, the same page applicants apply from, and the one you hire from.`,
    bullets: [
      `A preview banner says it plainly: this is what applicants see.`,
      `Location, type, and pay as labeled facts, not buried in prose.`,
      `The rail keeps your side of it: live stats and the way back to the pipeline.`,
    ],
  },
  {
    id: "f3",
    type: "flow",
    screen: 3,
    title: `The person behind the card.`,
    content: `Open an applicant and the board steps aside for the whole picture:`,
    bullets: [
      `The score, broken into skills, experience, and role fit.`,
      `Their experience, languages, and resume.`,
      `Enough to decide without opening ten tabs.`,
    ],
  },
  /* ── The Outcome ───────────────────────────────────────────── */
  {
    id: "impact",
    type: "closing",
    title: `Impact.`,
    content: `A contact list became a pipeline.`,
    bullets: [
      `Employers build their own stages; the best fit rises on its own.`,
      `Hundreds of applicants become a ranked shortlist, not a scroll.`,
      `Hiring happens on OFM now, not in an inbox, so we earn a seat at every hire.`,
    ],
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

/* Shared crossfade recipe for the right-panel beat layers. */
const CROSSFADE =
  "absolute inset-0 transition-opacity duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity] motion-reduce:transition-none";

/* ------------------------------------------------------------------ */
/*  NarrativeSection                                                   */
/* ------------------------------------------------------------------ */

function NarrativeSection({
  id,
  title,
  content,
  bullets,
  titleSize = "md",
  serif = false,
  active = false,
  onNavigate,
}: {
  id: string;
  title: string;
  content: string;
  bullets?: string[];
  titleSize?: "lg" | "md";
  serif?: boolean;
  active?: boolean;
  onNavigate?: () => void;
}) {
  const titleClass =
    titleSize === "lg"
      ? "text-[28px] tracking-[-0.02em] leading-tight"
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
          {title}
        </h2>
        <div className="text-[15px] leading-[1.7] text-txt-primary">
          <p>{content}</p>
          {bullets && bullets.length > 0 && (
            <ul className="list-disc space-y-1.5 pl-[18px] marker:text-txt-secondary">
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
/*  Right-panel screens                                                */
/* ------------------------------------------------------------------ */

/* A numbered placeholder for a Kibo screen still to be built. */
function ScreenSlot({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-white px-12 text-center">
      <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-zinc-300">
        Screen {n}
      </span>
      <span className="max-w-[440px] text-[24px] font-semibold leading-tight text-zinc-700">
        {title.replace(/\.$/, "")}
      </span>
      <span className="text-[13px] text-zinc-400">Kibo screen · build here</span>
    </div>
  );
}

/* Scale a fixed 1440×900 design to fit the (aspect-locked) canvas, so
   fixed-layout screens never clip regardless of viewport. The canvas box
   sets `container-type: size`, so 100cqw == the canvas width. */
function ScaledStage({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        data-stage-canvas
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: 1440,
          height: 900,
          transform: "scale(calc(100cqw / 1440px))",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* The live product: the Kibo hiring board, caged in `.kibo`. Rendered
   client-only - dnd-kit derives aria ids from a module counter that drifts
   between server and client, so SSR-ing it trips hydration. */
function BoardStage({
  highlight = false,
  editStages = false,
  messaging = false,
  rank = false,
  drag = false,
}: {
  highlight?: boolean;
  editStages?: boolean;
  messaging?: boolean;
  rank?: boolean;
  drag?: boolean;
}) {
  /* d2 sub-sequence: once the modal's "Save changes" is clicked, the modal
     closes and the new stage lands on the board (which scrolls to reveal it).
     Resets whenever the beat is left. */
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (!editStages) setSaved(false);
  }, [editStages]);

  /* d4 sub-sequence: the Applied column re-sorts by AI score, then the top
     card's breakdown opens and it gets spotlighted. */
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [rankSorted, setRankSorted] = useState(false);
  const [rankScoreHi, setRankScoreHi] = useState(false);
  const [rankScoreFrame, setRankScoreFrame] = useState(false);
  useEffect(() => {
    if (!rank) {
      setSortMenuOpen(false);
      setRankSorted(false);
      setRankScoreHi(false);
      setRankScoreFrame(false);
    }
  }, [rank]);

  /* d6 sub-sequence: the human drags candidates forward across stages; the
     board updates and the sort flips to "Manual" (a drag always wins). */
  const [dragMoveCount, setDragMoveCount] = useState(0);
  const [draggingCard, setDraggingCard] = useState<string | null>(null);
  const [dropStage, setDropStage] = useState<string | null>(null);
  const [sortManual, setSortManual] = useState(false);
  useEffect(() => {
    if (!drag) {
      setDragMoveCount(0);
      setDraggingCard(null);
      setDropStage(null);
      setSortManual(false);
    }
  }, [drag]);

  return (
    <ScaledStage>
      <DashboardShell>
        <PipelineBoard
          highlight={highlight}
          editing={editStages && !saved}
          extraStage={saved ? "Trial shift" : null}
          messaging={messaging}
          rankDemo={rank}
          rankSorted={rankSorted}
          rankScoreHi={rankScoreHi}
          rankScoreFrame={rankScoreFrame}
          sortMenuOpen={sortMenuOpen}
          dragDemo={drag}
          dragMoveCount={dragMoveCount}
          draggingCard={draggingCard}
          dropStage={dropStage}
          sortManual={sortManual}
        />
      </DashboardShell>
      <AnimatePresence>
        {editStages && !saved && (
          <EditStagesModal key="edit-stages" onSave={() => setSaved(true)} />
        )}
        {messaging && <MessageDock key="message-dock" />}
        {rank && (
          <RankFlow
            key="rank-flow"
            onOpenMenu={() => setSortMenuOpen(true)}
            onSort={() => {
              setRankSorted(true);
              setSortMenuOpen(false);
            }}
            onHighlightScore={() => setRankScoreHi(true)}
            onFrameScore={() => setRankScoreFrame(true)}
          />
        )}
        {drag && (
          <DragFlow
            key="drag-flow"
            onGrab={(card) => {
              setDraggingCard(card);
              setSortManual(true);
            }}
            onCarry={(stage) => setDropStage(stage)}
            onDrop={() => {
              setDragMoveCount((c) => c + 1);
              setDraggingCard(null);
              setDropStage(null);
            }}
          />
        )}
      </AnimatePresence>
    </ScaledStage>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function KanbanAndAIPage() {
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

  const active = sections.find((s) => s.id === activeId) ?? sections[0];
  const stage =
    active.type === "intro"
      ? "title"
      : active.type === "story"
      ? "story"
      : active.type === "decision"
      ? "product"
      : active.type === "flow"
      ? "flow"
      : "impact";

  /* The story illustration runs infinite loops; keep it mounted only while
     its layer is visible or still fading out, so it doesn't burn animation
     frames behind every other beat on the page. */
  const [storyMounted, setStoryMounted] = useState(stage === "story");
  useEffect(() => {
    if (stage === "story") {
      setStoryMounted(true);
      return;
    }
    const t = setTimeout(() => setStoryMounted(false), 650);
    return () => clearTimeout(t);
  }, [stage]);

  const flowBeat = active.type === "flow" ? active : null;

  const renderSections = (arr: typeof sections) =>
    arr.map((section, i) => {
      const prev = i > 0 ? arr[i - 1] : null;
      const showGroupHeading =
        (section.type === "story" && prev?.type !== "story") ||
        (section.type === "decision" && prev?.type !== "decision") ||
        (section.type === "flow" && prev?.type !== "flow") ||
        (section.type === "closing" && prev?.type !== "closing");
      const groupLabel =
        section.type === "story"
          ? "The Story"
          : section.type === "decision"
          ? "The Decisions"
          : section.type === "flow"
          ? "The Full Flow"
          : section.type === "closing"
          ? "The Outcome"
          : null;
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
            content={section.content}
            bullets={section.bullets}
            serif={section.id === "open"}
            active={section.id === activeId}
            onNavigate={() => scrollToSection(section.id)}
            titleSize={section.id === "open" ? "lg" : "md"}
          />
        </div>
      );
    });

  const RightCanvas = () => (
    <div
      className="relative rounded-2xl shadow-lg overflow-hidden"
      style={{
        aspectRatio: "1440 / 900",
        width: "min(100%, calc(100cqh * (1440 / 900)))",
        containerType: "size",
      }}
    >
      {/* Landing / title beat */}
      <div
        className={`${CROSSFADE} flex flex-col items-center justify-center ${
          stage === "title" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: BRAND }}
      >
        <OfmLogo variant="light" gap={BRAND} className="h-[116px] w-auto" />
        <span className="mt-4 text-[26px] font-semibold tracking-[-0.01em] text-white">
          OFM Jobs
        </span>
        <span
          className={`${spectral.className} mt-6 text-center text-[54px] leading-[1.05] text-white`}
        >
          Kanban &amp; AI Scoring
        </span>
      </div>

      {/* Story beat - hand-drawn, beat-aware "message sent → leak" illustration */}
      <div
        className={`${CROSSFADE} ${
          stage === "story" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {storyMounted && <MessageSentVisual beat={activeId} />}
      </div>

      {/* Decisions beat - the live product board */}
      <div
        className={`${CROSSFADE} ${
          stage === "product" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <BoardStage
          highlight={activeId === "d1"}
          editStages={activeId === "d2"}
          messaging={activeId === "d3"}
          rank={activeId === "d4"}
          drag={activeId === "d6"}
        />
      </div>

      {/* Flow beats - numbered screen slots, swapped per active beat */}
      <div
        className={`${CROSSFADE} ${
          stage === "flow" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <AnimatePresence mode="wait">
          {flowBeat &&
            (() => {
              const Screen = FLOW_COMPONENTS[flowBeat.screen ?? 0];
              return (
                <motion.div
                  key={flowBeat.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease }}
                >
                  {Screen ? (
                    <ScaledStage>
                      <Screen />
                    </ScaledStage>
                  ) : (
                    <ScreenSlot n={flowBeat.screen ?? 0} title={flowBeat.title} />
                  )}
                </motion.div>
              );
            })()}
        </AnimatePresence>
      </div>

      {/* Outcome beat - the closing visual */}
      <div
        className={`${CROSSFADE} ${
          stage === "impact" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <ScaledStage>
          <OutcomeVisual />
        </ScaledStage>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="flex max-lg:flex-col">
        {/* Left: scrolling narrative */}
        <div className="w-full md:w-[440px] lg:w-[480px] md:flex-shrink-0 bg-surface relative">
          <div className="px-6 py-16 md:px-10">
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

            {renderSections(sections)}

            {/* Continue Reading */}
            <div className="mt-16">
              <h4 className="text-[12px] font-normal text-txt-secondary uppercase tracking-[0.08em] mb-2 pl-4">
                Continue Reading
              </h4>
              {[
                {
                  title: "OFM Jobs Tests",
                  descriptor: "Assessment system with AI-powered hiring.",
                  href: "/ofm-jobs-tests",
                },
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
            <div className="flex-1 rounded-3xl bg-[#f5f0eb] p-[28px] flex flex-col">
              <div
                className="relative flex-1 min-h-0 flex items-center justify-center"
                style={{ containerType: "size" }}
              >
                <RightCanvas />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile artifact */}
      <div className="lg:hidden px-4 pb-10">
        <div className="rounded-3xl bg-[#f5f0eb] p-3">
          <div
            className="relative aspect-[1440/900] bg-white rounded-xl shadow-lg overflow-hidden"
            style={{ containerType: "size" }}
          >
            <BoardStage />
          </div>
        </div>
      </div>
    </div>
  );
}
