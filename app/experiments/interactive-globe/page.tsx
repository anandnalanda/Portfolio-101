"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Spectral } from "next/font/google";
import InteractiveGlobe from "@/components/experiments/InteractiveGlobe";

const spectral = Spectral({ subsets: ["latin"], weight: ["400"], style: ["normal"] });
const ease = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/*  Section data                                                       */
/* ------------------------------------------------------------------ */

type Section = {
  id: string;
  type: "intro" | "story" | "decision" | "closing";
  title: string;
  content: string;
  bullets?: string[];
};

const sections: Section[] = [
  {
    id: "open",
    type: "intro",
    title: "Interactive Globe",
    content: `A section on the OFM Jobs homepage. Dots for land, arcs between hiring cities, a sphere you can pick up and spin. It has been live since launch, and the one on the right is the real thing.`,
  },

  /* ── The Story ─────────────────────────────────────────────── */
  {
    id: "presence",
    type: "story",
    title: "It had to stop the scroll",
    content: `It is the fifth section down, well past the fold and right before the job listings. Nothing that far into a page gets attention for free.`,
    bullets: [
      `A photo can say global once. Something you can spin keeps saying it.`,
      `The claim was about reach, so the section had to be the map.`,
      `It sits just before the listings, so it has to set them up.`,
    ],
  },
  {
    id: "lineage",
    type: "story",
    title: "Where it came from",
    content: `Stripe's globe, and Anthropic's. I borrowed the idiom openly, a sphere of points with land picked out by density and arcs between places.`,
    bullets: [
      `Stripe's is WebGL with real map data. Mine is a 2D canvas with no dependencies.`,
      `Theirs sits in the background. Mine carries named cities, regions and arcs.`,
      `I would rather say where the idea came from than pretend it was mine.`,
    ],
  },

  /* ── The Decisions ─────────────────────────────────────────── */
  {
    id: "d1",
    type: "decision",
    title: "No dependencies",
    content: `850 lines of TypeScript and a 2D canvas. There is no three.js, no WebGL, no d3 and no globe library, because nothing five sections down a marketing page justifies hundreds of kilobytes.`,
  },
  {
    id: "d2",
    type: "decision",
    title: "The continents are arithmetic",
    content: `Forty rotated ellipses stand in for map data. Where they overlap the value is soft, so coastlines fade rather than step.`,
    bullets: [
      `The whole world is a few hundred bytes of parameters.`,
      `At this dot pitch, real coastlines would read as noise.`,
    ],
  },
  {
    id: "d3",
    type: "decision",
    title: "Golden-angle distribution",
    content: `Points are placed by the Fibonacci sphere method, which spreads them evenly. A latitude and longitude grid would crowd the poles and thin the equator.`,
  },
  {
    id: "d4",
    type: "decision",
    title: "Colour mixed in OKLCH",
    content: `Interpolating in sRGB dips through a muddy middle. A perceptual space keeps the ramp even, which matters when brightness is the only thing carrying depth.`,
  },
  {
    id: "d5",
    type: "decision",
    title: "Momentum, measured",
    content: `Pointer velocity is sampled every frame and handed straight to the rotation on release. A flick and a nudge feel different, which is what makes it read as an object.`,
  },
  {
    id: "d6",
    type: "decision",
    title: "It stops when you cannot see it",
    content: `The animation loop cancels off-screen, and pixel ratio is capped at 2. Sitting fifth, it is out of view for most of a visit.`,
    bullets: [
      `A section that quietly drains a battery is a bug, however good it looks.`,
      `Porting it here, I added the reduced-motion path it never had.`,
    ],
  },

  /* ── The Outcome ───────────────────────────────────────────── */
  {
    id: "live",
    type: "closing",
    title: "It shipped, and it stayed",
    content: `This is the production version, live on the OFM Jobs homepage since launch.`,
  },
];

const GROUP_LABEL: Record<string, string> = {
  story: "The Story",
  decision: "The Decisions",
  closing: "The Outcome",
};

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
    titleSize === "lg" ? "text-[28px] tracking-[-0.02em] leading-tight" : "text-[18px]";

  return (
    <div data-section={id} className="mb-6">
      <div
        onClick={() => {
          if (window.getSelection()?.toString()) return;
          onNavigate?.();
        }}
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
        <div className="text-[15px] leading-[1.7] text-txt-primary">
          <p>{content}</p>
          {bullets && bullets.length > 0 && (
            <ul className="mt-2.5 list-disc space-y-1.5 pl-[18px] marker:text-txt-secondary">
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

export default function InteractiveGlobePage() {
  const [activeId, setActiveId] = useState(sections[0].id);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Below lg the globe panel is pinned to the top of the viewport, so the
  // scroll-spy line sits just under it rather than at the desktop's 220px.
  const spyLine = () => {
    if (window.innerWidth >= 1024) return 220;
    return (panelRef.current?.getBoundingClientRect().height ?? 0) + 72;
  };

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - (spyLine() - 20);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

            {sections.map((section, i) => {
              const prev = i > 0 ? sections[i - 1] : null;
              const showGroupHeading =
                section.type !== "intro" && prev?.type !== section.type;
              return (
                <div
                  key={section.id}
                  ref={(el) => {
                    sectionRefs.current[section.id] = el;
                  }}
                >
                  {showGroupHeading && (
                    <div className="mt-12 mb-4 pl-4">
                      <h2
                        className={`${spectral.className} text-[24px] text-txt-heading pb-[2px] tracking-[-1px]`}
                      >
                        {GROUP_LABEL[section.type]}
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
                  {/* the live link belongs with the claim it backs up, not at
                      the end of the page where nobody has got to yet */}
                  {section.id === "open" && (
                    <div className="mb-10 -mt-2 pl-4">
                      <a
                        href="https://ofmjobs.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-txt-heading px-5 py-2.5 text-[14px] font-medium text-white transition-opacity hover:opacity-80"
                      >
                        View the live site
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="19" x2="19" y2="5" />
                          <polyline points="9 5 19 5 19 15" />
                        </svg>
                      </a>
                    </div>
                  )}
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
                  title: "Kanban and AI",
                  descriptor: "A pipeline employers want to live in.",
                  href: "/kanban-and-ai",
                },
                {
                  title: "OFM Jobs Tests",
                  descriptor: "Assessment system with AI-powered hiring.",
                  href: "/ofm-jobs-tests",
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

        {/* Right: sticky globe panel. One artifact, no crossfades. It simply
            stays on screen and stays draggable while you read past it. */}
        <div
          ref={panelRef}
          className="flex-1 min-w-0 max-lg:order-first max-lg:sticky max-lg:top-0 max-lg:z-30 max-lg:bg-white"
        >
          <div className="sticky top-0 h-screen pl-2 pr-[28px] py-[28px] flex flex-col max-lg:static max-lg:h-auto max-lg:px-3 max-lg:pt-3 max-lg:pb-2">
            <div className="relative flex-1 overflow-hidden rounded-3xl bg-gradient-to-br from-[#002818] via-[#003f26] to-[#005331] max-lg:aspect-[4/3] max-lg:flex-none">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(155,246,190,0.15)_0%,transparent_55%)]"
              />
              <InteractiveGlobe className="h-full w-full" />
              <div className="pointer-events-none absolute bottom-5 left-0 right-0 flex justify-center">
                <span className="rounded-full border border-white/10 bg-black/25 px-3.5 py-1.5 text-[11px] font-medium tracking-[0.08em] text-white/50 backdrop-blur-sm">
                  DRAG TO SPIN
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
