"use client";

/**
 * ResearchVisual — beat "research-methods" ("Three ways into the problem").
 * A mixed-media research artifact: crisp product-UI evidence cards married to
 * the case study's hand-drawn pen-doodle language (shared chibi cast + rough
 * filter, imported read-only from the Staple Chat illustrations).
 *
 *   1. Usage analytics    — the scale + cost of the problem, in numbers.
 *   2. Task observation   — a hand-drawn session: a frazzled reviewer, watched.
 *   3. Competitive teardown — a capability matrix whose empty "Fast correction"
 *      column (circled 0/5) is the gap the redesign aimed at.
 *
 * Rendered at a fixed 1440-wide design and scaled to fit the sticky panel via
 * ScaledCanvas. Data-driven: edit TIME_SPLIT / OBSERVATIONS / TOOLS to retune.
 */
import { motion, useReducedMotion } from "framer-motion";
import { Inter, Spectral } from "next/font/google";
import { Hero, INK, PINK, RoughFilter, Woman } from "../staple-chat/chibi";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const spectralItalic = Spectral({ subsets: ["latin"], weight: "400", style: "italic", display: "swap" });

const BRAND = "#003B4A";
const BRAND_TINT = "rgba(0,59,74,0.08)";

/* ------------------------------- data ---------------------------------- */

const TIME_SPLIT = [
  { label: "Correcting output", pct: 62, accent: true },
  { label: "Verifying fields", pct: 24, accent: false },
  { label: "Everything else", pct: 14, accent: false },
];

const OBSERVATIONS = [
  "Re-typed whole tables by hand from the document.",
  "No signal for which extracted values to trust.",
  "The review decision was lost in a crowded toolbar.",
];

type Cell = "yes" | "partial" | "no";
const CAPS = ["Table\nextraction", "In-place\nediting", "Confidence\ncues", "Fast\ncorrection"];
/* Five representative tools, ordered least → most capable, so the eye reads a
   gradient that still leaves "Fast correction" almost entirely empty. */
const TOOLS: { name: string; cells: Cell[] }[] = [
  { name: "Google Vision", cells: ["yes", "no", "no", "no"] },
  { name: "Amazon Textract", cells: ["yes", "no", "no", "no"] },
  { name: "ABBYY", cells: ["yes", "partial", "no", "no"] },
  { name: "Nanonets", cells: ["yes", "yes", "partial", "no"] },
  { name: "Rossum", cells: ["yes", "yes", "yes", "partial"] },
];
const GAP_COL = 3; // the column the teardown is really about

/* ------------------------------- marks --------------------------------- */

function Mark({ v, big = false }: { v: Cell; big?: boolean }) {
  const box = big ? "size-7" : "size-[22px]";
  if (v === "yes") {
    const s = big ? 15 : 12;
    return (
      <span className={`inline-flex ${box} items-center justify-center rounded-full`} style={{ background: BRAND_TINT }}>
        <svg width={s} height={s} viewBox="0 0 12 12" fill="none" aria-label="Yes">
          <path d="M2.4 6.3 4.8 8.7 9.6 3.5" stroke={BRAND} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  if (v === "partial") {
    const s = big ? 17 : 14;
    return (
      <span className={`inline-flex ${box} items-center justify-center`} aria-label="Partial">
        <svg width={s} height={s} viewBox="0 0 14 14">
          <circle cx="7" cy="7" r="6" fill="none" stroke="#d9942b" strokeWidth="1.4" />
          <path d="M7 1 A6 6 0 0 1 7 13 Z" fill="#d9942b" />
        </svg>
      </span>
    );
  }
  return (
    <span className={`inline-flex ${box} items-center justify-center`} aria-label="No">
      <span className={`${big ? "size-[11px]" : "size-[9px]"} rounded-full ring-[1.5px] ring-gray-300`} />
    </span>
  );
}

/* ------------------------- hand-drawn accents -------------------------- */

/** A rough pen underline that ties the header to the illustrated language. */
function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="184" height="12" viewBox="0 0 184 12" fill="none" aria-hidden>
      <defs>
        <RoughFilter id="rv-squiggle" baseFrequency={0.05} scale={1.6} seed={7} />
      </defs>
      <path d="M3 7 Q 46 2 92 6 T 181 5" stroke={BRAND} strokeWidth="2.4" strokeLinecap="round" fill="none" filter="url(#rv-squiggle)" opacity={0.55} />
    </svg>
  );
}

/** The task-observation vignette: a frazzled reviewer at a laptop, re-typing
    from loose paper, watched by a researcher with a clipboard. */
function ObservationScene() {
  return (
    <svg viewBox="0 0 400 176" className="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="A researcher observing a reviewer struggle at their screen">
      <defs>
        <RoughFilter id="rv-scene" baseFrequency={0.017} scale={2.2} />
      </defs>
      <g filter="url(#rv-scene)">
        {/* desk */}
        <path d="M 20 150 H 380" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />

        {/* loose source papers being copied by hand */}
        {[
          { x: 58, y: 118, r: -12 },
          { x: 70, y: 124, r: 6 },
        ].map((p, i) => (
          <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.r})`}>
            <rect x={-16} y={-21} width={32} height={42} rx={3} fill="#fff" stroke={INK} strokeWidth={1.8} />
            <g stroke={INK} strokeWidth={1} strokeLinecap="round" opacity={0.4}>
              <path d="M -9 -11 h 18" />
              <path d="M -9 -4 h 18" />
              <path d="M -9 3 h 12" />
            </g>
          </g>
        ))}

        {/* laptop */}
        <g>
          <rect x={104} y={86} width={112} height={60} rx={6} fill="#fff" stroke={INK} strokeWidth={2.2} />
          <g stroke={INK} strokeWidth={1.3} strokeLinecap="round" opacity={0.38}>
            <path d="M 116 102 h 44" />
            <path d="M 116 112 h 64" />
            <path d="M 116 122 h 52" />
          </g>
          <path d="M 100 146 L 220 146 L 232 158 L 88 158 Z" fill="#eef1f1" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        </g>

        {/* the reviewer, buried, behind the screen */}
        <Hero x={160} y={98} s={1.2} mood="frazzled" />

        {/* dotted line of sight from the observer to the screen */}
        <path d="M 300 104 Q 262 86 224 104" stroke={INK} strokeWidth={1.4} strokeDasharray="1.5 5" fill="none" opacity={0.5} />

        {/* the researcher, observing, clipboard in hand */}
        <Woman x={330} y={110} s={1.02} />
        <g>
          <rect x={300} y={120} width={30} height={38} rx={3} fill="#fff" stroke={INK} strokeWidth={1.8} />
          <rect x={309} y={116} width={12} height={6} rx={2} fill="#eef1f1" stroke={INK} strokeWidth={1.5} />
          <g stroke={PINK} strokeWidth={1.6} strokeLinecap="round" fill="none">
            <path d="M 305 130 l 2.5 2.5 l 4 -5" />
            <path d="M 305 140 l 2.5 2.5 l 4 -5" />
          </g>
        </g>
      </g>
    </svg>
  );
}

/** A pink hand-drawn ring around the damning stat. */
function CircledStat({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-flex h-[48px] w-[96px] shrink-0 items-center justify-center">
      <svg viewBox="0 0 96 48" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
        <defs>
          <RoughFilter id="rv-ring" baseFrequency={0.04} scale={1.7} seed={3} />
        </defs>
        <ellipse cx="48" cy="24" rx="42" ry="19" stroke={PINK} strokeWidth="2.4" filter="url(#rv-ring)" />
      </svg>
      <span className="relative text-[19px] font-bold" style={{ color: BRAND }}>
        {children}
      </span>
    </span>
  );
}

/* ------------------------------- cards --------------------------------- */

function CardShell({
  n,
  title,
  meta,
  className = "",
  children,
}: {
  n: number;
  title: string;
  meta: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col rounded-2xl border border-gray-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ${className}`}>
      <div className="flex items-center gap-3">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white" style={{ background: BRAND }}>
          {n}
        </span>
        <div className="text-[15px] font-semibold text-gray-900">{title}</div>
        <span className="ml-auto shrink-0 text-[12px] text-gray-400">{meta}</span>
      </div>
      {children}
    </div>
  );
}

function AnalyticsCard() {
  return (
    <CardShell n={1} title="Usage analytics" meta="90 days">
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          { big: "150+", small: "daily users" },
          { big: "10,000+", small: "documents / month" },
        ].map((k) => (
          <div key={k.small} className="rounded-xl bg-gray-50 px-4 py-3">
            <div className="text-[26px] font-semibold leading-none text-gray-900" style={{ fontVariantNumeric: "tabular-nums" }}>
              {k.big}
            </div>
            <div className="mt-1.5 text-[12px] text-gray-500">{k.small}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 text-[12px] font-medium uppercase tracking-[0.06em] text-gray-400">Where review time went</div>
      <div className="mt-3 space-y-2.5">
        {TIME_SPLIT.map((r) => (
          <div key={r.label} className="flex items-center gap-3">
            <div className="w-[128px] shrink-0 text-[13px] text-gray-600">{r.label}</div>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: r.accent ? BRAND : "#cdd3d4" }} />
            </div>
            <div className={`w-9 shrink-0 text-right text-[13px] ${r.accent ? "font-semibold text-gray-900" : "text-gray-500"}`} style={{ fontVariantNumeric: "tabular-nums" }}>
              {r.pct}%
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-[#fdf6ec] px-3.5 py-2.5 ring-1 ring-amber-100">
        <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-[11px] font-bold text-amber-600">!</span>
        <p className="text-[12.5px] leading-snug text-gray-700">
          <span className="font-semibold text-gray-900">73%</span> abandoned a complex extraction after three failed attempts.
        </p>
      </div>
    </CardShell>
  );
}

function ObservationCard() {
  return (
    <CardShell n={2} title="Task observation" meta="8 sessions · 5 reviewers" className="min-h-0 flex-1">
      <div className="relative mt-4 h-1.5 rounded-full bg-gray-100">
        {[0.22, 0.54, 0.83].map((t, i) => (
          <span key={i} className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${t * 100}%`, background: BRAND }} />
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {OBSERVATIONS.map((o, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold" style={{ background: BRAND_TINT, color: BRAND }}>
              {i + 1}
            </span>
            <p className="text-[13px] leading-snug text-gray-700">{o}</p>
          </div>
        ))}
      </div>

      <div className="relative mt-2 min-h-0 flex-1">
        <ObservationScene />
      </div>
      <p className={`${spectralItalic.className} -mt-1 text-center text-[13px] italic text-gray-500`}>
        Every session ended the same way: manual rework.
      </p>
    </CardShell>
  );
}

function TeardownCard() {
  return (
    <CardShell n={3} title="Competitive teardown" meta="5 tools · 4 capabilities" className="flex-1">
      <div className="mt-5 flex min-h-0 flex-1 flex-col">
        <table className="h-full w-full table-fixed border-collapse">
          <colgroup>
            <col style={{ width: "30%" }} />
            <col style={{ width: "17.5%" }} />
            <col style={{ width: "17.5%" }} />
            <col style={{ width: "17.5%" }} />
            <col style={{ width: "17.5%" }} />
          </colgroup>
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th />
              {CAPS.map((c, i) => (
                <th key={c} className="pb-3 align-bottom text-center text-[11.5px] font-semibold uppercase leading-tight tracking-[0.03em]" style={i === GAP_COL ? { color: BRAND } : { color: "#6b7280" }}>
                  {c.split("\n").map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TOOLS.map((t) => (
              <tr key={t.name} className="border-t border-gray-100">
                <td className="pr-2 align-middle text-[14.5px] font-medium text-gray-800">{t.name}</td>
                {t.cells.map((c, i) => (
                  <td key={i} className="text-center align-middle" style={i === GAP_COL ? { background: BRAND_TINT } : undefined}>
                    <span className="inline-flex justify-center">
                      <Mark v={c} big />
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Takeaway: the empty column is the opening. */}
      <div className="mt-5 flex items-center gap-4 rounded-xl px-4 py-3.5" style={{ background: BRAND_TINT }}>
        <CircledStat>0 / 5</CircledStat>
        <p className="text-[13.5px] leading-snug" style={{ color: BRAND }}>
          tools made correcting the output fast.
          <span className="font-semibold"> That empty column became the brief.</span>
        </p>
      </div>
    </CardShell>
  );
}

/* ------------------------------- legend -------------------------------- */

function Legend() {
  return (
    <div className="flex items-center gap-4 text-[12px] text-gray-500">
      <span className="flex items-center gap-1.5">
        <Mark v="yes" /> Full
      </span>
      <span className="flex items-center gap-1.5">
        <Mark v="partial" /> Partial
      </span>
      <span className="flex items-center gap-1.5">
        <Mark v="no" /> None
      </span>
    </div>
  );
}

/* ------------------------------- screen -------------------------------- */

export default function ResearchVisual() {
  const reduce = useReducedMotion();
  const rise = (i: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const, delay: 0.08 + i * 0.09 },
        };

  return (
    <div
      className={`${inter.className} relative flex h-full w-full flex-col px-14 py-12`}
      style={{
        background: "#fbfbfa",
        backgroundImage: "radial-gradient(circle, rgba(18,51,59,0.05) 1px, transparent 1.2px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Header row */}
      <div className="flex items-end justify-between">
        <div className="relative">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-gray-400">Discovery</div>
          <div className="mt-1 text-[22px] font-semibold text-gray-900">Evidence, three ways</div>
          <Squiggle className="absolute -bottom-2.5 left-0" />
        </div>
        <Legend />
      </div>

      {/* Triptych: two supporting cards + the matrix anchor */}
      <div className="mt-8 grid min-h-0 flex-1 grid-cols-[440px_1fr] gap-5">
        <motion.div className="flex min-h-0 flex-col gap-5" {...rise(0)}>
          <AnalyticsCard />
          <ObservationCard />
        </motion.div>
        <motion.div className="flex min-h-0" {...rise(1)}>
          <TeardownCard />
        </motion.div>
      </div>
    </div>
  );
}
