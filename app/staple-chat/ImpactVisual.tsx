"use client";

/**
 * ImpactVisual — beat 11 ("Impact") of the Staple Chat case study.
 *
 * A chibi pen-doodle "hub & spoke" scene (composition borrowed from the
 * marker-sketch reference, meaning inverted): the DATA sits at the centre and
 * every kind of person radiates off it on hand-drawn arrows, each getting
 * their own answer — the visual opposite of one analyst as the bottleneck.
 * The cast is built from the reference photos: the bespectacled protagonist,
 * a short-haired woman in sunglasses, a beaming man in a coral polo, and one
 * more. The two headline metrics land beneath.
 *
 * Inline SVG (self-contained, animatable) in the skill's naive rough-pen
 * language: wobbly hand-drawn outlines (a displacement filter), dot-eye
 * faces, mini figures, lots of white space, simple flat fills.
 */

import { motion, useReducedMotion } from "framer-motion";

const INK = "#12333b";
const TEAL = "#0e7c8b";
const TEAL_SOFT = "#d3eef1";
const WARM = "#f4c86a";
const PINK = "#e0699a";
const SKIN = "#f6ddc4";
const SKIN_BROWN = "#a8734d";
const HAIR = "#241d19";
const HAIR_BROWN = "#3a2416";
const DENIM = "#7ba7cf";
const NAVY = "#2b3a4a";
const CORAL = "#e08a6e";
const SWEATER = "#a7b0cb";

/* ------------------------------- people -------------------------------- */

/** The protagonist — round glasses, dark swept-up hair, stubble, denim. */
function Hero({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -18 34 Q -20 9 0 9 Q 20 9 18 34 Z" fill={DENIM} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M -7 9 L 0 22 L 7 9 Z" fill="#fff" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M -8 9 L -1.5 15 M 8 9 L 1.5 15" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <circle cx={0} cy={-9} r={14.5} fill={SKIN} stroke={INK} strokeWidth={2.4} />
      <path d="M -13 -8 Q -13 6 0 6 Q 13 6 13 -8 Q 9 2 0 2 Q -9 2 -13 -8 Z" fill={HAIR} opacity={0.28} />
      <path d="M -15 -11 Q -18 -30 -2 -30 Q 4 -34 12 -28 Q 18 -26 14 -11 Q 11 -21 2 -22 Q -8 -22 -15 -11 Z" fill={HAIR} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <g fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round">
        <path d="M -8 -9 q 2.5 -2.6 5 0" />
        <path d="M 3 -9 q 2.5 -2.6 5 0" />
      </g>
      <g stroke={INK} strokeWidth={1.8} fill="none">
        <circle cx={-5.5} cy={-9} r={5.4} />
        <circle cx={5.5} cy={-9} r={5.4} />
        <path d="M -0.1 -9 h 0.2" strokeWidth={2} />
        <path d="M -10.9 -9 q -3 -0.4 -4 0.8 M 10.9 -9 q 3 -0.4 4 0.8" />
      </g>
      <path d="M -4 -1 q 4 4 8 0" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
    </g>
  );
}

/** Short-haired woman in dark sunglasses and a navy tee. */
function Woman({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -17 34 Q -19 9 0 9 Q 19 9 17 34 Z" fill={NAVY} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M -6 9 q 6 5 12 0" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
      <circle cx={0} cy={-9} r={14} fill={SKIN} stroke={INK} strokeWidth={2.4} />
      {/* short side-swept bob */}
      <path d="M -15 -8 Q -19 -30 0 -28 Q 19 -30 15 -8 Q 17 3 11 8 L 10 -7 Q 7 -19 0 -19 Q -8 -19 -11 -7 L -13 8 Q -17 2 -15 -8 Z" fill={HAIR} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      {/* dark sunglasses */}
      <g stroke={INK} strokeWidth={1.8}>
        <path d="M -12 -11 q 0 8 6 8 q 6 0 6 -7 q -6 -2 -12 -1 Z" fill="#1b2b2e" />
        <path d="M 0 -11 q 0 8 6 8 q 6 0 6 -7 q -6 -2 -12 -1 Z" fill="#1b2b2e" />
        <path d="M -0.5 -10 h 1" fill="none" />
      </g>
      <path d="M -3 2 q 3 1.6 6 0" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
    </g>
  );
}

/** Beaming man with a big open smile, coral polo, arms crossed. */
function SmilingMan({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -19 34 Q -21 9 0 9 Q 21 9 19 34 Z" fill={CORAL} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      {/* crossed arms */}
      <path d="M -17 21 Q 0 15 17 21 Q 15 31 0 29 Q -15 31 -17 21 Z" fill="#d1785c" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      {/* polo collar + placket */}
      <path d="M -6 9 L 0 16 L 6 9" fill="#fff" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M 0 12 v 5" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
      <circle cx={0} cy={-9} r={14} fill={SKIN} stroke={INK} strokeWidth={2.4} />
      <path d="M -14 -10 Q -16 -27 0 -26 Q 16 -27 14 -10 Q 10 -20 0 -20 Q -10 -20 -14 -10 Z" fill={HAIR} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <g fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round">
        <path d="M -8 -9 q 2.6 -3 5 0" />
        <path d="M 3 -9 q 2.6 -3 5 0" />
      </g>
      {/* big open grin */}
      <path d="M -6 -2 Q 0 6 6 -2 Q 0 0 -6 -2 Z" fill="#fff" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
    </g>
  );
}

/** Curly-haired woman, warm brown skin, big smile, periwinkle sweatshirt
    with a little beaded necklace. */
function CurlyWoman({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* sweatshirt */}
      <path d="M -18 34 Q -20 9 0 9 Q 20 9 18 34 Z" fill={SWEATER} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M -7 9 q 7 5 14 0" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
      {/* beaded necklace */}
      <path d="M -6 11 q 6 8 13 0" fill="none" stroke="#cfd4dd" strokeWidth={1.1} />
      <circle cx={-3} cy={16} r={1.3} fill={CORAL} />
      <circle cx={1.5} cy={17} r={1.3} fill="#8fbfc4" />
      <circle cx={6} cy={16} r={1.3} fill={WARM} />
      {/* head */}
      <circle cx={0} cy={-8} r={13.5} fill={SKIN_BROWN} stroke={INK} strokeWidth={2.4} />
      {/* voluminous curly afro framing the face */}
      <path
        d="M -13 0 Q -28 -2 -23 -14 Q -32 -21 -21 -28 Q -23 -39 -8 -35 Q 0 -42 8 -35 Q 23 -39 21 -27 Q 31 -20 22 -12 Q 28 -1 13 0 Q 12 -9 7 -13 Q 3 -17 0 -17 Q -3 -17 -7 -13 Q -12 -9 -13 0 Z"
        fill={HAIR_BROWN}
        stroke={INK}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {/* curl-texture bumps around the edge */}
      <g fill={HAIR_BROWN} stroke={INK} strokeWidth={1.4}>
        <circle cx={-21} cy={-22} r={4.2} />
        <circle cx={-25} cy={-11} r={4} />
        <circle cx={-1} cy={-37} r={4.6} />
        <circle cx={13} cy={-32} r={4} />
        <circle cx={22} cy={-21} r={4.2} />
        <circle cx={25} cy={-10} r={4} />
      </g>
      {/* eyes + big bright smile */}
      <g fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round">
        <path d="M -7.5 -8 q 2.6 -3 5 0" />
        <path d="M 2.5 -8 q 2.6 -3 5 0" />
      </g>
      <path d="M -6 -1 Q 0 7 6 -1 Q 0 1 -6 -1 Z" fill="#fff" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
    </g>
  );
}

/** A mini generic person. */
function Chibi({ x, y, s = 1, color }: { x: number; y: number; s?: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -13 30 Q -15 7 0 7 Q 15 7 13 30 Z" fill={color} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <circle cx={0} cy={-7} r={13} fill={SKIN} stroke={INK} strokeWidth={2.4} />
      <g fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round">
        <path d="M -6 -10 q 2.6 -3 5 0" />
        <path d="M 1 -10 q 2.6 -3 5 0" />
        <path d="M -3.5 -4 q 3.5 3 7 0" />
      </g>
    </g>
  );
}

/** The data / answers hub at the centre. */
function Hub({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M -40 -30 Q -50 -30 -50 -18 Q -58 -8 -48 2 Q -52 16 -38 18 Q -30 30 -14 24 Q 0 32 16 24 Q 34 30 40 16 Q 54 10 46 -4 Q 54 -18 40 -24 Q 36 -38 20 -32 Q 4 -40 -12 -32 Q -30 -36 -40 -30 Z"
        fill={TEAL_SOFT}
        stroke={INK}
        strokeWidth={2.8}
        strokeLinejoin="round"
      />
      <g stroke={INK} strokeWidth={2.2} strokeLinecap="round" fill="none">
        <path d="M -22 -8 h 44" />
        <path d="M -22 0 h 44" />
        <path d="M -22 8 h 26" />
      </g>
    </g>
  );
}

function Spark({ x, y, color = WARM }: { x: number; y: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={color} strokeWidth={2.4} strokeLinecap="round">
      <path d="M 0 -7 V 7 M -7 0 H 7 M -5 -5 L 5 5 M 5 -5 L -5 5" />
    </g>
  );
}

/** A curved hand-drawn arrow from the hub out toward a person. */
function Arrow({ d, delay, reduceMotion }: { d: string; delay: number; reduceMotion: boolean | null }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={INK}
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut", delay }}
    />
  );
}

/* ------------------------------ metrics -------------------------------- */

function Metric({
  delay,
  label,
  sub,
  children,
}: {
  delay: number;
  label: string;
  sub?: string;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="flex flex-col items-center px-[clamp(20px,3cqw,48px)] text-center"
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut", delay }}
    >
      <div
        className="font-semibold text-txt-heading"
        style={{
          fontSize: "clamp(30px, 4.6cqw, 52px)",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {children}
      </div>
      <p
        className="mt-3.5 font-semibold uppercase text-txt-secondary"
        style={{ fontSize: "clamp(9.5px, 1.05cqw, 11px)", letterSpacing: "0.16em" }}
      >
        {label}
      </p>
      {sub && (
        <p
          className="mt-1"
          style={{ fontSize: "clamp(10px, 1.2cqw, 12.5px)", color: "rgba(37,36,41,0.34)" }}
        >
          {sub}
        </p>
      )}
    </motion.div>
  );
}

/* ------------------------------- scene --------------------------------- */

export default function ImpactVisual() {
  const reduceMotion = useReducedMotion();
  const pop = (delay: number) =>
    reduceMotion ? { duration: 0 } : { type: "spring" as const, stiffness: 320, damping: 18, delay };
  const fade = (delay: number) =>
    reduceMotion ? { duration: 0 } : { duration: 0.4, ease: "easeOut" as const, delay };

  // Each spoke: person node + the arrow reaching toward it.
  const HUB = { x: 450, y: 190 };

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{
        background: "#fdfcfa",
        backgroundImage:
          "radial-gradient(circle, rgba(18,51,59,0.08) 1.2px, transparent 1.3px)",
        backgroundSize: "26px 26px",
        gap: "clamp(20px, 3.4cqh, 44px)",
      }}
    >
      <svg
        viewBox="0 0 900 400"
        className="w-[90%] max-w-[860px]"
        role="img"
        aria-label="The data sits at the centre; every kind of person radiates off it on arrows, each getting their own answer directly."
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id="iv-rough">
            <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves={2} seed={5} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={3.4} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        <g filter="url(#iv-rough)">
          {/* radiating arrows (drawn first, behind the people) */}
          <Arrow d="M 400 168 Q 320 130 250 128" delay={0.7} reduceMotion={reduceMotion} />
          <Arrow d="M 500 168 Q 590 128 662 122" delay={0.85} reduceMotion={reduceMotion} />
          <Arrow d="M 500 212 Q 600 250 678 268" delay={1.0} reduceMotion={reduceMotion} />
          <Arrow d="M 400 214 Q 320 252 250 268" delay={1.15} reduceMotion={reduceMotion} />
          {/* arrowheads */}
          <g fill={INK}>
            <path d="M 250 128 l 12 -3 l -6 10 Z" />
            <path d="M 662 122 l -12 -4 l 6 11 Z" />
            <path d="M 678 268 l -12 -4 l 6 11 Z" />
            <path d="M 250 268 l 12 -3 l -6 10 Z" />
          </g>

          {/* the data hub */}
          <motion.g
            initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={pop(0.35)}
            style={{ transformOrigin: `${HUB.x}px ${HUB.y}px` }}
          >
            <Hub x={HUB.x} y={HUB.y} />
          </motion.g>

          {/* the four people, popping in */}
          <motion.g initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={pop(1.05)} style={{ transformOrigin: "210px 118px" }}>
            <Hero x={210} y={118} s={0.9} />
            <Spark x={182} y={98} />
          </motion.g>
          <motion.g initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={pop(1.2)} style={{ transformOrigin: "700px 112px" }}>
            <Woman x={700} y={112} s={0.9} />
            <Spark x={730} y={92} color={PINK} />
          </motion.g>
          <motion.g initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={pop(1.35)} style={{ transformOrigin: "710px 268px" }}>
            <SmilingMan x={710} y={262} s={0.9} />
            <Spark x={740} y={244} />
          </motion.g>
          <motion.g initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={pop(1.5)} style={{ transformOrigin: "210px 270px" }}>
            <CurlyWoman x={210} y={270} s={0.86} />
            <Spark x={180} y={250} color={PINK} />
          </motion.g>

          {/* hand-lettered tagline (echoes the reference's "LIKE THIS?!") */}
          <motion.g
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={fade(1.7)}
          >
            <text x={450} y={44} textAnchor="middle" fontSize={22} fontWeight={700} fill={INK} style={{ fontStyle: "italic" }}>
              everyone, just asks
            </text>
            <path d="M 356 56 q 96 8 190 0" fill="none" stroke={PINK} strokeWidth={3} strokeLinecap="round" />
          </motion.g>
        </g>
      </svg>

      {/* Headline metrics — an editorial stat row: the "win" numbers carry the
          brand teal, muted "before" state, uppercase tracked labels, split by a
          single hairline. */}
      <div className="flex items-stretch">
        <Metric delay={reduceMotion ? 0 : 1.9} label="Time to insight">
          <span className="inline-flex items-baseline" style={{ gap: "0.24em" }}>
            <span className="text-txt-secondary" style={{ fontWeight: 500 }}>
              15 min
            </span>
            <span style={{ color: TEAL, fontWeight: 400 }}>→</span>
            <span style={{ color: TEAL }}>2 min</span>
          </span>
        </Metric>

        <div
          aria-hidden
          className="mx-1 w-px self-center"
          style={{ height: "clamp(48px, 6.5cqh, 76px)", background: "rgba(18,51,59,0.2)" }}
        />

        <Metric delay={reduceMotion ? 0 : 2.05} label="Queries by non-technical people">
          <span style={{ color: TEAL }}>67%</span>
        </Metric>
      </div>
    </div>
  );
}
