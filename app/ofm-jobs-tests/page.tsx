"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Spectral } from "next/font/google";
import OfmLogo from "@/components/screens/ofm/OfmLogo";
import GatedJob from "@/components/screens/ofm/tests/GatedJob";
import EnglishTest from "@/components/screens/ofm/tests/EnglishTest";
import VerbalTest from "@/components/screens/ofm/tests/VerbalTest";
import ListeningTest from "@/components/screens/ofm/tests/ListeningTest";
import SpeedTest from "@/components/screens/ofm/tests/SpeedTest";
import TypingTest from "@/components/screens/ofm/tests/TypingTest";
import ApplicationUnlocked from "@/components/screens/ofm/tests/ApplicationUnlocked";
import PromiseVisual from "@/components/screens/ofm/tests/PromiseVisual";
import LateVisual from "@/components/screens/ofm/tests/LateVisual";
import JobPostWizard from "@/components/screens/ofm/tests/JobPostWizard";
import DiscoverMarket from "@/components/screens/ofm/tests/DiscoverMarket";
import FindWork from "@/components/screens/ofm/tests/FindWork";
import ImpactVisual from "@/components/screens/ofm/tests/ImpactVisual";

/* Deep emerald landing, drawn from the OFM `.kibo` brand hue. */
const BRAND = "#064E3B";

/* d1 "Test the job, not trivia" names the five tests, so it lands straight on
   the wizard's Tests step, where all five are on screen, and the cursor picks
   the ones the role needs. */
function JobPostTestsBeat() {
  return <JobPostWizard autoplay initialStep={1} />;
}

/* f1 "Set the bar when you post" is about the step living inside the posting
   flow, so this one plays the whole wizard: a cursor clicks Continue from
   Details through Requirements and arrives at the Tests step. */
function SetBarBeat() {
  return <JobPostWizard autoplay />;
}

/* d3–d5 are one continuous scene: the Discover marketplace + candidate overlay,
   driven by `phase` — feed (d3), the trust layer (d4), the portable layer (d5). */
function GradeBeat() {
  return <DiscoverMarket phase="feed" />;
}
function TrustBeat() {
  return <DiscoverMarket phase="trust" />;
}
function ExperienceBeat() {
  return <DiscoverMarket phase="experience" />;
}
function PortableBeat() {
  return <DiscoverMarket phase="portable" />;
}

/* Every beat's right-panel artifact. */
const FLOW_SCREENS: Record<string, React.ComponentType> = {
  promise: PromiseVisual,
  late: LateVisual,
  d1: JobPostTestsBeat,    // test the job, not trivia — the job-post wizard, autoplayed
  d2: FindWork,            // proof to apply, not proof to shortlist — the Find work board, gated by proof
  d3: GradeBeat,           // grade it the moment it's done — Discover, the verified marketplace
  d4: TrustBeat,           // a score you can trust — overlay opens on the Overview
  dexp: ExperienceBeat,    // a number, and the person behind it — cursor clicks the Experience tab
  d5: PortableBeat,        // prove it once, carry it everywhere — cursor clicks the Test result tab
  f1: SetBarBeat,          // set the bar when you post — the wizard's Tests step
  f3: GatedJob,            // the job, with a gate
  f6: EnglishTest,
  f7: VerbalTest,
  f8: ListeningTest,
  f9: SpeedTest,
  f10: TypingTest,
  f12: ApplicationUnlocked,// application unlocked
  impact: ImpactVisual,    // the filter moved to the front — closing illustration
};

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
});

/* ------------------------------------------------------------------ */
/*  Section data - the whole left-column narrative                     */
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
    title: "Proof to apply",
    content: `A shortlist is still a stack of claims: "fluent English," "fast typist," everyone writes it, few can prove it. Tests move proof to the front of the funnel. The employer sets the bar when posting; a candidate can't apply until they clear it. Designed and shipped end to end.`,
  },

  /* ── The Story ─────────────────────────────────────────────── */
  {
    id: "promise",
    type: "story",
    title: `A résumé is a promise.`,
    content: `The job is the skill itself, and none of it survives a CV.`,
    bullets: [
      `Hold a real conversation in English, or just tick "B2"?`,
      `Type fast enough to run three chats at once?`,
      `A connection that survives a shift?`,
      `A CV answers none of it.`,
    ],
  },
  {
    id: "late",
    type: "story",
    title: `You found out too late.`,
    content: `The only skill check was the interview, the most expensive filter in the funnel.`,
    bullets: [
      `Thirty minutes in: they type 22 WPM.`,
      `The call drops every two minutes, live.`,
      `The right filter, at the wrong end of the pipe.`,
    ],
  },

  /* ── The Decisions ─────────────────────────────────────────── */
  {
    id: "d1",
    type: "decision",
    title: `Test the job itself.`,
    content: `Five native tests, each mapped to a skill the work needs.`,
    bullets: [
      `English: reading and grammar, in real chat snippets.`,
      `Verbal: a spoken answer, recorded.`,
      `Listening: catch what the customer said.`,
      `Internet speed: the silent dealbreaker.`,
      `Typing: WPM and accuracy on a clock.`,
      `Built in, so scores land on the board rather than on a vendor's site.`,
    ],
  },
  {
    id: "d2",
    type: "decision",
    title: `Proof before you can apply.`,
    content: `The test is the door. Nothing is submitted below the bar.`,
    bullets: [
      `Required skills are set when the job is posted.`,
      `Proven roles are one-tap Apply; the rest stay locked.`,
      `The pile arrives already filtered by the bar.`,
      `Clearing the bar opens the door; the employer still chooses.`,
    ],
  },
  {
    id: "d3",
    type: "decision",
    title: `Grade it the moment it's done.`,
    content: `The machine grades what it can, the instant it can, with no human queue.`,
    bullets: [
      `Typing and speed are measured, so they come back as numbers.`,
      `English and listening auto-score against a key.`,
      `Verbal is AI-scored, with the reasoning shown.`,
    ],
  },
  {
    id: "d4",
    type: "decision",
    title: `A score you can trust.`,
    content: `Every number on the profile was earned on a test.`,
    bullets: [
      `"68 WPM," measured live, instead of "good typist."`,
      `Nothing here is self-reported.`,
      `"Fully verified" only once every skill cleared its test.`,
      `Scores sit beside real roles and real tenure.`,
    ],
  },
  {
    id: "dexp",
    type: "decision",
    title: `A number is only half the story.`,
    content: `A score shows what someone can do. A track record shows what they have done.`,
    bullets: [
      `Same overlay, one tab over: roles, tenure, languages.`,
      `Verified scores beside a real history.`,
      `Tenure on the surface, so "reliable" is visible.`,
    ],
  },
  {
    id: "d5",
    type: "decision",
    title: `Prove it once, carry it everywhere.`,
    content: `Proof stays with the candidate rather than the application.`,
    bullets: [
      `Take any test proactively, on your own time.`,
      `Verified scores travel from job to job.`,
      `Already clear a job's bar? Apply instantly.`,
    ],
  },

  /* ── The Full Flow ─────────────────────────────────────────── */
  {
    id: "f1",
    type: "flow",
    screen: 1,
    title: `Set the bar when you post.`,
    content: `Setting the bar is part of posting the job.`,
    bullets: [
      `A required-skills step inside the job post.`,
      `Toggle each test on and set its pass mark.`,
      `The job goes live gated, so without proof there is no application.`,
    ],
  },
  {
    id: "f3",
    type: "flow",
    screen: 2,
    title: `The job, with a gate.`,
    content: `The listing is honest about what it takes.`,
    bullets: [
      `The four required skills, right beside the posting.`,
      `Green ticks on skills already proven; Take test on the rest.`,
      `Apply stays locked until all four are met.`,
    ],
  },
  {
    id: "f6",
    type: "flow",
    screen: 3,
    title: `English.`,
    content: `Reading and grammar, staged as the chat itself.`,
    bullets: [
      `Complete real customer messages, and your replies.`,
      `Answer to unlock Next; Back revisits, Skip moves on.`,
      `Auto-scored. Leaving the tab is flagged.`,
    ],
  },
  {
    id: "f7",
    type: "flow",
    screen: 4,
    title: `Verbal.`,
    content: `A customer scenario on screen; say your answer out loud.`,
    bullets: [
      `Record, hear it back, submit.`,
      `One retake, spent when you choose.`,
      `AI scores fluency and clarity, and shows why.`,
    ],
  },
  {
    id: "f8",
    type: "flow",
    screen: 5,
    title: `Listening.`,
    content: `Play the customer's voice note, answer what it asked.`,
    bullets: [
      `Two plays at most, options in view while you listen.`,
      `It tests comprehension rather than transcription.`,
      `Auto-scored against the key.`,
    ],
  },
  {
    id: "f9",
    type: "flow",
    screen: 6,
    title: `Internet speed.`,
    content: `A live check of the thing that silently ends chat work.`,
    bullets: [
      `The dial sweeps to a reading, past the pass mark.`,
      `Upload, ping, and jitter alongside.`,
      `A weak reading is flagged for a retry rather than failed.`,
    ],
  },
  {
    id: "f10",
    type: "flow",
    screen: 7,
    title: `Typing.`,
    content: `A timed passage; WPM and accuracy tick up live.`,
    bullets: [
      `The caret advances; mistypes show red.`,
      `Live WPM, accuracy, and the clock.`,
      `One number the employer already understands.`,
    ],
  },
  {
    id: "f12",
    type: "flow",
    screen: 8,
    title: `Application unlocked.`,
    content: `Back on the job, the proof does its work.`,
    bullets: [
      `The last two skills flip to verified: 4 of 4.`,
      `Apply lights up; one tap, already proven.`,
      `Scores attach to the application automatically.`,
    ],
  },

  /* ── The Outcome ───────────────────────────────────────────── */
  {
    id: "impact",
    type: "closing",
    title: `Impact.`,
    content: `The filter moved to the front, and the interview became the reward.`,
    bullets: [
      `142 applications became 38, every one verified.`,
      `Zero skill surprises reached an interview.`,
      `One test result, reused across every role.`,
      `Post to offer, start to finish on OFM.`,
    ],
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

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
  /* Heading level, not size. The intro beat is the page's only h1; the group
     rails ("The Story") sit a level below it, and every other beat sits under
     a rail. Styling stays on titleClass, so the document outline changes and
     the look does not. */
  const Heading = titleSize === "lg" ? "h1" : "h3";

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
        <Heading
          className={`mb-2 text-txt-heading ${titleClass} ${
            serif ? `${spectral.className} font-normal` : "font-semibold"
          }`}
        >
          {title}
        </Heading>
        <p className="text-[15px] leading-[1.7] text-txt-primary">{content}</p>
        {bullets && bullets.length > 0 && (
          <ul className="mt-3 list-disc space-y-1.5 pl-[18px] text-[15px] leading-[1.6] text-txt-primary marker:text-txt-secondary">
            {bullets.map((b, i) => (
              <li key={i} className="pl-1">
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
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

/* A beat's artifact: the built screen (the intro beat renders the landing
   panel instead, so it has no entry here). */
function Artifact({ id }: { id: string }) {
  const Screen = FLOW_SCREENS[id];
  if (!Screen) return null;
  return (
    <ScaledStage>
      <Screen />
    </ScaledStage>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function OFMJobsTestsPage() {
  const [activeId, setActiveId] = useState(sections[0].id);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Below lg the artifact panel is pinned to the top of the viewport, so the
  // scroll-spy line (and the jump-to-section offset) sit just under it rather
  // than at the desktop's fixed 220px.
  const panelRef = useRef<HTMLDivElement | null>(null);
  const spyLine = () => {
    if (window.innerWidth >= 1024) return 220;
    return (panelRef.current?.getBoundingClientRect().height ?? 0) + 72;
  };


  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (!el) return;
    const top =
      el.getBoundingClientRect().top +
      window.scrollY -
      (spyLine() - 20);
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
        if (el && el.getBoundingClientRect().top <= spyLine()) current = s.id;
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

  const groupLabelFor = (t: SectionType) =>
    t === "story"
      ? "The Story"
      : t === "decision"
      ? "The Decisions"
      : t === "flow"
      ? "The Full Flow"
      : t === "closing"
      ? "The Outcome"
      : "";

  const renderSections = (arr: typeof sections) =>
    arr.map((section, i) => {
      const prev = i > 0 ? arr[i - 1] : null;
      const showGroupHeading =
        (section.type === "story" && prev?.type !== "story") ||
        (section.type === "decision" && prev?.type !== "decision") ||
        (section.type === "flow" && prev?.type !== "flow") ||
        (section.type === "closing" && prev?.type !== "closing");
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
              <h2
                className={`${spectral.className} text-[24px] text-txt-heading pb-[2px] tracking-[-1px]`}
              >
                {groupLabel}
              </h2>
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
      /* demo, not a control: keep its buttons out of the Tab order */
                inert
                className="relative rounded-2xl shadow-lg overflow-hidden max-lg:!w-[min(100%,calc(44svh_*_1.6))]"
      style={{
        aspectRatio: "1440 / 900",
        width: "min(100%, calc(100cqh * (1440 / 900)))",
        containerType: "size",
      }}
    >
      {/* Landing / title beat */}
      <div
        className={`${CROSSFADE} flex flex-col items-center justify-center ${
          active.type === "intro"
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ background: BRAND }}
      >
        <OfmLogo variant="light" gap={BRAND} className="h-[clamp(40px,8cqw,116px)] w-auto" />
        <span className="mt-4 text-[clamp(13px,1.8cqw,26px)] font-semibold tracking-[-0.01em] text-white">
          OFM Jobs
        </span>
        <span
          className={`${spectral.className} mt-6 text-center text-[clamp(24px,3.75cqw,54px)] leading-[1.05] text-white`}
        >
          Tests
        </span>
      </div>

      {/* Every other beat - numbered screen placeholder, crossfaded */}
      <div
        className={`${CROSSFADE} ${
          active.type === "intro"
            ? "opacity-0 pointer-events-none"
            : "opacity-100"
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <Artifact id={activeId} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="flex max-lg:flex-col">
        {/* Left: scrolling narrative */}
        <div className="w-full lg:w-[480px] lg:flex-shrink-0 bg-surface relative">
          {/* max-lg cap: stacked, the narrative would otherwise run ~100
              characters a line at iPad-portrait width against 52 on desktop. */}
          <div className="px-6 py-16 md:px-10 max-lg:pt-8 max-lg:max-w-[520px]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease }}
              className="mb-3 pl-4"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 py-3 -my-3 text-[14px] text-txt-secondary hover:text-txt-heading transition-colors"
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
                  title: "Kanban and AI",
                  descriptor: "Hiring pipeline with AI-ranked candidates.",
                  href: "/kanban-and-ai",
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
        <div
          ref={panelRef}
          className="flex-1 min-w-0 max-lg:order-first max-lg:sticky max-lg:top-0 max-lg:z-30 max-lg:bg-white"
        >
          <div className="sticky top-0 h-screen pl-2 pr-[28px] py-[28px] flex flex-col max-lg:static max-lg:h-auto max-lg:px-3 max-lg:pt-3 max-lg:pb-2">
            <div className="flex-1 rounded-3xl bg-[#f5f0eb] p-[28px] flex flex-col max-lg:p-3">
              <div
                className="relative flex-1 min-h-0 flex items-center justify-center [container-type:size] max-lg:[container-type:inline-size]"
              >
                {/* Called as a function, not <RightCanvas />: an inline component
                    gets a new identity every render, which would remount the
                    whole panel on each scroll tick and kill the crossfades. */}
                {RightCanvas()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
