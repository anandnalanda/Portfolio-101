"use client";

/**
 * OutcomeVisual — the closing beats of the Staple Tables case study, drawn in
 * the same naive pen-doodle language as the Story/Research/Principles beats so
 * the case study bookends in one visual voice.
 *
 *   results + business → ONE wide "impact" scene that reads left→right: the
 *     reviewer's desk (faster, accurate, a chore become a glance) flows into the
 *     business outcomes (3x throughput, fewer tickets, a happier team). Shown for
 *     both beats while the left-hand copy changes.
 *   testimonials → two delighted people with speech bubbles and stars.
 *
 * Coded SVG under a rough displacement filter (hand-drawn line), crisp text kept
 * outside the filter. Rendered at a fixed 900-wide design, scaled to the sticky
 * panel via ScaledCanvas.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Inter, Spectral } from "next/font/google";
import { CurlyWoman, Hero, RoughFilter, SmilingMan, INK, PINK, TEAL, TEAL_SOFT, WARM } from "../staple-chat/chibi";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const spectralItalic = Spectral({ subsets: ["latin"], weight: "400", style: "italic", display: "swap" });

const GREEN = "#3a9e6e";
const MUTE = "#6b7b80";
const PAPER = "#fbfaf8";
const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------ primitives ------------------------------ */

function Check({ s = 1, fill = GREEN }: { s?: number; fill?: string }) {
  return (
    <g transform={`scale(${s})`}>
      <circle r={9} fill={fill} stroke={INK} strokeWidth={2} />
      <path d="M -4 0 l 3 3.4 l 5.5 -6.6" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function DocCard({ accent = TEAL, check = false }: { accent?: string; check?: boolean }) {
  return (
    <g>
      <rect x={-21} y={-27} width={42} height={54} rx={4} fill="#fff" stroke={INK} strokeWidth={2.2} />
      <rect x={-21} y={-27} width={42} height={10} rx={4} fill={accent} />
      <rect x={-21} y={-21} width={42} height={4} fill={accent} />
      <g stroke={INK} strokeWidth={1.1} strokeLinecap="round" opacity={0.4}>
        <path d="M -14 -6 h 28" />
        <path d="M -14 1 h 28" />
        <path d="M -14 8 h 18" />
        <path d="M -14 15 h 24" />
      </g>
      {check && (
        <g transform="translate(13 18)">
          <Check s={0.72} />
        </g>
      )}
    </g>
  );
}

function Star({ s = 1, fill = WARM }: { s?: number; fill?: string }) {
  return (
    <polygon
      transform={`scale(${s})`}
      points="0,-10 2.9,-3.1 10.5,-3.1 4.3,1.6 6.7,9 0,4.5 -6.7,9 -4.3,1.6 -10.5,-3.1 -2.9,-3.1"
      fill={fill}
      stroke={INK}
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
  );
}

function Stopwatch({ s = 1 }: { s?: number }) {
  return (
    <g transform={`scale(${s})`}>
      <rect x={-5} y={-33} width={10} height={7} rx={2} fill={WARM} stroke={INK} strokeWidth={2} />
      <path d="M -12 -28 l 6 5 M 12 -28 l -6 5" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <circle r={23} fill="#fff" stroke={INK} strokeWidth={2.6} />
      <circle r={23} fill="none" stroke={TEAL_SOFT} strokeWidth={4} strokeDasharray="12 130" strokeLinecap="round" transform="rotate(-90)" />
      <path d="M 0 0 L 0 -15" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
      <path d="M 0 0 L 10 6" stroke={TEAL} strokeWidth={2.2} strokeLinecap="round" />
      <circle r={2.4} fill={INK} />
    </g>
  );
}

function Callout({ x, y, big, small, color = INK }: { x: number; y: number; big: string; small: string; color?: string }) {
  return (
    <g className={inter.className}>
      <text x={x} y={y} textAnchor="middle" fontSize={20} fontWeight={800} fill={color}>{big}</text>
      <text x={x} y={y + 18} textAnchor="middle" fontSize={12} fontWeight={600} fill={MUTE}>{small}</text>
    </g>
  );
}

/* -------------------------------- shell --------------------------------- */

function Scene({ id, label, caption, children }: { id: string; label: string; caption: string; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 900 650" className="h-full w-full" role="img" aria-label={caption}>
      <defs>
        <RoughFilter id={`ov-${id}`} baseFrequency={0.015} scale={2.6} />
      </defs>
      <text x={450} y={80} textAnchor="middle" fontSize={13} fontWeight={700} letterSpacing="3" fill={MUTE} className={inter.className}>
        {label.toUpperCase()}
      </text>
      <g filter={`url(#ov-${id})`}>{children}</g>
      <motion.text
        x={450}
        y={604}
        textAnchor="middle"
        fontSize={22}
        className={spectralItalic.className}
        fontStyle="italic"
        fill="#4b5b60"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 1 }}
      >
        {caption}
      </motion.text>
    </svg>
  );
}

/* ------------------------- testimonial doodles -------------------------- */

function wavyPath(x: number, y: number, len: number) {
  const seg = 12;
  const n = Math.max(1, Math.floor(len / seg));
  let d = `M ${x} ${y}`;
  for (let i = 0; i < n; i++) d += ` q ${seg / 2} ${i % 2 ? 3 : -3} ${seg} 0`;
  return d;
}

function Heart({ s = 1, fill = PINK }: { s?: number; fill?: string }) {
  return <path transform={`scale(${s})`} d="M 0 5 C -9 -6, -18 4, 0 15 C 18 4, 9 -6, 0 5 Z" fill={fill} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />;
}

function Sparkle({ s = 1, color = WARM }: { s?: number; color?: string }) {
  return (
    <path
      transform={`scale(${s})`}
      d="M 0 -8 C 1 -2, 2 -1, 8 0 C 2 1, 1 2, 0 8 C -1 2, -2 1, -8 0 C -2 -1, -1 -2, 0 -8 Z"
      fill={color}
      stroke={INK}
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
  );
}

/** A little testimonial message box: squiggle "text" + a sentiment mark. */
function MessageBox({ w = 150, h = 76, lines = 3, tailX, accent = "none" }: { w?: number; h?: number; lines?: number; tailX?: number; accent?: "none" | "stars" | "heart" }) {
  const bx = -w / 2;
  const by = -h / 2;
  const textLines = accent === "stars" ? Math.min(lines, 2) : lines;
  return (
    <g>
      <rect x={bx} y={by} width={w} height={h} rx={16} fill="#fff" stroke={INK} strokeWidth={2.4} />
      {tailX != null && <path d={`M ${tailX - 8} ${h / 2 - 3} l -3 20 l 17 -16 Z`} fill="#fff" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />}
      <g stroke={INK} strokeWidth={1.7} fill="none" strokeLinecap="round" opacity={0.5}>
        {Array.from({ length: textLines }).map((_, i) => (
          <path key={i} d={wavyPath(bx + 15, by + 20 + i * 15, w - 44 - (i === textLines - 1 ? 26 : 0))} />
        ))}
      </g>
      {accent === "stars" && (
        <g transform={`translate(${bx + 20} ${h / 2 - 15})`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} transform={`translate(${i * 16} 0)`}>
              <Star s={0.62} />
            </g>
          ))}
        </g>
      )}
      {accent === "heart" && (
        <g transform={`translate(${w / 2 - 20} ${h / 2 - 16})`}>
          <Heart s={0.75} />
        </g>
      )}
    </g>
  );
}

/* -------------------------------- impact -------------------------------- */

/** Results + business, one wide scene: the reviewer's desk on the left flows
    into the business outcomes on the right. */
function Impact() {
  const reduce = useReducedMotion();
  const BASE = 468;
  const pop = (d: number) => (reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 250, damping: 18, delay: d });
  return (
    <Scene id="impact" label="The impact" caption="the review got faster, and the whole business felt it">
      {/* a light current sweeping the desk's win rightward into the business */}
      <path d="M 300 430 C 430 470, 560 300, 820 300" fill="none" stroke={TEAL} strokeWidth={2.2} strokeDasharray="2 10" strokeLinecap="round" opacity={0.35} />

      {/* ---- LEFT: the reviewer, relaxed (chore -> glance) ---- */}
      <motion.g initial={reduce ? false : { opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={pop(0.3)} style={{ transformOrigin: "150px 195px" }}>
        <g transform="translate(150 195)"><Stopwatch s={1.15} /></g>
      </motion.g>
      <motion.g initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={pop(0.1)}>
        <g transform="translate(210 400) scale(2.35)"><Hero x={0} y={0} mood="happy" /></g>
        <g transform="translate(210 466)">
          <rect x={-44} y={-28} width={88} height={54} rx={6} fill="#fff" stroke={INK} strokeWidth={2.6} />
          <rect x={-38} y={-22} width={76} height={42} rx={3} fill={PAPER} stroke={INK} strokeWidth={1.6} />
          <path d="M -55 26 h 110 l -8 8 h -94 Z" fill="#fff" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
          <g transform="translate(0 -1)"><Check s={1.05} /></g>
        </g>
      </motion.g>

      {/* ---- CENTER: varied documents rising, each already checked ---- */}
      {[
        { x: 360, y: 356, r: -8, accent: TEAL, d: 0.5 },
        { x: 442, y: 306, r: 3, accent: WARM, d: 0.62 },
        { x: 524, y: 264, r: 11, accent: PINK, d: 0.74 },
      ].map((c, i) => (
        <motion.g key={i} initial={reduce ? false : { opacity: 0, x: -18, y: 14 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 20, delay: c.d }}>
          <g transform={`translate(${c.x} ${c.y}) rotate(${c.r}) scale(1.08)`}><DocCard accent={c.accent} check /></g>
        </motion.g>
      ))}

      {/* ---- CENTER-RIGHT: 3x faster, before/after bars ---- */}
      <line x1={575} y1={BASE} x2={715} y2={BASE} stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      <motion.rect x={592} width={44} rx={5} fill="#d8dede" stroke={INK} strokeWidth={2.4}
        initial={reduce ? false : { height: 0, y: BASE }} animate={{ height: 138, y: BASE - 138 }} transition={reduce ? { duration: 0 } : { duration: 0.7, delay: 0.55, ease: EASE }} />
      <motion.rect x={654} width={44} rx={5} fill={TEAL} stroke={INK} strokeWidth={2.4}
        initial={reduce ? false : { height: 0, y: BASE }} animate={{ height: 46, y: BASE - 46 }} transition={reduce ? { duration: 0 } : { duration: 0.7, delay: 0.72, ease: EASE }} />
      <text x={614} y={BASE + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill={MUTE} className={inter.className}>Before</text>
      <text x={676} y={BASE + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK} className={inter.className}>After</text>

      {/* ---- RIGHT: the business — a cheering teammate + shrinking tickets ---- */}
      <motion.g initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={pop(0.5)}>
        <g transform="translate(800 420) scale(2.15)"><SmilingMan x={0} y={0} /></g>
      </motion.g>
      <motion.g initial={reduce ? false : { opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.9 }}>
        {[0, 1].map((i) => (
          <g key={i} transform={`translate(${792 + i * 3} ${218 + i * 9}) rotate(${i ? -5 : 4})`}>
            <rect x={-30} y={-16} width={60} height={30} rx={5} fill="#fff" stroke={INK} strokeWidth={2.2} />
            <g stroke={INK} strokeWidth={1.2} strokeLinecap="round" opacity={0.4}><path d="M -22 -6 h 30" /><path d="M -22 2 h 22" /></g>
          </g>
        ))}
        <path d="M 822 254 q 8 22 -12 34" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        <path d="M 806 288 l 7 -2 l -1 8 Z" fill={INK} />
      </motion.g>

      {/* ---- hand-drawn flourishes ---- */}
      <motion.g initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={reduce ? { duration: 0 } : { duration: 0.6, delay: 1 }}>
        <g transform="translate(470 226)"><Sparkle s={1.1} /></g>
        <g transform="translate(578 344)"><Sparkle s={0.85} color={PINK} /></g>
        <g transform="translate(300 268)"><Sparkle s={0.9} color={TEAL} /></g>
        <g transform="translate(872 356)"><Heart s={0.85} fill={PINK} /></g>
        <g transform="translate(126 356)"><Heart s={0.7} fill={WARM} /></g>
        {/* an up-tick celebrating the shorter "After" bar */}
        <path d="M 716 430 l 0 -30 m -8 10 l 8 -10 l 8 10" fill="none" stroke={GREEN} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        {/* little motion streaks by the desk */}
        <g stroke={INK} strokeWidth={2} strokeLinecap="round" opacity={0.28}>
          <path d="M 92 402 h 26" />
          <path d="M 84 426 h 20" />
        </g>
      </motion.g>

      {/* ---- crisp callouts ---- */}
      <Callout x={150} y={252} big="50% less time" small="correcting errors" />
      <Callout x={442} y={368} big="+40%" small="accuracy" color={GREEN} />
      <Callout x={645} y={300} big="3×" small="faster" />
      <Callout x={730} y={214} big="−73%" small="IT tickets" />
    </Scene>
  );
}

/* ---------------------------- testimonials ------------------------------ */

function Testimonials() {
  const reduce = useReducedMotion();
  const rise = (d: number) => (reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 240, damping: 18, delay: d });
  const boxes: { x: number; y: number; w: number; h: number; lines: number; tailX: number; accent: "none" | "stars" | "heart"; d: number }[] = [
    { x: 178, y: 168, w: 158, h: 84, lines: 3, tailX: 34, accent: "stars", d: 0.35 },
    { x: 462, y: 128, w: 176, h: 70, lines: 2, tailX: -6, accent: "heart", d: 0.5 },
    { x: 728, y: 182, w: 150, h: 86, lines: 3, tailX: -28, accent: "none", d: 0.65 },
    { x: 300, y: 300, w: 112, h: 50, lines: 2, tailX: 22, accent: "stars", d: 0.78 },
    { x: 606, y: 306, w: 118, h: 52, lines: 2, tailX: -22, accent: "heart", d: 0.9 },
  ];
  const doodles: { x: number; y: number; kind: "heart" | "spark" | "star"; s: number; c?: string }[] = [
    { x: 118, y: 300, kind: "heart", s: 1.1 },
    { x: 826, y: 322, kind: "heart", s: 0.9, c: WARM },
    { x: 402, y: 246, kind: "spark", s: 1.15 },
    { x: 566, y: 214, kind: "spark", s: 0.9, c: PINK },
    { x: 150, y: 428, kind: "spark", s: 0.8 },
    { x: 786, y: 128, kind: "star", s: 0.9 },
    { x: 356, y: 392, kind: "star", s: 0.7, c: PINK },
    { x: 664, y: 400, kind: "spark", s: 0.85, c: TEAL },
  ];
  return (
    <Scene id="testimonials" label="In their words" caption="the teams felt it first">
      {/* message boxes flying in over the team */}
      {boxes.map((b, i) => (
        <motion.g key={i} initial={reduce ? false : { opacity: 0, scale: 0.7, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={rise(b.d)} style={{ transformOrigin: `${b.x}px ${b.y}px` }}>
          <g transform={`translate(${b.x} ${b.y})`}>
            <MessageBox w={b.w} h={b.h} lines={b.lines} tailX={b.tailX} accent={b.accent} />
          </g>
        </motion.g>
      ))}

      {/* three delighted people */}
      <motion.g initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={rise(0.15)}>
        <g transform="translate(250 476) scale(2.4)"><CurlyWoman x={0} y={0} /></g>
      </motion.g>
      <motion.g initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={rise(0.28)}>
        <g transform="translate(462 486) scale(2.4)"><Hero x={0} y={0} mood="happy" /></g>
      </motion.g>
      <motion.g initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={rise(0.4)}>
        <g transform="translate(674 476) scale(2.4)"><SmilingMan x={0} y={0} /></g>
      </motion.g>

      {/* scattered hand-drawn love */}
      <motion.g initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={reduce ? { duration: 0 } : { duration: 0.6, delay: 1 }}>
        {doodles.map((d, i) => (
          <g key={i} transform={`translate(${d.x} ${d.y})`}>
            {d.kind === "heart" ? <Heart s={d.s} fill={d.c ?? PINK} /> : d.kind === "spark" ? <Sparkle s={d.s} color={d.c ?? WARM} /> : <Star s={d.s} fill={d.c ?? WARM} />}
          </g>
        ))}
      </motion.g>
    </Scene>
  );
}

/* -------------------------------- root ---------------------------------- */

export default function OutcomeVisual({ beat }: { beat: string }) {
  const isImpact = beat === "results";
  return (
    <div
      className={`${inter.className} relative flex h-full w-full items-center justify-center overflow-hidden`}
      style={{
        background: PAPER,
        backgroundImage: "radial-gradient(circle, rgba(18,51,59,0.06) 1.1px, transparent 1.2px)",
        backgroundSize: "26px 26px",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isImpact ? "impact" : beat}
          className="relative h-full w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {isImpact && <Impact />}
          {beat === "testimonials" && <Testimonials />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
