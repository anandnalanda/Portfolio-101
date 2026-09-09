"use client";

import { motion } from "framer-motion";
import { Spectral } from "next/font/google";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import OfmRightPanel from "@/components/visual-direction/ofm-jobs/OfmRightPanel";
import JobslyRightPanel from "@/components/visual-direction/jobsly/JobslyRightPanel";
import ScaledCanvas from "@/components/screens/_ui/ScaledCanvas";

/**
 * Visual Direction case study - same scrollytelling chrome as the other case
 * studies (left narration column + sticky right panel), with a brand TOGGLE at
 * the top of the left column to switch between OFM Jobs and Jobsly. Each brand
 * is a full case: how the site was designed - design system, typography, craft.
 *
 * The left column is the neutral portfolio narrator. The right panel (brand
 * world) is a placeholder for now - built next, per brand.
 */

const spectral = Spectral({ subsets: ["latin"], weight: ["400"] });
const ease = [0.22, 1, 0.36, 1] as const;

/* The right column measures ~920x690 at a 1440-wide desktop. Below lg the panel
   is drawn at exactly this size and scaled to fit, so the composition a phone
   sees is the composition a laptop sees. 4:3 matches the mobile aspect box. */
const PANEL_DESIGN_W = 920;
const PANEL_DESIGN_H = 690;

type BrandId = "ofm" | "jobsly";

type Beat = {
  id: string;
  group?: string;
  title: string;
  body?: string;
  bullets?: string[];
  meta?: { label: string; value: string }[];
  link?: { label: string; href: string };
};

type BrandContent = {
  label: string;
  accent: string; // left toggle + active-beat accent
  beats: Beat[];
};

/* ── content ──────────────────────────────────────────────────────── */

const CONTENT: Record<BrandId, BrandContent> = {
  ofm: {
    label: "OFM Jobs",
    accent: "#006E42",
    beats: [
      {
        id: "ofm-open",
        title: "OFM Jobs",
        meta: [
          { label: "Role", value: "Design & build" },
          { label: "Status", value: "In production" },
        ],
        body: "The hiring platform for OnlyFans agencies, designed and built end to end. A calm, confident product surface with a marketing layer that has some energy.",
        link: { label: "View the live site", href: "https://ofmjobs.com/" },
      },
      {
        id: "ofm-attrs",
        group: "Visual language",
        title: "Guiding attributes",
        body: "Before any colour or type, I set the feeling the product should carry:",
        bullets: [
          "Credible: a real hiring tool, nothing like a gig board",
          "Calm: hiring is stressful; the UI stays composed",
          "Approachable: people-first, gently rounded",
        ],
      },
      {
        id: "ofm-color",
        group: "Visual language",
        title: "Colour",
        body: "A role-based colour system around a deep forest green, defined as Tailwind theme tokens so every surface and state derives from it. It holds up on colour-theory too:",
        bullets: [
          "Monochromatic green reads calm and credible, right for hiring",
          "Green-tinted neutrals unify the UI, so nothing reads as sterile grey",
          "A reserved maroon keeps red exclusively for errors",
          "on-* pairings guarantee AA/AAA text contrast",
        ],
      },
      {
        id: "ofm-type",
        group: "Visual language",
        title: "Type, corners & elevation",
        body: "One grotesk, Hanken Grotesk, carries display through body, friendly and legible without turning startup-generic. Shapes stay pill-first and soft (radii 1–3rem), and depth reads through a Tailwind shadow scale (sm → 2xl) rather than colour.",
      },
      {
        id: "ofm-hero-video",
        group: "Visual language",
        title: "The hero, generated with AI",
        body: "The homepage hero is a cinematic video I generated with Google Flow, with no shoot, no crew and no location. A custom production of this quality would run close to $60k; here it was prompts and iteration.",
      },
      {
        id: "ofm-pages-1",
        group: "The shipped site",
        title: "Sneak Peek 1",
        body: "The system in production: the marketing homepage and the pricing table. The same tokens, type and gradients carry from a photographic hero to a dense plan grid.",
      },
      {
        id: "ofm-pages-2",
        group: "The shipped site",
        title: "Sneak Peek 2",
        body: "And across the rest of the site, from the comparison page to the blog, the language holds up on busy, content-heavy layouts.",
      },
    ],
  },
  jobsly: {
    label: "Jobsly",
    accent: "#0B1F1A",
    beats: [
      {
        id: "jobsly-open",
        title: "Jobsly",
        meta: [
          { label: "Role", value: "Design & build" },
          { label: "Status", value: "Live" },
        ],
        body: "An AI hiring platform that runs the whole pipeline through one conversational agent, so a team can hire without a hiring team. I owned the product surface: the interaction model, the design system, and the shipped screens.",
        link: { label: "View the live site", href: "https://jobsly.com/" },
      },
      {
        id: "jobsly-attrs",
        group: "Visual language",
        title: "Guiding attributes",
        body: "Automating hiring decisions is a trust problem before it is a UI problem, so three attributes anchored every screen:",
        bullets: [
          "In control: you approve, the agent executes, and every action stays logged and reversible",
          "Legible: each AI judgement cites the rubric it scored against, so there is no black box",
          "Quietly capable: a calm agent that surfaces the decision and gets out of the way",
        ],
      },
      {
        id: "jobsly-color",
        group: "Visual language",
        title: "Colour",
        body: "A near-black canvas, layered with barely-there dark surfaces and hairlines, lit by a single indigo accent for the agent's voice and the primary action. Green is held back for success alone, so colour only ever marks meaning.",
      },
      {
        id: "jobsly-type",
        group: "Visual language",
        title: "Type, corners & elevation",
        body: "A clean grotesk built for density: chat transcripts, rubrics and candidate tables sit side by side without noise. Tighter radii and restrained elevation give it a tool-like feel, purposeful rather than playful.",
      },
      {
        id: "jobsly-agent",
        group: "Visual language",
        title: "Designing the agent",
        body: "The primary UI is a conversation. I designed the agent to move through six pipeline stages, from brief and sourcing to screening, interviews, references and hire, as one steerable thread, with structured data folding into the chat at each decision point.",
      },
      {
        id: "jobsly-pages-1",
        group: "The shipped site",
        title: "Sneak Peek 1",
        body: "The shipped surface: the landing and the pricing page, where the six-stage pipeline is walked through as real conversations rather than feature bullets.",
      },
      {
        id: "jobsly-pages-2",
        group: "The shipped site",
        title: "Sneak Peek 2",
        body: "And across the deeper stage pages, from hire to interview, the same dark system and accent hold up on busy, data-first layouts.",
      },
    ],
  },
};

/* ── narrative section (left card) ────────────────────────────────── */

function NarrativeSection({
  beat,
  active,
  onNavigate,
  isOpen,
}: {
  beat: Beat;
  active: boolean;
  onNavigate: () => void;
  isOpen: boolean;
}) {
  /* Heading level, not size. The opening beat is the page's only h1; the group
     rails sit a level below it, and every other beat sits under a rail. */
  const Heading = isOpen ? "h1" : "h3";

  return (
    <div className="mb-6">
      <div
        onClick={() => {
          if (window.getSelection()?.toString()) return;
          onNavigate?.();
        }}
        className={`group cursor-pointer border-l-[2.4px] px-4 py-4 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          active
            ? "border-l-txt-secondary bg-surface-muted opacity-100"
            : "border-l-transparent opacity-[0.75] hover:bg-black/[0.02] hover:opacity-100"
        }`}
      >
        <Heading
          className={`mb-2 text-txt-heading ${
            isOpen
              ? `${spectral.className} text-[28px] font-normal leading-tight tracking-[-0.02em]`
              : "text-[18px] font-semibold"
          }`}
        >
          {beat.title}
        </Heading>

        {beat.meta && (
          <div className="mb-3 flex gap-8">
            {beat.meta.map((m) => (
              <div key={m.label}>
                <div className="text-[11px] uppercase tracking-[0.1em] text-txt-secondary">
                  {m.label}
                </div>
                <div className="text-[14px] font-medium text-txt-heading">
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-[15px] leading-[1.7] text-txt-primary">
          {beat.body && <p>{beat.body}</p>}
          {beat.bullets && (
            <ul
              className={`${
                beat.body ? "mt-2.5" : ""
              } list-disc space-y-1.5 pl-[18px] marker:text-txt-secondary`}
            >
              {beat.bullets.map((b, i) => (
                <li key={i} className="pl-1">
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>

        {beat.link && (
          <a
            href={beat.link.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#1c1c1e] px-4 py-2 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-[#33343a]"
          >
            {beat.link.label}
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="9 7 17 7 17 15" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

/* ── page ─────────────────────────────────────────────────────────── */

export default function VisualDirectionPage() {
  const [brand, setBrand] = useState<BrandId>("ofm");
  /* The brand panels are laid out for a ~920px-wide desktop column and carry
     40-odd fixed pixel type sizes, so they cannot simply reflow into a phone.
     Below lg they are rendered at their design width and zoomed down instead —
     the same "identical screen, only the zoom differs" trick the other case
     studies use via ScaledCanvas. Starts false so the server and the first
     client paint agree; the effect corrects it before anything is visible. */
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023.98px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const content = CONTENT[brand];
  const beats = content.beats;

  const [activeId, setActiveId] = useState(beats[0].id);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Below lg the panel is pinned to the top of the viewport, so the scroll-spy
  // line sits just under it rather than at the desktop's 220px. Same rule as
  // every other case study.
  const spyLine = () => {
    if (window.innerWidth >= 1024) return 220;
    return (panelRef.current?.getBoundingClientRect().height ?? 0) + 72;
  };

  // reset when the brand toggles
  useEffect(() => {
    setActiveId(CONTENT[brand].beats[0].id);
    window.scrollTo({ top: 0 });
  }, [brand]);

  // beat-by-beat scroll - one deliberate scroll (or arrow / page key) advances
  // exactly one beat, so the whole study reads one beat at a time. Desktop +
  // motion only; touch, reduced-motion and small screens keep native scrolling.
 
  const scrollTo = (id: string) => {
    const el = refs.current[id];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - (spyLine() - 20);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  };

  // scroll-spy - last beat whose top crossed the line is active
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      let current = beats[0].id;
      for (const b of beats) {
        const el = refs.current[b.id];
        if (el && el.getBoundingClientRect().top <= spyLine()) current = b.id;
      }
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 120
      ) {
        current = beats[beats.length - 1].id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [beats]);

  const activeBeat = beats.find((b) => b.id === activeId) ?? beats[0];

  return (
    <div className="min-h-screen bg-white">
      <div className="flex max-lg:flex-col">
        {/* ── left: narration + brand toggle ── */}
        <div className="relative w-full bg-surface lg:w-[480px] lg:flex-shrink-0">
          {/* max-lg cap: stacked, the narrative would otherwise run ~100
              characters a line at iPad-portrait width against 52 on desktop. */}
          <div className="px-6 py-16 md:px-10 max-lg:pt-8 max-lg:max-w-[520px]">
            <div className="mb-6 pl-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 py-3 -my-3 text-[14px] text-txt-secondary transition-colors hover:text-txt-heading"
              >
                <span>←</span> Home
              </Link>
            </div>

            {/* brand toggle - a segmented control with a sliding active pill,
                left-aligned to the Home link and body text above/below it */}
            <div className="mb-8 pl-4">
              <div
                role="tablist"
                aria-label="Case study"
                className="inline-flex items-center gap-1 rounded-full border border-surface-border bg-white p-1 shadow-sm"
              >
                {(Object.keys(CONTENT) as BrandId[]).map((id) => {
                  const selected = id === brand;
                  return (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setBrand(id)}
                      className="relative rounded-full px-4 py-2.5 text-[13px] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-txt-heading/30"
                    >
                      {selected && (
                        <motion.span
                          layoutId="brandPill"
                          className="absolute inset-0 rounded-full bg-[#1c1c1e]"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span
                        className={`relative z-10 transition-colors duration-200 ${
                          selected ? "text-white" : "text-txt-secondary hover:text-txt-heading"
                        }`}
                      >
                        {CONTENT[id].label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {beats.map((beat, i) => {
              const prev = i > 0 ? beats[i - 1] : null;
              const showGroup = beat.group && beat.group !== prev?.group;
              return (
                <div
                  key={beat.id}
                  ref={(el) => {
                    refs.current[beat.id] = el;
                  }}
                >
                  {showGroup && (
                    <div className="mb-4 mt-12 pl-4">
                      <h2
                        className={`${spectral.className} pb-[2px] text-[24px] tracking-[-1px] text-txt-heading`}
                      >
                        {beat.group}
                      </h2>
                      <div className="border-b border-surface-border" />
                    </div>
                  )}
                  <NarrativeSection
                    beat={beat}
                    active={beat.id === activeId}
                    onNavigate={() => scrollTo(beat.id)}
                    isOpen={i === 0}
                  />
                </div>
              );
            })}

            {/* Continue reading - fills the trailing scroll room the sticky
                panel needs to reveal the last beats with useful nav instead of
                empty space, like the other case studies */}
            <div className="mt-16">
              <h4 className="mb-2 pl-4 text-[12px] uppercase tracking-[0.08em] text-txt-secondary">
                Continue Reading
              </h4>
              {[
                { title: "Staple Chat", descriptor: "Ask questions of your data in plain language.", href: "/staple-chat" },
                { title: "Staple Tables", descriptor: "Turn documents into clean, editable tables.", href: "/staple-tables" },
                { title: "Kanban and AI", descriptor: "Hiring pipeline with AI-ranked candidates.", href: "/kanban-and-ai" },
                { title: "OFM Jobs Tests", descriptor: "Assessment system with AI-powered hiring.", href: "/ofm-jobs-tests" },
              ].map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="block border-b border-surface-border py-4 pl-4 transition-all duration-[250ms] ease-out hover:bg-black/[0.02]"
                >
                  <h5 className="text-[15px] font-semibold text-txt-heading">{p.title}</h5>
                  <p className="mt-0.5 text-[13px] text-txt-secondary">{p.descriptor}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── right: sticky brand world ── */}
        {/* Below lg this used to be `max-lg:hidden`, which meant phones and
            tablets got the narration with none of the work it describes. It now
            follows the same stacked treatment as every other case study: the
            panel rides to the top of the column and pins there while the
            narrative scrolls under it. */}
        <div
          ref={panelRef}
          className="min-w-0 flex-1 max-lg:order-first max-lg:sticky max-lg:top-0 max-lg:z-30 max-lg:bg-white"
        >
          <div className="sticky top-0 flex h-screen flex-col py-[28px] pl-2 pr-[28px] max-lg:static max-lg:h-auto max-lg:px-3 max-lg:pt-3 max-lg:pb-2">
            {/* Both brand panels size themselves with h-full, so once this
                column stops being h-screen below lg they would collapse to zero
                height. The aspect box gives them a real one — the same fix the
                interactive-globe case study uses for its fluid panel. */}
            <div className="relative flex min-h-0 flex-1 flex-col max-lg:aspect-[4/3] max-lg:flex-none">
              {narrow ? (
                <ScaledCanvas designWidth={PANEL_DESIGN_W}>
                  <div style={{ height: PANEL_DESIGN_H }}>
                    {brand === "ofm" ? (
                      <OfmRightPanel activeId={activeId} />
                    ) : (
                      <JobslyRightPanel activeId={activeId} />
                    )}
                  </div>
                </ScaledCanvas>
              ) : brand === "ofm" ? (
                <OfmRightPanel activeId={activeId} />
              ) : (
                <JobslyRightPanel activeId={activeId} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
