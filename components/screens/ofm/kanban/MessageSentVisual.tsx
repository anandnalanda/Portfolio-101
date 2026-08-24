"use client";

/* Story-beat illustration - hand-drawn, beat-aware, fully animated.

   One continuous chibi world that ACTS OUT the two story beats, replaying
   its sequence whenever the reader scrolls a beat into focus:

     ended → the scene builds itself: the flood arrives, the employer sends
             a message, the paper plane flies the trail, hits the tear, and
             applicants start leaking off the platform with suitcases.
     two   → the leak fades; two rough lassos circle the two problems in
             turn, each answered by a popping "?" bubble.

   Reuses the shared chibi cast from the OFM illustrations (characters only).
   Text labels render OUTSIDE the rough filter so words stay crisp. */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Chibi,
  RoughFilter,
  SmilingMan,
  WaitBubble,
  INK,
} from "@/components/screens/ofm/chibi";

const EMER = "#0B7A4E";

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD - beat "ended" (replays on entry)
 *
 *     0ms   platform ground line draws left → right
 *   250ms   applicants flood in, back row first (pop, 60ms stagger)
 *           "hundreds apply" fades up
 *  1350ms   the employer pops in
 *  1800ms   the message bubble springs open
 *  2500ms   the paper plane launches down the trail; the trail
 *           draws beneath it; check ticks in + "message sent"
 *  3150ms   the plane hits the edge - the tear rips down, impact shake
 *  3650ms   the leak: applicants walk off the platform, on a loop
 *           "off the platform" fades up
 * ───────────────────────────────────────────────────────── */
const T_ENDED = {
  ground: 0, //     stage 1 · ground line draws
  flood: 250, //    stage 2 · applicants pop in (staggered)
  employer: 1350, // stage 3 · employer pops in
  bubble: 1800, //  stage 4 · message bubble springs open
  launch: 2500, //  stage 5 · plane flies, trail draws, "message sent"
  crash: 3150, //   stage 6 · tear rips, impact shake
  leak: 3650, //    stage 7 · applicants leak off the platform (loop)
};

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD - beat "two" (the built scene holds)
 *
 *     0ms   the leak fades away; the drawn scene stands still
 *   350ms   a rough lasso circles the flood        (problem 1)
 *   950ms   "?" bubble pops over it + "Who's best?"
 *  1800ms   a rough lasso circles the dead end     (problem 2)
 *  2400ms   "?" bubble pops over it + "Then what?"
 *           both bubbles keep bobbing forever
 * ───────────────────────────────────────────────────────── */
const T_TWO = {
  circleOne: 350, // stage 1 · lasso draws around the flood
  askOne: 950, //    stage 2 · "Who's best?" bubble + label
  circleTwo: 1800, // stage 3 · lasso draws around the tear
  askTwo: 2400, //   stage 4 · "Then what?" bubble + label
};

/* ── element configs ─────────────────────────────────────── */

/* Pop-in springs, by character weight. */
const POP = {
  floodStagger: 0.045, // s between each applicant popping in
  chibi: { type: "spring" as const, stiffness: 480, damping: 24 },
  employer: { type: "spring" as const, stiffness: 380, damping: 22 },
  bubble: { type: "spring" as const, stiffness: 400, damping: 21 },
  ask: { type: "spring" as const, stiffness: 480, damping: 17 },
};

/* The platform ground line (dashed, revealed via a masked draw). */
const GROUND = {
  d: "M120 680 L1010 680", //   the platform, up to the tear
  leakD: "M1080 692 L1408 838", // past the tear it falls away - leaking through the floor
  draw: 0.7, // s to draw left → right
};

/* Faint arrival arcs - the flood keeps pouring in from offstage. */
const INCOMING = {
  arcs: ["M 96 208 Q 214 168 300 316", "M 208 130 Q 330 128 390 300"],
  heads: ["M286 310 L300 316 L297 301", "M377 295 L390 300 L389 284"],
  opacity: 0.45,
};

/* The message trail out of the bubble (dashed, masked draw). */
const TRAIL = {
  d: "M988 344 Q1050 372 1030 470",
  draw: 0.62, // s - matches the plane's flight down it
};

/* The tear at the platform's edge. */
const TEAR = {
  d: "M1018 452 l16 22 l-18 20 l18 22 l-16 22 l16 22 l-14 22",
  draw: 0.3, //                    s to rip top → bottom
  shake: [0, -6, 5, -3, 2, 0], //  x keyframes on impact
  shakeDuration: 0.45,
};

/* The flying paper plane: keyframes trace the trail, then the crash. */
const PLANE = {
  d: "M 15 0 L -11 -7.5 L -4 0 L -11 7.5 Z",
  x: [988, 1014, 1030, 1035, 1030, 1022, 1026],
  y: [344, 362, 390, 425, 464, 505, 545],
  rotate: [32, 48, 68, 85, 96, 135, 170],
  opacity: [1, 1, 1, 1, 1, 0.85, 0],
  times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1], // impact lands at 0.6
  duration: 1.05, // s - flight (0.65s) + crumple and fall (0.4s)
};

/* Impact ticks fanning off the tear where the plane hits. */
const IMPACT = {
  at: { x: 1048, y: 450 },
  angles: [-52, -12, 32], // deg, radiating up-right
  length: 17,
  flash: 0.5, // s for the 0 → 1 → 0 opacity flash
};

/* The endless leak: applicants walking down through the floor. */
const WALK = {
  from: 1052, //  x where a walker appears (just past the tear)
  to: 1408, //    x where a walker reaches the inbox
  y: 556, //      baseline at the top of the slope
  drop: 145, //   how far they descend along the falling ground line
  duration: 5.8, // s per crossing
  fade: { o: [0, 0.95, 0.85, 0], times: [0, 0.08, 0.82, 1] },
  bob: { rotate: [-2.6, 2.6], duration: 0.36 }, // the waddle
  walkers: [
    { delay: 0, color: "#2E9E6B", s: 2.0 },
    { delay: 1.9, color: "#63B98A", s: 1.85 },
    { delay: 3.8, color: "#CBB86E", s: 1.7 },
  ],
};

/* Rough hand-drawn lassos around the two problems. */
const LASSO = {
  stroke: 3.4,
  opacity: 0.75,
  draw: 0.55, // s per lasso
  one: "M 348 314 C 496 320 606 400 600 508 C 594 616 486 700 336 694 C 196 688 76 610 82 502 C 88 396 200 308 348 314 Z",
  two: "M 1048 384 C 1112 388 1158 450 1154 540 C 1150 630 1108 698 1042 694 C 978 690 936 626 940 536 C 944 446 984 380 1048 384 Z",
};

/* The gentle forever-bob on the "?" bubbles. */
const ASK_BOB = { y: [0, -7, 0], duration: 2.1 };

/* ── cast placement ──────────────────────────────────────── */

/* The flood - a crowd of applicants, drawn back rows first for depth.
   `o` fades the far rows into the distance. */
const FLOOD: { x: number; y: number; s: number; color: string; o?: number }[] = [
  { x: 250, y: 362, s: 0.8, color: "#8FC6A6", o: 0.7 },
  { x: 320, y: 360, s: 0.8, color: "#AFD3A0", o: 0.7 },
  { x: 390, y: 364, s: 0.8, color: "#63B98A", o: 0.7 },
  { x: 205, y: 392, s: 1.0, color: "#AFD3A0", o: 0.85 },
  { x: 272, y: 396, s: 1.0, color: "#CBB86E", o: 0.85 },
  { x: 339, y: 392, s: 1.0, color: "#63B98A", o: 0.85 },
  { x: 406, y: 396, s: 1.0, color: "#8FC6A6", o: 0.85 },
  { x: 470, y: 392, s: 1.0, color: "#AFD3A0", o: 0.85 },
  { x: 168, y: 428, s: 1.25, color: "#63B98A" },
  { x: 240, y: 432, s: 1.25, color: "#AFD3A0" },
  { x: 312, y: 428, s: 1.25, color: "#7CA9D0" },
  { x: 384, y: 432, s: 1.25, color: "#2E9E6B" },
  { x: 456, y: 428, s: 1.25, color: "#CBB86E" },
  { x: 208, y: 470, s: 1.5, color: "#AFD3A0" },
  { x: 300, y: 466, s: 1.5, color: "#63B98A" },
  { x: 392, y: 470, s: 1.5, color: "#AFD3A0" },
  { x: 150, y: 476, s: 1.4, color: "#CBB86E" },
  { x: 176, y: 520, s: 1.85, color: "#2E9E6B" },
  { x: 268, y: 524, s: 1.85, color: "#7CA9D0" },
  { x: 360, y: 520, s: 1.85, color: "#0B7A4E" },
  { x: 448, y: 524, s: 1.8, color: "#63B98A" },
  { x: 150, y: 582, s: 2.15, color: "#0B7A4E" },
  { x: 244, y: 586, s: 2.15, color: "#E0906E" },
  { x: 338, y: 582, s: 2.15, color: "#2E9E6B" },
  { x: 432, y: 586, s: 2.1, color: "#AFD3A0" },
  { x: 520, y: 582, s: 2.05, color: "#63B98A" },
];

/* Static leak arrangement - the reduced-motion fallback. */
const LEAVING: { x: number; y: number; s: number; color: string; o: number }[] =
  [
    { x: 1150, y: 600, s: 2.0, color: "#2E9E6B", o: 0.92 },
    { x: 1272, y: 648, s: 1.6, color: "#63B98A", o: 0.55 },
    { x: 1366, y: 690, s: 1.3, color: "#8FC6A6", o: 0.3 },
  ];

/* ── small pieces ────────────────────────────────────────── */

function Suitcase({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeLinejoin="round">
      <rect x="-13" y="-9" width="26" height="20" rx="4" fill="#CBB86E" strokeWidth="2.2" />
      <path d="M -6 -9 l 0 -6 l 12 0 l 0 6" fill="none" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

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

/* Scale/rotate SVG children about a fixed anchor point. Percentage
   transform-origins on SVG groups resolve against the wrong box in the
   browser, so instead the anchor is moved to the local origin, the motion
   transform runs about 0,0, and the content is moved back. */
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

/* Spring pop from an anchor point (usually the character's feet or the
   bubble's tail). Resets instantly (duration 0) so a replay never shows
   the collapse. */
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

/* Draw-on for a solid stroke via pathLength. */
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

/* Fade-up for the crisp labels outside the rough filter. */
function LabelFade({
  on,
  children,
}: {
  on: boolean;
  children: React.ReactNode;
}) {
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

/* One leaking applicant: appears at the tear, waddles off the canvas,
   fades near the edge, and goes again. */
function Walker({ delay, color, s }: { delay: number; color: string; s: number }) {
  return (
    <motion.g
      initial={{ x: WALK.from, y: 0, opacity: 0 }}
      animate={{ x: [WALK.from, WALK.to], y: [0, WALK.drop], opacity: WALK.fade.o }}
      transition={{
        duration: WALK.duration,
        delay,
        repeat: Infinity,
        ease: "linear",
        opacity: {
          duration: WALK.duration,
          delay,
          repeat: Infinity,
          times: WALK.fade.times,
          ease: "linear",
        },
      }}
    >
      <Anchored
        ax={12}
        ay={WALK.y + 30 * s}
        animate={{ rotate: WALK.bob.rotate }}
        transition={{
          duration: WALK.bob.duration,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        <Chibi x={0} y={WALK.y} s={s} color={color} />
        <Suitcase x={30 * s} y={WALK.y + 6 * s} s={s * 0.9} />
      </Anchored>
    </motion.g>
  );
}

/* A popping, forever-bobbing "?" bubble. */
function AskBubble({
  on,
  x,
  y,
  bobDelay = 0,
  still = false,
}: {
  on: boolean;
  x: number;
  y: number;
  bobDelay?: number;
  still?: boolean;
}) {
  return (
    <Anchored
      ax={x - 14}
      ay={y + 20}
      initial={false}
      animate={{ scale: on ? 1 : 0, opacity: on ? 1 : 0 }}
      transition={on ? { ...POP.ask, opacity: { duration: 0.15 } } : { duration: 0 }}
    >
      <motion.g
        animate={still ? undefined : { y: ASK_BOB.y }}
        transition={{
          duration: ASK_BOB.duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: bobDelay,
        }}
      >
        <WaitBubble x={x} y={y} s={3.4} color={EMER} />
      </motion.g>
    </Anchored>
  );
}

/* ── the visual ──────────────────────────────────────────── */

export default function MessageSentVisual({ beat = "ended" }: { beat?: string }) {
  const reduced = useReducedMotion() ?? false;
  const [stage, setStage] = useState(0);

  useEffect(() => {
    setStage(0);
    if (beat !== "ended" && beat !== "two") return;
    if (reduced) {
      setStage(99);
      return;
    }
    const script = beat === "ended" ? T_ENDED : T_TWO;
    const timers = Object.values(script).map((t, i) =>
      setTimeout(() => setStage(i + 1), t)
    );
    return () => timers.forEach(clearTimeout);
  }, [beat, reduced]);

  const ended = beat === "ended";
  /* Base scene: staged while "ended" plays; simply present on other beats
     (arriving mid-story, anything unbuilt springs in to catch up). */
  const scene = (n: number) => (ended ? stage >= n : true);
  const two = (n: number) => beat === "two" && stage >= n;
  const leakOn = ended && stage >= 7;

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
        aria-label="A flood of applicants; the employer can only send a message; the pipeline dead-ends and applicants drift off the platform."
      >
        <defs>
          <RoughFilter id="ofm-rough" baseFrequency={0.013} scale={5} seed={11} />
          {/* draw-on masks for the dashed strokes (pathLength would fight
              their dash patterns) */}
          <mask id="ofm-msv-ground" maskUnits="userSpaceOnUse" x="0" y="0" width="1540" height="1000">
            <motion.path
              d={GROUND.d}
              fill="none"
              stroke="#fff"
              strokeWidth={18}
              initial={false}
              animate={{ pathLength: scene(1) ? 1 : 0 }}
              transition={scene(1) ? { duration: GROUND.draw, ease: "easeInOut" } : { duration: 0 }}
            />
          </mask>
          <mask id="ofm-msv-trail" maskUnits="userSpaceOnUse" x="940" y="300" width="220" height="260">
            <motion.path
              d={TRAIL.d}
              fill="none"
              stroke="#fff"
              strokeWidth={18}
              initial={false}
              animate={{ pathLength: scene(5) ? 1 : 0 }}
              transition={scene(5) ? { duration: TRAIL.draw, ease: "easeIn" } : { duration: 0 }}
            />
          </mask>
        </defs>

        {/* nudge the full-bleed composition into the canvas */}
        <g transform="translate(-45 0)">

        {/* ── the scene (rough / hand-drawn) ── */}
        <g filter="url(#ofm-rough)">
          {/* ground line - the platform, ending at the tear */}
          <path
            d={GROUND.d}
            mask="url(#ofm-msv-ground)"
            fill="none"
            stroke={INK}
            strokeWidth="3"
            strokeDasharray="2 26"
            strokeLinecap="round"
          />

          {/* the flood keeps pouring in - faint arrival arcs (ended only) */}
          <motion.g
            initial={false}
            animate={{ opacity: ended && stage >= 2 ? INCOMING.opacity : 0 }}
            transition={{ duration: 0.5, delay: ended && stage >= 2 ? 0.5 : 0 }}
            stroke={INK}
            fill="none"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {INCOMING.arcs.map((d) => (
              <path key={d} d={d} strokeDasharray="2 14" />
            ))}
            {INCOMING.heads.map((d) => (
              <path key={d} d={d} />
            ))}
          </motion.g>

          {/* flood of applicants - popping in back row first */}
          {FLOOD.map((c, i) => (
            <PopIn
              key={i}
              on={scene(2)}
              delay={i * POP.floodStagger}
              ax={c.x}
              ay={c.y + 30 * c.s}
              spring={POP.chibi}
            >
              <g opacity={c.o ?? 1}>
                <Chibi x={c.x} y={c.y} s={c.s} color={c.color} />
              </g>
            </PopIn>
          ))}

          {/* the employer - only tool is a message */}
          <PopIn on={scene(3)} ax={720} ay={640} spring={POP.employer}>
            <SmilingMan x={720} y={548} s={2.7} />
          </PopIn>
          <PopIn on={scene(4)} ax={742} ay={452} spring={POP.bubble}>
            <g stroke={INK} strokeLinejoin="round" strokeLinecap="round">
              <path
                d="M726 300 Q720 268 760 266 L946 266 Q986 268 984 302 L984 372 Q986 404 948 404 L800 404 L742 452 L760 402 Q726 396 726 366 Z"
                fill="#FFFFFF"
                strokeWidth="3.2"
              />
              <path d="M782 372 L932 302 L858 388 Z" fill="#E7F3EA" stroke={EMER} strokeWidth="3" />
              <path d="M782 372 L858 346 L858 388" fill="none" stroke={EMER} strokeWidth="3" />
              {/* the check ticks in the moment the plane launches */}
              <DrawPath
                on={scene(5)}
                d="M900 356 l10 11 l20 -24"
                duration={0.35}
                fill="none"
                stroke={EMER}
                strokeWidth="3"
              />
            </g>
          </PopIn>
        </g>

        {/* ── the dead end: trail, plane, tear (shakes on impact) ── */}
        <motion.g
          filter="url(#ofm-rough)"
          animate={ended && stage >= 6 ? { x: TEAR.shake } : { x: 0 }}
          transition={{ duration: TEAR.shakeDuration, ease: "easeOut" }}
        >
          {/* trail out of the bubble, drawn under the plane's flight */}
          <path
            d={TRAIL.d}
            mask="url(#ofm-msv-trail)"
            fill="none"
            stroke={EMER}
            strokeWidth="3.4"
            strokeDasharray="1.5 22"
            strokeLinecap="round"
          />

          {/* the paper plane - flies the trail, crumples at the tear */}
          {ended && stage >= 5 && !reduced && (
            <motion.g
              style={{ transformOrigin: "0px 0px" }}
              initial={{ x: PLANE.x[0], y: PLANE.y[0], rotate: PLANE.rotate[0] }}
              animate={{ x: PLANE.x, y: PLANE.y, rotate: PLANE.rotate, opacity: PLANE.opacity }}
              transition={{ duration: PLANE.duration, times: PLANE.times, ease: "linear" }}
            >
              <path d={PLANE.d} fill="#E7F3EA" stroke={EMER} strokeWidth="2.6" strokeLinejoin="round" />
            </motion.g>
          )}

          {/* the tear - rips top to bottom when the plane lands */}
          <DrawPath
            on={scene(6)}
            d={TEAR.d}
            duration={TEAR.draw}
            fill="none"
            stroke={INK}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* impact ticks fanning off the point of the crash */}
          {ended && stage >= 6 && !reduced &&
            IMPACT.angles.map((deg) => (
              <g key={deg} transform={`translate(${IMPACT.at.x} ${IMPACT.at.y}) rotate(${deg})`}>
                <motion.path
                  d={`M 6 0 L ${6 + IMPACT.length} 0`}
                  fill="none"
                  stroke={EMER}
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: IMPACT.flash, times: [0, 0.3, 1] }}
                />
              </g>
            ))}
        </motion.g>

        {/* ── the leak: applicants walking off the platform ── */}
        <AnimatePresence>
          {leakOn && (
            <motion.g
              key="leak"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <g filter="url(#ofm-rough)">
                <path
                  d={GROUND.leakD}
                  fill="none"
                  stroke={INK}
                  strokeWidth="2.6"
                  strokeDasharray="2 30"
                  strokeLinecap="round"
                  opacity={0.5}
                />
                {reduced
                  ? LEAVING.map((c, i) => (
                      <g key={i} opacity={c.o}>
                        <Chibi x={c.x} y={c.y} s={c.s} color={c.color} />
                        <Suitcase x={c.x + 30 * c.s} y={c.y + 6 * c.s} s={c.s * 0.9} />
                      </g>
                    ))
                  : WALK.walkers.map((w) => (
                      <Walker key={w.delay} delay={w.delay} color={w.color} s={w.s} />
                    ))}
                {/* where they end up: someone's inbox */}
                <Anchored
                  ax={1360}
                  ay={830}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={reduced ? { duration: 0 } : { ...POP.bubble, delay: 0.4 }}
                >
                  <g stroke={INK} strokeWidth="3" strokeLinejoin="round" opacity={0.8}>
                    <rect x="1316" y="770" width="88" height="60" rx="9" fill="#FFFFFF" />
                    <path d="M1316 776 L1360 810 L1404 776" fill="none" />
                  </g>
                </Anchored>
              </g>
              <Label x={1245} y={680}>
                off the platform
              </Label>
            </motion.g>
          )}
        </AnimatePresence>

        {/* ── two problems: lassos + "?" bubbles ── */}
        <AnimatePresence>
          {beat === "two" && (
            <motion.g
              key="two"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <g filter="url(#ofm-rough)">
                <DrawPath
                  on={two(1)}
                  d={LASSO.one}
                  duration={LASSO.draw}
                  fill="none"
                  stroke={EMER}
                  strokeWidth={LASSO.stroke}
                  strokeOpacity={LASSO.opacity}
                  strokeLinecap="round"
                />
                <AskBubble on={two(2)} x={350} y={258} still={reduced} />
                <DrawPath
                  on={two(3)}
                  d={LASSO.two}
                  duration={LASSO.draw}
                  fill="none"
                  stroke={EMER}
                  strokeWidth={LASSO.stroke}
                  strokeOpacity={LASSO.opacity}
                  strokeLinecap="round"
                />
                <AskBubble on={two(4)} x={1196} y={486} bobDelay={0.9} still={reduced} />
              </g>
              <LabelFade on={two(2)}>
                <Label x={350} y={180} size={37} color={EMER}>
                  Who&apos;s best?
                </Label>
              </LabelFade>
              <LabelFade on={two(4)}>
                <Label x={1092} y={296} size={37} color={EMER}>
                  Then what?
                </Label>
              </LabelFade>
            </motion.g>
          )}
        </AnimatePresence>

        {/* ── persistent labels (crisp - outside the rough filter) ── */}
        <LabelFade on={scene(2)}>
          <Label x={330} y={742}>
            hundreds apply
          </Label>
        </LabelFade>
        <LabelFade on={scene(5)}>
          <Label x={855} y={244}>
            message sent
          </Label>
        </LabelFade>

        </g>
      </svg>
    </div>
  );
}
