"use client";

/**
 * PrinciplesVisual — beat "principles" ("Three rules for the redesign"). The
 * hinge between research and the built screens: each rule is shown as the
 * CURRENT screen (crisp, flawed) beside a HAND-DRAWN WIREFRAME of the fix. The
 * scroll then reads research → wireframe → built product (the Feature beats),
 * so it's clear the redesign was sketched before it was built.
 *
 *   1. Hierarchy first    — the buried total, sketched large and first.
 *   2. Colour with meaning — grey headers, sketched with colour-coded bars.
 *   3. Room to breathe     — cramped rows, sketched open with a measured gap.
 *
 * Wireframes use the shared pen-doodle rough filter (read-only import from the
 * Staple Chat illustrations). Scaled to fit the sticky panel via ScaledCanvas.
 */
import { motion, useReducedMotion } from "framer-motion";
import { Inter } from "next/font/google";
import { INK, RoughFilter } from "../staple-chat/chibi";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const BRAND = "#003B4A";
const BRAND_TINT = "rgba(0,59,74,0.08)";
/* Untitled UI utility palette (500) — the hues the product's field groups use. */
/* Same colour-blind-safe hues as the product's field groups (Okabe-Ito-style). */
const UTIL = { blue: "#2E90FA", pink: "#EE46BC", orange: "#EF6820", green: "#17B26A" };

const GROUPS = [
  { title: "Invoice details", color: UTIL.blue },
  { title: "Merchant", color: UTIL.pink },
  { title: "Receiver", color: UTIL.orange },
  { title: "Totals", color: UTIL.green },
];

const tnum = { fontVariantNumeric: "tabular-nums" as const };

/* ------------------------- shared / hand-drawn ------------------------- */

function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="180" height="12" viewBox="0 0 180 12" fill="none" aria-hidden>
      <defs>
        <RoughFilter id="pv-squiggle" baseFrequency={0.05} scale={1.6} seed={7} />
      </defs>
      <path d="M3 7 Q 44 2 90 6 T 177 5" stroke={BRAND} strokeWidth="2.4" strokeLinecap="round" fill="none" filter="url(#pv-squiggle)" opacity={0.55} />
    </svg>
  );
}

/** The pen arrow from the current screen to the wireframe, tagged "sketch".
    Rendered once per rule row, so the filter id must be unique per instance. */
function SketchArrow({ id }: { id: string }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-1 self-center">
      <svg width="44" height="24" viewBox="0 0 44 24" fill="none" aria-hidden>
        <defs>
          <RoughFilter id={id} baseFrequency={0.06} scale={1.4} />
        </defs>
        <g filter={`url(#${id})`} stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M 4 12 H 36" />
          <path d="M 28 5 L 39 12 L 28 19" />
        </g>
      </svg>
      <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-gray-400">sketch</span>
    </div>
  );
}

function Panel({ label, wire = false, children }: { label: string; wire?: boolean; children: React.ReactNode }) {
  return (
    <div className={`relative flex flex-1 flex-col overflow-hidden rounded-xl border p-3 ${wire ? "border-[#003B4A]/25 bg-[#fdfcf8]" : "border-gray-200 bg-white"}`}>
      <span className={`text-[9.5px] font-semibold uppercase tracking-[0.09em] ${wire ? "text-[#003B4A]" : "text-gray-400"}`}>{label}</span>
      <div className="relative mt-2 min-h-0 flex-1">{children}</div>
    </div>
  );
}

/* ------------------------------ wireframes ----------------------------- */
/* Each "after" is a rough pen sketch — the wireframe made before building. */

function HierarchyWire() {
  return (
    <svg viewBox="0 0 250 148" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" aria-label="Wireframe: the total, drawn large and first">
      <defs>
        <RoughFilter id="pw-hier" baseFrequency={0.018} scale={1.5} />
      </defs>
      <g filter="url(#pw-hier)">
        {/* panel header: a title + a count pill */}
        <text x={12} y={13} fontSize={9.5} fill={INK} letterSpacing="0.4">Fields</text>
        <rect x={198} y={4} width={40} height={13} rx={6.5} fill="none" stroke={INK} strokeWidth={1.3} />
        <path d="M 205 11 h 26" stroke={INK} strokeWidth={1.4} opacity={0.4} strokeLinecap="round" />
        <path d="M 12 19 H 238" stroke={INK} strokeWidth={1} opacity={0.25} />
        {/* the hero total block, emphasised */}
        <rect x={10} y={26} width={228} height={38} rx={6} fill="#fff" stroke={INK} strokeWidth={2.7} />
        <text x={22} y={49} fontSize={11} fill={INK} letterSpacing="1">TOTAL</text>
        <rect x={162} y={35} width={64} height={20} rx={3} fill={INK} opacity={0.85} />
        {/* structured field rows, each with a mapped-check cue */}
        {[0, 1, 2].map((i) => {
          const y = 82 + i * 22;
          return (
            <g key={i}>
              <path d={`M 12 ${y} h 40`} stroke={INK} strokeWidth={1.6} opacity={0.35} strokeLinecap="round" />
              <path d={`M 12 ${y + 8} h 94`} stroke={INK} strokeWidth={2.4} opacity={0.6} strokeLinecap="round" />
              <circle cx={228} cy={y + 4} r={6} fill="none" stroke={INK} strokeWidth={1.4} opacity={0.55} />
              <path d={`M 225 ${y + 4} l 2 2.5 l 4.5 -5`} stroke={INK} strokeWidth={1.4} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function ColourWire() {
  const three = GROUPS.slice(0, 3);
  return (
    <svg viewBox="0 0 250 148" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" aria-label="Wireframe: colour-coded field groups">
      <defs>
        <RoughFilter id="pw-colour" baseFrequency={0.02} scale={1.4} />
      </defs>
      <g filter="url(#pw-colour)">
        {/* each group: a colour bar, a title, and two field rows */}
        {three.map((g, i) => {
          const gy = 8 + i * 44;
          return (
            <g key={g.title}>
              <rect x={12} y={gy} width={7} height={38} rx={2} fill={g.color} stroke={INK} strokeWidth={1.3} />
              <path d={`M 28 ${gy + 6} h 66`} stroke={INK} strokeWidth={2.4} opacity={0.65} strokeLinecap="round" />
              <path d={`M 28 ${gy + 20} h 44`} stroke={INK} strokeWidth={1.5} opacity={0.32} strokeLinecap="round" />
              <path d={`M 150 ${gy + 20} h 52`} stroke={INK} strokeWidth={2} opacity={0.5} strokeLinecap="round" />
              <path d={`M 28 ${gy + 31} h 44`} stroke={INK} strokeWidth={1.5} opacity={0.32} strokeLinecap="round" />
              <path d={`M 150 ${gy + 31} h 38`} stroke={INK} strokeWidth={2} opacity={0.5} strokeLinecap="round" />
            </g>
          );
        })}
        {/* palette swatches + note */}
        <g>
          {GROUPS.map((g, i) => (
            <rect key={g.title} x={12 + i * 12} y={140} width={8} height={8} rx={2} fill={g.color} stroke={INK} strokeWidth={1} />
          ))}
          <text x={68} y={147} fontSize={9} fill={INK} opacity={0.55}>colour = category</text>
        </g>
      </g>
    </svg>
  );
}

function BreatheWire() {
  const rowY = [18, 50, 82, 114];
  return (
    <svg viewBox="0 0 250 148" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" aria-label="Wireframe: open rows with measured whitespace">
      <defs>
        <RoughFilter id="pw-breathe" baseFrequency={0.018} scale={1.4} />
      </defs>
      <g filter="url(#pw-breathe)">
        {rowY.map((y, i) => (
          <g key={i}>
            <path d={`M 18 ${y} h 34`} stroke={INK} strokeWidth={1.6} strokeLinecap="round" opacity={0.32} />
            <path d={`M 18 ${y + 9} h 116`} stroke={INK} strokeWidth={2.5} strokeLinecap="round" opacity={0.6} />
          </g>
        ))}
        {/* row-gap measure */}
        <g stroke={INK} strokeWidth={1.5} strokeLinecap="round" fill="none" opacity={0.9}>
          <path d="M 214 30 v 20" />
          <path d="M 210 30 h 8" />
          <path d="M 210 50 h 8" />
          <path d="M 214 33 l -3 4 M 214 33 l 3 4" />
          <path d="M 214 47 l -3 -4 M 214 47 l 3 -4" />
        </g>
        <text x={222} y={44} fontSize={11} fontWeight={700} fill={INK}>16</text>
        {/* dashed baseline guides, redline style */}
        <path d="M 12 27 H 200" stroke={INK} strokeWidth={1} strokeDasharray="2 4" opacity={0.22} />
        <path d="M 12 59 H 200" stroke={INK} strokeWidth={1} strokeDasharray="2 4" opacity={0.22} />
        {/* left inner-padding tick */}
        <g stroke={INK} strokeWidth={1.4} strokeLinecap="round" fill="none" opacity={0.7}>
          <path d="M 4 12 v 10" />
          <path d="M 18 12 v 10" />
          <path d="M 4 17 h 14" />
        </g>
        <text x={7} y={9} fontSize={8} fontWeight={700} fill={INK}>12</text>
      </g>
    </svg>
  );
}

/* ------------------------------ specimens ------------------------------ */
/* The "before" panels are the crisp current screen, for contrast. */

function HierarchyBefore() {
  const buried: [string, string][] = [
    ["Invoice No", "NX-2025-INV-7834"],
    ["Sub Total", "$2,442.00"],
    ["Grand Total", "$2,661.78"],
    ["Tax", "$219.78"],
    ["Invoice Date", "Jan 25, 2025"],
  ];
  return (
    <div className="space-y-1.5">
      {buried.map(([l, v]) => (
        <div key={l} className="flex justify-between text-[12px]">
          <span className="text-gray-500">{l}</span>
          <span className="text-gray-600" style={tnum}>{v}</span>
        </div>
      ))}
    </div>
  );
}

function ColourBefore() {
  return (
    <div className="flex h-full flex-col justify-center space-y-[13px]">
      {GROUPS.map((g) => (
        <div key={g.title} className="text-[11px] uppercase tracking-[0.06em] text-gray-400">
          {g.title}
        </div>
      ))}
    </div>
  );
}

function BreatheBefore() {
  const rows: [string, string][] = [
    ["Merchant name", "Summit Software Solutions"],
    ["Merchant email", "info@summitsoftware.com"],
    ["Merchant phone", "+1 415 789 5643"],
  ];
  return (
    <div className="self-start">
      {rows.map(([l, v]) => (
        <div key={l} className="border-b border-gray-100 py-[3px] last:border-0">
          <div className="text-[9px] leading-tight text-gray-400">{l}</div>
          <div className="text-[11px] leading-tight text-gray-600">{v}</div>
        </div>
      ))}
    </div>
  );
}

const RULES = [
  { n: 1, title: "Hierarchy first", note: "The total is drawn large and first, instead of hiding mid-list.", Before: HierarchyBefore, Wire: HierarchyWire },
  { n: 2, title: "Colour with meaning", note: "Category bars sketched in hues that differ in lightness, colour-blind safe.", Before: ColourBefore, Wire: ColourWire },
  { n: 3, title: "Room to breathe", note: "Rows opened up, the added whitespace measured right on the sketch.", Before: BreatheBefore, Wire: BreatheWire },
];

/* -------------------------------- rows --------------------------------- */

function RuleRow({ n, title, note, Before, Wire }: (typeof RULES)[number]) {
  return (
    <div className="flex min-h-0 flex-1 items-stretch gap-5 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="w-[210px] shrink-0 self-center">
        <div className="flex items-center gap-2.5">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white" style={{ background: BRAND }}>
            {n}
          </span>
          <span className="text-[15px] font-semibold text-gray-900">{title}</span>
        </div>
        <p className="mt-2 text-[12.5px] leading-snug text-gray-500">{note}</p>
      </div>
      <div className="flex min-w-0 flex-1 items-stretch gap-3">
        <Panel label="Before · current screen">
          <Before />
        </Panel>
        <SketchArrow id={`pv-arrow-${n}`} />
        <Panel label="After · wireframe" wire>
          <Wire />
        </Panel>
      </div>
    </div>
  );
}

/* ------------------------------- screen -------------------------------- */

export default function PrinciplesVisual() {
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
      <div className="flex items-end justify-between">
        <div className="relative">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-gray-400">Principles</div>
          <div className="mt-1 text-[22px] font-semibold text-gray-900">Three rules, sketched first</div>
          <Squiggle className="absolute -bottom-2.5 left-0" />
        </div>
        <div className="text-[12px] text-gray-400">Current screen → hand-drawn wireframe</div>
      </div>

      <div className="mt-8 flex min-h-0 flex-1 flex-col gap-4">
        {RULES.map((r, i) => (
          <motion.div key={r.n} className="flex min-h-0 flex-1" {...rise(i)}>
            <RuleRow {...r} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
