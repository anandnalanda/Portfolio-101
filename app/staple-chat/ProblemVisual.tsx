"use client";

/**
 * ProblemVisual — the establishing "problem" diagram for the Staple Chat case
 * study, scroll-wired with GSAP ScrollTrigger (scrub).
 *
 * Organized layout: the five systems sit on a clean two-column GRID; one
 * question snakes through them in ORTHOGONAL segments (right angles, rounded
 * corners — no freeform curves), funnels down into Excel where the report is
 * hand-assembled, and the receipt emerges to the right. As the reader scrolls
 * beats 2→3 the dotted route draws in proportion to scroll; numbered
 * timestamps arrive as the line reaches each system; the receipt lands last.
 *
 * Product visual language: Inter labels, hairline 1px strokes, the UI's soft
 * card shadow, neutral palette from the Staple design-system CSS variables —
 * except the query bubble (deep brand solid), the one spot of color.
 * Annotation in Spectral italic (the narrator).
 */
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Inter, Spectral } from "next/font/google";
import "@/components/screens/_ui/ui.generated.css";
import { CurlyWoman, Hero, PINK, RoughFilter, SmilingMan, TEAL, WaitBubble, Woman } from "./chibi";

gsap.registerPlugin(ScrollTrigger);

/* ---------------------------- scroll tuning ---------------------------- */
const DRAW_TRIGGER = '[data-section="bottleneck"]';
const DRAW_END_TRIGGER = '[data-section="interviews"]';
const DRAW_START = "top 15%";
const DRAW_END = "bottom 30%";
const SCRUB = 1;

const inter = Inter({ subsets: ["latin"], display: "swap" });
const spectralItalic = Spectral({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
});

type SystemId = "invoices" | "pos" | "outlet" | "pnl" | "supplier";

interface SystemNode {
  id: SystemId;
  title: string;
  sub: string;
  time: string;
  x: number;
  y: number;
}

const NODE_W = 180;
const NODE_H = 62;
const BADGE_UP = 16; // number badge sits this far above the card's top-left

/* Two-column grid. colA x-center = 590, colB x-center = 936. (The left column
   position was tuned with DialKit and baked in here.) */
const systems: SystemNode[] = [
  { id: "invoices", title: "Invoices", sub: "finance.invoices", time: "9:03", x: 500, y: 96 },
  { id: "pos", title: "POS Transactions", sub: "sales · 4 markets", time: "9:06", x: 846, y: 96 },
  { id: "outlet", title: "Outlet Master", sub: "ops.locations", time: "9:09", x: 846, y: 300 },
  { id: "pnl", title: "Monthly P&L", sub: "finance.reports", time: "9:13", x: 500, y: 300 },
  { id: "supplier", title: "Supplier Invoices", sub: "Q1", time: "9:16", x: 500, y: 500 },
];

const EXCEL = { x: 472, y: 628, w: 236, h: 80 };
const RECEIPT = { x: 740, y: 645, w: 236, h: 46 };
const RECEIPT_ENTRY = { x: RECEIPT.x, y: RECEIPT.y + RECEIPT.h / 2 };

const c = systems.map((n) => ({ x: n.x + NODE_W / 2, y: n.y + NODE_H / 2 }));

/* The route as orthogonal waypoints (each pair differs in x OR y only):
   query → jog up → across ①② → down to ③ → across to ④ → down through ⑤ into
   Excel → across to the receipt. */
const WAYPOINTS = [
  { x: 284, y: 384 }, // query, right edge
  { x: 450, y: 384 }, //   jog right into the gutter
  { x: 450, y: 127 }, //   up to the top row
  { x: 936, y: 127 }, //   across ① → ②
  { x: 936, y: 331 }, //   down ② → ③
  { x: 590, y: 331 }, //   across ③ → ④
  { x: 590, y: 668 }, //   down ④ → ⑤ → Excel
  { x: RECEIPT_ENTRY.x, y: RECEIPT_ENTRY.y }, // across → receipt
];

/* Orthogonal path with rounded corners. */
function ortho(pts: { x: number; y: number }[], r: number) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const e = pts[i + 1];
    const inX = Math.sign(b.x - a.x);
    const inY = Math.sign(b.y - a.y);
    const outX = Math.sign(e.x - b.x);
    const outY = Math.sign(e.y - b.y);
    const rr = Math.min(r, Math.hypot(b.x - a.x, b.y - a.y) / 2, Math.hypot(e.x - b.x, e.y - b.y) / 2);
    d += ` L ${b.x - inX * rr},${b.y - inY * rr} Q ${b.x},${b.y} ${b.x + outX * rr},${b.y + outY * rr}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x},${last.y}`;
  return d;
}

const JOURNEY = ortho(WAYPOINTS, 18);

/* Simple monochrome glyphs in a 24×24 box. */
function Glyph({ id }: { id: SystemId }) {
  const s = {
    fill: "none",
    stroke: "var(--color-fg-quaternary)",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    vectorEffect: "non-scaling-stroke" as const,
  };
  switch (id) {
    case "invoices":
    case "supplier":
      return (
        <g {...s}>
          <rect x="4.5" y="2.5" width="15" height="19" rx="2.5" />
          <line x1="8" y1="8" x2="16" y2="8" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="8" y1="16" x2="13" y2="16" />
        </g>
      );
    case "pos":
      return (
        <g {...s}>
          <rect x="3" y="4.5" width="18" height="15" rx="2" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="9.5" y1="10" x2="9.5" y2="19.5" />
          <line x1="15" y1="10" x2="15" y2="19.5" />
        </g>
      );
    case "outlet":
      return (
        <g {...s}>
          <path d="M12 21.5c4-4.2 6-7.3 6-10.5a6 6 0 1 0-12 0c0 3.2 2 6.3 6 10.5Z" />
          <circle cx="12" cy="11" r="2.3" />
        </g>
      );
    case "pnl":
      return (
        <g {...s}>
          <line x1="6" y1="20" x2="6" y2="13" />
          <line x1="12" y1="20" x2="12" y2="7.5" />
          <line x1="18" y1="20" x2="18" y2="15" />
        </g>
      );
  }
}

/* What you walk away with: as the route reaches each system, a small pile
   of artifacts spills out of the card. The tour is also a collection errand,
   and by Excel you are visibly carrying five piles. Same hairline monochrome
   language as the rest of the diagram so the route stays the subject. */
const YIELD_KINDS: Record<SystemId, "lines" | "receipt" | "bars" | "pin"> = {
  invoices: "lines",
  pos: "receipt",
  outlet: "pin",
  pnl: "bars",
  supplier: "lines",
};

function SheetInterior({ kind }: { kind: "lines" | "receipt" | "bars" | "pin" }) {
  const s = {
    fill: "none",
    stroke: "var(--color-fg-quaternary)",
    strokeWidth: 1.1,
    strokeLinecap: "round" as const,
    vectorEffect: "non-scaling-stroke" as const,
  };
  switch (kind) {
    case "lines":
      return (
        <g {...s}>
          <line x1="-5.5" y1="8" x2="5.5" y2="8" />
          <line x1="-5.5" y1="12.5" x2="5.5" y2="12.5" />
          <line x1="-5.5" y1="17" x2="1.5" y2="17" />
        </g>
      );
    case "receipt":
      return (
        <g {...s}>
          <line x1="-5" y1="8" x2="5" y2="8" />
          <line x1="-5" y1="12.5" x2="5" y2="12.5" />
          <line x1="-5.5" y1="18" x2="5.5" y2="18" strokeDasharray="1.5 2.5" />
        </g>
      );
    case "bars":
      return (
        <g {...s}>
          <line x1="-4.5" y1="18" x2="-4.5" y2="12" />
          <line x1="0" y1="18" x2="0" y2="8" />
          <line x1="4.5" y1="18" x2="4.5" y2="13.5" />
        </g>
      );
    case "pin":
      return (
        <g {...s}>
          <circle cx="-3.5" cy="10" r="2.2" />
          <line x1="1.5" y1="10" x2="6" y2="10" />
          <line x1="-5.5" y1="16.5" x2="4" y2="16.5" />
        </g>
      );
  }
}

function ExcelGlyph() {
  return (
    <g
      fill="none"
      stroke="var(--color-fg-quaternary)"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    >
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="14.5" x2="21" y2="14.5" />
      <line x1="9.5" y1="4" x2="9.5" y2="20" />
      <line x1="15" y1="4" x2="15" y2="20" />
    </g>
  );
}

export function ProblemVisual() {
  const maskPathRef = useRef<SVGPathElement>(null);
  const badgeRefs = useRef<(SVGGElement | null)[]>([]);
  const yieldRefs = useRef<(SVGGElement | null)[]>([]);
  const endRef = useRef<SVGGElement>(null);
  const arrowRef = useRef<SVGGElement>(null);

  useLayoutEffect(() => {
    const maskPath = maskPathRef.current;
    const end = endRef.current;
    const arrow = arrowRef.current;
    if (!maskPath || !end || !arrow) return;

    const badges = badgeRefs.current.filter(Boolean) as SVGGElement[];
    const L = maskPath.getTotalLength();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(maskPath, { strokeDasharray: L, strokeDashoffset: 0 });
      return;
    }

    const SAMPLES = 500;
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const p = maskPath.getPointAtLength((i / SAMPLES) * L);
      pts.push({ x: p.x, y: p.y });
    }
    const thresholdFor = (t: { x: number; y: number }) => {
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i <= SAMPLES; i++) {
        const dx = pts[i].x - t.x;
        const dy = pts[i].y - t.y;
        const d = dx * dx + dy * dy;
        if (d < bestD) {
          bestD = d;
          best = i / SAMPLES;
        }
      }
      return best;
    };
    const thresholds = c.map(thresholdFor);

    gsap.set(maskPath, { strokeDasharray: L, strokeDashoffset: L });
    gsap.set([...badges, end], { autoAlpha: 0, y: 8 });
    gsap.set(arrow, { autoAlpha: 0 });
    const yieldSheets = yieldRefs.current
      .filter(Boolean)
      .flatMap((g) => Array.from((g as SVGGElement).querySelectorAll("[data-sheet]")));
    /* Piles start tucked up behind their card and slide out below it. */
    gsap.set(yieldSheets, { autoAlpha: 0, y: -12 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: DRAW_TRIGGER,
        start: DRAW_START,
        endTrigger: DRAW_END_TRIGGER,
        end: DRAW_END,
        scrub: SCRUB,
      },
    });

    tl.to(maskPath, { strokeDashoffset: 0, duration: 1, ease: "none" }, 0);

    thresholds.forEach((t, i) => {
      const b = badgeRefs.current[i];
      if (b) {
        tl.to(b, { autoAlpha: 1, y: 0, duration: 0.05, ease: "power1.out" }, Math.min(t, 0.92));
      }
      /* The moment the line touches the card, its artifacts spill out,
         one sheet after another as the scroll continues. */
      const yg = yieldRefs.current[i];
      if (yg) {
        Array.from(yg.querySelectorAll("[data-sheet]")).forEach((sheet, j) => {
          tl.to(
            sheet,
            { autoAlpha: 1, y: 0, duration: 0.04, ease: "power2.out" },
            Math.min(t + 0.012 + j * 0.014, 0.94)
          );
        });
      }
    });

    // Receipt box appears as the line approaches; the arrow only lands once
    // the dotted line has fully completed its run into it.
    tl.to(end, { autoAlpha: 1, y: 0, duration: 0.05, ease: "power1.out" }, 0.9);
    tl.to(arrow, { autoAlpha: 1, duration: 0.03, ease: "power1.out" }, 0.99);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div
      className={`${inter.className} staple-theme h-full w-full`}
      style={{
        backgroundColor: "var(--color-bg-secondary)",
        backgroundImage:
          "radial-gradient(circle, color-mix(in srgb, var(--color-fg-quaternary) 42%, transparent) 1.2px, transparent 1.3px)",
        backgroundSize: "26px 26px",
      }}
    >
      <svg
        viewBox="0 29 1100 740"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
        role="img"
        aria-label="One question forced to tour five disconnected systems and a spreadsheet; the answer arrives fifteen minutes later"
      >
        <defs>
          <filter id="pv-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.05" />
          </filter>
          <RoughFilter id="pv-rough" baseFrequency={0.016} scale={3} />
          <mask id="pv-draw" maskUnits="userSpaceOnUse" x="0" y="0" width="1100" height="740">
            <rect x="0" y="0" width="1100" height="740" fill="black" />
            <path
              ref={maskPathRef}
              d={JOURNEY}
              fill="none"
              stroke="white"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </mask>
        </defs>

        {/* Silo borders — each system fenced off on its own */}
        {systems.map((n) => (
          <rect
            key={`fence-${n.id}`}
            x={n.x - 16}
            y={n.y - 16}
            width={NODE_W + 32}
            height={NODE_H + 32}
            rx="18"
            fill="var(--color-bg-primary)"
            fillOpacity="0.5"
            stroke="var(--color-fg-quaternary)"
            strokeOpacity="0.5"
            strokeWidth="1"
            strokeDasharray="2 7"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* The orthogonal route — dotted, revealed by the scroll-scrubbed mask */}
        <path
          d={JOURNEY}
          fill="none"
          stroke="var(--color-fg-quaternary)"
          strokeOpacity="0.85"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="0.5 6.5"
          mask="url(#pv-draw)"
        />

        {/* The question — a real Staple Chat user bubble, brand color */}
        <g>
          <text x="48" y="330" fontSize="11.5">
            <tspan fontWeight={600} fill="var(--color-text-secondary)">
              You
            </tspan>
            <tspan fill="var(--color-text-tertiary)"> · 9:01 AM</tspan>
          </text>
          <rect
            x="44"
            y="340"
            width="236"
            height="88"
            rx="16"
            fill="var(--color-bg-brand-solid)"
            filter="url(#pv-shadow)"
          />
          <text x="66" y="377" fontSize="16" fontWeight={500} fill="#ffffff">
            What are the total sales
          </text>
          <text x="66" y="400" fontSize="16" fontWeight={500} fill="#ffffff">
            in January?
          </text>
        </g>

        {/* Five system cards */}
        {systems.map((n) => (
          <g key={n.id}>
            <rect
              x={n.x}
              y={n.y}
              width={NODE_W}
              height={NODE_H}
              rx="12"
              fill="var(--color-bg-primary)"
              stroke="var(--color-border-secondary)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              filter="url(#pv-shadow)"
            />
            <g transform={`translate(${n.x + 16}, ${n.y + (NODE_H - 24) / 2})`}>
              <Glyph id={n.id} />
            </g>
            <text
              x={n.x + 50}
              y={n.y + 27}
              fontSize="14.5"
              fontWeight={600}
              fill="var(--color-text-primary)"
            >
              {n.title}
            </text>
            <text x={n.x + 50} y={n.y + 45} fontSize="11.5" fill="var(--color-text-tertiary)">
              {n.sub}
            </text>
          </g>
        ))}

        {/* The yield: a small fanned pile spills out of each card as the
            route reaches it (invoice sheets, receipt slips, address cards,
            a mini P&L). Statically visible under reduced motion. */}
        {systems.map((n, i) => (
          <g
            key={`yield-${n.id}`}
            ref={(el) => {
              yieldRefs.current[i] = el;
            }}
          >
            {[
              { a: -11, dx: -8 },
              { a: 2, dx: 0 },
              { a: 13, dx: 8 },
            ].map((f, j) => (
              /* Outer g bakes the position; the data-sheet g is the GSAP
                 target (identity transform, so animated y offsets are
                 relative); innermost g bakes the fan rotation. */
              <g
                key={j}
                transform={`translate(${n.x + NODE_W - 34 + f.dx}, ${
                  n.y + NODE_H - 6
                })`}
              >
                <g data-sheet>
                  <g transform={`rotate(${f.a})`}>
                    <rect
                      x="-9"
                      y="0"
                      width="18"
                      height="24"
                      rx="2.5"
                      fill="var(--color-bg-primary)"
                      stroke="var(--color-border-secondary)"
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                      filter="url(#pv-shadow)"
                    />
                    <SheetInterior kind={YIELD_KINDS[n.id]} />
                  </g>
                </g>
              </g>
            ))}
          </g>
        ))}

        {/* Numbered, time-stamped hops */}
        {systems.map((n, i) => (
          <g
            key={`num-${n.id}`}
            ref={(el) => {
              badgeRefs.current[i] = el;
            }}
          >
            <circle
              cx={n.x}
              cy={n.y - BADGE_UP}
              r="11.5"
              fill="var(--color-bg-primary)"
              stroke="var(--color-border-secondary)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <text
              x={n.x}
              y={n.y - BADGE_UP + 3.5}
              fontSize="11"
              fontWeight={600}
              textAnchor="middle"
              fill="var(--color-text-secondary)"
            >
              {i + 1}
            </text>
            <text
              x={n.x + 18}
              y={n.y - BADGE_UP + 3.5}
              fontSize="10.5"
              fill="var(--color-text-tertiary)"
            >
              {n.time}
            </text>
          </g>
        ))}

        {/* Excel — the manual assembly bottleneck */}
        <g>
          <rect
            x={EXCEL.x}
            y={EXCEL.y}
            width={EXCEL.w}
            height={EXCEL.h}
            rx="14"
            fill="var(--color-bg-primary)"
            stroke="var(--color-border-secondary)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            filter="url(#pv-shadow)"
          />
          <g transform={`translate(${EXCEL.x + 18}, ${EXCEL.y + (EXCEL.h - 24) / 2})`}>
            <ExcelGlyph />
          </g>
          <text
            x={EXCEL.x + 54}
            y={EXCEL.y + 35}
            fontSize="15.5"
            fontWeight={600}
            fill="var(--color-text-primary)"
          >
            Excel
          </text>
          <text x={EXCEL.x + 54} y={EXCEL.y + 54} fontSize="11.5" fill="var(--color-text-tertiary)">
            paste · reconcile · build report
          </text>
        </g>

        {/* The answer, emerging from the spreadsheet */}
        <g ref={endRef}>
          <text
            x={RECEIPT.x + RECEIPT.w}
            y={RECEIPT.y - 12}
            fontSize="15"
            textAnchor="end"
            className={spectralItalic.className}
            fontStyle="italic"
            fill="var(--color-text-tertiary)"
          >
            …15 minutes later.
          </text>
          <rect
            x={RECEIPT.x}
            y={RECEIPT.y}
            width={RECEIPT.w}
            height={RECEIPT.h}
            rx="23"
            fill="var(--color-bg-primary)"
            stroke="var(--color-border-secondary)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            filter="url(#pv-shadow)"
          />
          <g
            transform={`translate(${RECEIPT.x + 18}, ${RECEIPT.y + 14})`}
            fill="none"
            stroke="var(--color-fg-quaternary)"
            strokeWidth="1.6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          >
            <circle cx="9" cy="9" r="7.5" />
            <path d="M9 5.5V9l2.5 2" />
          </g>
          <text
            x={RECEIPT.x + 44}
            y={RECEIPT.y + 28}
            fontSize="14.5"
            fontWeight={600}
            fill="var(--color-text-primary)"
          >
            Total: $351,630
          </text>
        </g>

        {/* Arrow — lands only when the route line has finished drawing in */}
        <g ref={arrowRef}>
          <path
            d="M -9 -4.5 L 0 0 L -9 4.5 Z"
            fill="var(--color-fg-quaternary)"
            transform={`translate(${RECEIPT_ENTRY.x},${RECEIPT_ENTRY.y})`}
          />
        </g>

        {/* ---- The human bottleneck: the story the maze is really about. One
             frazzled analyst runs the entire tour + assembly by hand, while a
             queue of non-technical people waits on that single person. These
             are the SAME faces set free at the hub in the Impact beat. ---- */}
        {/* Baked position (tuned via DialKit): offsetX -10, scale 1.2 about the
            group centroid (210, 650). */}
        <g transform="translate(-10 0) translate(210 650) scale(1.2) translate(-210 -650)">
        <g filter="url(#pv-rough)">
          {/* A queue that recedes to the left — everyone funnelling toward the
              one analyst. Drawn far→near so nearer figures overlap. */}
          <SmilingMan x={96} y={664} s={0.5} />
          <WaitBubble x={110} y={636} s={0.62} color={TEAL} />
          <CurlyWoman x={166} y={660} s={0.6} />
          <WaitBubble x={148} y={626} s={0.72} color={PINK} />
          <Woman x={240} y={652} s={0.74} />
          <WaitBubble x={258} y={614} s={0.82} color={PINK} />

          {/* The analyst, buried at the assembly point beside Excel — the
              single human choke-point the whole queue is waiting on. */}
          <Hero x={332} y={640} s={1.16} mood="frazzled" />
        </g>

        {/* Narrator annotations — outside the rough filter so the type stays
            crisp (Spectral italic, the same voice as "…15 minutes later"). */}
        <text
          x={330}
          y={574}
          textAnchor="middle"
          fontSize="13"
          className={spectralItalic.className}
          fontStyle="italic"
          fill="var(--color-text-tertiary)"
        >
          one analyst · every request
        </text>
        <text
          x={170}
          y={710}
          textAnchor="middle"
          fontSize="12.5"
          className={spectralItalic.className}
          fontStyle="italic"
          fill="var(--color-text-tertiary)"
        >
          everyone else waits their turn
        </text>
        </g>
      </svg>
    </div>
  );
}
