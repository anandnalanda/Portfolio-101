"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Spectral } from "next/font/google";
import ScaledStapleChat from "@/components/screens/staple-chat/ScaledStapleChat";
import ScaledCanvas from "@/components/screens/_ui/ScaledCanvas";
import SpacesScreen from "@/components/screens/staple-chat/SpacesScreen";
import {
  blankConversation,
  chartConversation,
  chartFollowUps,
  impactConversation,
  revealConversation,
  revealFollowUps,
  voiceFollowUps,
} from "@/components/screens/staple-chat/data";

/* Blank-canvas beat hides the pinned follow-up row entirely. */
const NO_FOLLOW_UPS: string[] = [];

/* The "full flow" beats reuse the same sticky panel — each flow section maps
   to a Staple Chat screen state, cross-faded as the reader scrolls through. */
const FLOW_SCREENS: Record<string, React.ComponentProps<typeof ScaledStapleChat>> = {
  /* Cold start: nothing connected, nothing asked — no follow-up chips (the
     product can't suggest questions about data it doesn't have yet). */
  "flow-idle": {
    idle: true,
    messages: [],
    configurePanel: true,
    panelTab: "data",
    followUpItems: NO_FOLLOW_UPS,
  },
  "flow-connect": {
    idle: true,
    messages: [],
    configurePanel: true,
    panelTab: "data",
    connectModal: true,
    followUpItems: NO_FOLLOW_UPS,
  },
  /* Quiet chips: the neutral walkthrough points at nothing. */
  "flow-connected": { blankCanvas: "chips-quiet", configurePanel: true, panelTab: "data" },
  /* Just the question, freshly sent — the answer is the NEXT step. */
  /* One combined beat: the question is sent, the answer processes, then it
     reveals — played automatically via answerSequence. */
  "flow-ask": {
    messages: revealConversation,
    answerSequence: true,
    configurePanel: false,
    followUpItems: revealFollowUps,
  },
  /* The thread continues: scroll down into the new follow-up + inline chart,
     watching the bars animate in. */
  "flow-chart": {
    messages: chartConversation,
    reasoningExpanded: false,
    configurePanel: false,
    followUpItems: chartFollowUps,
    restScroll: "reveal",
  },
  /* The configure panel slides in from the right, Instructions selected. */
  "flow-instructions": {
    messages: chartConversation,
    panelReveal: true,
    panelTab: "instructions",
    followUpItems: chartFollowUps,
    restScroll: "bottom",
  },
};
import { StapleWordmark } from "./StapleWordmark";
import { ProblemVisual } from "./ProblemVisual";
import { BigTypeVisual } from "./BigTypeVisual";
import ImpactVisual from "./ImpactVisual";

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

type SectionType = "intro" | "critique" | "refinement" | "summary" | "story" | "product" | "flow" | "closing";

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

const sections: Section[] = [
  {
    id: "open",
    type: "intro",
    title: "Building Staple Chat",
    content: `Staple Chat is an AI data-analysis tool I designed: ask a question in plain language, get an answer straight from your connected data. What follows is how we identified the problem, designed our way to this product, and turned it into one of the company's biggest selling points.`,
    highlight: null,
  },
  {
    id: "bottleneck",
    type: "story",
    title: "The analyst bottleneck.",
    content: `The bottleneck was never the data. It was translation.`,
    bullets: [
      `Non-technical people queued behind analysts for one-sentence answers.`,
      `Static reports couldn't answer the obvious follow-up, so every question restarted the tour.`,
    ],
    highlight: null,
  },
  {
    id: "interviews",
    type: "story",
    title: "23 interviews. One pattern.",
    content: `The obvious brief was "build a better dashboard." Twenty-three interviews with finance, ops, and compliance killed it.`,
    bullets: [
      `One pattern under every complaint: the tool makes me translate my question into its language.`,
      `Nobody wanted a better dashboard. They wanted to stop needing one.`,
    ],
    highlight: null,
  },
  {
    id: "brief",
    type: "story",
    title: "The brief was one sentence.",
    content: `One line from our CEO: "we should be able to chat with documents." Turning it into a product was mine. I scoped v1 with the CEO and PM:`,
    bullets: [
      `What a query could touch.`,
      `How documents came in.`,
      `What we'd show on screen.`,
    ],
    highlight: null,
  },
  {
    id: "d1",
    type: "product",
    title: "Decision 1: Chat is the product, not a feature.",
    content: `The safe version was a chatbot bolted onto the dashboards, an assistant in the corner of the maze. We rejected it early.`,
    bullets: [
      `A bot that answers questions about a maze is still a maze.`,
      `If natural language was how people thought, it had to be the whole interface.`,
    ],
    highlight: null,
  },
  {
    id: "d2",
    type: "product",
    title: "Decision 2: Show the thinking.",
    content: `"Excluding returns and taxes" carries real business logic. The system should translate intent, not make users do it. But a translation you can't see is just a black box, and finance won't sign off on numbers they can't audit.`,
    bullets: [
      `Every answer shows its work: what it read, what it filtered, how it totaled.`,
      `Visible reasoning turns "a number" into "a number I'll put in front of my CFO."`,
    ],
    highlight: null,
  },
  {
    id: "d3",
    type: "product",
    title: "Decision 3: Charts live inside the conversation.",
    content: `Every tool we studied put visualization somewhere else: a tab, a builder, an export. But the point is the follow-up. "Now break that down by outlet" only feels natural if you never left the thread.`,
    bullets: [
      `Charts render inline, and the conversation keeps going.`,
      `A separate charts tab would have been the maze sneaking back in.`,
    ],
    highlight: null,
  },
  {
    id: "d4",
    type: "product",
    title: "Decision 4: Power without a setup wizard.",
    content: `Power users needed their own data on the table: invoices, POS exports, P&L, outlet masters, ready to be questioned. The lazy version is a setup wizard; the clever-looking version sprays settings through the chat. We did neither.`,
    bullets: [
      `A side panel holds everything you've connected, summoned when needed, invisible otherwise.`,
      `Clean for the person who just wants an answer; depth one click away for the person who doesn't.`,
    ],
    highlight: null,
  },
  {
    id: "d5",
    type: "product",
    title: "Decision 5: The blank canvas problem.",
    content: `A chat interface has a dirty secret: an empty input box is scarier than a bad dashboard. New users don't know what to ask, so they ask nothing and leave.`,
    bullets: [
      `Suggestion chips propose the next question from what's connected and what was just asked.`,
      `Not a convenience feature; it's how the product teaches its own ceiling.`,
      `The rejected alternative was onboarding tours and docs, for a product whose whole promise was no learning curve.`,
    ],
    highlight: null,
  },
  {
    id: "flow-idle",
    type: "flow",
    title: "Start from your spaces.",
    content: `Every dataset lives in its own space: invoices in one, reviews in another. You land on the workspace you've built, and adding more is one click away.`,
    highlight: null,
  },
  {
    id: "flow-connect",
    type: "flow",
    title: "Connect the sources.",
    content: `Add opens a picker of files and tables: everything a new space should see, chosen before the first question is asked.`,
    highlight: null,
  },
  {
    id: "flow-connected",
    type: "flow",
    title: "The workspace is ready.",
    content: `Sources land in the Data panel. Nothing has been asked yet, but the conversation can start.`,
    highlight: null,
  },
  {
    id: "flow-ask",
    type: "flow",
    title: "Ask, and watch it answer.",
    content: `The real question, typed the way you'd say it out loud, with no syntax or field names. It answers with a reasoning drawer, the prose, and a table where every figure traces back to its rows.`,
    highlight: null,
  },
  {
    id: "flow-chart",
    type: "flow",
    title: "The thread keeps going.",
    content: `A follow-up becomes a real message, answered by a chart that renders inline. You never leave the conversation.`,
    highlight: null,
  },
  {
    id: "flow-instructions",
    type: "flow",
    title: "Logic, set once.",
    content: `Custom business rules, like "treat anything below three stars as negative," quietly applied to every answer.`,
    highlight: null,
  },
  {
    id: "impact",
    type: "closing",
    title: "Impact.",
    content: `Time-to-insight went from 15 minutes to 2, not because people got faster, but because the tour of five dashboards stopped existing.`,
    bullets: [
      `Within a quarter, 67% of queries came from non-technical people.`,
      `The analyst queue dissolved, and the founding promise reached the people it was made for.`,
    ],
    highlight: null,
  },
  {
    id: "next",
    type: "closing",
    title: "Where it goes next: from chatting to talking.",
    content: `Chat removes the dashboard, but you're still typing. The next step I designed was voice.`,
    bullets: [
      `Ask out loud, and drill in by just asking.`,
      `Text was the right v1: precise, auditable, shareable. Voice is the v2 that matches how people already think out loud.`,
    ],
    highlight: null,
  },
];

const ease = [0.22, 1, 0.36, 1];

/* One shared crossfade recipe for every right-panel beat layer, so any two
   beats fade in/out over the SAME duration + curve. Balanced crossfades (the
   outgoing beat leaves exactly as the incoming arrives) are what make the
   scroll read as smooth in both directions, instead of one layer lingering. */
const CROSSFADE =
  "absolute inset-0 transition-opacity duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity] motion-reduce:transition-none";

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
  /** Jump-to: click the section to scroll it into the active position (the
      right-hand screen then transitions via the normal scroll-spy). */
  onNavigate?: () => void;
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
}: NarrativeSectionProps) {
  const titleClass =
    titleSize === "lg"
      ? "text-[28px] tracking-[-0.02em] leading-tight"
      : titleSize === "sm"
      ? "text-[22px] tracking-[-0.01em]"
      : "text-[18px]";

  // A click anywhere on the card jumps to the section — but not when the
  // reader is actually selecting its text (a drag that ends in a click).
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
/*  Right-panel artifact — per-beat UI                                 */
/* ------------------------------------------------------------------ */

/**
 * The UI shown in the sticky right panel.
 *
 * The product's first appearance (beat "d1") is a reveal carried by the
 * HIGHLIGHT FRAME, not by the screen: the screen arrives still, the frame
 * lands around the whole canvas, then flies down and tightens onto the
 * composer ("chat is the entire product" in one gesture). The frame's
 * choreography lives in StapleChatScreen; reduced motion shows it
 * statically on the composer.
 */
/** Which story state the product screen is in for the active beat. */
type ScreenBeat =
  | "base"
  | "reveal"
  | "reasoning"
  | "chart"
  | "panel"
  | "blank";

function StapleArtifact({
  beat = "base",
  restingPanel = false,
}: {
  beat?: ScreenBeat;
  /* Keep the configure panel open in the "base" state (the mobile inline
     artifact). The desktop instance leaves it closed: its base state is
     never visible, and an open panel there would animate shut during the
     d1 reveal — a 460px reflow reading as a stray "responsive" resize. */
  restingPanel?: boolean;
}) {
  // The single-query thread (panel collapsed) carries beats d1–d2; the chart
  // beat extends it with the follow-up exchange. Base = full resting screen.
  const inStory = beat !== "base";
  return (
    <div className="absolute inset-0">
      <ScaledStapleChat
        highlightComposer={beat === "reveal"}
        messages={
          beat === "blank"
            ? blankConversation
            : beat === "chart" || beat === "panel"
            ? chartConversation
            : inStory
            ? revealConversation
            : undefined
        }
        followUpItems={
          beat === "blank"
            ? NO_FOLLOW_UPS
            : beat === "chart" || beat === "panel"
            ? chartFollowUps
            : inStory
            ? revealFollowUps
            : undefined
        }
        /* The panel stays open from d4 INTO d5 — the blank canvas reads as
           "workspace ready, nothing asked yet" with the data still in view,
           and the d4 → d5 hand-off loses its distracting close animation. */
        configurePanel={
          beat === "panel" || beat === "blank" || (!inStory && restingPanel)
        }
        highlightThinking={beat === "reasoning"}
        reasoningExpanded={beat === "reasoning"}
        highlightChart={beat === "chart"}
        highlightSources={beat === "panel"}
        /* Straight to the resolution: chips + brand accent (no red
           problem-frame phase — the copy carries the problem). */
        blankCanvas={beat === "blank" ? "chips" : undefined}
      />
    </div>
  );
}

/* Full-flow screen — the product driven to a flow beat, cross-faded between
   states as the reader scrolls the flow list. Mounts only while a flow beat is
   active (active !== null), so it costs nothing elsewhere. */
function FlowScreen({ active }: { active: string | null }) {
  const reduce = useReducedMotion();
  // The first two flow beats live on the Spaces HOME (the product's real cold
  // start): the workspace you return to, then the Add → connect-data step.
  // From "workspace ready" onward it's the chat screen.
  const isSpaces = active === "flow-idle" || active === "flow-connect";
  return (
    <AnimatePresence initial={false}>
      {active && (
        <motion.div
          key={isSpaces ? "flow-spaces" : active}
          className="absolute inset-0"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.3, ease }}
        >
          {isSpaces ? (
            <ScaledCanvas>
              <SpacesScreen connectModal={active === "flow-connect"} />
            </ScaledCanvas>
          ) : (
            <ScaledStapleChat {...(FLOW_SCREENS[active] ?? {})} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function StapleChatPage() {
  // Landing state shows the brand logo. Once the reader scrolls to the first
  // story beat (its top crosses the viewport center), the logo cross-fades out
  // and the live product appears. Driven by scroll position (not the center-
  // band observer) so the logo reliably stays on first paint.
  // Single source of truth for the active beat: a scroll-spy that names the
  // last section whose top has crossed a fixed line near the top of the
  // viewport. Both the left-hand highlight and the right-hand screen derive
  // from it, so exactly ONE beat is ever selected. "open" (the logo beat) is
  // active on landing; scrolling to the first story beat switches it.
  const [activeId, setActiveId] = useState(sections[0].id);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Jump-to-section: smooth-scroll the target just above the spy line (220)
  // so it becomes active; the scroll-spy then drives the right-hand screen
  // with its normal cross-fade/flight transitions. Respects reduced motion.
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
      /* The last beat sits too close to the page bottom for its top to ever
         cross the spy line on shorter viewports — approaching the end of
         the page must always land the final beat. */
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 120
      ) {
        current = sections[sections.length - 1].id;
      }
      setActiveId(current);
    };
    // Coalesce scroll events to one layout read per animation frame so the
    // scroll never thrashes layout — keeps it buttery.
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

  // Which screen the right panel shows for the active beat. The problem
  // diagram spans beats 2–3 (its dotted path draws across both via scroll);
  // the "brief" beat is a deliberate big-type pause before the product.
  const screen =
    activeId === "open"
      ? "logo"
      : activeId === "bottleneck" || activeId === "interviews"
      ? "problem"
      : activeId === "brief"
      ? "quote"
      : activeId === "impact"
      ? "impact"
      : activeId === "next"
      ? "voice"
      : activeId.startsWith("flow-")
      ? "flow"
      : "product";

  const renderSections = (arr: typeof sections) =>
    arr.map((section, i) => {
      const prev = i > 0 ? arr[i - 1] : null;
      const showGroupHeading =
        (section.type === "story" && prev?.type !== "story") ||
        (section.type === "product" && prev?.type !== "product") ||
        (section.type === "flow" && prev?.type !== "flow") ||
        (section.type === "closing" && prev?.type !== "closing");
      const groupLabel =
        section.type === "story"
          ? "The Story"
          : section.type === "product"
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
            bullets={section.bullets}
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
  );

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

            {renderSections(sections)}

            <ContinueReading />

          </div>
        </div>

        {/* Right: sticky artifact panel */}
        <div className="flex-1 min-w-0 max-lg:hidden">
          <div className="sticky top-0 h-screen pl-2 pr-[28px] py-[28px] flex flex-col">
            {/* Beige panel — design-system radii: frame rounded-3xl (24px),
                white panel rounded-2xl (16px) to match the product's cards. */}
            <div className="flex-1 rounded-3xl bg-[#f5f0eb] p-[28px] flex flex-col">
              {/* Dashboard container — pinned to a fixed 1440×900 desktop
                  canvas so every viewer sees the IDENTICAL screen (same
                  layout, wraps, and choreography); only the zoom differs.
                  Contain-fit and centered in the beige mat. */}
              <div
                className="relative flex-1 min-h-0 flex items-center justify-center"
                style={{ containerType: "size" }}
              >
              <div
                className="relative rounded-2xl shadow-lg overflow-hidden"
                style={{
                  aspectRatio: "1440 / 900",
                  width: "min(100%, calc(100cqh * (1440 / 900)))",
                }}
              >
                {/* Landing beat: brand logo on the brand color */}
                <div
                  className={`${CROSSFADE} flex items-center justify-center ${
                    screen === "logo" ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                  style={{ background: BRAND }}
                >
                  <StapleWordmark className="w-[62%] max-w-[520px] text-white" />
                </div>
                {/* Problem beat: the establishing "five islands" diagram. */}
                <div
                  className={`${CROSSFADE} ${
                    screen === "problem"
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <ProblemVisual />
                </div>
                {/* Big-type pause beat: one line, nothing else */}
                <div
                  className={`${CROSSFADE} ${
                    screen === "quote" ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <BigTypeVisual active={screen === "quote"} />
                </div>
                {/* Later beats: the live product. Its first arrival (out of
                    the big-type pause) is a quicker 500ms fade + subtle scale
                    so it reads as the product calmly "arriving". */}
                <div
                  className={`${CROSSFADE} ${
                    screen === "product" ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  {/* Beat → screen-state mapping:
                      d1 = reveal (single query, panel collapsed, input framed)
                      d2 = reasoning (drawer expands, highlight travels to it)
                      d3 = chart (thread continues, inline bars)
                      d4 = panel (slides open, instruction highlighted)
                      d5 = blank canvas (empty + red frame → chips + accent) */}
                  <StapleArtifact
                    beat={
                      activeId === "d1"
                        ? "reveal"
                        : activeId === "d2"
                        ? "reasoning"
                        : activeId === "d3"
                        ? "chart"
                        : activeId === "d4"
                        ? "panel"
                        : activeId === "d5"
                        ? "blank"
                        : "base"
                    }
                  />
                </div>
                {/* Full-flow beats: the same product, driven through its seven
                    states, cross-faded as the reader scrolls the flow list. */}
                <div
                  className={`${CROSSFADE} ${
                    screen === "flow" ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <FlowScreen active={screen === "flow" ? activeId : null} />
                </div>
                {/* Impact beat: a warm chibi scene — the analyst queue
                    dissolving — on a clean canvas, with the headline metrics
                    below. A deliberate tonal shift for the emotional payoff. */}
                <div
                  className={`${CROSSFADE} ${
                    screen === "impact"
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <AnimatePresence initial={false}>
                    {screen === "impact" && <ImpactVisual key="impact-scene" />}
                  </AnimatePresence>
                </div>
                {/* Voice beat: the same product in a new input mode — the
                    composer comes alive, listens, and the spoken answer
                    lands in the thread. Mounted only while active so the
                    idle → listening → answer sequence replays on re-entry. */}
                <div
                  className={`${CROSSFADE} ${
                    screen === "voice" ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <AnimatePresence initial={false}>
                    {screen === "voice" && (
                      <motion.div
                        key="voice"
                        className="absolute inset-0"
                        initial={false}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ScaledStapleChat
                          messages={impactConversation}
                          followUpItems={voiceFollowUps}
                          voice="sequence"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Mobile artifact (shown inline on small screens) */}
      <div className="lg:hidden px-4 pb-10">
        <div className="rounded-3xl bg-[#f5f0eb] p-3">
          <div className="relative aspect-[1440/900] bg-white rounded-xl shadow-lg overflow-hidden">
            <StapleArtifact restingPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
