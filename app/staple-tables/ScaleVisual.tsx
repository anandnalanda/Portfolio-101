"use client";

/**
 * ScaleVisual — beat "scale" ("Ten thousand documents a month") of the Staple
 * Tables case study. A hand-drawn problem diagram in the same pen-doodle
 * language as the Staple Chat maze: a funnel of documents pours down into ONE
 * review screen, where a lone reviewer is buried. The number, the funnel, and
 * the single overwhelmed human carry the thesis: at this volume, every extra
 * second on the review screen multiplies into days.
 *
 * Reuses the shared chibi cast + rough-pen filter (imported read-only from the
 * Staple Chat case study).
 */
import { motion, useReducedMotion } from "framer-motion";
import { Inter, Spectral } from "next/font/google";
import { INK, PINK, RoughFilter, TEAL, WARM } from "../staple-chat/chibi";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const spectralItalic = Spectral({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
});

const PURPLE = "#7c6ff0";
const SKY = "#5ab0c4";
const CARD_ACCENTS = [TEAL, WARM, PINK, PURPLE, SKY];

/* The funnel: rows of document cards, wide at the top, converging toward the
   review screen's mouth at CX. */
const CX = 450;
const FUNNEL_ROWS = [
  { y: 150, n: 7, half: 320 },
  { y: 192, n: 6, half: 262 },
  { y: 234, n: 5, half: 204 },
  { y: 276, n: 4, half: 148 },
  { y: 316, n: 3, half: 92 },
];
const CARDS = FUNNEL_ROWS.flatMap((row, ri) =>
  Array.from({ length: row.n }, (_, i) => {
    const t = row.n === 1 ? 0.5 : i / (row.n - 1);
    return {
      key: `${ri}-${i}`,
      x: CX - row.half + t * row.half * 2,
      y: row.y,
      r: ((ri + i) % 3) - 1,
      accent: CARD_ACCENTS[(ri * 3 + i) % CARD_ACCENTS.length],
      order: ri * 7 + i,
    };
  })
);

/** A small extracted document card. */
function DocCard({ accent }: { accent: string }) {
  return (
    <g>
      <rect x={-22} y={-29} width={44} height={58} rx={4} fill="#ffffff" stroke={INK} strokeWidth={1.7} />
      <rect x={-22} y={-29} width={44} height={11} rx={4} fill={accent} />
      <rect x={-22} y={-22} width={44} height={4} fill={accent} />
      <g stroke={INK} strokeWidth={1} strokeLinecap="round" opacity={0.45}>
        <path d="M -14 -8 h 28" />
        <path d="M -14 -1 h 28" />
        <path d="M -14 6 h 18" />
        <path d="M -14 13 h 24" />
      </g>
    </g>
  );
}

/** The single review screen the whole funnel pours into. */
function ReviewScreen() {
  return (
    <g>
      <rect x={310} y={344} width={280} height={150} rx={16} fill="#ffffff" stroke={INK} strokeWidth={2.6} />
      <path d="M 310 372 h 280" stroke={INK} strokeWidth={1.6} />
      <circle cx={326} cy={358} r={2.4} fill={PINK} />
      <circle cx={335} cy={358} r={2.4} fill={WARM} />
      <circle cx={344} cy={358} r={2.4} fill={TEAL} />
      {/* mini document thumbnail */}
      <rect x={330} y={388} width={92} height={92} rx={5} fill="#fbfaf8" stroke={INK} strokeWidth={1.6} />
      <g stroke={INK} strokeWidth={1.1} strokeLinecap="round" opacity={0.5}>
        <path d="M 342 402 h 40" />
        <path d="M 342 412 h 68" />
        <path d="M 342 422 h 68" />
        <path d="M 342 432 h 50" />
        <path d="M 342 450 h 68" />
        <path d="M 342 460 h 40" />
      </g>
      {/* extracted field rows */}
      <g>
        {[TEAL, PURPLE, WARM, PINK].map((c, i) => (
          <g key={i} transform={`translate(442 ${396 + i * 22})`}>
            <rect x={0} y={0} width={3} height={16} rx={1.5} fill={c} />
            <path d={`M 12 5 h ${52 - (i % 2) * 14}`} stroke={INK} strokeWidth={2} strokeLinecap="round" opacity={0.75} />
            <path d={`M 12 12 h ${70 - (i % 3) * 18}`} stroke={INK} strokeWidth={1.4} strokeLinecap="round" opacity={0.4} />
          </g>
        ))}
      </g>
    </g>
  );
}

export default function ScaleVisual() {
  const reduce = useReducedMotion();
  const drop = (order: number) =>
    reduce
      ? { duration: 0 }
      : { type: "spring" as const, stiffness: 260, damping: 20, delay: 0.15 + order * 0.03 };

  return (
    <div
      className={`${inter.className} absolute inset-0`}
      style={{
        background: "#fbfaf8",
        backgroundImage:
          "radial-gradient(circle, rgba(18,51,59,0.06) 1.1px, transparent 1.2px)",
        backgroundSize: "26px 26px",
      }}
    >
      <svg viewBox="0 0 900 650" className="h-full w-full" role="img" aria-label="Ten thousand documents a month, all funnelling into one review screen">
        <defs>
          <RoughFilter id="sv-rough" baseFrequency={0.015} scale={2.6} />
        </defs>

        {/* Hand-drawn layer */}
        <g filter="url(#sv-rough)">
          {/* funnel of documents pouring down */}
          {CARDS.map((c) => (
            <motion.g
              key={c.key}
              initial={reduce ? false : { opacity: 0, y: -40, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={drop(c.order)}
              style={{ transformOrigin: `${c.x}px ${c.y}px` }}
            >
              <g transform={`translate(${c.x} ${c.y}) rotate(${c.r})`}>
                <DocCard accent={c.accent} />
              </g>
            </motion.g>
          ))}

          {/* the single review screen (the bottleneck) */}
          <motion.g
            initial={reduce ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 20, delay: 0.9 }}
            style={{ transformOrigin: "450px 420px" }}
          >
            <ReviewScreen />
          </motion.g>

        </g>

        {/* Crisp text layer */}
        <g>
          <text x={CX} y={70} textAnchor="middle" fontSize={56} fontWeight={800} fill={INK} letterSpacing="-1.5">
            10,000+
          </text>
          <text x={CX} y={100} textAnchor="middle" fontSize={16} fontWeight={500} fill="#5b6b70">
            documents, every month
          </text>

          <text x={450} y={528} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="#8a969a" letterSpacing="1.4">
            ONE REVIEW SCREEN
          </text>

          <motion.text
            x={CX}
            y={612}
            textAnchor="middle"
            fontSize={17}
            className={spectralItalic.className}
            fontStyle="italic"
            fill="#5b6b70"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 1.5 }}
          >
            every extra second here, times ten thousand, becomes days
          </motion.text>
        </g>
      </svg>
    </div>
  );
}
