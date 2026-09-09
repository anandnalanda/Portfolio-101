"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Spectral } from "next/font/google";

const spectral = Spectral({ subsets: ["latin"], weight: ["400"], style: ["normal"] });
const ease = [0.22, 1, 0.36, 1] as const;

const LIVE_URL = "https://www.goldpricecalculate.com/";

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
    title: "Gold Price Calculator",
    content: `A calculator for what a piece of jewellery should cost. Weight, purity, making charges and tax, the same arithmetic that happens behind the counter, done where you can see it. It is live and free, and there is no account to make.`,
  },

  /* ── The Story ─────────────────────────────────────────────── */
  {
    id: "itch",
    type: "story",
    title: "I built it because I could not follow my own bill",
    content: `This one is entirely selfish. I went to buy jewellery and could not keep up with the number I was being quoted. The arithmetic is simple enough. The trouble is that it arrives all at once, at a counter, with someone waiting on you.`,
    bullets: [
      `The rate is quoted per gram. The piece is priced as a whole.`,
      `Purity, making charges and tax each land as a separate percentage.`,
      `You end up doing four sums in your head while somebody watches.`,
    ],
  },
  {
    id: "trust",
    type: "story",
    title: "The people it fails are the ones who ask least",
    content: `Elderly buyers are the ones this hurts. My parents' generation does not argue with a number on a printed slip. They hear the total, nod and pay, because there is no way to check it in the moment.`,
    bullets: [
      `Nodding along to a breakdown is different from agreeing with it.`,
      `With no way to check, the only option left is to trust the person selling.`,
      `If you can work the number out yourself, you do not have to take anyone's word for it.`,
    ],
  },

  /* ── The Decisions ─────────────────────────────────────────── */
  {
    id: "d1",
    type: "decision",
    title: "Show the working",
    content: `Gold price = (weight × rate per gram × purity) + making charges + tax. The tool prints that line and then fills it in, so you can follow how the total was reached instead of taking it on trust.`,
  },
  {
    id: "d2",
    type: "decision",
    title: "Purity as a fraction",
    content: `24K, 23K, 22K, 21K, 18K, 14K and 12K each carry their real fraction, from 99.9% down to 50%. A 22K chain is 92% gold, and the price should say so plainly instead of hiding it in a hallmark.`,
  },
  {
    id: "d3",
    type: "decision",
    title: "Making charges are the line people miss",
    content: `Entered either as a percentage of the gold value or as a flat amount, because shops quote it both ways. It is the line most often folded quietly into a total, which makes it the one most worth seeing on its own.`,
  },
  {
    id: "d4",
    type: "decision",
    title: "Rates that are current",
    content: `Live spot prices, refreshed twice a day at 11:10 and 15:10 IST. A calculator running on yesterday's number would still look authoritative, which is what makes it dangerous.`,
  },
  {
    id: "d5",
    type: "decision",
    title: "The units people use",
    content: `Grams by default, and tola at 11.6638 grams, which is still how a lot of South Asia buys. Currencies in USD, EUR, GBP, INR and AED. Nobody should have to convert anything before they can start.`,
  },

  /* ── The Outcome ───────────────────────────────────────────── */
  {
    id: "live",
    type: "closing",
    title: "Live, and free to use",
    content: `There is no sign-up and no app. Open it at the counter, type in what you have been quoted, and see whether you arrive at the same total.`,
  },
];

const GROUP_LABEL: Record<string, string> = {
  story: "The Story",
  decision: "The Decisions",
  closing: "The Outcome",
};

/* ------------------------------------------------------------------ */
/*  The panel: the shipped site, layered                               */
/* ------------------------------------------------------------------ */

/* Same overlapping composition the Visual Direction case study uses for its
   shipped pages: a warm accent card, a back window bleeding off the right
   edge, a front window on top. Percentages, so the whole thing scales with the
   panel instead of needing a second set of numbers for small screens. */
/* The captures are 3:4, so a window whose width is ~77% of this panel is
   exactly as tall as the panel. Both are set wider than that, so between them
   they cover the frame completely and the warm ground never shows. The front
   is pinned to the top-left corner, which keeps its title bar and traffic
   lights on screen (that chrome is what makes it read as a browser at all);
   it runs off the bottom. The back is pushed past the top and right edges, and
   the overlap between the two is what reads as depth. */
const SCREEN_LAYOUT = {
  backX: 40,
  backY: -7,
  backW: 82,
  frontX: 0,
  frontY: 0,
  frontW: 78,
  cardX: 21,
  cardY: 30,
  cardW: 54,
  cardH: 52,
  cardOpacity: 0.9,
} as const;

type Shot = { src: string; label: string; alt: string };

const SHOTS: Record<"calculator" | "making", Shot> = {
  calculator: {
    src: "/gold/calculator.jpg",
    label: "Calculator",
    alt: "The calculator on goldpricecalculate.com: live spot price, inputs for weight, karat, making charges and tax, and a price breakdown ending in a total.",
  },
  making: {
    src: "/gold/making-charges.jpg",
    label: "Making charges",
    alt: "The making charges page on goldpricecalculate.com, explaining percentage and per-gram charges with a table of typical rates by jewellery type.",
  },
};

/* a shipped page shown as a browser window (top of the full-page capture) */
function ScreenWindow({ shot }: { shot: Shot }) {
  return (
    <div className="overflow-hidden rounded-xl bg-[#0b0b0d] ring-1 ring-white/10">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-2.5 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#febc2e" }} />
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#28c840" }} />
        <span className="ml-1.5 truncate text-[9px] font-medium text-white/50">
          goldpricecalculate.com · {shot.label}
        </span>
      </div>
      {/* the captures are 1120x1493, so a 3:4 box shows the whole frame with
          no crop; intrinsic size keeps the window from reflowing on load */}
      <div className="aspect-[3/4] w-full overflow-hidden">
        <img
          src={shot.src}
          alt={shot.alt}
          width={1120}
          height={1493}
          className="block w-full select-none"
          draggable={false}
        />
      </div>
    </div>
  );
}

function DualScreens({ front, back }: { front: Shot; back: Shot }) {
  const p = SCREEN_LAYOUT;
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* warm accent card behind the front window */}
      <div
        className="absolute rounded-3xl"
        style={{
          left: `${p.cardX}%`,
          top: `${p.cardY}%`,
          width: `${p.cardW}%`,
          height: `${p.cardH}%`,
          background: "linear-gradient(135deg, #F5E7CA 0%, #E7B77A 100%)",
          opacity: p.cardOpacity,
        }}
      />
      {/* back window, bleeds off the edge */}
      <div
        className="absolute"
        style={{
          left: `${p.backX}%`,
          top: `${p.backY}%`,
          width: `${p.backW}%`,
          filter: "drop-shadow(0 30px 55px rgba(60,16,4,0.45))",
        }}
      >
        <ScreenWindow shot={back} />
      </div>
      {/* front window, on top */}
      <div
        className="absolute"
        style={{
          left: `${p.frontX}%`,
          top: `${p.frontY}%`,
          width: `${p.frontW}%`,
          filter: "drop-shadow(0 34px 60px rgba(60,16,4,0.5))",
        }}
      >
        <ScreenWindow shot={front} />
      </div>
    </div>
  );
}

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
     rails sit a level below it, and every other beat sits under a rail. */
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

export default function GoldCalculatorPage() {
  const [activeId, setActiveId] = useState(sections[0].id);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Below lg the panel is pinned to the top of the viewport, so the scroll-spy
  // line sits just under it rather than at the desktop's 220px.
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
                        href={LIVE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-txt-heading px-5 py-2.5 text-[14px] font-medium text-white transition-opacity hover:opacity-80"
                      >
                        Try the calculator
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
                  title: "Interactive Globe",
                  descriptor: "A spinnable canvas globe, no dependencies.",
                  href: "/experiments/interactive-globe",
                },
                {
                  title: "Kanban and AI",
                  descriptor: "A pipeline employers want to live in.",
                  href: "/kanban-and-ai",
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

        {/* Right: sticky panel. The tool itself as two browser windows; the
            beat about making charges brings that page to the front. */}
        <div
          ref={panelRef}
          className="flex-1 min-w-0 max-lg:order-first max-lg:sticky max-lg:top-0 max-lg:z-30 max-lg:bg-white"
        >
          <div className="sticky top-0 h-screen pl-2 pr-[28px] py-[28px] flex flex-col max-lg:static max-lg:h-auto max-lg:px-3 max-lg:pt-3 max-lg:pb-2">
            {/* square below lg: a 3:4 window whose width is 78% of the panel is
                104% of a square panel's height, so the pair still covers the
                frame. A taller box left a band of the warm ground showing. */}
            <div className="relative flex-1 overflow-hidden rounded-3xl bg-gradient-to-br from-[#5C2411] via-[#A8401F] to-[#C9612F] max-lg:aspect-square max-lg:flex-none">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,231,202,0.18)_0%,transparent_55%)]"
              />
              {/* The making-charges beat is the one the BACK window is about,
                  and the back window is the least visible thing on screen. So
                  for that beat the two pages trade places: making charges
                  comes to the front, the calculator drops behind. Two stacked
                  compositions crossfading, rather than animating layout, so the
                  bleed and shadows never have to move. */}
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: activeId === "d3" ? 0 : 1 }}
                transition={{ duration: 0.55, ease }}
                aria-hidden={activeId === "d3"}
              >
                <DualScreens front={SHOTS.calculator} back={SHOTS.making} />
              </motion.div>
              <motion.div
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: activeId === "d3" ? 1 : 0 }}
                transition={{ duration: 0.55, ease }}
                aria-hidden={activeId !== "d3"}
              >
                <DualScreens front={SHOTS.making} back={SHOTS.calculator} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
