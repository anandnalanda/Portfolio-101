"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Hanken_Grotesk, Spectral } from "next/font/google";
import { useState } from "react";
import { OFM_SCREENS, type SitePage } from "./pages";
import OfmLogo from "@/components/screens/ofm/OfmLogo";
import {
  RoughFilter,
  SmilingMan,
  CurlyWoman,
  INK,
  WARM,
} from "@/components/screens/ofm/chibi";

/**
 * OFM Jobs - the sticky right "brand world" for the Visual Direction case
 * study. Fully self-contained: OFM's real tokens, gradients and radii, plus
 * Hanken Grotesk scoped to this component only (never leaks to Jobsly or the
 * portfolio). Content crossfades to match the active left beat.
 */

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-ofm",
});
const spectral = Spectral({ subsets: ["latin"], weight: ["400"] });

/* solid landing emerald - matches the OFM Jobs Tests case-study opener */
const LANDING = "#064E3B";

const OFM = {
  primary: "#005331",
  container: "#006E42",
  dim: "#086000",
  fixed: "#9BF6BE",
  secondary: "#456550",
  tertiary: "#7C2D33",
  surface: "#F6FBF4",
  surfaceContainer: "#EBEFE9",
  onSurface: "#181D19",
  onSurfaceVariant: "#3F4941",
  outline: "#6F7A71",
} as const;

const CTA_GRADIENT = "linear-gradient(135deg, #A3E635 0%, #005331 100%)";

/* palette spec - the ACTUAL OFM design-system tokens (from globals.css) */
type Spec = {
  name: string;
  hex: string;
  rgb: string;
  light: boolean; // true = white text on this colour
};

/* primary tonal ramp - real primary-family tokens, light → dark */
const PRIMARY_RAMP = [
  "#9BF6BE", // primary-fixed
  "#80D9A3", // primary-fixed-dim
  "#006E42", // primary-container
  "#005331", // primary
  "#086000", // primary-dim
];

/* primary family - the hero (left) */
const PRIMARY_MAIN: Spec = { name: "Forest", hex: "#005331", rgb: "0, 83, 49", light: true };
const PRIMARY_TONES: Spec[] = [
  { name: "Emerald", hex: "#006E42", rgb: "0, 110, 66", light: true },
  { name: "Fern", hex: "#086000", rgb: "8, 96, 0", light: true },
  { name: "Mint", hex: "#9BF6BE", rgb: "155, 246, 190", light: false },
  { name: "Seafoam", hex: "#80D9A3", rgb: "128, 217, 163", light: false },
];

/* accents + ink, exact from globals.css - the roles grid (right) */
const ROLES: Spec[] = [
  { name: "Sage", hex: "#456550", rgb: "69, 101, 80", light: true },
  { name: "Honeydew", hex: "#C4E8CE", rgb: "196, 232, 206", light: false },
  { name: "Maroon", hex: "#7C2D33", rgb: "124, 45, 51", light: true },
  { name: "Brick", hex: "#9A4449", rgb: "154, 68, 73", light: true },
  { name: "Crimson", hex: "#BA1A1A", rgb: "186, 26, 26", light: true },
  { name: "Blush", hex: "#FFDAD6", rgb: "255, 218, 214", light: false },
  { name: "Stone", hex: "#6F7A71", rgb: "111, 122, 113", light: true },
  { name: "Ash", hex: "#BEC9BF", rgb: "190, 201, 191", light: false },
  { name: "Ink", hex: "#181D19", rgb: "24, 29, 25", light: true },
  { name: "Charcoal", hex: "#3F4941", rgb: "63, 73, 65", light: true },
  { name: "Gunmetal", hex: "#2D322D", rgb: "45, 50, 45", light: true },
  { name: "Chalk", hex: "#EEF2EB", rgb: "238, 242, 235", light: false },
];

/* surface tonal ramp - near-white steps, light → dim */
const SURFACE_RAMP: Spec[] = [
  { name: "White", hex: "#FFFFFF", rgb: "255, 255, 255", light: false },
  { name: "Frost", hex: "#F6FBF4", rgb: "246, 251, 244", light: false },
  { name: "Alabaster", hex: "#F0F5EE", rgb: "240, 245, 238", light: false },
  { name: "Porcelain", hex: "#EBEFE9", rgb: "235, 239, 233", light: false },
  { name: "Cloud", hex: "#E5E9E3", rgb: "229, 233, 227", light: false },
  { name: "Fog", hex: "#DFE4DD", rgb: "223, 228, 221", light: false },
  { name: "Pewter", hex: "#D7DBD5", rgb: "215, 219, 213", light: false },
];

/* the Tailwind shadow scale the site uses for elevation */
const SHADOWS: { name: string; css: string }[] = [
  { name: "sm", css: "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
  { name: "base", css: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)" },
  { name: "md", css: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" },
  { name: "lg", css: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" },
  { name: "xl", css: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" },
  { name: "2xl", css: "0 25px 50px -12px rgb(0 0 0 / 0.25)" },
];

/* pill-first radius ramp (px · rem label) */
const CORNERS: { r: number; label: string }[] = [
  { r: 8, label: "0.5" },
  { r: 16, label: "1" },
  { r: 24, label: "1.5" },
  { r: 32, label: "2" },
  { r: 48, label: "3" },
  { r: 9999, label: "full" },
];

/* HEX / RGB / USAGE labels - stacked (narrow blocks) or in a row (wide) */
function Labels({ spec, stack, copied }: { spec: Spec; stack?: boolean; copied: boolean }) {
  const cols: [string, string][] = [
    ["Hex", copied ? "copied ✓" : spec.hex],
    ["RGB", spec.rgb],
  ];
  return (
    <div className={stack ? "space-y-2" : "flex gap-5"}>
      {cols.map(([k, v]) => (
        <div key={k}>
          <div className="text-[9px] font-bold uppercase tracking-wide opacity-90">{k}</div>
          <div className="text-[10.5px] opacity-70">{v}</div>
        </div>
      ))}
    </div>
  );
}

/* ── per-beat views ───────────────────────────────────────────────── */

function Hero() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center rounded-[28px] px-10 text-center"
      style={{ background: LANDING }}
    >
      <OfmLogo variant="light" gap={LANDING} className="h-[104px] w-auto" />
      <span className="mt-5 text-[22px] font-semibold tracking-[-0.01em] text-white">
        OFM Jobs
      </span>
      <span className={`${spectral.className} mt-5 whitespace-nowrap text-[40px] leading-[1.06] text-white`}>
        Website design + build
      </span>
    </div>
  );
}

/* verified seal - a hand-drawn gold rosette with a check + ribbon tails.
   Dotted ring computed once (an "official"/credible cue). */
const SEAL_DOTS = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
  return [Math.cos(a) * 66, Math.sin(a) * 66];
});

function VerifiedSeal() {
  return (
    <g>
      {/* ribbon tails */}
      <path d="M-17 44 L-30 84 L-9 70 Z" fill={WARM} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M17 44 L30 84 L9 70 Z" fill={WARM} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      {/* dotted official ring */}
      {SEAL_DOTS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.4} fill={WARM} stroke={INK} strokeWidth={1.4} />
      ))}
      {/* medal disc */}
      <circle r={54} fill={WARM} stroke={INK} strokeWidth={2.8} />
      <circle r={42} fill="none" stroke={INK} strokeWidth={2} />
      {/* check */}
      <path d="M-19 2 L-5 18 L21 -16" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/**
 * Guiding-attributes illustration - a hand-drawn pen-doodle scene in the OFM
 * case-study language (chibi cast + RoughFilter): a candidate and an employer,
 * warm and at ease (Approachable), with a gold verified seal between them
 * (Credible), on the airy mint field with soft floating dots (Calm). Gentle
 * idle bob. Labels stay crisp (outside the rough filter).
 */
function AttributesView() {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[28px]"
      style={{ backgroundColor: OFM.surface }}
    >
      <svg
        viewBox="0 0 620 620"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <defs>
          <RoughFilter id="vd-rough" />
        </defs>

        {/* calm floating dots (crisp, soft) */}
        <g fill={OFM.container} opacity={0.18}>
          <circle cx={120} cy={150} r={5} />
          <circle cx={500} cy={120} r={7} />
          <circle cx={540} cy={330} r={4} />
          <circle cx={95} cy={360} r={4} />
        </g>

        {/* hand-drawn scene - roughened parent, animated children (loop) */}
        <g filter="url(#vd-rough)">
          {/* soft ground */}
          <path
            d="M135 470 Q 310 458 490 470"
            fill="none"
            stroke={INK}
            strokeWidth={2.4}
            strokeLinecap="round"
            opacity={0.5}
          />

          {/* the two people bob gently, out of phase - alive but calm */}
          <motion.g
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <CurlyWoman x={218} y={338} s={3.7} />
          </motion.g>
          <motion.g
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 1.7 }}
          >
            <SmilingMan x={402} y={338} s={3.7} />
          </motion.g>

          {/* verified seal - gentle bob, out of phase with the people */}
          <g transform="translate(310 168)">
            <motion.g
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            >
              <VerifiedSeal />
            </motion.g>
          </g>
        </g>
      </svg>
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

  // big block (name + hex + rgb) for the primary hero
  const block = (spec: Spec, stack: boolean, className: string) => (
    <button
      type="button"
      onClick={() => copy(spec.hex)}
      className={`flex flex-col justify-end p-5 text-left transition-[filter] hover:brightness-[1.04] ${className}`}
      style={{ backgroundColor: spec.hex, color: spec.light ? "#fff" : OFM.onSurface }}
    >
      <span className="mb-2.5 text-[15px] font-bold uppercase tracking-wide">{spec.name}</span>
      <Labels spec={spec} stack={stack} copied={copied === spec.hex} />
    </button>
  );

  // compact swatch (name + hex) for the family tones + roles grid
  const chip = (spec: Spec) => (
    <button
      key={spec.hex}
      type="button"
      onClick={() => copy(spec.hex)}
      className="flex flex-col justify-between p-3 text-left transition-[filter] hover:brightness-[1.04]"
      style={{ backgroundColor: spec.hex, color: spec.light ? "#fff" : OFM.onSurface }}
    >
      <span className="text-[11px] font-bold uppercase leading-tight tracking-wide">{spec.name}</span>
      <span className="text-[9.5px] font-medium uppercase leading-tight opacity-70">
        {copied === spec.hex ? "copied ✓" : spec.hex}
      </span>
    </button>
  );

  const SHADOW = "0 14px 40px rgba(0,83,49,0.10)";

  return (
    <div className="flex h-full w-full flex-col rounded-[28px] p-6" style={{ backgroundColor: OFM.surface }}>
      {/* the spec fills the panel, leaving just the surface padding around it */}
      <div className="flex min-h-0 flex-1 gap-4">
        {/* left - primary family: tonal strip + Primary + its tones */}
        <div className="flex flex-[1.2] overflow-hidden rounded-3xl" style={{ boxShadow: SHADOW }}>
          <div className="flex w-[12%] flex-col">
            {PRIMARY_RAMP.map((c, i) => (
              <div key={i} className="flex-1" style={{ backgroundColor: c }} />
            ))}
          </div>
          {block(PRIMARY_MAIN, true, "flex-[1.1]")}
          <div className="grid flex-1 grid-rows-4">{PRIMARY_TONES.map(chip)}</div>
        </div>

        {/* right - accents + ink */}
        <div
          className="grid flex-1 grid-cols-2 overflow-hidden rounded-3xl"
          style={{ boxShadow: SHADOW, gridTemplateRows: "repeat(6, minmax(0, 1fr))" }}
        >
          {ROLES.map(chip)}
        </div>
      </div>

      {/* surface tonal ramp */}
      <div className="mt-4 flex h-[64px] overflow-hidden rounded-2xl" style={{ boxShadow: SHADOW }}>
        {SURFACE_RAMP.map((spec, i) => (
          <button
            key={spec.hex}
            type="button"
            onClick={() => copy(spec.hex)}
            className="flex flex-1 flex-col justify-end p-2.5 text-left transition-[filter] hover:brightness-[0.98]"
            style={{
              backgroundColor: spec.hex,
              color: OFM.onSurface,
              boxShadow: i > 0 ? "inset 1px 0 0 rgba(0,0,0,0.05)" : undefined,
            }}
          >
            <span className="text-[10px] font-bold uppercase leading-tight tracking-wide">{spec.name}</span>
            <span className="text-[9px] font-medium uppercase leading-tight opacity-55">
              {copied === spec.hex ? "copied ✓" : spec.hex}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}


/* OFM's Hanken Grotesk type scale (name · size · line-height · weight) */
const TYPE_SCALE: { name: string; px: number; lh: number; weight: number; track: number }[] = [
  { name: "Display", px: 38, lh: 42, weight: 800, track: -1.5 },
  { name: "Headline", px: 28, lh: 34, weight: 700, track: -1 },
  { name: "Title", px: 22, lh: 28, weight: 700, track: -0.5 },
  { name: "Subtitle", px: 18, lh: 24, weight: 600, track: -0.25 },
  { name: "Body", px: 15, lh: 22, weight: 400, track: 0 },
  { name: "Label", px: 13, lh: 18, weight: 600, track: 1.5 },
  { name: "Caption", px: 11, lh: 16, weight: 500, track: 1 },
];

/* 4-based spacing ramp (px) */
const SPACING = [4, 8, 12, 16, 24, 32];

const WEIGHTS: [string, number][] = [
  ["Regular", 400],
  ["Medium", 500],
  ["Bold", 700],
  ["Extrabold", 800],
];

/**
 * Type, corners & elevation - a bento spec sheet (like the Colour view): a
 * Hanken Grotesk specimen + weight ramp up top, the full type scale as the
 * centrepiece, and compact corner + elevation cells beneath.
 */
function FoundationsView() {
  const CARD_SHADOW = "0 14px 40px rgba(0,83,49,0.10)";
  const cellLabel = "text-[11px] font-bold uppercase tracking-[0.14em]";
  return (
    <div
      className="flex h-full w-full flex-col gap-3 rounded-[28px] p-5"
      style={{ backgroundColor: OFM.surface }}
    >
      {/* specimen + weights */}
      <div className="flex gap-3">
        <div className="flex flex-[1.3] flex-col rounded-3xl bg-white p-5" style={{ boxShadow: CARD_SHADOW }}>
          <span className={cellLabel} style={{ color: OFM.primary }}>
            Hanken Grotesk
          </span>
          <span className="mt-1 text-[70px] font-extrabold leading-[0.95]" style={{ color: OFM.onSurface }}>
            Ag
          </span>
          <span className="mt-2.5 text-[10.5px] leading-[1.75]" style={{ color: OFM.onSurfaceVariant }}>
            ABCDEFGHIJKLMNOPQRSTUVWXYZ
            <br />
            abcdefghijklmnopqrstuvwxyz
            <br />
            0123456789 &amp; @ # % “ ”
          </span>
        </div>
        <div className="flex flex-1 flex-col rounded-3xl bg-white p-5" style={{ boxShadow: CARD_SHADOW }}>
          <span className={cellLabel} style={{ color: OFM.outline }}>
            Weights
          </span>
          <div className="mt-1.5 flex flex-col">
            {WEIGHTS.map(([label, w]) => (
              <div
                key={w}
                className="flex items-baseline justify-between border-b py-[9px] last:border-0"
                style={{ borderColor: "#eef2ec" }}
              >
                <span className="text-[19px] leading-none" style={{ fontWeight: w, color: OFM.onSurface }}>
                  {label}
                </span>
                <span className="text-[11px] tabular-nums" style={{ color: OFM.outline }}>
                  {w}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* type scale - the centrepiece */}
      <div className="flex flex-1 flex-col rounded-3xl bg-white px-6 py-5" style={{ boxShadow: CARD_SHADOW }}>
        <span className={cellLabel} style={{ color: OFM.outline }}>
          Type scale
        </span>
        <div className="mt-2 flex flex-1 flex-col justify-between">
          {TYPE_SCALE.map((t) => (
            <div
              key={t.name}
              className="flex items-baseline justify-between gap-4 border-b py-1.5 last:border-0"
              style={{ borderColor: "#eef2ec" }}
            >
              <span
                style={{
                  fontSize: t.px,
                  lineHeight: `${t.lh}px`,
                  fontWeight: t.weight,
                  letterSpacing: `${t.track / 100}em`,
                  color: OFM.onSurface,
                }}
              >
                {t.name}
              </span>
              <span className="shrink-0 text-[10px] tabular-nums" style={{ color: OFM.outline }}>
                {t.px}/{t.lh} · {t.weight} · {t.track > 0 ? "+" : ""}
                {t.track}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* corners + elevation ramps */}
      <div className="flex gap-3">
        <div className="flex flex-1 flex-col rounded-3xl bg-white px-5 py-4" style={{ boxShadow: CARD_SHADOW }}>
          <span className={cellLabel} style={{ color: OFM.outline }}>
            Corners
          </span>
          <div className="flex flex-1 items-center justify-between pt-3">
            {CORNERS.map((c) => (
              <div key={c.label} className="flex flex-col items-center gap-2">
                <div className="h-11 w-11" style={{ backgroundColor: OFM.container, borderRadius: c.r }} />
                <span className="text-[9.5px] tabular-nums" style={{ color: OFM.onSurfaceVariant }}>
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-1 flex-col rounded-3xl bg-white px-5 py-4" style={{ boxShadow: CARD_SHADOW }}>
          <span className={cellLabel} style={{ color: OFM.outline }}>
            Elevation
          </span>
          <div className="flex flex-1 items-center justify-between pt-3">
            {SHADOWS.map((s) => (
              <div key={s.name} className="flex flex-col items-center gap-2">
                <div
                  className="h-11 w-11 rounded-[14px] bg-white"
                  style={{ boxShadow: s.css, border: "1px solid rgba(17,24,20,0.05)" }}
                />
                <span className="text-[9.5px]" style={{ color: OFM.onSurfaceVariant }}>
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* spacing scale */}
      <div className="rounded-3xl bg-white px-5 py-4" style={{ boxShadow: CARD_SHADOW }}>
        <div className="flex items-baseline justify-between">
          <span className={cellLabel} style={{ color: OFM.outline }}>
            Spacing
          </span>
          <span className="text-[10px]" style={{ color: OFM.outline }}>
            4px base
          </span>
        </div>
        <div className="mt-3 flex items-end justify-between">
          {SPACING.map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div className="rounded-[3px]" style={{ width: s, height: 16, backgroundColor: OFM.container }} />
              <span className="text-[9.5px] tabular-nums" style={{ color: OFM.onSurfaceVariant }}>
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * The AI hero video - the real homepage hero (generated with Google Flow),
 * autoplaying in a framed card on the opener's emerald, with a small tool badge.
 */
/* video size + crop - tuned with DialKit and baked here */
const HERO_VIDEO = { frameW: 100, aspect: 1.6, zoom: 1.14, offsetX: 0, offsetY: 0 } as const;

function HeroVideoView() {
  const v = HERO_VIDEO;
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center rounded-[28px] p-8"
      style={{ backgroundColor: LANDING }}
    >
      <div
        className="relative overflow-hidden rounded-2xl ring-4 ring-[#9BF6BE]/50"
        style={{
          width: `${v.frameW}%`,
          aspectRatio: `${v.aspect}`,
          boxShadow: "0 30px 60px rgba(0,40,20,0.45)",
        }}
      >
        <video
          src="/vd/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: `scale(${v.zoom}) translate(${v.offsetX}%, ${v.offsetY}%)` }}
        />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-[11px] font-semibold leading-none text-white backdrop-blur">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="shrink-0" aria-hidden>
            <path d="M12 5l1.9 5.1L19 12l-5.1 1.9L12 19l-1.9-5.1L5 12l5.1-1.9L12 5z" />
          </svg>
          Made with Google Flow
        </div>
      </div>
    </div>
  );
}

/* a shipped page shown as a browser window (top of the full-page capture) */
function ScreenWindow({ page }: { page: SitePage }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white ring-4 ring-[#9BF6BE]/50">
      <div className="flex items-center gap-1.5 border-b px-3 py-2" style={{ borderColor: "#eef2ec" }}>
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#febc2e" }} />
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#28c840" }} />
        <span className="ml-2 truncate text-[9px] font-medium" style={{ color: OFM.outline }}>
          ofmjobs.com · {page.label}
        </span>
      </div>
      <div className="aspect-[3/4] w-full overflow-hidden">
        <img src={page.src} alt={`ofmjobs.com · ${page.label}`} className="block w-full select-none" draggable={false} />
      </div>
    </div>
  );
}

/**
 * Two shipped pages shown together - an overlapping browser-window composition:
 * a front window over a brand-gradient card, a back window bleeding off the
 * edge. Positions were tuned with DialKit and baked here. Background matches
 * the opener's emerald.
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

function DualScreens({ front, back }: { front: SitePage; back: SitePage }) {
  const p = SCREEN_LAYOUT;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[28px]" style={{ backgroundColor: LANDING }}>
      {/* brand accent card behind the front window */}
      <div
        className="absolute rounded-3xl"
        style={{
          left: `${p.cardX}%`,
          top: `${p.cardY}%`,
          width: `${p.cardW}%`,
          height: `${p.cardH}%`,
          background: CTA_GRADIENT,
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
          filter: "drop-shadow(0 30px 55px rgba(0,40,20,0.35))",
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
          filter: "drop-shadow(0 34px 60px rgba(0,40,20,0.4))",
        }}
      >
        <ScreenWindow page={front} />
      </div>
    </div>
  );
}

const VIEWS: Record<string, () => React.ReactElement> = {
  "ofm-open": Hero,
  "ofm-attrs": AttributesView,
  "ofm-color": ColourView,
  "ofm-type": FoundationsView,
  "ofm-hero-video": HeroVideoView,
  "ofm-pages-1": () => <DualScreens front={OFM_SCREENS.home} back={OFM_SCREENS.pricing} />,
  "ofm-pages-2": () => <DualScreens front={OFM_SCREENS.compare} back={OFM_SCREENS.insights} />,
};

// backdrop per beat, so the crossfade gap shows the incoming beat's base
// colour instead of the white page (no flash). Emerald beats vs near-white specs.
const BEAT_BG: Record<string, string> = {
  "ofm-open": LANDING,
  "ofm-attrs": OFM.surface,
  "ofm-color": OFM.surface,
  "ofm-type": OFM.surface,
  "ofm-hero-video": LANDING,
  "ofm-pages-1": LANDING,
  "ofm-pages-2": LANDING,
};

export default function OfmRightPanel({ activeId }: { activeId: string }) {
  const View = VIEWS[activeId] ?? Hero;
  return (
    <div
      className={`${hanken.variable} h-full w-full overflow-hidden rounded-[28px]`}
      style={{ fontFamily: "var(--font-ofm), sans-serif", backgroundColor: BEAT_BG[activeId] ?? OFM.surface }}
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
