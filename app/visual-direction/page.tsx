"use client";

import { motion } from "framer-motion";
import { Spectral } from "next/font/google";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import OfmRightPanel from "@/components/visual-direction/ofm-jobs/OfmRightPanel";
import JobslyRightPanel from "@/components/visual-direction/jobsly/JobslyRightPanel";

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
        link: { label: "Visit the live site", href: "https://ofmjobs.com/" },
      },
      {
        id: "ofm-attrs",
        group: "Visual language",
        title: "Guiding attributes",
        body: "Before any colour or type, I set the feeling the product should carry:",
        bullets: [
          "Credible: a real hiring tool, not a sketchy gig board",
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
          "Green-tinted neutrals unify the UI, no sterile grey",
          "A reserved maroon keeps red exclusively for errors",
          "on-* pairings guarantee AA/AAA text contrast",
        ],
      },
      {
        id: "ofm-type",
        group: "Visual language",
        title: "Type, corners & elevation",
        body: "One grotesk, Hanken Grotesk, carries display through body: friendly, legible, never startup-generic. Shapes stay pill-first and soft (radii 1–3rem), and depth reads through a Tailwind shadow scale (sm → 2xl), not colour.",
      },
      {
        id: "ofm-hero-video",
        group: "Visual language",
        title: "The hero, generated with AI",
        body: "The homepage hero is a cinematic video I generated with Google Flow: no shoot, no crew, no location. A custom production of this quality would run close to $60k; here it was prompts and iteration.",
      },
      {
        id: "ofm-pages-1",
        group: "The shipped site",
        title: "Sneak Peak 1",
        body: "The system in production: the marketing homepage and the pricing table. The same tokens, type and gradients carry from a photographic hero to a dense plan grid.",
      },
      {
        id: "ofm-pages-2",
        group: "The shipped site",
        title: "Sneak Peak 2",
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
          { label: "Role", value: "Design & Build" },
          { label: "Status", value: "Live" },
        ],
        body: "An AI hiring platform that runs the whole pipeline through one conversational agent, so a team can hire without a hiring team. I owned the product surface: the interaction model, the design system, and the shipped screens.",
        link: { label: "Visit the live site", href: "https://jobsly.com/" },
      },
      {
        id: "jobsly-attrs",
        group: "Visual language",
        title: "Guiding attributes",
        body: "Automating hiring decisions is a trust problem before it is a UI problem. Three attributes anchored every screen:",
        bullets: [
          "In control: you approve, the agent executes, and every action stays logged and reversible",
          "Legible: each AI judgement cites the rubric it scored against, never a black box",
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
        body: "The primary UI is a conversation, not a dashboard. I designed the agent to move through six pipeline stages, from brief and sourcing to screening, interviews, references and hire, as one steerable thread, with structured data folding into the chat at each decision point.",
      },
      {
        id: "jobsly-pages-1",
        group: "The shipped site",
        title: "Sneak Peak 1",
        body: "The shipped surface: the landing and the product tour, where the six-stage pipeline is walked through as real conversations rather than feature bullets.",
      },
      {
        id: "jobsly-pages-2",
        group: "The shipped site",
        title: "Sneak Peak 2",
        body: "And across the rest of the site, from pricing to the deeper stage pages, the same dark system and accent hold up on busy, data-first layouts.",
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
  return (
    <div className="mb-6">
      <div
        onClick={onNavigate}
        className={`group cursor-pointer border-l-[2.4px] px-4 py-4 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          active
            ? "border-l-txt-secondary bg-surface-muted opacity-100"
            : "border-l-transparent opacity-[0.75] hover:bg-black/[0.02] hover:opacity-100"
        }`}
      >
        <h2
          className={`mb-2 text-txt-heading ${
            isOpen
              ? `${spectral.className} text-[28px] font-normal leading-tight tracking-[-0.02em]`
              : "text-[18px] font-semibold"
          }`}
        >
          {beat.title}
        </h2>

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
  const content = CONTENT[brand];
  const beats = content.beats;

  const [activeId, setActiveId] = useState(beats[0].id);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const footerRef = useRef<HTMLDivElement | null>(null);
  const idxRef = useRef(0); // current stop index for the beat-by-beat scroll

  // reset when the brand toggles
  useEffect(() => {
    setActiveId(CONTENT[brand].beats[0].id);
    idxRef.current = 0;
    window.scrollTo({ top: 0 });
  }, [brand]);

  // beat-by-beat scroll - one deliberate scroll (or arrow / page key) advances
  // exactly one beat, so the whole study reads one beat at a time. Desktop +
  // motion only; touch, reduced-motion and small screens keep native scrolling.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    const OFFSET = 150;
    let cooldown: ReturnType<typeof setTimeout> | null = null;

    const stops = () => {
      const list = beats
        .map((b) => refs.current[b.id])
        .filter((el): el is HTMLDivElement => !!el);
      if (footerRef.current) list.push(footerRef.current);
      return list;
    };

    // deterministic ±1 step from the tracked index, so momentum can never make
    // it jump two beats and skip one
    const step = (dir: 1 | -1) => {
      const list = stops();
      if (!list.length) return;
      const next = Math.min(list.length - 1, Math.max(0, idxRef.current + dir));
      if (next === idxRef.current) return;
      idxRef.current = next;
      const top = list[next].getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    };

    // one step per gesture: the first event fires immediately; the cooldown then
    // refreshes on every following event, so a trackpad flick's inertia tail is
    // absorbed into a single step (the cause of the skipped beat).
    const gate = () => {
      const idle = cooldown === null;
      if (cooldown) clearTimeout(cooldown);
      cooldown = setTimeout(() => {
        cooldown = null;
      }, 160);
      return idle;
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 2) return;
      e.preventDefault();
      if (gate()) step(e.deltaY > 0 ? 1 : -1);
    };
    const onKey = (e: KeyboardEvent) => {
      const down = ["ArrowDown", "PageDown", " ", "Spacebar"].includes(e.key);
      const up = ["ArrowUp", "PageUp"].includes(e.key);
      if (!down && !up) return;
      e.preventDefault();
      if (gate()) step(down ? 1 : -1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      if (cooldown) clearTimeout(cooldown);
    };
  }, [beats]);

  const scrollTo = (id: string) => {
    const el = refs.current[id];
    if (!el) return;
    const i = beats.findIndex((b) => b.id === id);
    if (i >= 0) idxRef.current = i;
    const top = el.getBoundingClientRect().top + window.scrollY - 200;
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
        if (el && el.getBoundingClientRect().top <= 220) current = b.id;
      }
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 24
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
        <div className="relative w-full bg-surface md:w-[440px] md:flex-shrink-0 lg:w-[480px]">
          <div className="px-6 py-16 md:px-10">
            <div className="mb-6 pl-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[14px] text-txt-secondary transition-colors hover:text-txt-heading"
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
                      className="relative rounded-full px-4 py-1.5 text-[13px] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-txt-heading/30"
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
                      <h3
                        className={`${spectral.className} pb-[2px] text-[24px] tracking-[-1px] text-txt-heading`}
                      >
                        {beat.group}
                      </h3>
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

            {/* live-site button - below the shipped-site beats, per brand */}
            {beats[0].link && (
              <div className="mt-8 pl-4">
                <a
                  href={beats[0].link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#1c1c1e] px-4 py-2 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-[#33343a]"
                >
                  Visit the live site
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
              </div>
            )}

            {/* Continue reading - fills the trailing scroll room the sticky
                panel needs to reveal the last beats with useful nav instead of
                empty space, like the other case studies */}
            <div ref={footerRef} className="mt-14">
              <h4 className="mb-2 pl-4 text-[12px] uppercase tracking-[0.08em] text-txt-secondary">
                Continue reading
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
        <div className="min-w-0 flex-1 max-lg:hidden">
          <div className="sticky top-0 flex h-screen flex-col py-[28px] pl-2 pr-[28px]">
            {brand === "ofm" ? (
              <OfmRightPanel activeId={activeId} />
            ) : (
              <JobslyRightPanel activeId={activeId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
