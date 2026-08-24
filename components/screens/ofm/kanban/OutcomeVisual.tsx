"use client";

/* The Outcome — closing visual for /kanban-and-ai.

   A hand-drawn Impact illustration in the OFM pen-doodle language (the same
   rough-filter + chibi cast the Story beats use, so it bookends them). It SHOWS
   what the left column says: a contact list became a pipeline that keeps
   everyone on OFM, the best fit on top, hundreds narrowed to a shortlist. The
   three stat callouts are illustrative (made-up but believable) and map 1:1 to
   the Impact bullets. Text is kept OUTSIDE the rough filter so it stays crisp. */

import { motion, useReducedMotion } from "framer-motion";
import {
  RoughFilter,
  SmilingMan,
  INK,
  SKIN,
  WARM,
} from "@/components/screens/ofm/chibi";

const EMER = "#0B7A4E";
const CREAM = "#faf7f1";
const TINT = "#e9f2ec";
const EASE = [0.22, 1, 0.36, 1] as const;

/* a tiny candidate card inside a column */
function MiniCard({
  x,
  y,
  accent,
  star,
  check,
}: {
  x: number;
  y: number;
  accent?: string;
  star?: boolean;
  check?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        width={128}
        height={34}
        rx={9}
        fill="#fff"
        stroke={INK}
        strokeWidth={2}
      />
      {/* avatar */}
      <circle cx={19} cy={17} r={9.5} fill={accent ?? SKIN} stroke={INK} strokeWidth={1.8} />
      <g fill="none" stroke={INK} strokeWidth={1.4} strokeLinecap="round">
        <path d="M 15.5 15 q 1.4 -1.4 2.6 0" />
        <path d="M 19.5 15 q 1.4 -1.4 2.6 0" />
      </g>
      {/* text lines */}
      <rect x={36} y={11} width={54} height={4} rx={2} fill={INK} opacity={0.75} />
      <rect x={36} y={20} width={38} height={3.4} rx={1.7} fill={INK} opacity={0.32} />
      {star && (
        <path
          d="M 110 10 l 2.4 4.9 5.4 0.8 -3.9 3.8 0.9 5.4 -4.8 -2.5 -4.8 2.5 0.9 -5.4 -3.9 -3.8 5.4 -0.8 Z"
          fill={WARM}
          stroke={INK}
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
      )}
      {check && (
        <g transform="translate(108 8)">
          <circle cx={9} cy={9} r={10} fill={EMER} stroke={INK} strokeWidth={1.6} />
          <path d="M 4.5 9.2 l 3 3 5 -6" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </g>
  );
}

function Column({
  x,
  label,
  children,
}: {
  x: number;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x={0} y={248} width={146} height={204} rx={12} fill={TINT} stroke={INK} strokeWidth={2} />
      {/* header */}
      <circle cx={16} cy={266} r={4.5} fill={EMER} />
      <rect x={28} y={263} width={52} height={5} rx={2.5} fill={INK} opacity={0.6} />
      {children}
    </g>
  );
}

/* a crisp stat callout (outside the rough filter) */
function Stat({
  x,
  y,
  big,
  lines,
  align = "start",
}: {
  x: number;
  y: number;
  big: string;
  lines: string[];
  align?: "start" | "middle";
}) {
  return (
    <g transform={`translate(${x} ${y})`} textAnchor={align}>
      <text
        x={0}
        y={0}
        fontSize={54}
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
          y={26 + i * 20}
          fontSize={15.5}
          fontWeight={500}
          fill={INK}
          opacity={0.72}
          style={{ fontFamily: "Georgia, serif" }}
        >
          {l}
        </text>
      ))}
    </g>
  );
}

export default function OutcomeVisual() {
  const reduce = useReducedMotion();
  const pop = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, scale: 0.6 },
          animate: { opacity: 1, scale: 1 },
          transition: { type: "spring" as const, stiffness: 260, damping: 16, delay },
        };

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden" style={{ background: CREAM }}>
      <motion.svg
        /* viewBox framed on the artwork's true center (content spans x≈92..902)
           with even left/right breathing room; ratio ~1.6 to match the panel */
        viewBox="60 14 874 546"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        /* transform-only entrance: the scene is always visible even if the
           animation never runs (no opacity gate that could strand it blank) */
        initial={reduce ? undefined : { y: 16 }}
        animate={reduce ? undefined : { y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <defs>
          <RoughFilter id="rf-impact" baseFrequency={0.015} scale={2.6} seed={7} />
        </defs>

        {/* ── the hand-drawn scene ── */}
        <g filter="url(#rf-impact)">
          {/* platform boundary that keeps everyone on OFM */}
          <rect x={252} y={214} width={520} height={252} rx={26} fill="#fff" stroke={INK} strokeWidth={2.6} />
          {/* OFM tab */}
          <rect x={276} y={200} width={70} height={28} rx={14} fill={EMER} stroke={INK} strokeWidth={2} />

          {/* columns */}
          <Column x={278} label="Applied">
            <MiniCard x={288 - 278 + 8} y={286} star accent="#f2c6d5" />
            <MiniCard x={18} y={330} accent="#cfe0f4" />
            <MiniCard x={18} y={374} accent={SKIN} />
          </Column>
          <Column x={447} label="Interview">
            <MiniCard x={18} y={286} accent="#d9d1ef" />
            <MiniCard x={18} y={330} accent={SKIN} />
          </Column>
          <Column x={616} label="Hired">
            <MiniCard x={18} y={286} check accent="#c9e6d5" />
          </Column>

          {/* flow arrow along the bottom */}
          <path
            d="M 300 486 H 690"
            fill="none"
            stroke={EMER}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeDasharray="2 9"
          />
          <path d="M 686 480 l 10 6 -10 6" fill="none" stroke={EMER} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />

          {/* the happy employer */}
          <SmilingMan x={832} y={392} s={2.4} />

          {/* underlines under the stats */}
          <path d="M 792 132 q 46 8 96 0" fill="none" stroke={WARM} strokeWidth={4} strokeLinecap="round" />
          <path d="M 96 168 q 60 8 132 0" fill="none" stroke={WARM} strokeWidth={4} strokeLinecap="round" />

          {/* mini funnel of dots for the 200 → 12 stat */}
          <g fill={EMER} opacity={0.5}>
            {[
              [120, 210], [140, 208], [160, 210], [180, 208], [200, 210],
              [134, 226], [156, 224], [178, 226],
              [150, 242], [168, 240],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={4.4} />
            ))}
          </g>
          <path d="M 214 216 l 20 8 -20 8" fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
          <rect x={240} y={214} width={40} height={20} rx={5} fill="#fff" stroke={INK} strokeWidth={2} />
        </g>

        {/* OFM tab label (crisp) */}
        <text x={311} y={219} textAnchor="middle" fontSize={14} fontWeight={800} fill="#fff" style={{ fontFamily: "Georgia, serif", letterSpacing: "0.04em" }}>
          OFM
        </text>

        {/* ── crisp stat callouts ── */}
        <motion.g {...pop(0.35)}>
          <Stat x={790} y={118} big="92%" lines={["of hiring now", "happens on OFM"]} />
        </motion.g>
        <motion.g {...pop(0.5)}>
          <Stat x={96} y={156} big="200 → 12" lines={["hundreds become a", "ranked shortlist"]} />
        </motion.g>
      </motion.svg>
    </div>
  );
}
