"use client";

/* Story-beat illustration - "A résumé is a promise, not proof."

   Hand-drawn in the same pen-doodle language as the Kanban story visual
   (rough displacement filter, chibi cast, crisp labels outside the filter):
   a big résumé sheet stands on the ground, its proud mini author beside it,
   a faint crowd of other candidates waits behind with identical sheets
   (everyone writes it), an employer squints at the page with a wondering
   "?", and the three claims every CV makes flicker, one at a time, into
   the question mark nobody can answer from paper. Replays on scroll-in. */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Chibi,
  RoughFilter,
  SmilingMan,
  WaitBubble,
  INK,
  WARM,
  NAVY,
  SKIN,
  HAIR,
} from "@/components/screens/ofm/chibi";

const EMER = "#0B7A4E";
const PAPER_TINT = "#E7F3EA";

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD (replays on entry)
 *
 *     0ms   ground line draws left → right
 *   250ms   the résumé sheet springs up from the ground
 *   600ms   the author pops in beside it, beaming
 *  1050ms   the sheet fills itself in: photo, scribbles, gold seal
 *  1550ms   the three claim pills pop in (staggered)
 *  2150ms   the queue pops in behind him - identical sheets in hand -
 *           and "everyone writes it" fades up
 *  2750ms   the employer pops in on the right, squinting at the page
 *  3050ms   her "?" bubble springs open (and bobs forever)
 *  3300ms   the flicker starts: claim ↔ "?" on a slow loop
 *  3550ms   "asserted, never verified." + arrow fade up
 * ───────────────────────────────────────────────────────── */
const T_PROMISE = {
  ground: 0, //    stage 1 · ground line draws
  sheet: 250, //   stage 2 · the résumé springs up
  author: 600, //  stage 3 · the candidate pops in
  inkin: 1050, //  stage 4 · photo + scribbles + seal draw on
  chips: 1550, //  stage 5 · claim pills pop (staggered)
  crowd: 2150, //  stage 6 · the queue of other claimants pops in
  reader: 2750, // stage 7 · the employer pops in, squinting
  wonder: 3050, // stage 8 · her "?" bubble springs open
  flicker: 3300, // stage 9 · the claim ↔ "?" loop begins
  label: 3550, //  stage 10 · annotation + arrow fade up
};

const POP = {
  sheet: { type: "spring" as const, stiffness: 340, damping: 24 },
  chibi: { type: "spring" as const, stiffness: 480, damping: 24 },
  chip: { type: "spring" as const, stiffness: 440, damping: 19 },
  bubble: { type: "spring" as const, stiffness: 480, damping: 17 },
  chipStagger: 0.16, // s between pills popping in
  crowdStagger: 0.07, // s between queue members popping in
};

const GROUND = { d: "M120 762 L1320 762", draw: 0.6 };

/* The queue behind the author - everyone's holding the same sheet.
   Back row first for depth; `o` fades the far row away. */
const CROWD: { x: number; y: number; s: number; color: string; o: number }[] = [
  { x: 176, y: 688, s: 1.15, color: "#8FC6A6", o: 0.45 },
  { x: 248, y: 684, s: 1.2, color: "#AFD3A0", o: 0.5 },
  { x: 320, y: 688, s: 1.15, color: "#CBB86E", o: 0.45 },
  { x: 140, y: 717, s: 1.4, color: "#63B98A", o: 0.7 },
  { x: 218, y: 720, s: 1.45, color: "#7CA9D0", o: 0.75 },
  { x: 296, y: 717, s: 1.4, color: "#2E9E6B", o: 0.7 },
  { x: 372, y: 721, s: 1.35, color: "#AFD3A0", o: 0.65 },
];

/* The employer, scrutinizing the page from the right. */
const READER = { x: 1090, y: 678, s: 2.4 };
const WONDER = { x: 1176, y: 540, s: 4.6 };
const WONDER_BOB = { y: [0, -7, 0], duration: 2.1 };

/* Her magnifying glass, held over the page's decorated corner - with the
   "?" she keeps finding inside the lens. */
const LENS = { cx: 940, cy: 616, r: 40 };


/* Pride sparkles by the sheet's shoulder - the author's own confidence. */
const SPARKS = [
  { x: 566, y: 246, deg: -115 },
  { x: 552, y: 292, deg: -165 },
  { x: 596, y: 212, deg: -65 },
];
const SPARK_LEN = 13;

/* The sheet: a tall page with a folded top-right corner. */
const SHEET = {
  d: "M590 235 L918 235 L950 267 L950 715 L590 715 Z",
  fold: "M918 235 L950 267 L918 267 Z",
};

/* The three claims every CV makes. */
const CHIPS = [
  { label: "Fluent English", y: 412 },
  { label: "Fast typist", y: 486 },
  { label: "Great on calls", y: 560 },
];
const CHIP = { x: 630, w: 280, h: 56, r: 28, cx: 770 };

/* The forever flicker: one pill at a time flips to "?" and back. */
const FLICKER = {
  cycle: 4.5, //  s per full claim → ? → claim round trip
  stagger: 1.5, // s between pills, so one flips at a time
  claimO: { v: [1, 1, 0, 0, 1, 1], t: [0, 0.5, 0.56, 0.86, 0.92, 1] },
  markO: { v: [0, 0, 1, 1, 0, 0], t: [0, 0.5, 0.56, 0.86, 0.92, 1] },
  pop: { v: [1, 1, 1.05, 1, 1, 1], t: [0, 0.5, 0.56, 0.64, 0.92, 1] },
};


/* ── small pieces (same idiom as the Kanban story visual) ── */

function Label({
  x,
  y,
  children,
  size = 31,
  color = INK,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  color?: string;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize={size}
      fontStyle="italic"
      fill={color}
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {children}
    </text>
  );
}

/* Scale/rotate SVG children about a fixed anchor point (see Kanban visual
   for why percentage transform-origins can't be trusted on SVG groups). */
function Anchored({
  ax,
  ay,
  children,
  ...motionProps
}: {
  ax: number;
  ay: number;
  children: React.ReactNode;
} & React.ComponentProps<typeof motion.g>) {
  return (
    <g transform={`translate(${ax} ${ay})`}>
      <motion.g style={{ transformOrigin: "0px 0px" }} {...motionProps}>
        <g transform={`translate(${-ax} ${-ay})`}>{children}</g>
      </motion.g>
    </g>
  );
}

function PopIn({
  on,
  delay = 0,
  ax,
  ay,
  spring,
  children,
}: {
  on: boolean;
  delay?: number;
  ax: number;
  ay: number;
  spring: object;
  children: React.ReactNode;
}) {
  return (
    <Anchored
      ax={ax}
      ay={ay}
      initial={false}
      animate={{ scale: on ? 1 : 0, opacity: on ? 1 : 0 }}
      transition={
        on
          ? { ...spring, delay, opacity: { duration: 0.2, delay } }
          : { duration: 0 }
      }
    >
      {children}
    </Anchored>
  );
}

function DrawPath({
  on,
  d,
  duration,
  delay = 0,
  ...rest
}: {
  on: boolean;
  d: string;
  duration: number;
  delay?: number;
} & React.ComponentProps<typeof motion.path>) {
  return (
    <motion.path
      d={d}
      initial={false}
      animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
      transition={
        on
          ? {
              pathLength: { duration, delay, ease: "easeInOut" },
              opacity: { duration: 0.01, delay },
            }
          : { duration: 0 }
      }
      {...rest}
    />
  );
}

function LabelFade({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <motion.g
      initial={false}
      animate={{ opacity: on ? 1 : 0, y: on ? 0 : 10 }}
      transition={on ? { duration: 0.5, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }}
    >
      {children}
    </motion.g>
  );
}

/* The tiny résumé everyone in the queue is holding: the same sheet,
   the same claims, at hand size. */
function MiniSheet({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeLinejoin="round">
      <path d="M -10 -14 L 6 -14 L 10 -10 L 10 14 L -10 14 Z" fill="#fff" strokeWidth="2" />
      <path d="M -6 -7 q 3 -2.4 6 0 t 6 0" fill="none" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      <rect x="-6" y="-1" width="12" height="4.6" rx="2.3" fill="none" strokeWidth="1.5" opacity="0.75" />
      <rect x="-6" y="6" width="12" height="4.6" rx="2.3" fill="none" strokeWidth="1.5" opacity="0.75" />
    </g>
  );
}

/* The skeptical employer: squinting eyes, one raised brow, flat mouth.
   Same cast language as chibi.tsx, but the face does the doubting. */
function SkepticReader({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -17 34 Q -19 9 0 9 Q 19 9 17 34 Z" fill={NAVY} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M -6 9 q 6 5 12 0" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
      <circle cx={0} cy={-9} r={14} fill={SKIN} stroke={INK} strokeWidth={2.4} />
      <path
        d="M -15 -8 Q -19 -30 0 -28 Q 19 -30 15 -8 Q 17 3 11 8 L 10 -7 Q 7 -19 0 -19 Q -8 -19 -11 -7 L -13 8 Q -17 2 -15 -8 Z"
        fill={HAIR}
        stroke={INK}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <g fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round">
        {/* stern brows: one arched up, one pressed flat */}
        <path d="M -8.6 -12 q 3 -3.4 6 -1" />
        <path d="M 3 -10.6 l 5.6 1.6" />
        {/* the squint: eyes narrowed to slits */}
        <path d="M -7.6 -5.4 l 5 -1.2" strokeWidth={2.6} />
        <path d="M 3 -6 l 5 1" strokeWidth={2.6} />
        {/* straight, unconvinced mouth */}
        <path d="M -3.2 2.6 l 6.4 -1.2" />
      </g>
    </g>
  );
}

/* The self-awarded gold seal - looks official, proves nothing. */
function Seal({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={INK} strokeLinejoin="round">
      <path d="M -7 12 L -13 30 L -2 22 Z" fill={PAPER_TINT} strokeWidth="2" />
      <path d="M 7 12 L 13 30 L 2 22 Z" fill={PAPER_TINT} strokeWidth="2" />
      <circle r="17" fill={WARM} strokeWidth="2.4" />
      <path
        d="M 0 -9 L 2.6 -2.8 L 9 -2.8 L 3.8 1.4 L 5.6 8 L 0 4 L -5.6 8 L -3.8 1.4 L -9 -2.8 L -2.6 -2.8 Z"
        fill="#fff"
        strokeWidth="1.8"
      />
    </g>
  );
}

/* One claim pill: rough outline in the filtered layer, flickering claim/"?"
   text kept crisp above it. `loop` starts the forever claim ↔ "?" cycle;
   reduced motion instead stamps a faint tilted "?" on the corner. */
function ChipText({
  y,
  label,
  loop,
  delay,
  reduced,
}: {
  y: number;
  label: string;
  loop: boolean;
  delay: number;
  reduced: boolean;
}) {
  const cy = y + CHIP.h / 2;
  const flick = loop && !reduced;
  return (
    <>
      <motion.text
        x={CHIP.cx}
        y={cy + 9}
        textAnchor="middle"
        fontSize={27}
        fontWeight={600}
        fill={INK}
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        initial={false}
        animate={flick ? { opacity: FLICKER.claimO.v } : { opacity: 1 }}
        transition={
          flick
            ? {
                duration: FLICKER.cycle,
                times: FLICKER.claimO.t,
                repeat: Infinity,
                delay,
                ease: "linear",
              }
            : { duration: 0.2 }
        }
      >
        {label}
      </motion.text>
      {flick && (
        <motion.text
          x={CHIP.cx}
          y={cy + 12}
          textAnchor="middle"
          fontSize={36}
          fontWeight={700}
          fill={EMER}
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: FLICKER.markO.v }}
          transition={{
            duration: FLICKER.cycle,
            times: FLICKER.markO.t,
            repeat: Infinity,
            delay,
            ease: "linear",
          }}
        >
          ?
        </motion.text>
      )}
      {/* reduced motion: the faint stamp instead of the loop */}
      {reduced && loop && (
        <text
          x={CHIP.x + CHIP.w - 26}
          y={y + 24}
          textAnchor="middle"
          fontSize={30}
          fontWeight={700}
          fill={EMER}
          opacity={0.45}
          transform={`rotate(-12 ${CHIP.x + CHIP.w - 26} ${y + 24})`}
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          ?
        </text>
      )}
    </>
  );
}

/* ── the visual ──────────────────────────────────────────── */

export default function PromiseVisual() {
  const reduced = useReducedMotion() ?? false;
  const [stage, setStage] = useState(0);

  useEffect(() => {
    setStage(0);
    if (reduced) {
      setStage(99);
      return;
    }
    const timers = Object.values(T_PROMISE).map((t, i) =>
      setTimeout(() => setStage(i + 1), t)
    );
    return () => timers.forEach(clearTimeout);
  }, [reduced]);

  const on = (n: number) => stage >= n;

  return (
    <div
      className="absolute inset-0"
      style={{
        background: "#fbfaf8",
        backgroundImage:
          "radial-gradient(circle, rgba(18,51,59,0.06) 1.1px, transparent 1.2px)",
        backgroundSize: "26px 26px",
      }}
    >
      <svg
        viewBox="0 0 1440 900"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="A proud candidate beside an oversized résumé with a gold seal; a queue of other candidates waits behind him holding identical sheets; an employer squints at the page with a question-mark bubble; the claims (fluent English, fast typist, great on calls) each flicker into a question mark: asserted, never verified."
      >
        <defs>
          <RoughFilter id="ofm-promise-rough" baseFrequency={0.013} scale={5} seed={7} />
        </defs>

        {/* ── the scene (rough / hand-drawn) ── */}
        <g filter="url(#ofm-promise-rough)">
          {/* ground line */}
          <DrawPath
            on={on(1)}
            d={GROUND.d}
            duration={GROUND.draw}
            fill="none"
            stroke={INK}
            strokeWidth="3"
            strokeDasharray="2 26"
            strokeLinecap="round"
          />

          {/* the résumé sheet, springing up from the ground */}
          <PopIn on={on(2)} ax={770} ay={715} spring={POP.sheet}>
            <path d={SHEET.d} fill="#FFFFFF" stroke={INK} strokeWidth="3.2" strokeLinejoin="round" />
            <path d={SHEET.fold} fill={PAPER_TINT} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />

            {/* the sheet inks itself in: photo, name scribbles, divider */}
            <motion.g
              initial={false}
              animate={{ opacity: on(4) ? 1 : 0 }}
              transition={{ duration: 0.45 }}
            >
              {/* passport photo: a dot-eye face in a box */}
              <rect x="622" y="268" width="72" height="76" rx="6" fill="#FFFFFF" stroke={INK} strokeWidth="2.6" />
              <path d="M630 344 Q633 324 658 324 Q683 324 686 344" fill={PAPER_TINT} stroke={INK} strokeWidth="2.2" />
              <circle cx="658" cy="300" r="17" fill="#f6ddc4" stroke={INK} strokeWidth="2.2" />
              <g fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round">
                <path d="M650 297 q 3 -3.4 6 0" />
                <path d="M660 297 q 3 -3.4 6 0" />
                <path d="M654 305 q 4 3.4 8 0" />
              </g>

              {/* the name, in confident scribble */}
              <g fill="none" stroke={INK} strokeLinecap="round">
                <path d="M716 292 q 12 -9 24 0 t 24 0 t 24 0 t 24 0 t 24 0" strokeWidth="3" opacity="0.8" />
                <path d="M716 320 q 10 -6 20 0 t 20 0 t 20 0" strokeWidth="2.4" opacity="0.4" />
              </g>

              {/* divider */}
              <path d="M622 380 L918 380" stroke={INK} strokeWidth="2" opacity="0.3" />

              {/* trailing resume scribble */}
              <g fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" opacity="0.35">
                <path d="M622 652 q 10 -6 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0" />
                <path d="M622 680 q 10 -6 20 0 t 20 0 t 20 0 t 20 0 t 20 0" />
              </g>

              {/* the self-awarded seal */}
              <Seal x={886} y={660} />
            </motion.g>

            {/* the three claims - popping in, then flickering to "?" */}
            {CHIPS.map((chip, i) => (
              <PopIn
                key={chip.label}
                on={on(5)}
                delay={i * POP.chipStagger}
                ax={CHIP.cx}
                ay={chip.y + CHIP.h / 2}
                spring={POP.chip}
              >
                <Anchored
                  ax={CHIP.cx}
                  ay={chip.y + CHIP.h / 2}
                  animate={
                    on(9) && !reduced
                      ? { scale: FLICKER.pop.v }
                      : { scale: 1 }
                  }
                  transition={
                    on(9) && !reduced
                      ? {
                          duration: FLICKER.cycle,
                          times: FLICKER.pop.t,
                          repeat: Infinity,
                          delay: i * FLICKER.stagger,
                          ease: "linear",
                        }
                      : { duration: 0.2 }
                  }
                >
                  <rect
                    x={CHIP.x}
                    y={chip.y}
                    width={CHIP.w}
                    height={CHIP.h}
                    rx={CHIP.r}
                    fill="#FFFFFF"
                    stroke={INK}
                    strokeWidth="2.8"
                  />
                </Anchored>
              </PopIn>
            ))}
          </PopIn>

          {/* its proud author - mini beside his oversized claims */}
          <PopIn on={on(3)} ax={480} ay={760} spring={POP.chibi}>
            <SmilingMan x={480} y={668} s={2.7} />
          </PopIn>

          {/* the queue behind him - everyone's holding the same sheet */}
          {CROWD.map((c, i) => (
            <PopIn
              key={i}
              on={on(6)}
              delay={i * POP.crowdStagger}
              ax={c.x}
              ay={c.y + 30 * c.s}
              spring={POP.chibi}
            >
              <g opacity={c.o}>
                <Chibi x={c.x} y={c.y} s={c.s} color={c.color} />
                <MiniSheet x={c.x + 26 * c.s} y={c.y + 4 * c.s} s={c.s * 0.85} />
              </g>
            </PopIn>
          ))}

          {/* the employer, squinting at the page */}
          <PopIn on={on(7)} ax={READER.x} ay={760} spring={POP.chibi}>
            <SkepticReader x={READER.x} y={READER.y} s={READER.s} />
          </PopIn>

          {/* her magnifying glass, held over the page's corner */}
          <PopIn on={on(8)} ax={1012} ay={690} spring={POP.bubble}>
            {/* raised arm + hand */}
            <path d="M 1070 706 Q 1040 706 1016 694" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
            <circle cx="1012" cy="690" r="6.5" fill={SKIN} stroke={INK} strokeWidth="2.2" />
            {/* handle + lens */}
            <path d={`M ${LENS.cx + 28} ${LENS.cy + 28} L 1008 686`} stroke={INK} strokeWidth="7" strokeLinecap="round" />
            <circle cx={LENS.cx} cy={LENS.cy} r={LENS.r} fill={PAPER_TINT} fillOpacity="0.55" stroke={INK} strokeWidth="3.4" />
            {/* glass glint */}
            <g stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.85">
              <path d={`M ${LENS.cx - 22} ${LENS.cy - 13} q 8 -9 18 -12`} fill="none" />
              <path d={`M ${LENS.cx - 25} ${LENS.cy + 2} q 3 -5 7 -8`} fill="none" />
            </g>
          </PopIn>

          {/* pride sparkles by the sheet's shoulder */}
          {SPARKS.map((sp, i) => (
            <g key={i} transform={`translate(${sp.x} ${sp.y}) rotate(${sp.deg})`}>
              <motion.path
                d={`M 5 0 L ${5 + SPARK_LEN} 0`}
                fill="none"
                stroke={WARM}
                strokeWidth="3.4"
                strokeLinecap="round"
                initial={false}
                animate={
                  on(3)
                    ? reduced
                      ? { opacity: 0.8 }
                      : { opacity: [0.25, 1, 0.25] }
                    : { opacity: 0 }
                }
                transition={
                  on(3) && !reduced
                    ? { duration: 1.8, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }
                    : { duration: 0.2 }
                }
              />
            </g>
          ))}
          <Anchored
            ax={WONDER.x - 14}
            ay={WONDER.y + 20}
            initial={false}
            animate={{ scale: on(8) ? 1 : 0, opacity: on(8) ? 1 : 0 }}
            transition={
              on(8) ? { ...POP.bubble, opacity: { duration: 0.15 } } : { duration: 0 }
            }
          >
            <motion.g
              animate={reduced ? undefined : { y: WONDER_BOB.y }}
              transition={{
                duration: WONDER_BOB.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <WaitBubble x={WONDER.x} y={WONDER.y} s={WONDER.s} color={EMER} />
            </motion.g>
          </Anchored>

        </g>

        {/* ── crisp layer: chip text + labels (outside the rough filter) ── */}
        <motion.g
          initial={false}
          animate={{ opacity: on(5) ? 1 : 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          {CHIPS.map((chip, i) => (
            <ChipText
              key={chip.label}
              y={chip.y}
              label={chip.label}
              loop={on(9)}
              delay={i * FLICKER.stagger}
              reduced={reduced}
            />
          ))}
        </motion.g>

        {/* the "?" she keeps finding in the lens */}
        <motion.text
          x={LENS.cx}
          y={LENS.cy + 15}
          textAnchor="middle"
          fontSize={46}
          fontWeight={700}
          fill={EMER}
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          initial={false}
          animate={
            on(8)
              ? reduced
                ? { opacity: 1, scale: 1 }
                : { opacity: [0, 1, 1, 0.55, 1], scale: 1 }
              : { opacity: 0, scale: 0.6 }
          }
          transition={
            on(8) && !reduced
              ? { duration: 3.6, times: [0, 0.12, 0.5, 0.72, 1], repeat: Infinity }
              : { duration: 0.2 }
          }
        >
          ?
        </motion.text>

        <LabelFade on={on(6)}>
          <Label x={262} y={630}>
            everyone writes it
          </Label>
        </LabelFade>

        <LabelFade on={on(10)}>
          <Label x={1200} y={394} size={34} color={EMER}>
            asserted,
          </Label>
          <Label x={1200} y={434} size={34} color={EMER}>
            never verified
          </Label>
        </LabelFade>
      </svg>
    </div>
  );
}
