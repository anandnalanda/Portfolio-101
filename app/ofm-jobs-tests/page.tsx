"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Spectral } from "next/font/google";
import OfmLogo from "@/components/screens/ofm/OfmLogo";
import JobPostRequire from "@/components/screens/ofm/tests/JobPostRequire";
import TestLibrary from "@/components/screens/ofm/tests/TestLibrary";
import GatedJob from "@/components/screens/ofm/tests/GatedJob";
import VerifiedProfile from "@/components/screens/ofm/tests/VerifiedProfile";
import InviteScreen from "@/components/screens/ofm/tests/InviteScreen";
import EnglishTest from "@/components/screens/ofm/tests/EnglishTest";
import VerbalTest from "@/components/screens/ofm/tests/VerbalTest";
import ListeningTest from "@/components/screens/ofm/tests/ListeningTest";
import SpeedTest from "@/components/screens/ofm/tests/SpeedTest";
import TypingTest from "@/components/screens/ofm/tests/TypingTest";
import ScorecardScreen from "@/components/screens/ofm/tests/ScorecardScreen";
import ApplicationUnlocked from "@/components/screens/ofm/tests/ApplicationUnlocked";
import ResultsTable from "@/components/screens/ofm/tests/ResultsTable";
import BoardReturn from "@/components/screens/ofm/tests/BoardReturn";
import PromiseVisual from "@/components/screens/ofm/tests/PromiseVisual";
import LateVisual from "@/components/screens/ofm/tests/LateVisual";
import TestLibraryGrid from "@/components/screens/ofm/tests/TestLibraryGrid";
import JobPostWizard from "@/components/screens/ofm/tests/JobPostWizard";
import DecisionPortable from "@/components/screens/ofm/tests/DecisionPortable";
import CandidatePool from "@/components/screens/ofm/tests/CandidatePool";
import DecisionTrust from "@/components/screens/ofm/tests/DecisionTrust";
import FindWork from "@/components/screens/ofm/tests/FindWork";
import ImpactScreen from "@/components/screens/ofm/tests/ImpactScreen";

/* Deep emerald landing, drawn from the OFM `.kibo` brand hue. */
const BRAND = "#064E3B";

/* The d1 beat: the full "Post a job" wizard, autoplaying a cursor that clicks
   Continue from Details through Requirements to the Tests step. */
function JobPostTestsBeat() {
  return <JobPostWizard autoplay />;
}

/* Beats whose right-panel artifact is built. Others fall back to the
   SpecNote build brief. */
const FLOW_SCREENS: Record<string, React.ComponentType> = {
  promise: PromiseVisual,
  late: LateVisual,
  d1: JobPostTestsBeat,    // test the job, not trivia — the job-post wizard, autoplayed
  d2: FindWork,            // proof to apply, not proof to shortlist — the Find work board, gated by proof
  d3: CandidatePool,       // grade it the moment it's done — the employer's graded candidate pool
  d4: DecisionTrust,       // a score you can trust
  d5: DecisionPortable,    // prove it once, carry it everywhere — employer sees the portable profile
  f1: JobPostRequire,      // set the bar when you post
  f2: TestLibrary,         // a library, not a quiz you build
  f3: GatedJob,            // the job, with a gate
  f4: VerifiedProfile,     // prove it once, on your own time
  f5: InviteScreen,        // what the candidate opens
  f6: EnglishTest,
  f7: VerbalTest,
  f8: ListeningTest,
  f9: SpeedTest,
  f10: TypingTest,
  f11: ScorecardScreen,    // scored, saved to the profile
  f12: ApplicationUnlocked,// application unlocked
  f13: ResultsTable,       // a pre-qualified pool
  f14: BoardReturn,        // verified, from column one
  impact: ImpactScreen,    // the filter moved to the front — outcome dashboard
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
    content: `OFM Jobs got an employer to a shortlist, but a shortlist is a stack of claims. "Fluent English," "fast typist," "great on calls": everyone writes it, few can prove it, and you only found out it was false after an interview you'd already paid for. Tests move the proof all the way to the front. An employer sets the required skills when they post the job, chosen from a shared test library, and a candidate can't apply until they've cleared the bar. Candidates prove it once, on their own time, and carry a verified profile from job to job. I designed and shipped it end to end, from the job post to the gate, the five tests, and the way proof lands back on the board.`,
  },

  /* ── The Story ─────────────────────────────────────────────── */
  {
    id: "promise",
    type: "story",
    title: `A résumé is a promise, not proof.`,
    content: `For these roles the job is the skill itself, and almost none of it survives a CV.`,
    bullets: [
      `Can they actually hold a conversation in English, or just tick "B2"?`,
      `Do they type fast enough to run three chats at once?`,
      `Is their connection even stable enough to work?`,
      `A CV answers none of it, but the job depends on all of it.`,
    ],
  },
  {
    id: "late",
    type: "story",
    title: `You found out too late.`,
    content: `The only place to check a skill was the interview, the most expensive filter in the funnel.`,
    bullets: [
      `Thirty minutes in, you learn they type 22 WPM.`,
      `A call that drops every two minutes, discovered on the call.`,
      `The filter existed; it just sat at the wrong end of the pipe.`,
    ],
  },

  /* ── The Decisions ─────────────────────────────────────────── */
  {
    id: "d1",
    type: "decision",
    title: `Test the job, not trivia.`,
    content: `Five tests, each mapped to something the work actually needs, and nothing it doesn't. An off-the-shelf vendor would have been faster and wrong: generic tests screen generic skills, and they run on someone else's site, so the candidate and the score both leave OFM. So the tests are built native, shaped to chat work, and the result lands straight on the board.`,
    bullets: [
      `English: reading and grammar, the baseline for chat work.`,
      `Verbal: a spoken prompt, recorded, for roles that get on calls.`,
      `Listening: audio comprehension, because half the job is catching what's said.`,
      `Internet speed: the boring thing that quietly ends chat work.`,
      `Typing: raw words-per-minute and accuracy under a clock.`,
    ],
  },
  {
    id: "d2",
    type: "decision",
    title: `Proof to apply, not proof to shortlist.`,
    content: `A test that runs after the shortlist still lets a stack of claims into the pile. So the test became the door. A candidate only sees Apply on the roles their verified skills already clear; the rest stay locked until they prove them. Nothing is submitted below the bar, so the pile an employer receives is pre-filtered, by the standard the role needs, not by a person.`,
    bullets: [
      `Required skills are chosen when the job is posted, not bolted on later.`,
      `Roles a candidate has already proven are one-click apply; the rest stay locked until they take the test.`,
      `Proof sits at the very front of the funnel, where the leak used to start.`,
      `Clearing the bar opens the door, not the job. The employer still chooses among everyone who qualifies.`,
    ],
  },
  {
    id: "d3",
    type: "decision",
    title: `Grade it the moment it's done.`,
    content: `Waiting on a human to mark tests would just move the bottleneck. So the machine grades what it can, the instant it can.`,
    bullets: [
      `Typing and internet speed are measured, not judged. Numbers, not opinions.`,
      `English and listening auto-score against a key.`,
      `Verbal is scored by AI, with the reasoning shown, never a number from nowhere.`,
    ],
  },
  {
    id: "d4",
    type: "decision",
    title: `A score you can trust.`,
    content: `A result nobody understands is a result nobody acts on, and a test that punishes a bad day tests the wrong thing.`,
    bullets: [
      `Every score opens into how it was reached.`,
      `Pass marks are the employer's to set, per test and per role.`,
      `A weak connection or a shaky first take is flagged for a retry, not scored as a fail.`,
      `Retakes and flags stay visible, not buried in an average.`,
    ],
  },
  {
    id: "d5",
    type: "decision",
    title: `Prove it once, carry it everywhere.`,
    content: `Making a candidate re-test for every employer is its own kind of leak. So the proof lives on the candidate, not the application. Take a test on your own time, and the verified score sits on your profile, ready for the next gated job that needs it.`,
    bullets: [
      `Take any test proactively, not only when an employer invites you.`,
      `Verified scores live on the profile and travel from job to job.`,
      `Already clear a job's bar? Apply instantly. "Fluent English" is now "English: 92, verified."`,
    ],
  },

  /* ── The Full Flow ─────────────────────────────────────────── */
  {
    id: "f1",
    type: "flow",
    screen: 1,
    title: `Set the bar when you post.`,
    content: `Requirements aren't an afterthought; they're part of posting the job. Add the skills the role needs and the score each one has to clear.`,
    bullets: [
      `A "Required skills" step, right inside the job post.`,
      `Pull each test from the shared library and set its pass mark.`,
      `The job goes live gated: no proof, no application.`,
    ],
  },
  {
    id: "f2",
    type: "flow",
    screen: 2,
    title: `A library, not a quiz you build.`,
    content: `Nobody writes their own typing test. The tests are standardized and shared, so the same skill means the same thing on every job across OFM.`,
    bullets: [
      `Pick from a catalog of ready, chat-work tests.`,
      `Same test, same scale, every employer, so scores compare.`,
      `Choose it, set the bar, and it's attached to the role.`,
    ],
  },
  {
    id: "f3",
    type: "flow",
    screen: 3,
    title: `The job, with a gate.`,
    content: `On the candidate's side, the listing is honest about what it takes. The required skills sit right up top, and Apply is locked until they're met.`,
    bullets: [
      `The verified skills the role needs, shown before you start.`,
      `A locked Apply button; the bar is visible, never a surprise.`,
      `Green ticks for what you already hold, from earlier tests.`,
    ],
  },
  {
    id: "f4",
    type: "flow",
    screen: 4,
    title: `Prove it once, on your own time.`,
    content: `A candidate doesn't have to wait for an invite. They can take any test proactively and build a verified profile that opens doors before they even knock.`,
    bullets: [
      `Take a test whenever, not only when an employer asks.`,
      `Verified scores live on the profile, ready to reuse.`,
      `One good result unlocks every job that needs it.`,
    ],
  },
  {
    id: "f5",
    type: "flow",
    screen: 5,
    title: `What the candidate opens.`,
    content: `Whether it's to clear a gate or top up a profile, the battery opens as a plain, unintimidating page: here's what you'll do, here's how long it takes.`,
    bullets: [
      `The set laid out up front, with an honest time estimate.`,
      `A mic and connection check before anything counts.`,
      `One button to begin; the battery runs itself from there.`,
    ],
  },
  {
    id: "f6",
    type: "flow",
    screen: 6,
    title: `English.`,
    content: `A short reading-and-grammar set that mirrors the messages they'd actually send.`,
    bullets: [
      `Real chat snippets, not textbook sentences.`,
      `One question at a time, auto-advancing.`,
      `Auto-scored against the key the moment it ends.`,
    ],
  },
  {
    id: "f7",
    type: "flow",
    screen: 7,
    title: `Verbal.`,
    content: `A prompt on screen, a recorder underneath: say your answer out loud.`,
    bullets: [
      `A scenario to respond to, like a real customer.`,
      `Record, hear it back, submit.`,
      `AI scores fluency and clarity, and shows why.`,
    ],
  },
  {
    id: "f8",
    type: "flow",
    screen: 8,
    title: `Listening.`,
    content: `Play a clip, answer what it asked, the half of the job that isn't typing.`,
    bullets: [
      `Short audio, played once or twice.`,
      `Comprehension questions that follow the clip.`,
      `Auto-scored, no employer time spent.`,
    ],
  },
  {
    id: "f9",
    type: "flow",
    screen: 9,
    title: `Internet speed.`,
    content: `A live test of the thing that silently decides whether someone can do chat work at all.`,
    bullets: [
      `Download, upload, and ping, measured live.`,
      `A clear pass line for what the work needs.`,
      `Flagged, not failed, so a bad reading can be retried.`,
    ],
  },
  {
    id: "f10",
    type: "flow",
    screen: 10,
    title: `Typing.`,
    content: `A timed passage with words-per-minute and accuracy ticking up as they type.`,
    bullets: [
      `Live WPM and accuracy, no waiting for a result.`,
      `The same passage for everyone, so scores compare.`,
      `One number the employer already understands.`,
    ],
  },
  {
    id: "f11",
    type: "flow",
    screen: 11,
    title: `Scored, and saved to the profile.`,
    content: `The moment they finish, one card sums the battery, and the results don't just vanish into one employer's inbox.`,
    bullets: [
      `Five results in a row, each with a pass or a flag.`,
      `The AI's notes on the verbal answer, in plain words.`,
      `Saved to the profile, not sent once and gone.`,
    ],
  },
  {
    id: "f12",
    type: "flow",
    screen: 12,
    title: `Application unlocked.`,
    content: `Back on the gated job, the proof does its work: every required skill turns green, the lock falls away, and applying takes one tap.`,
    bullets: [
      `Cleared the bar, so Apply lights up.`,
      `The verified scores attach to the application automatically.`,
      `You apply already proven, not just hopeful.`,
    ],
  },
  {
    id: "f13",
    type: "flow",
    screen: 13,
    title: `A pre-qualified pool.`,
    content: `On the employer's side, the applicant list looks different now: everyone in it has already cleared the bar. There's nothing to weed out, only the best to find.`,
    bullets: [
      `Every applicant already meets the required skills.`,
      `Sort among the qualified, not sift through the claimed.`,
      `Verified badges on every row, comparable at a glance.`,
    ],
  },
  {
    id: "f14",
    type: "flow",
    screen: 14,
    title: `Verified, from column one.`,
    content: `The pipeline starts where it used to end. The very first column is already proven, and the AI match score rests on evidence, not a résumé's word.`,
    bullets: [
      `The first Kanban column is verified, not hopeful.`,
      `Open a card and the full scorecard is right there.`,
      `Testing and pipeline, the two halves of OFM Jobs, become one flow.`,
    ],
  },

  /* ── The Outcome ───────────────────────────────────────────── */
  {
    id: "impact",
    type: "closing",
    title: `Impact.`,
    content: `Claims became proof, and the filter moved all the way to the front. The board stopped being a place to weed out bad fits; every candidate on it had already cleared the bar. The interview became the reward for passing, not the place you discovered the truth.`,
    bullets: [
      `Applications arrived pre-qualified, so the "types 22 WPM" surprise never reached the board.`,
      `Candidates who tested proactively applied in one tap and reused a single result across roles.`,
      `A role went from open post to a verified, ranked pool without a manual screen in between.`,
      `Hiring, from post to offer, now runs start to finish on OFM, so the platform earns a seat at every hire.`,
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

/* ------------------------------------------------------------------ */
/*  Right-panel build briefs - what each beat's screen/illustration is */
/* ------------------------------------------------------------------ */

type Note = {
  /** tag shown top-left, e.g. "Screen 3", "Illustration", "Diagram" */
  kind: string;
  headline: string;
  what: string;
  /** the concrete elements to build on the artboard */
  onScreen: string[];
  /** the motion / illustration idea */
  motion: string;
};

const NOTES: Record<string, Note> = {
  /* Story illustrations */
  promise: {
    kind: "Illustration",
    headline: "Claims without proof",
    what: "A hand-drawn profile whose skill claims can't be trusted.",
    onScreen: [
      "A candidate card with claim chips: 'Fluent English', 'Fast typist', 'Great on calls'.",
      "Each chip stamped with a faint '?': asserted, never verified.",
      "Loose sketch-line style, muted ink (match the Kanban story visual).",
    ],
    motion: "Each chip flickers between its claim and a question mark on a slow loop.",
  },
  late: {
    kind: "Illustration",
    headline: "The expensive filter",
    what: "The interview is where the truth finally shows up, too late.",
    onScreen: [
      "A video-call frame: two avatars, a live call bar.",
      "A typing meter creeping up and stalling at '22 WPM'.",
      "A '30 min' cost tag and a dropping connection blip.",
    ],
    motion: "The WPM needle rises and stalls at 22; the call bars fall to one, then a 'reconnecting' flicker.",
  },

  /* Decision illustrations / diagrams */
  d1: {
    kind: "Diagram",
    headline: "Five tests, one job",
    what: "The battery as a single set, each test mapped to a real skill.",
    onScreen: [
      "Five labeled tiles in a row: English, Verbal, Listening, Internet speed, Typing, each with its icon.",
      "A one-line 'why' under each (baseline / on calls / catches what's said / connection / speed).",
      "Reads as one battery, not five forms.",
    ],
    motion: "Tiles stagger in left to right; the row settles as a single grouped set.",
  },
  d2: {
    kind: "Screen",
    headline: "The test is the door",
    what: "The candidate's Find work board: you can only apply where proof clears the bar.",
    onScreen: [
      "A job list split into 'Ready to apply' and 'A few tests away'.",
      "Verified skills clear the bar on several jobs at once. One-tap Apply on those.",
      "The rest stay locked, showing exactly which tests would open them.",
    ],
    motion: "The job cards reveal top to bottom; the apply-ready jobs sit above the gated ones.",
  },
  d3: {
    kind: "Screen",
    headline: "A pool of graded candidates",
    what: "The employer's applicant pool + one candidate's full detail.",
    onScreen: [
      "A candidate list, each already scored. No queue, everyone auto-graded.",
      "The selected candidate's results by grading method: measured, auto-scored, AI-scored with its reasoning.",
      "Her experience and languages alongside the scorecard.",
    ],
    motion: "The verbal 'why' note types out beneath its AI score.",
  },
  d4: {
    kind: "Screen",
    headline: "A score you can open",
    what: "Explainable scores, employer-set pass marks, fair retries.",
    onScreen: [
      "A score chip that expands into its breakdown (how it was reached).",
      "A pass-mark control per test.",
      "A 'flagged for retry' row on a weak connection, not a fail.",
    ],
    motion: "A score expands to reveal its reasons; a flagged row surfaces a 'retry' affordance.",
  },
  d5: {
    kind: "Screen",
    headline: "Prove it once, carry it everywhere",
    what: "The employer opens a candidate whose proof predates this job.",
    onScreen: [
      "A candidate profile holding verified badges: 'English 92', 'Typing 68'.",
      "Earned before this job, already attached. No re-testing asked.",
      "The same scores already unlocked other roles she applied to.",
    ],
    motion: "The verified badges stagger in, each stamped with when it was earned.",
  },

  /* Flow screens */
  f1: {
    kind: "Screen 1",
    headline: "Pick the tests, send the invite",
    what: "Employer builds the battery from the role. Kibo shell.",
    onScreen: [
      "DashboardShell (Kibo) with the role/applicant in view.",
      "Five test toggles, each with a pass-mark and time-limit field.",
      "'Copy link' / 'Invite from card' action.",
    ],
    motion: "Toggling a test on scaffolds its pass-mark row inline.",
  },
  f2: {
    kind: "Screen 2",
    headline: "What the candidate opens",
    what: "The invite page: plain, honest, one button to start.",
    onScreen: [
      "Candidate chrome (not the employer shell): clean and calm.",
      "The five tests listed with an honest time estimate (~10 min).",
      "A mic + connection pre-check, then a 'Begin' CTA.",
    ],
    motion: "The connection check runs a quick pulse, then goes green.",
  },
  f3: {
    kind: "Screen 3",
    headline: "English",
    what: "Reading and grammar, from real chat snippets.",
    onScreen: [
      "One question at a time, framed as a real chat message.",
      "3 to 4 options; a '3 of 10' progress marker.",
      "Auto-advance on select.",
    ],
    motion: "Selecting an option slides the next question in.",
  },
  f4: {
    kind: "Screen 4",
    headline: "Verbal",
    what: "A spoken response to a scenario, recorded.",
    onScreen: [
      "A scenario prompt (a demanding customer message).",
      "A record button with a live waveform; playback + submit.",
      "'AI scores fluency & clarity' note.",
    ],
    motion: "The waveform animates while recording; on submit, a score and one-line reason appear.",
  },
  f5: {
    kind: "Screen 5",
    headline: "Listening",
    what: "An audio clip, then a comprehension question.",
    onScreen: [
      "An audio player (play once or twice) with a scrubber.",
      "A comprehension question below the clip.",
      "Auto-scored, no employer time.",
    ],
    motion: "The scrubber plays through; the question reveals once the clip ends.",
  },
  f6: {
    kind: "Screen 6",
    headline: "Internet speed",
    what: "A live speedometer for the connection.",
    onScreen: [
      "A large animated gauge with a needle; live Mbps counting up.",
      "Download / upload / ping tiles.",
      "A clear pass-line marker.",
    ],
    motion: "The needle sweeps and the numbers tick, landing above or below the pass line.",
  },
  f7: {
    kind: "Screen 7",
    headline: "Typing",
    what: "A timed passage with live WPM and accuracy.",
    onScreen: [
      "A passage with a moving caret; typed characters highlighted.",
      "Live WPM + accuracy counters and a countdown.",
      "The same passage for everyone, so scores compare.",
    ],
    motion: "Words highlight as if typed; WPM ticks up while the timer counts down.",
  },
  f8: {
    kind: "Screen 8",
    headline: "The candidate's scorecard",
    what: "All five results summed in one card.",
    onScreen: [
      "Five result rows: English, Verbal, Listening, Speed, Typing, each pass or flag.",
      "The AI's verbal note in plain words.",
      "A 'sent to the employer' confirmation.",
    ],
    motion: "Rows fill in one by one, ending on a 'sent' tick.",
  },
  f9: {
    kind: "Screen 9",
    headline: "The employer's view",
    what: "Every tested candidate, ranked and comparable.",
    onScreen: [
      "A table: one row per candidate, five test columns plus a combined score.",
      "Sortable columns and verified badges.",
      "A way back to the pipeline.",
    ],
    motion: "Sorting by combined score reorders the rows.",
  },
  f10: {
    kind: "Screen 10",
    headline: "Back on the board",
    what: "The verified score living on the Kanban card. Reuses PipelineBoard.",
    onScreen: [
      "The PipelineBoard (reused from Kanban) with a candidate card.",
      "'English 92 · verified' on the card; match score 'evidence-based'.",
      "Open the card and the scorecard is right there.",
    ],
    motion: "The card's claimed chips flip to verified; the match score updates in place.",
  },

  /* Outcome */
  impact: {
    kind: "Outcome",
    headline: "The filter moved to the front",
    what: "Fewer, better interviews; hiring stays on OFM.",
    onScreen: [
      "A funnel: many applicants to a verified shortlist to a small set of the right interviews.",
      "A 'stays on OFM' loop closing on-platform.",
      "The directional outcomes as quiet stat callouts.",
    ],
    motion: "The funnel narrows to a verified few; the loop closes and settles.",
  },
};

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

/* A beat's artifact: the built screen if it exists, else its build brief. */
function Artifact({ id }: { id: string }) {
  const Screen = FLOW_SCREENS[id];
  if (Screen) {
    return (
      <ScaledStage>
        <Screen />
      </ScaledStage>
    );
  }
  return <SpecNote id={id} />;
}

function SpecNote({ id }: { id: string }) {
  const note = NOTES[id];
  if (!note) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white text-[14px] text-zinc-400">
        Build note pending
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col bg-white p-[7%] text-left">
      <div className="flex items-center gap-2">
        <span className="size-1.5 rounded-full" style={{ background: BRAND }} aria-hidden />
        <span
          className="text-[12px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: BRAND }}
        >
          {note.kind}
        </span>
      </div>
      <h3 className="mt-3 text-[clamp(20px,3.4cqw,32px)] font-semibold leading-tight text-zinc-900">
        {note.headline}
      </h3>
      <p className="mt-2 max-w-[60ch] text-[clamp(12px,1.6cqw,16px)] leading-relaxed text-zinc-500">
        {note.what}
      </p>

      <div className="mt-[6%] h-px bg-zinc-100" />

      <div className="mt-[6%] grid flex-1 grid-cols-2 gap-8">
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
            On screen
          </h4>
          <ul className="mt-3 list-disc space-y-2 pl-4 text-[clamp(11px,1.4cqw,14px)] leading-snug text-zinc-700 marker:text-zinc-300">
            {note.onScreen.map((b, i) => (
              <li key={i} className="pl-1">
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
            Motion / illustration
          </h4>
          <p className="mt-3 text-[clamp(11px,1.4cqw,14px)] leading-relaxed text-zinc-700">
            {note.motion}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function OFMJobsTestsPage() {
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
          active.type === "intro"
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
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
            <Artifact id={activeId} />
          </div>
        </div>
      </div>
    </div>
  );
}
