import type { Variants, Transition } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — "Documents → Data" hover
 *
 *    0ms   card expands (spring); nothing else moves yet
 *  380ms   expansion settled → doors open (640ms) — clearly visible
 *  +50ms   glow fades in           (delays below are from doors-open)
 * +150ms   conveyor fades in mid-scroll + scanner beam
 * +350ms   particle mist starts (pre-seeded)
 * +500ms   CTA arrow slides in
 *
 *  exit    scene fades (150ms) + doors visibly close (while the card is
 *          still large) → 320ms → card contracts (spring)
 * ───────────────────────────────────────────────────────────── */

export const TIMING = {
  doorsDelayMs: 380, // doors open once the expansion has settled
  doorCloseMs: 380, // how long the card stays large while the close spring plays
  glowDelay: 0.05, // scene delays are relative to doors opening
  conveyorDelay: 0.15,
  particlesDelay: 0.35,
  buttonDelay: 0.5,
  sceneFade: 0.3, // enter fade for scene layers
  exitFade: 0.15, // compressed exit for all scene layers
  cardAFade: 0.2,
  leaveDebounceMs: 75, // grazing the edge must not flicker the sequence
} as const;

/** Card expansion / contraction spring (FLIP via framer-motion `layout`).
 *  Tuned for a buttery glide-and-settle: no visible ring at the end. */
export const EXPAND_SPRING: Transition = {
  type: "spring",
  stiffness: 230,
  damping: 32,
  mass: 1,
};
export const EXPAND_REDUCED: Transition = { duration: 0.25, ease: "easeOut" };

/* ── design tokens (re-skin here) ───────────────────────────── */
export const COLORS = {
  // Staple brand teal family (was generic sky/cyan)
  scanCore: "#0B6E86",
  scanBloom: "rgba(11, 110, 134, 0.30)",
  glow: "rgba(11, 110, 134, 0.26)",
  handle: "#0B6E86",
  particles: ["#0B6E86", "#1791A8", "#4FB3C6", "#9FD8E2"],
  bezel: "#eceef0",
  bezelPin: "#d7dadd",
  pageBorder: "#e5e7eb",
  pageInk: "#d1d5db",
  cardBg: "#ffffff",
} as const;

export const RADII = {
  card: 24, // rounded-3xl
  chipBezel: 28,
  chipWindow: 16,
  page: 8,
} as const;

/* ── geometry ───────────────────────────────────────────────── */
export const SIZES = {
  rowH: 360, // fixed row height (playground)
  chip: 272, // chip outer square
  bezel: 26, // bezel ring thickness → window = chip - 2*bezel
  chipLeftPct: 42, // chip centre x, % of expanded card width
  scanPct: 51, // scan line x, % of expanded card width
  pageW: 120,
  pageH: 176,
  pageGap: 8,
  pageSecs: 2.5, // one page advances per this many seconds
  dissolveBandPct: 4, // ± band around scanPct where pages dissolve
} as const;

export const PARTICLES = {
  pool: 160,
  preSeed: 40,
  perSecond: 24,
  driftX: [20, 60] as const, // px/s
  wanderY: 10, // ± px
  life: [2, 4] as const, // seconds
  alpha: [0.25, 0.9] as const,
  // mostly binary (the extracted data), with occasional star accents
  glyphs: ["0", "1", "0", "1", "0", "1", "0", "1", "✦", "✧"],
  glyphPx: [8, 16] as const,
  dotPx: [1.5, 3] as const,
  circlePx: [4, 8] as const,
} as const;

/* ── shared variants ────────────────────────────────────────── */

/** Scene layer: fade in at its storyboard beat, compressed fade on exit. */
export const sceneLayer = (delay: number, y = 0): Variants => ({
  hidden: { opacity: 0, y },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: TIMING.sceneFade, delay, ease: "easeOut" },
  },
  exit: { opacity: 0, transition: { duration: TIMING.exitFade } },
});

export const cardAVariants: Variants = {
  rest: { opacity: 1, scale: 1, transition: { duration: TIMING.cardAFade } },
  hovered: { opacity: 0, scale: 0.98, transition: { duration: TIMING.cardAFade } },
};
