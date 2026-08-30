"use client";

/* Story-beat illustration - "You found out too late."

   The sequel to the promise beat, same pen-doodle world: the only place to
   check a skill was the interview - the most expensive filter in the funnel.
   A centred, detailed video call builds once and then holds; on top of it the
   failure replays on a seamless loop - the same coral-shirt candidate from the
   promise beat beams, then is caught out (his "22 WPM" exposed, his "Fast
   typist" claim struck through), then his connection drops, then it resets and
   plays again. The scene itself never disappears. */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  RoughFilter,
  SmilingMan,
  Hero,
  INK,
} from "@/components/screens/ofm/chibi";

const EMER = "#0B7A4E";
const RED = "#C0492F";
const PAPER_TINT = "#E7F3EA";

const POP = {
  window: { type: "spring" as const, stiffness: 320, damping: 24 },
  chibi: { type: "spring" as const, stiffness: 460, damping: 22 },
};
const EASE = [0.22, 1, 0.36, 1] as const;

const GROUND = { d: "M150 740 L1290 740", draw: 0.6 };

/* ── the video call window (centred) ───────────────────────── */
const WIN = { x: 386, y: 244, w: 668, h: 372, r: 20, bar: 42 };
const DIVIDE = WIN.x + WIN.w / 2; // 720 — the canvas centre
const PANE_L = { cx: WIN.x + WIN.w * 0.27, faceY: WIN.y + 214 };
const PANE_R = { cx: WIN.x + WIN.w * 0.73, faceY: WIN.y + 214 };
const FACE_S = 1.95;

const WPM = { cx: DIVIDE + 76, cy: WIN.y + WIN.bar + 40 };
const CHIP = { cx: DIVIDE + 100, cy: WIN.y + WIN.h - 54, w: 146, h: 30 };
const YOUTAG = { cx: WIN.x + 74, cy: WIN.y + WIN.h - 54 };
const BARS = { x: WIN.x + WIN.w - 72, y: WIN.y + WIN.bar + 22, heights: [8, 14, 20, 26] };
const BAR = { cx: DIVIDE, cy: WIN.y + WIN.h, w: 226, h: 40 };

/* ── loop timing ───────────────────────────────────────────── */
const BUILD = [0, 300, 750, 1150, 1600]; // ground, window, chrome, faces, timer
const EVT_START = 2000; // when the failure loop begins
const EVT = { caught: 1400, dropped: 2200 }; // offsets within each loop
const LOOP_MS = 5000;

/* ── shared small pieces ───────────────────────────────────── */

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
        on ? { ...spring, delay, opacity: { duration: 0.2, delay } } : { duration: 0 }
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
      transition={on ? { duration: 0.5, ease: EASE } : { duration: 0 }}
    >
      {children}
    </motion.g>
  );
}

/* Signal-strength glyph: four bars, `live` count lit. */
function Signal({ live }: { live: number }) {
  return (
    <g>
      {BARS.heights.map((h, i) => (
        <rect
          key={i}
          x={BARS.x + i * 12}
          y={BARS.y + (26 - h)}
          width={7}
          height={h}
          rx={2}
          fill={i < live ? EMER : "none"}
          stroke={i < live ? "none" : INK}
          strokeWidth={1.5}
          opacity={i < live ? 1 : 0.3}
        />
      ))}
    </g>
  );
}

/* When the call drops: a faint frost over his video and a small flickering
   "Reconnecting…" tag folded into the signal corner. */
function Reconnect({ show, reduced }: { show: boolean; reduced: boolean }) {
  return (
    <motion.g initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: 0.3 }}>
      <rect
        x={DIVIDE}
        y={WIN.y + WIN.bar}
        width={WIN.w / 2}
        height={WIN.h - WIN.bar}
        fill="#e8efe9"
        opacity={0.32}
      />
      <g transform={`translate(${BARS.x - 84} ${BARS.y + 28})`}>
        {/* the spinner: a faint track ring + a bold 270° arc that spins */}
        <circle cx={9} cy={9} r={9} fill="none" stroke={RED} strokeWidth={2.4} opacity={0.18} />
        <motion.path
          d="M 9 0 A 9 9 0 1 1 0 9"
          fill="none"
          stroke={RED}
          strokeWidth={2.6}
          strokeLinecap="round"
          animate={reduced || !show ? undefined : { rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "9px 9px" }}
        />
        {/* the label, gently pulsing so the spin stays the main motion */}
        <motion.text
          x={26}
          y={14}
          fontSize={13}
          fontWeight={600}
          fill={RED}
          style={{ fontFamily: "Georgia, serif" }}
          initial={false}
          animate={reduced || !show ? { opacity: 1 } : { opacity: [1, 0.5, 1] }}
          transition={reduced || !show ? { duration: 0 } : { duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
        >
          Reconnecting…
        </motion.text>
      </g>
    </motion.g>
  );
}

/* Toolbar icons - little pen-doodle glyphs. */
function ToolIcon({ kind, cx, cy }: { kind: "mic" | "cam" | "share"; cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx} ${cy})`} fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={0} cy={0} r={13} stroke={INK} strokeWidth={1.6} opacity={0.5} />
      {kind === "mic" && (
        <>
          <rect x={-3.5} y={-7} width={7} height={11} rx={3.5} fill="#fff" />
          <path d="M -6 -1 q 0 6 6 6 q 6 0 6 -6" />
          <path d="M 0 5 v 3.5" />
        </>
      )}
      {kind === "cam" && (
        <>
          <rect x={-7} y={-4.5} width={10} height={9} rx={2} fill="#fff" />
          <path d="M 3 -1.5 L 8 -4.5 L 8 4.5 L 3 1.5 Z" fill="#fff" />
        </>
      )}
      {kind === "share" && (
        <>
          <rect x={-8} y={-6} width={16} height={11} rx={2} fill="#fff" />
          <path d="M 0 -1 v -4 M 0 -5 l -3 3 M 0 -5 l 3 3" />
        </>
      )}
    </g>
  );
}

/* ── the visual ──────────────────────────────────────────── */

export default function LateVisual() {
  const reduced = useReducedMotion() ?? false;
  const [built, setBuilt] = useState(0); // scaffold: 0..5, built once, never reverts
  const [evt, setEvt] = useState(0); // failure phase: 0 fresh, 1 caught, 2 dropped
  const [cycle, setCycle] = useState(0); // increments each loop (resets the timer)
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    if (reduced) {
      setBuilt(5);
      setEvt(2);
      setCycle(1);
      setShowLabel(true);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    BUILD.forEach((t, i) => timers.push(setTimeout(() => setBuilt(i + 1), t)));
    timers.push(setTimeout(() => setShowLabel(true), 3400));

    let evtTimers: ReturnType<typeof setTimeout>[] = [];
    const runEvt = () => {
      evtTimers.forEach(clearTimeout);
      setCycle((x) => x + 1);
      setEvt(0);
      evtTimers = [
        setTimeout(() => setEvt(1), EVT.caught),
        setTimeout(() => setEvt(2), EVT.dropped),
      ];
    };
    let loop: ReturnType<typeof setInterval> | undefined;
    const kick = setTimeout(() => {
      runEvt();
      loop = setInterval(runEvt, LOOP_MS);
    }, EVT_START);
    timers.push(kick);

    return () => {
      timers.forEach(clearTimeout);
      evtTimers.forEach(clearTimeout);
      if (loop) clearInterval(loop);
    };
  }, [reduced]);

  const b = (n: number) => built >= n;
  const caught = evt >= 1;
  const dropped = evt >= 2;
  const meterFrac = 0.22;

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
        aria-label="A video-call interview: the employer on one side, the candidate on the other. Live, his typing meter stalls at 22 WPM, his 'fast typist' claim strikes through, and his connection drops — the truth, found out too late in the most expensive filter in the funnel."
      >
        <defs>
          <RoughFilter id="ofm-late-rough" baseFrequency={0.013} scale={5} seed={9} />
          <clipPath id="ofm-late-win">
            <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} rx={WIN.r} />
          </clipPath>
        </defs>

        {/* enlarge + centre the whole composition (window, caption, ground) */}
        <g transform="translate(-360 -288) scale(1.5)">

        {/* ═══ the scene (rough / hand-drawn) ═══ */}
        <g filter="url(#ofm-late-rough)">
          {/* ground line the call sits on */}
          <DrawPath
            on={b(1)}
            d={GROUND.d}
            duration={GROUND.draw}
            fill="none"
            stroke={INK}
            strokeWidth="3"
            strokeDasharray="2 26"
            strokeLinecap="round"
          />

          {/* ── the call window, springing up ── */}
          <PopIn on={b(2)} ax={DIVIDE} ay={WIN.y + WIN.h} spring={POP.window}>
            <g clipPath="url(#ofm-late-win)">
              <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} fill="#F4F7F5" />
              <motion.rect
                x={DIVIDE}
                y={WIN.y}
                width={WIN.w / 2}
                height={WIN.h}
                fill={PAPER_TINT}
                initial={false}
                animate={{ opacity: b(3) ? 0.5 : 0 }}
                transition={{ duration: 0.4 }}
              />
              <motion.rect
                x={WIN.x}
                y={WIN.y}
                width={WIN.w}
                height={WIN.bar}
                fill="#FFFFFF"
                initial={false}
                animate={{ opacity: b(3) ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </g>
            <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} rx={WIN.r} fill="none" stroke={INK} strokeWidth="3.2" />
            <DrawPath on={b(3)} d={`M${WIN.x} ${WIN.y + WIN.bar} L${WIN.x + WIN.w} ${WIN.y + WIN.bar}`} duration={0.4} fill="none" stroke={INK} strokeWidth="2.4" />
            <DrawPath on={b(3)} d={`M${DIVIDE} ${WIN.y + WIN.bar} L${DIVIDE} ${WIN.y + WIN.h}`} duration={0.4} delay={0.1} fill="none" stroke={INK} strokeWidth="2.4" strokeDasharray="2 12" />
            <g fill="none" stroke={INK} strokeWidth="2">
              <circle cx={WIN.x + 20} cy={WIN.y + WIN.bar / 2} r="4.5" />
              <circle cx={WIN.x + 38} cy={WIN.y + WIN.bar / 2} r="4.5" />
              <circle cx={WIN.x + 56} cy={WIN.y + WIN.bar / 2} r="4.5" />
            </g>
          </PopIn>

          {/* the two callers, clipped into their panes */}
          <g clipPath="url(#ofm-late-win)">
            <PopIn on={b(4)} ax={PANE_L.cx} ay={WIN.y + WIN.h} spring={POP.chibi}>
              <SmilingMan x={PANE_L.cx} y={PANE_L.faceY} s={FACE_S} />
            </PopIn>
            {/* the candidate - a distinct person from the employer: denim
                shirt, glasses. Beams, then drops to frazzled when caught. */}
            <PopIn on={b(4)} ax={PANE_R.cx} ay={WIN.y + WIN.h} spring={POP.chibi}>
              <motion.g initial={false} animate={{ opacity: caught ? 0 : 1 }} transition={{ duration: 0.25 }}>
                <Hero x={PANE_R.cx} y={PANE_R.faceY} s={FACE_S} mood="happy" />
              </motion.g>
            </PopIn>
            <motion.g initial={false} animate={{ opacity: b(4) && caught ? 1 : 0 }} transition={{ duration: 0.3 }}>
              <Hero x={PANE_R.cx} y={PANE_R.faceY} s={FACE_S} mood="frazzled" />
            </motion.g>
            <Reconnect show={dropped} reduced={reduced} />
          </g>

          {/* signal bars on his pane (fall to one on the drop) */}
          <motion.g initial={false} animate={{ opacity: b(4) ? 1 : 0 }} transition={{ duration: 0.3 }}>
            <Signal live={dropped ? 1 : 4} />
          </motion.g>
        </g>

        {/* ═══ crisp layer (text stays readable) ═══ */}

        {/* window title */}
        <motion.g initial={false} animate={{ opacity: b(3) ? 1 : 0 }} transition={{ duration: 0.3 }}>
          <text x={WIN.x + 74} y={WIN.y + WIN.bar / 2 + 5} fontSize={15} fontWeight={600} fill={INK} style={{ fontFamily: "Georgia, serif" }}>
            Interview · Virtual Chatter
          </text>
        </motion.g>

        {/* REC dot + call timer */}
        <CallTimer on={b(5)} reduced={reduced} cycle={cycle} />

        {/* name tags */}
        <motion.g initial={false} animate={{ opacity: b(4) ? 1 : 0 }} transition={{ duration: 0.3 }}>
          <rect x={YOUTAG.cx - 34} y={YOUTAG.cy - 14} width={68} height={28} rx={8} fill="#FFFFFF" stroke={INK} strokeWidth="1.8" />
          <text x={YOUTAG.cx} y={YOUTAG.cy + 5} textAnchor="middle" fontSize={14} fontWeight={600} fill={INK} style={{ fontFamily: "Georgia, serif" }}>
            You
          </text>
        </motion.g>

        {/* the WPM stat card (persistent once the call is up; reddens when caught) */}
        <motion.g
          initial={false}
          animate={{ opacity: b(4) ? 1 : 0, scale: b(4) ? 1 : 0.8 }}
          transition={{ duration: 0.35, ease: EASE }}
          style={{ transformOrigin: `${WPM.cx}px ${WPM.cy}px` }}
        >
          <rect x={WPM.cx - 60} y={WPM.cy - 25} width={120} height={50} rx={11} fill="#FFFFFF" stroke={caught ? RED : INK} strokeWidth="2.4" />
          <rect x={WPM.cx - 44} y={WPM.cy + 11} width={88} height={6} rx={3} fill="#eceeec" />
          <motion.rect
            x={WPM.cx - 44}
            y={WPM.cy + 11}
            height={6}
            rx={3}
            fill={RED}
            initial={false}
            animate={
              b(4)
                ? reduced
                  ? { width: 88 * meterFrac }
                  : { width: [0, 88 * meterFrac, 88 * meterFrac * 0.88, 88 * meterFrac] }
                : { width: 0 }
            }
            transition={b(4) ? { duration: 1.4, times: [0, 0.55, 0.75, 1], repeat: Infinity, repeatDelay: 0.6 } : { duration: 0 }}
          />
          <path d={`M${WPM.cx - 42} ${WPM.cy - 11} l6 8 l6 -8`} fill="none" stroke={RED} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <text x={WPM.cx - 22} y={WPM.cy - 1} fontSize={22} fontWeight={700} fill={RED} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            22
          </text>
          <text x={WPM.cx + 8} y={WPM.cy - 1} fontSize={12} fontWeight={600} fill={INK} opacity={0.5} style={{ fontFamily: "Georgia, serif" }}>
            WPM
          </text>
        </motion.g>

        {/* his claim name-tag, struck through when caught */}
        <motion.g initial={false} animate={{ opacity: b(4) ? 1 : 0 }} transition={{ duration: 0.3 }}>
          <rect
            x={CHIP.cx - CHIP.w / 2}
            y={CHIP.cy - CHIP.h / 2}
            width={CHIP.w}
            height={CHIP.h}
            rx={CHIP.h / 2}
            fill="#FFFFFF"
            stroke={caught ? RED : INK}
            strokeWidth="2.2"
            opacity={caught ? 0.6 : 1}
          />
          <text x={CHIP.cx} y={CHIP.cy + 5} textAnchor="middle" fontSize={16} fontWeight={600} fill={caught ? RED : INK} opacity={caught ? 0.7 : 1} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Fast typist
          </text>
          <DrawPath on={caught} d={`M${CHIP.cx - CHIP.w / 2 + 8} ${CHIP.cy} L${CHIP.cx + CHIP.w / 2 - 8} ${CHIP.cy}`} duration={0.3} fill="none" stroke={RED} strokeWidth="2.6" strokeLinecap="round" />
        </motion.g>

        {/* the floating call toolbar */}
        <motion.g
          initial={false}
          animate={{ opacity: b(3) ? 1 : 0, y: b(3) ? 0 : 8 }}
          transition={{ duration: 0.35, ease: EASE, delay: 0.15 }}
        >
          <rect x={BAR.cx - BAR.w / 2} y={BAR.cy - BAR.h / 2} width={BAR.w} height={BAR.h} rx={BAR.h / 2} fill="#FFFFFF" stroke={INK} strokeWidth="2.4" />
          <ToolIcon kind="mic" cx={BAR.cx - 74} cy={BAR.cy} />
          <ToolIcon kind="cam" cx={BAR.cx - 40} cy={BAR.cy} />
          <ToolIcon kind="share" cx={BAR.cx - 6} cy={BAR.cy} />
          {/* red end-call pill */}
          <g transform={`translate(${BAR.cx + 52} ${BAR.cy})`}>
            <rect x={-30} y={-13} width={60} height={26} rx={13} fill={RED} />
            <path d="M -9 -3 q 9 -7 18 0 l 0 5 q -3 2 -5 0 q -0.5 -3 -2 -3.5 q -4 -1 -8 0 q -1.5 0.5 -2 3.5 q -2 2 -5 0 Z" fill="#fff" transform="rotate(135)" />
          </g>
        </motion.g>

        {/* ── annotation (appears once, stays) ── */}
        <LabelFade on={showLabel}>
          <Label x={DIVIDE} y={WIN.y + WIN.h + 78} size={30} color={EMER}>
            interview, the most expensive filter in the funnel
          </Label>
        </LabelFade>
        </g>
      </svg>
    </div>
  );
}

/* The call timer: mm:ss counting up while the interview runs, resetting each
   loop and capped at the thirty-minute mark so it never runs away. */
function CallTimer({ on, reduced, cycle }: { on: boolean; reduced: boolean; cycle: number }) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    if (!on) {
      setSecs(0);
      return;
    }
    if (reduced) {
      setSecs(1800);
      return;
    }
    setSecs(0);
    const iv = setInterval(() => {
      setSecs((s) => {
        if (s >= 1800) {
          clearInterval(iv);
          return 1800;
        }
        return Math.min(1800, s + 24);
      });
    }, 70);
    return () => clearInterval(iv);
  }, [on, reduced, cycle]);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  return (
    <motion.g initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: 0.3 }}>
      <g transform={`translate(${WIN.x + WIN.w - 108} ${WIN.y + WIN.bar / 2})`}>
        <circle cx={0} cy={0} r={4} fill={RED} />
        <text x={12} y={5} fontSize={16} fontWeight={700} fill={INK} style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontVariantNumeric: "tabular-nums" }}>
          {mm}:{ss}
        </text>
      </g>
    </motion.g>
  );
}
