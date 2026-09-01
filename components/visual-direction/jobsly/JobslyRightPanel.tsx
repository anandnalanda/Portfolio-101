"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Inter, Spectral } from "next/font/google";
import { useState } from "react";
import { RoughFilter } from "@/components/screens/ofm/chibi";

/**
 * Jobsly - the sticky right "brand world" for the Visual Direction case study,
 * mirroring the OFM panel but in Jobsly's own system: a Linear-style dark UI
 * with a near-black canvas, layered dark surfaces + hairlines, a single indigo
 * accent, green reserved for success, and Inter throughout. Fully self-contained;
 * content crossfades to match the active left beat.
 */

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-jb" });
const spectral = Spectral({ subsets: ["latin"], weight: ["400"] });

const JB = {
  canvas: "#010102",
  s1: "#0f1011",
  s2: "#141516",
  s3: "#18191a",
  s4: "#191a1b",
  sHover: "#1e1f21",
  hairline: "#23252a",
  hairlineStrong: "#34343a",
  hairlineTertiary: "#3e3e44",
  ink: "#f7f8f8",
  inkMuted: "#d0d6e0",
  inkSubtle: "#8a8f98",
  inkTertiary: "#62666d",
  primary: "#5e6ad2",
  primaryHover: "#828fff",
  focus: "#5e69d1",
  onPrimary: "#ffffff",
  success: "#27a644",
} as const;

/* Linear-style stage-light background (white glow rising from the bottom) */
const HERO_BG =
  "radial-gradient(ellipse 100% 70% at 50% 0%, transparent 40%, rgba(0,0,0,0.45) 100%), radial-gradient(ellipse 100% 80% at 50% 100%, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.08) 55%, transparent 85%), #0a0a0f";

const CARD = { backgroundColor: JB.s2, border: `1px solid ${JB.hairline}` };
const cellLabel = "text-[10px] font-semibold uppercase tracking-[0.14em]";

/* ── data ─────────────────────────────────────────────────────────── */

type Swatch = { name: string; hex: string; darkText?: boolean };

// proper colour names for every token, in the spirit of the OFM colour beat -
// each hex given an evocative name tuned to Jobsly's dark indigo system
const ACCENTS: Swatch[] = [
  { name: "Periwinkle", hex: "#828FFF" }, // primary-hover
  { name: "Indigo", hex: "#5E69D1" }, // primary-focus
  { name: "Shamrock", hex: "#27A644" }, // success
];
const SURFACES: Swatch[] = [
  { name: "Obsidian", hex: "#010102" }, // canvas
  { name: "Onyx", hex: "#0F1011" }, // surface-1
  { name: "Coal", hex: "#141516" }, // surface-2
  { name: "Graphite", hex: "#18191A" }, // surface-3
  { name: "Charcoal", hex: "#191A1B" }, // surface-4
  { name: "Gunmetal", hex: "#1E1F21" }, // surface-hover
];
const HAIRLINES: Swatch[] = [
  { name: "Slate", hex: "#23252A" }, // hairline
  { name: "Iron", hex: "#34343A" }, // hairline-strong
  { name: "Steel", hex: "#3E3E44" }, // hairline-tertiary
];
const INKS: Swatch[] = [
  { name: "Porcelain", hex: "#F7F8F8", darkText: true }, // ink
  { name: "Mist", hex: "#D0D6E0", darkText: true }, // ink-muted
  { name: "Stone", hex: "#8A8F98", darkText: true }, // ink-subtle
  { name: "Pewter", hex: "#62666D" }, // ink-tertiary
];

const TYPE_SCALE: { name: string; px: number; lh: number; weight: number; track: number }[] = [
  { name: "Display", px: 40, lh: 44, weight: 600, track: -2 },
  { name: "Heading", px: 30, lh: 36, weight: 600, track: -1.5 },
  { name: "Title", px: 24, lh: 30, weight: 600, track: -1 },
  { name: "Subtitle", px: 20, lh: 26, weight: 500, track: -0.5 },
  { name: "Body", px: 16, lh: 24, weight: 400, track: 0 },
  { name: "Body sm", px: 14, lh: 20, weight: 400, track: 0 },
  { name: "Caption", px: 12, lh: 16, weight: 500, track: 0.5 },
  { name: "Micro", px: 11, lh: 14, weight: 500, track: 1 },
];
const WEIGHTS: [string, number][] = [
  ["Regular", 400],
  ["Medium", 500],
  ["Semibold", 600],
  ["Bold", 700],
];
const RADII: { r: number; label: string }[] = [
  { r: 4, label: "xs" },
  { r: 6, label: "sm" },
  { r: 8, label: "md" },
  { r: 12, label: "lg" },
  { r: 16, label: "xl" },
  { r: 24, label: "2xl" },
  { r: 9999, label: "pill" },
];

const SCREENS = {
  home: { label: "Home", src: "/vd/pages/jobsly-home.jpg" },
  pricing: { label: "Pricing", src: "/vd/pages/jobsly-pricing.jpg" },
  screen: { label: "Screen", src: "/vd/pages/jobsly-screen.jpg" },
  blog: { label: "Blog", src: "/vd/pages/jobsly-blog.jpg" },
  hire: { label: "Hire", src: "/vd/pages/jobsly-hire.jpg" },
  interview: { label: "Interview", src: "/vd/pages/jobsly-interview.jpg" },
} as const;
type Page = { label: string; src: string };

/* ── per-beat views ───────────────────────────────────────────────── */

function Hero() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center rounded-[28px] px-10 text-center"
      style={{ background: HERO_BG }}
    >
      <img src="/vd/jobsly-logo.svg" alt="Jobsly" className="h-[74px] w-auto select-none" draggable={false} />
      <span className={`${spectral.className} mt-7 whitespace-nowrap text-[38px] leading-[1.06]`} style={{ color: JB.inkMuted }}>
        Website design + Build
      </span>
    </div>
  );
}

/* ── Guiding attributes: a three-panel pen-doodle triptych ──────────────
   The old single tableau made the reader decode one busy scene for three
   ideas. Instead each attribute gets its own tiny IP-illustration (rough
   broken outlines, dot-eye cuteness, lots of dark space), anchored by its
   keyword, so the meaning reads instantly:
     1 · In control      - you tap APPROVE; the agent waits to execute; undo = reversible
     2 · Legible         - a cited, magnified rubric row on an open card; no black box
     3 · Quietly capable - a calm agent sets the finished decision down and steps aside
   Adapted to Jobsly's dark palette: light "pen" ink, indigo accent, green
   reserved for approval/success. */

const IK = "#e9ebef"; // light "pen" ink on the dark canvas

/** Cute indigo agent - the recurring character across all three panels. */
function MiniRobot({ x, y, s = 1, pose = "wait" }: { x: number; y: number; s?: number; pose?: "wait" | "point" | "calm" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <line x1={0} y1={-20} x2={0} y2={-28} stroke={IK} strokeWidth={2.4} strokeLinecap="round" />
      <circle cx={0} cy={-31} r={3.2} fill={JB.primary} stroke={IK} strokeWidth={1.8} />
      {/* body first, so the head overlaps it */}
      <path d="M -16 32 Q -17 12 0 12 Q 17 12 16 32 Z" fill={JB.s3} stroke={IK} strokeWidth={2.6} strokeLinejoin="round" />
      <rect x={-7.5} y={19} width={15} height={9} rx={2.5} fill={JB.s1} stroke={IK} strokeWidth={1.8} />
      <circle cx={0} cy={23.5} r={1.9} fill={JB.primary} />
      <rect x={-19} y={-18} width={38} height={31} rx={12} fill={JB.s3} stroke={IK} strokeWidth={2.6} />
      <rect x={-13} y={-10} width={26} height={14} rx={7} fill={JB.primary} />
      {pose === "calm" ? (
        <g fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round">
          <path d="M -7.5 -3.5 q 2.5 2.6 5 0" />
          <path d="M 2.5 -3.5 q 2.5 2.6 5 0" />
        </g>
      ) : (
        <g fill="#fff">
          <circle cx={-5} cy={-3.5} r={2.1} />
          <circle cx={5} cy={-3.5} r={2.1} />
        </g>
      )}
      {pose === "point" && <path d="M 14 15 q 17 -3 24 -18" fill="none" stroke={IK} strokeWidth={2.6} strokeLinecap="round" />}
      {pose === "wait" && <path d="M 14 17 q 9 1 10 11" fill="none" stroke={IK} strokeWidth={2.6} strokeLinecap="round" />}
      {pose === "calm" && <path d="M 14 15 q 14 3 21 -3" fill="none" stroke={IK} strokeWidth={2.6} strokeLinecap="round" />}
    </g>
  );
}

/** The human operator - dot-eye, calm. */
function MiniPerson({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -21 34 Q -23 7 0 7 Q 23 7 21 34 Z" fill={JB.s3} stroke={IK} strokeWidth={2.6} strokeLinejoin="round" />
      <circle cx={0} cy={-15} r={17} fill={JB.s2} stroke={IK} strokeWidth={2.6} />
      <circle cx={-6} cy={-15} r={2.5} fill={IK} />
      <circle cx={6} cy={-15} r={2.5} fill={IK} />
      <path d="M -5 -7 q 5 4.5 10 0" fill="none" stroke={IK} strokeWidth={2.2} strokeLinecap="round" />
    </g>
  );
}

const LOOP = { repeat: Infinity, ease: "easeInOut" as const };
const ORIGIN = { transformBox: "fill-box", transformOrigin: "center" } as const;

/* Panel 1 - In control: you tap the green APPROVE (it presses) and the agent
   waits to execute (bobs) - you approve, it acts. */
function InControlScene() {
  return (
    <svg viewBox="0 0 220 210" className="w-full" aria-hidden>
      <defs>
        <RoughFilter id="jb-a" seed={3} />
        <radialGradient id="jb-halo-a" cx="46%" cy="30%" r="52%">
          <stop offset="0%" stopColor={JB.primary} stopOpacity="0.22" />
          <stop offset="70%" stopColor={JB.primary} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={104} cy={64} r={92} fill="url(#jb-halo-a)" />
      <g filter="url(#jb-a)">
        {/* APPROVE control - a periodic press */}
        <motion.g style={ORIGIN} animate={{ scale: [1, 0.9, 1, 1] }} transition={{ duration: 3, times: [0, 0.08, 0.2, 1], ...LOOP }}>
          <rect x={52} y={38} width={104} height={40} rx={13} fill={JB.success} stroke={IK} strokeWidth={2.6} />
          <path d="M 70 58 l 6 7 l 12 -15" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
          <rect x={96} y={54} width={44} height={7} rx={3.5} fill="#fff" opacity={0.9} />
        </motion.g>
        {/* you - hand on the control */}
        <MiniPerson x={58} y={176} s={0.94} />
        <path d="M 72 168 Q 92 128 100 82" fill="none" stroke={IK} strokeWidth={2.8} strokeLinecap="round" />
        <circle cx={101} cy={80} r={4} fill={JB.s2} stroke={IK} strokeWidth={2.2} />
        {/* the agent - waits to execute (gentle bob) */}
        <motion.g animate={{ y: [0, -2.5, 0] }} transition={{ duration: 2.6, ...LOOP }}>
          <MiniRobot x={168} y={148} s={0.9} pose="wait" />
        </motion.g>
      </g>
    </svg>
  );
}

/* Panel 2 - Legible: the magnifier scans the open decision card, the cited
   rubric row pulses in indigo, the agent points to its own reasoning. */
function LegibleScene() {
  return (
    <svg viewBox="0 0 220 210" className="w-full" aria-hidden>
      <defs>
        <RoughFilter id="jb-b" seed={7} />
        <radialGradient id="jb-halo-b" cx="52%" cy="30%" r="52%">
          <stop offset="0%" stopColor={JB.primary} stopOpacity="0.20" />
          <stop offset="70%" stopColor={JB.primary} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={112} cy={70} r={92} fill="url(#jb-halo-b)" />
      <g filter="url(#jb-b)">
        {/* the open, readable card */}
        <g transform="translate(112 74) rotate(-4)">
          <rect x={-54} y={-52} width={108} height={104} rx={12} fill="#f4f5f7" stroke={IK} strokeWidth={2.8} />
          <circle cx={-36} cy={-34} r={10} fill={JB.success} />
          <path d="M -40.5 -34 l 3 4 l 6.5 -8" fill="none" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
          <rect x={-20} y={-39} width={50} height={7} rx={3.5} fill="#0f1011" />
          <g fill="#9aa0aa">
            <rect x={-40} y={-14} width={80} height={5.5} rx={2.75} />
            <rect x={-40} y={-2} width={66} height={5.5} rx={2.75} />
          </g>
          {/* cited rubric row (highlighted) - gentle pulse */}
          <motion.g style={ORIGIN} animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2.4, ...LOOP }}>
            <rect x={-42} y={16} width={70} height={20} rx={6} fill="#e7e9fb" stroke={JB.primary} strokeWidth={2} />
            <circle cx={-31} cy={26} r={3.4} fill={JB.primary} />
            <rect x={-22} y={23} width={34} height={6} rx={3} fill={JB.primary} />
          </motion.g>
        </g>
        {/* magnifier - scans across the rows */}
        <motion.g animate={{ x: [0, -48, -10, 0], y: [0, -38, -54, 0] }} transition={{ duration: 6, ...LOOP }}>
          <g transform="translate(150 122)">
            <circle cx={0} cy={0} r={15} fill="none" stroke={JB.primaryHover} strokeWidth={3} />
            <circle cx={0} cy={0} r={15} fill={JB.primary} opacity={0.1} />
            <line x1={11} y1={11} x2={24} y2={24} stroke={JB.primaryHover} strokeWidth={4} strokeLinecap="round" />
          </g>
        </motion.g>
        {/* the agent - points to its own reasoning (bob) */}
        <motion.g animate={{ y: [0, -2, 0] }} transition={{ duration: 2.8, ...LOOP }}>
          <MiniRobot x={44} y={176} s={0.8} pose="point" />
        </motion.g>
      </g>
    </svg>
  );
}

/* Panel 3 - Quietly capable: an attention transfer, no arrow. The calm agent
   surfaces the finished decision - the card lifts and its glow blooms while a
   quiet check ticks in - then the agent recedes (dims, shrinks, lowers its
   gesturing arm) so the decision, not the agent, is what you're left looking
   at. It gets out of the way. One slow, calm loop.
   Beat timing (5.4s, keyframes at 0 / 0.30 / 0.74 / 1):
     rest → surfaced+agent-receded → held → back to rest. */
const QUIET_DUR = 5.4;
const QUIET_TIMES = [0, 0.3, 0.74, 1];
function QuietScene() {
  const sparkles: [number, number, number, number][] = [
    [190, 92, 2.4, 0],
    [206, 76, 1.7, 0.5],
    [178, 72, 1.3, 1.0],
  ];
  return (
    <svg viewBox="0 0 220 210" className="w-full" aria-hidden>
      <defs>
        <RoughFilter id="jb-c" seed={11} />
        <radialGradient id="jb-halo-c" cx="34%" cy="40%" r="46%">
          <stop offset="0%" stopColor={JB.primary} stopOpacity="0.16" />
          <stop offset="70%" stopColor={JB.primary} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="jb-cardglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={JB.primaryHover} stopOpacity="0.6" />
          <stop offset="55%" stopColor={JB.primary} stopOpacity="0.16" />
          <stop offset="100%" stopColor={JB.primary} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* faint ambient on the agent's side */}
      <circle cx={92} cy={96} r={86} fill="url(#jb-halo-c)" />

      {/* the surfaced decision's glow - blooms as the agent presents it */}
      <motion.ellipse
        cx={166} cy={118} rx={56} ry={48} fill="url(#jb-cardglow)" style={ORIGIN}
        animate={{ opacity: [0.08, 0.62, 0.62, 0.08], scale: [0.9, 1.04, 1.04, 0.9] }}
        transition={{ duration: QUIET_DUR, times: QUIET_TIMES, ...LOOP }}
      />
      {/* quiet sparkles around the decision - twinkle */}
      {sparkles.map(([cx, cy, r, delay], i) => (
        <motion.circle
          key={i} cx={cx} cy={cy} r={r} fill={JB.primaryHover} style={ORIGIN}
          animate={{ opacity: [0.1, 0.9, 0.1], scale: [0.6, 1.15, 0.6] }}
          transition={{ duration: 2.4, delay, ...LOOP }}
        />
      ))}

      <g filter="url(#jb-c)">
        {/* connecting gesture - "here's your decision"; lowers as the agent recedes */}
        <motion.path
          d="M 110 150 q 22 -14 34 -30" fill="none" stroke={IK} strokeWidth={2.6} strokeLinecap="round"
          animate={{ opacity: [0.9, 0.9, 0.15, 0.9], pathLength: [1, 1, 0.55, 1] }}
          transition={{ duration: QUIET_DUR, times: QUIET_TIMES, ...LOOP }}
        />

        {/* the finished decision - lifts as it's surfaced, then holds */}
        <motion.g
          style={ORIGIN}
          animate={{ y: [7, 0, 0, 7], scale: [0.97, 1.03, 1.03, 0.97] }}
          transition={{ duration: QUIET_DUR, times: QUIET_TIMES, ...LOOP }}
        >
          <g transform="translate(166 118) rotate(4)">
            <rect x={-25} y={-27} width={50} height={46} rx={9} fill="#f4f5f7" stroke={IK} strokeWidth={2.4} />
            <circle cx={-12} cy={-14} r={7.5} fill={JB.success} />
            <path d="M -15.5 -14 l 2.4 3 l 5 -6.2" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
            <g fill="#9aa0aa">
              <rect x={-16} y={1} width={34} height={5} rx={2.5} />
              <rect x={-16} y={11} width={25} height={5} rx={2.5} />
            </g>
          </g>
        </motion.g>

        {/* the calm agent - surfaces the decision, then quietly recedes so the
            decision is what you're left with (dims, shrinks, steps back) */}
        <motion.g
          style={ORIGIN}
          animate={{ opacity: [1, 0.42, 0.42, 1], scale: [1, 0.88, 0.88, 1], x: [0, -9, -9, 0] }}
          transition={{ duration: QUIET_DUR, times: QUIET_TIMES, ...LOOP }}
        >
          <MiniRobot x={90} y={148} s={1.06} pose="calm" />
        </motion.g>
      </g>
    </svg>
  );
}

const ATTRS: { key: string; label: string; Scene: () => React.ReactElement }[] = [
  { key: "control", label: "In control", Scene: InControlScene },
  { key: "legible", label: "Legible", Scene: LegibleScene },
  { key: "quiet", label: "Quietly capable", Scene: QuietScene },
];

function AttributesView() {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[28px] px-3" style={{ background: HERO_BG }}>
      <div className="grid w-full grid-cols-3 items-center">
        {ATTRS.map(({ key, label, Scene }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.14, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`flex flex-col items-center px-4 ${i > 0 ? "border-l" : ""}`}
            style={{ borderColor: JB.hairline }}
          >
            <div className="w-full max-w-[320px]">
              <Scene />
            </div>
            <div className="mt-6 font-mono text-[11px] font-light uppercase tracking-[0.16em]" style={{ color: JB.inkSubtle, textIndent: "0.16em" }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="mt-2 font-mono text-[14px] font-light uppercase tracking-[0.16em]" style={{ color: JB.ink, textIndent: "0.16em" }}>
              {label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ColourView() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1000);
  };
  const chip = (s: Swatch, cls = "") => (
    <button
      key={s.hex}
      type="button"
      onClick={() => copy(s.hex)}
      className={`flex flex-col justify-between rounded-xl p-3 text-left transition-[filter] hover:brightness-125 ${cls}`}
      style={{ backgroundColor: s.hex, border: `1px solid ${JB.hairline}`, color: s.darkText ? JB.canvas : JB.ink }}
    >
      <span className="text-[11px] font-semibold">{s.name}</span>
      <span className="text-[9.5px] font-medium uppercase opacity-70">{copied === s.hex ? "copied ✓" : s.hex}</span>
    </button>
  );

  return (
    <div className="flex h-full w-full flex-col gap-3 rounded-[28px] p-4" style={{ backgroundColor: JB.canvas }}>
      {/* primary + accents */}
      <div className="flex gap-3" style={{ height: "34%" }}>
        <button
          type="button"
          onClick={() => copy("#5E6AD2")}
          className="flex flex-[1.3] flex-col justify-end rounded-2xl p-5 text-left transition-[filter] hover:brightness-110"
          style={{ backgroundColor: JB.primary, color: JB.onPrimary }}
        >
          <span className="text-[15px] font-semibold">Iris</span>
          <span className="mt-1 text-[11px] font-medium uppercase opacity-80">{copied === "#5E6AD2" ? "copied ✓" : "#5E6AD2"}</span>
        </button>
        <div className="grid flex-1 grid-rows-3 gap-3">{ACCENTS.map((s) => chip(s))}</div>
      </div>

      {/* surfaces */}
      <div>
        <span className={cellLabel} style={{ color: JB.inkSubtle }}>Surfaces</span>
        <div className="mt-2 grid grid-cols-6 gap-2">{SURFACES.map((s) => chip(s, "h-[62px]"))}</div>
      </div>

      {/* text + hairlines */}
      <div className="flex min-h-0 flex-1 gap-3">
        <div className="flex flex-1 flex-col">
          <span className={cellLabel} style={{ color: JB.inkSubtle }}>Text</span>
          <div className="mt-2 grid flex-1 grid-cols-2 gap-2">{INKS.map((s) => chip(s))}</div>
        </div>
        <div className="flex flex-1 flex-col">
          <span className={cellLabel} style={{ color: JB.inkSubtle }}>Hairlines</span>
          <div className="mt-2 grid flex-1 grid-cols-3 gap-2">{HAIRLINES.map((s) => chip(s))}</div>
        </div>
      </div>
    </div>
  );
}

function FoundationsView() {
  return (
    <div className="flex h-full w-full flex-col gap-3 rounded-[28px] p-4" style={{ backgroundColor: JB.canvas }}>
      {/* specimen + weights */}
      <div className="flex gap-3">
        <div className="flex flex-[1.3] flex-col rounded-2xl p-5" style={CARD}>
          <span className={cellLabel} style={{ color: JB.primaryHover }}>Inter</span>
          <span className="mt-1 text-[64px] font-semibold leading-[0.95] tracking-[-0.03em]" style={{ color: JB.ink }}>
            Ag
          </span>
          <span className="mt-2.5 text-[10.5px] leading-[1.75]" style={{ color: JB.inkSubtle }}>
            ABCDEFGHIJKLMNOPQRSTUVWXYZ
            <br />
            abcdefghijklmnopqrstuvwxyz
            <br />
            0123456789 &amp; @ # % “ ”
          </span>
        </div>
        <div className="flex flex-1 flex-col rounded-2xl p-5" style={CARD}>
          <span className={cellLabel} style={{ color: JB.inkSubtle }}>Weights</span>
          <div className="mt-1.5 flex flex-col">
            {WEIGHTS.map(([label, w]) => (
              <div key={w} className="flex items-baseline justify-between border-b py-[9px] last:border-0" style={{ borderColor: JB.hairline }}>
                <span className="text-[18px] leading-none" style={{ fontWeight: w, color: JB.ink }}>{label}</span>
                <span className="text-[11px] tabular-nums" style={{ color: JB.inkSubtle }}>{w}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* type scale */}
      <div className="flex flex-1 flex-col rounded-2xl px-6 py-4" style={CARD}>
        <span className={cellLabel} style={{ color: JB.inkSubtle }}>Type scale</span>
        <div className="mt-1 flex flex-1 flex-col justify-between">
          {TYPE_SCALE.map((t) => (
            <div key={t.name} className="flex items-baseline justify-between gap-4 border-b py-1 last:border-0" style={{ borderColor: JB.hairline }}>
              <span style={{ fontSize: t.px, lineHeight: `${t.lh}px`, fontWeight: t.weight, letterSpacing: `${t.track / 100}em`, color: JB.ink }}>
                {t.name}
              </span>
              <span className="shrink-0 text-[10px] tabular-nums" style={{ color: JB.inkSubtle }}>
                {t.px}/{t.lh} · {t.weight} · {t.track > 0 ? "+" : ""}{t.track}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* corners + elevation (surface tint ladder) */}
      <div className="flex gap-3">
        <div className="flex flex-1 flex-col rounded-2xl p-5" style={CARD}>
          <span className={cellLabel} style={{ color: JB.inkSubtle }}>Corners</span>
          <div className="flex flex-1 items-center justify-between pt-3">
            {RADII.map((c) => (
              <div key={c.label} className="flex flex-col items-center gap-2">
                <div className="h-9 w-9" style={{ backgroundColor: JB.primary, borderRadius: c.r }} />
                <span className="text-[9px]" style={{ color: JB.inkSubtle }}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-1 flex-col rounded-2xl p-5" style={CARD}>
          <span className={cellLabel} style={{ color: JB.inkSubtle }}>Elevation</span>
          <div className="flex flex-1 items-center justify-between pt-3">
            {SURFACES.slice(1).map((s) => (
              <div key={s.hex} className="flex flex-col items-center gap-2">
                <div className="h-9 w-9 rounded-[10px]" style={{ backgroundColor: s.hex, border: `1px solid ${JB.hairlineStrong}` }} />
                <span className="text-[9px]" style={{ color: JB.inkSubtle }}>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Designing the agent - a faithful rebuild of Jobsly's shipped hero: one
   window, two panes. Left is the role pipeline ("Good morning, Sophie."); right
   is Rob's thread, where a plain-English reply steers the whole conversation.
   The primary UI is a conversation, not a dashboard. */
const AGENT_ROLES: { role: string; status: string; days: string; count: number; dot: string }[] = [
  { role: "Senior Backend Engineer", status: "Offer pending — Elena. Competing deadline Friday.", days: "42d", count: 1, dot: "#e5484d" },
  { role: "Customer Support Lead", status: "247 new overnight. 8 strong, screening complete.", days: "12d", count: 23, dot: "#f5a623" },
  { role: "Product Designer", status: "Interview today 11:00am — Liam Torres.", days: "28d", count: 4, dot: JB.success },
  { role: "Data Analyst", status: "Interview today 14:00 — Fatima Al-Rashid.", days: "18d", count: 6, dot: JB.success },
  { role: "SDR ×2", status: "Healthy pipeline. 12 new overnight, nothing urgent.", days: "10d", count: 15, dot: JB.success },
  { role: "Finance Manager", status: "3 assessments completed. Results pending.", days: "21d", count: 8, dot: JB.success },
];

/* Rob's thread, played out as a live conversation on mount */
const THREAD: { kind: "rob" | "you" | "time"; text: string; accent?: string }[] = [
  { kind: "rob", text: "Morning, Sophie. Busy night — here's what needs you." },
  { kind: "time", text: "8:47 AM" },
  { kind: "rob", accent: "#e5484d", text: "Elena's offer for Senior Backend has a competing deadline this Friday. You need to send today or we'll lose her." },
  { kind: "rob", accent: "#f5a623", text: "Customer Support got 247 overnight. I've screened them all — 8 are strong. Ready to send assessments when you are." },
  { kind: "rob", text: "You've got Liam Torres at 11am and Fatima Al-Rashid at 2pm — I'll prep both packs before then." },
  { kind: "you", text: "Let's start with Elena's offer." },
  { kind: "rob", text: "On it. Pulling up her profile now." },
];

const RISE = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } };
const ROLES_WRAP = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } } };
const THREAD_WRAP = { hidden: {}, show: { transition: { staggerChildren: 0.55, delayChildren: 0.55 } } };

function AgentView() {
  const msg = "rounded-lg px-4 py-3 text-[13px] leading-relaxed";
  return (
    <div className="flex h-full w-full rounded-[28px] p-5" style={{ background: HERO_BG }}>
      <div className="flex h-full w-full overflow-hidden rounded-2xl" style={{ backgroundColor: JB.s1, border: `1px solid ${JB.hairline}`, boxShadow: "0 24px 70px rgba(0,0,0,0.45)" }}>
        {/* ── left: the role pipeline ── */}
        <div className="flex w-[60%] flex-col border-r" style={{ borderColor: JB.hairline }}>
          <div className="px-7 pt-7">
            <h3 className="text-[24px] font-medium tracking-[-0.5px]" style={{ color: JB.ink }}>Good morning, Sophie.</h3>
            <p className="mt-1.5 text-[13px]" style={{ color: JB.inkSubtle }}>
              Screened 47 applicants for Customer Support overnight · 2 interviews today
            </p>
          </div>
          <motion.div className="flex-1 space-y-1.5 px-7 py-6" variants={ROLES_WRAP} initial="hidden" animate="show">
            {AGENT_ROLES.map((r) => (
              <motion.div key={r.role} variants={RISE} className="flex items-center gap-3 rounded-lg px-4 py-3" style={{ border: `1px solid ${JB.hairline}` }}>
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: r.dot }} />
                <span className="whitespace-nowrap text-[13px] font-medium" style={{ color: JB.ink }}>{r.role}</span>
                <span className="flex-1 truncate text-[13px]" style={{ color: JB.inkSubtle }}>{r.status}</span>
                <span className="shrink-0 text-[11px]" style={{ color: JB.inkTertiary }}>{r.days}</span>
                <span className="shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium" style={{ color: JB.inkSubtle, backgroundColor: JB.s2 }}>{r.count}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── right: Rob's thread ── */}
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-3 border-b px-5 py-4" style={{ borderColor: JB.hairline }}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold" style={{ backgroundColor: JB.primary, color: JB.onPrimary }}>R</span>
            <div className="leading-tight">
              <div className="text-[13px] font-medium" style={{ color: JB.ink }}>Rob</div>
              <div className="text-[11px]" style={{ color: JB.inkTertiary }}>your hiring assistant</div>
            </div>
          </div>

          <motion.div className="flex-1 min-h-0 space-y-4 overflow-hidden p-5" variants={THREAD_WRAP} initial="hidden" animate="show">
            {THREAD.map((m, i) => {
              if (m.kind === "time")
                return (
                  <motion.p key={i} variants={RISE} className="text-[11px]" style={{ color: JB.inkTertiary }}>
                    {m.text}
                  </motion.p>
                );
              if (m.kind === "you")
                return (
                  <motion.div key={i} variants={RISE} className="flex justify-end">
                    <div className="rounded-lg px-4 py-2.5 text-[13px] leading-relaxed" style={{ backgroundColor: "#ffffff", color: "#000000" }}>
                      {m.text}
                    </div>
                  </motion.div>
                );
              return (
                <motion.div
                  key={i}
                  variants={RISE}
                  className={msg}
                  style={{ backgroundColor: JB.s2, border: `1px solid ${JB.hairline}`, color: JB.ink, ...(m.accent ? { borderLeft: `2px solid ${m.accent}` } : {}) }}
                >
                  {m.text}
                </motion.div>
              );
            })}
          </motion.div>

          <div className="border-t px-4 py-3" style={{ borderColor: JB.hairline }}>
            <div className="flex items-center gap-3 rounded-lg px-3.5 py-2.5" style={{ backgroundColor: JB.s2, border: `1px solid ${JB.hairline}` }}>
              <span className="flex-1 text-[13px]" style={{ color: JB.inkTertiary }}>
                Ask Rob anything…
                <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}>|</motion.span>
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-md" style={{ backgroundColor: JB.primary }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6H10M10 6L7 3M10 6L7 9" stroke={JB.onPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* a shipped page shown as a browser window (top of the full-page capture),
   with the ring stroke mirroring OFM's sneak-peek windows - here in Jobsly's
   indigo instead of OFM's mint */
function ScreenWindow({ page }: { page: Page }) {
  return (
    <div className="overflow-hidden rounded-xl ring-4 ring-[#828FFF]/40" style={{ backgroundColor: JB.canvas }}>
      <div className="flex items-center gap-1.5 border-b px-3 py-2" style={{ borderColor: JB.hairline }}>
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#febc2e" }} />
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#28c840" }} />
        <span className="ml-2 truncate text-[9px] font-medium" style={{ color: JB.inkSubtle }}>jobsly.com · {page.label}</span>
      </div>
      <div className="aspect-[3/4] w-full overflow-hidden">
        <img src={page.src} alt={`jobsly.com · ${page.label}`} className="block w-full select-none" draggable={false} />
      </div>
    </div>
  );
}

/**
 * Two shipped pages together - the exact overlapping composition from OFM's
 * sneak-peek beats (same SCREEN_LAYOUT positions, sizes and spacing from the
 * frame): a front window over a brand-gradient card, a back window bleeding off
 * the edge. Only the palette differs - Jobsly's indigo on the dark canvas.
 */
const SCREEN_LAYOUT = {
  backX: 43,
  backY: -8.5,
  backW: 64,
  backRotate: 0,
  frontX: 4,
  frontY: 4,
  frontW: 54.5,
  frontRotate: 0,
  cardX: 18.5,
  cardY: 19,
  cardW: 52,
  cardH: 60,
  cardOpacity: 0.92,
} as const;

function DualScreens({ front, back }: { front: Page; back: Page }) {
  const p = SCREEN_LAYOUT;
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[28px]" style={{ background: HERO_BG }}>
      {/* brand accent card behind the front window */}
      <div
        className="absolute rounded-3xl"
        style={{
          left: `${p.cardX}%`,
          top: `${p.cardY}%`,
          width: `${p.cardW}%`,
          height: `${p.cardH}%`,
          background: `linear-gradient(150deg, ${JB.primary}, ${JB.canvas})`,
          opacity: p.cardOpacity,
        }}
      />
      {/* back window - behind, bleeds off the edge */}
      <div
        className="absolute"
        style={{
          left: `${p.backX}%`,
          top: `${p.backY}%`,
          width: `${p.backW}%`,
          transform: `rotate(${p.backRotate}deg)`,
          filter: "drop-shadow(0 30px 55px rgba(0,0,0,0.55))",
        }}
      >
        <ScreenWindow page={back} />
      </div>
      {/* front window - on top */}
      <div
        className="absolute"
        style={{
          left: `${p.frontX}%`,
          top: `${p.frontY}%`,
          width: `${p.frontW}%`,
          transform: `rotate(${p.frontRotate}deg)`,
          filter: "drop-shadow(0 34px 60px rgba(0,0,0,0.6))",
        }}
      >
        <ScreenWindow page={front} />
      </div>
    </div>
  );
}

const VIEWS: Record<string, () => React.ReactElement> = {
  "jobsly-open": Hero,
  "jobsly-attrs": AttributesView,
  "jobsly-color": ColourView,
  "jobsly-type": FoundationsView,
  "jobsly-agent": AgentView,
  "jobsly-pages-1": () => <DualScreens front={SCREENS.home} back={SCREENS.pricing} />,
  "jobsly-pages-2": () => <DualScreens front={SCREENS.hire} back={SCREENS.interview} />,
};

export default function JobslyRightPanel({ activeId }: { activeId: string }) {
  const View = VIEWS[activeId] ?? Hero;
  return (
    <div
      className={`${inter.variable} h-full w-full overflow-hidden rounded-[28px]`}
      style={{ fontFamily: "var(--font-jb), sans-serif", backgroundColor: JB.canvas }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full"
        >
          <View />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
