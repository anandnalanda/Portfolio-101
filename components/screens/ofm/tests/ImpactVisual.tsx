"use client";

/* Impact — closing visual for /ofm-jobs-tests, and the bookend to
   PromiseVisual. Same pen-doodle language, same cast, the story resolved:

   The queue from the first illustration is still there, still holding the
   same sheets — but now a gate stands at the FRONT, wearing the OFM mark.
   At the gate the sheet gets the green check it never had, and past it the
   familiar faces (Hero, CurlyWoman) walk on carrying proof instead of
   promises. The employer who spent the opening squinting "?" at a résumé
   is the same person here — smiling, her question answered with a check.
   Replays on scroll-in. Crisp text stays outside the rough filter. */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Chibi,
  CurlyWoman,
  Hero,
  RoughFilter,
  INK,
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
 *   250ms   the gate springs up, wearing the OFM mark
 *   600ms   the queue pops in on the left — same sheets as ever
 *  1250ms   at the gate, the sheet gets its green check stamped
 *  1750ms   the proven pair pops in past the gate, badges in hand
 *  2350ms   the employer pops in, beaming this time
 *  2650ms   her check-bubble springs open (the "?" answered) + bobs
 *  3000ms   the flow arrow draws under it all
 *  3250ms   labels fade up
 * ───────────────────────────────────────────────────────── */
const T = {
  ground: 0,
  gate: 250,
  queue: 600,
  stamp: 1250,
  pair: 1750,
  reader: 2350,
  bubble: 2650,
  arrow: 3000,
  label: 3250,
};

const POP = {
  gate: { type: "spring" as const, stiffness: 340, damping: 24 },
  chibi: { type: "spring" as const, stiffness: 480, damping: 24 },
  stamp: { type: "spring" as const, stiffness: 440, damping: 15 },
  bubble: { type: "spring" as const, stiffness: 480, damping: 17 },
  queueStagger: 0.09,
  pairStagger: 0.18,
};

const GROUND = { d: "M120 762 L1320 762", draw: 0.6 };

/* The queue, waiting left of the gate — the PromiseVisual crowd, same
   colors, still holding the same little sheets. */
const QUEUE: { x: number; y: number; s: number; color: string; o: number }[] = [
  { x: 180, y: 700, s: 1.3, color: "#8FC6A6", o: 0.5 },
  { x: 262, y: 696, s: 1.35, color: "#7CA9D0", o: 0.6 },
  { x: 346, y: 700, s: 1.4, color: "#CBB86E", o: 0.75 },
  { x: 434, y: 698, s: 1.5, color: "#AFD3A0", o: 0.9 },
];

/* The gate: posts, beam, and the OFM mark. */
const GATE = {
  left: 610,
  right: 800,
  top: 470,
  postW: 16,
};

/* The candidate at the gate, sheet raised, getting the stamp. */
const AT_GATE = { x: 705, y: 706, s: 1.55, color: "#63B98A" };

/* The proven pair past the gate — familiar faces, badges in hand. */
const PAIR = [
  { x: 950, y: 700, s: 2.0, who: "hero" as const },
  { x: 1065, y: 702, s: 2.0, who: "curly" as const },
];

/* The employer — the PromiseVisual skeptic, now smiling. */
const READER = { x: 1240, y: 678, s: 2.4 };
const BUBBLE = { x: 1322, y: 548, s: 4.4 };
const BUBBLE_BOB = { y: [0, -7, 0], duration: 2.1 };

/* ── small pieces (same idiom as PromiseVisual) ── */

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

/* A crisp stat callout — the OutcomeVisual idiom, sized for this canvas. */
function Stat({
  x,
  y,
  big,
  lines,
}: {
  x: number;
  y: number;
  big: string;
  lines: string[];
}) {
  return (
    <g transform={`translate(${x} ${y})`} textAnchor="middle">
      <text
        x={0}
        y={0}
        fontSize={86}
        fontWeight={800}
        fill={EMER}
        style={{ fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "-0.02em" }}
      >
        {big}
      </text>
      {lines.map((l, i) => (
        <text
          key={i}
          x={0}
          y={56 + i * 36}
          fontSize={27}
          fontStyle="italic"
          fill={INK}
          opacity={0.72}
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {l}
        </text>
      ))}
    </g>
  );
}

/* The little résumé the queue still holds — same as PromiseVisual's. */
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

/* The green proof badge the proven carry instead of the sheet. */
function ProofBadge({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r="11" fill={EMER} stroke={INK} strokeWidth="2" />
      <path
        d="M -4.6 0.2 l 3.2 3.4 6 -7"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

/* The employer from PromiseVisual — same navy, same hair, but the squint
   and the flat mouth resolved into an easy smile. */
function HappyReader({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
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
        {/* soft brows, eyes open */}
        <path d="M -8.4 -13 q 2.6 -2.6 5 0" />
        <path d="M 3.4 -13 q 2.6 -2.6 5 0" />
        <path d="M -6.8 -7.4 q 2 -2.2 4 0" strokeWidth={2.2} />
        <path d="M 3 -7.4 q 2 -2.2 4 0" strokeWidth={2.2} />
      </g>
      {/* the open smile the skeptic never had */}
      <path d="M -4.6 0 Q 0 6 4.6 0 Q 0 1.8 -4.6 0 Z" fill="#fff" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
    </g>
  );
}

/* Her bubble — the "?" of the opening, answered. */
function CheckBubble({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M -11 -8 Q -11 -17 0 -17 Q 12 -17 12 -8 Q 12 0 1 0 L -4 6 L -4 0 Q -11 -1 -11 -8 Z"
        fill="#fff"
        stroke={INK}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <path
        d="M -4.4 -8.4 l 3 3.2 5.6 -6.4"
        fill="none"
        stroke={EMER}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

/* ── the visual ──────────────────────────────────────────── */

export default function ImpactVisual() {
  const reduced = useReducedMotion() ?? false;
  const [stage, setStage] = useState(0);

  useEffect(() => {
    setStage(0);
    if (reduced) {
      setStage(99);
      return;
    }
    const timers = Object.values(T).map((t, i) =>
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
        aria-label="The résumé queue from the opening waits at an OFM gate; at the gate each sheet is stamped with a green check, and past it candidates carry proof badges toward the employer, the same one who squinted at claims earlier, now smiling under a check-mark bubble. The filter moved to the front."
      >
        <defs>
          <RoughFilter id="ofm-impact-rough" baseFrequency={0.013} scale={5} seed={7} />
        </defs>

        {/* ── the scene (rough / hand-drawn) ── */}
        <g filter="url(#ofm-impact-rough)">
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

          {/* the gate, at the front of the line */}
          <PopIn on={on(2)} ax={705} ay={762} spring={POP.gate}>
            {/* posts */}
            <rect x={GATE.left} y={GATE.top} width={GATE.postW} height={762 - GATE.top} rx={7} fill="#fff" stroke={INK} strokeWidth="3" />
            <rect x={GATE.right - GATE.postW} y={GATE.top} width={GATE.postW} height={762 - GATE.top} rx={7} fill="#fff" stroke={INK} strokeWidth="3" />
            {/* beam */}
            <rect x={GATE.left - 22} y={GATE.top - 34} width={GATE.right - GATE.left + 44} height={40} rx={12} fill={PAPER_TINT} stroke={INK} strokeWidth="3" />
            {/* the OFM pill on the beam (text crisp, below) */}
            <rect x={671} y={GATE.top - 27} width={68} height={26} rx={13} fill={EMER} stroke={INK} strokeWidth="2.2" />
          </PopIn>

          {/* the queue, still holding the same sheets */}
          {QUEUE.map((c, i) => (
            <PopIn
              key={i}
              on={on(3)}
              delay={i * POP.queueStagger}
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

          {/* at the gate: the sheet, raised — and stamped */}
          <PopIn on={on(3)} delay={QUEUE.length * POP.queueStagger} ax={AT_GATE.x} ay={AT_GATE.y + 30 * AT_GATE.s} spring={POP.chibi}>
            <Chibi x={AT_GATE.x} y={AT_GATE.y} s={AT_GATE.s} color={AT_GATE.color} />
            <MiniSheet x={AT_GATE.x + 30 * AT_GATE.s} y={AT_GATE.y - 8 * AT_GATE.s} s={AT_GATE.s} />
          </PopIn>
          <PopIn on={on(4)} ax={AT_GATE.x + 30 * AT_GATE.s} ay={AT_GATE.y - 8 * AT_GATE.s} spring={POP.stamp}>
            <g transform={`rotate(-10 ${AT_GATE.x + 30 * AT_GATE.s} ${AT_GATE.y - 8 * AT_GATE.s})`}>
              <ProofBadge x={AT_GATE.x + 30 * AT_GATE.s} y={AT_GATE.y - 8 * AT_GATE.s} s={1.25} />
            </g>
          </PopIn>

          {/* past the gate: the familiar faces, proof in hand */}
          {PAIR.map((p, i) => (
            <PopIn
              key={p.who}
              on={on(5)}
              delay={i * POP.pairStagger}
              ax={p.x}
              ay={p.y + 30 * p.s}
              spring={POP.chibi}
            >
              {p.who === "hero" ? (
                <Hero x={p.x} y={p.y} s={p.s} />
              ) : (
                <CurlyWoman x={p.x} y={p.y} s={p.s} />
              )}
              <ProofBadge x={p.x + 24 * p.s} y={p.y + 6 * p.s} s={1.15} />
            </PopIn>
          ))}

          {/* the employer — smiling this time */}
          <PopIn on={on(6)} ax={READER.x} ay={760} spring={POP.chibi}>
            <HappyReader x={READER.x} y={READER.y} s={READER.s} />
          </PopIn>

          {/* her bubble: the "?" answered */}
          <Anchored
            ax={BUBBLE.x - 14}
            ay={BUBBLE.y + 20}
            initial={false}
            animate={{ scale: on(7) ? 1 : 0, opacity: on(7) ? 1 : 0 }}
            transition={
              on(7) ? { ...POP.bubble, opacity: { duration: 0.15 } } : { duration: 0 }
            }
          >
            <motion.g
              animate={reduced ? undefined : { y: BUBBLE_BOB.y }}
              transition={{
                duration: BUBBLE_BOB.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <CheckBubble x={BUBBLE.x} y={BUBBLE.y} s={BUBBLE.s} />
            </motion.g>
          </Anchored>

          {/* the flow, front to finish */}
          <DrawPath
            on={on(8)}
            d="M 240 812 H 1200"
            duration={0.7}
            fill="none"
            stroke={EMER}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeDasharray="2 12"
          />
          <PopIn on={on(8)} ax={1210} ay={812} spring={POP.stamp}>
            <path d="M 1202 804 l 12 8 -12 8" fill="none" stroke={EMER} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </PopIn>

          {/* warm underlines beneath the stat numbers */}
          <DrawPath
            on={on(9)}
            d="M 518 206 q 100 12 200 5 t 200 -5"
            duration={0.5}
            fill="none"
            stroke="#f4c86a"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </g>

        {/* ── crisp layer (outside the rough filter) ── */}
        {/* OFM, on the gate */}
        <motion.text
          x={705}
          y={GATE.top - 8}
          textAnchor="middle"
          fontSize={17}
          fontWeight={800}
          fill="#fff"
          style={{ fontFamily: "Georgia, serif", letterSpacing: "0.05em" }}
          initial={false}
          animate={{ opacity: on(2) ? 1 : 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
        >
          OFM
        </motion.text>

        <LabelFade on={on(9)}>
          <Label x={330} y={600}>
            the same queue
          </Label>
        </LabelFade>

        {/* the numbers, mapped to the scene */}
        <LabelFade on={on(9)}>
          <Stat
            x={720}
            y={176}
            big="142 → 38"
            lines={["the stack became a pool,", "every one verified"]}
          />
        </LabelFade>

        <LabelFade on={on(9)}>
          <Label x={705} y={392} color={EMER}>
            the filter, now at the front
          </Label>
        </LabelFade>

        <LabelFade on={on(9)}>
          <Label x={1176} y={420} size={34} color={EMER}>
            every interview,
          </Label>
          <Label x={1176} y={460} size={34} color={EMER}>
            already proven
          </Label>
        </LabelFade>
      </svg>
    </div>
  );
}
