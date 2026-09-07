"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

/**
 * Experiments with AI — a stack of app frames pushed past the card's right
 * edge so the card clips them (the "not fully disclosed" beat).
 *
 * Each frame has two designs, not one design at two opacities.
 *
 * At rest it is a white card with a hairline edge, its artwork drawn as light
 * line-work and its title in a quiet grey — the same language as the bento
 * cards around it, so it belongs to the page instead of competing with it.
 * What you read at rest is EDGES and the stagger, not fills. On hover the
 * frame fills: the ground floods to colour, the ink goes to its full tone,
 * the shadow lifts. A crisp light drawing reads as deliberate; a washed-out
 * colour card reads as something being hidden — that is the whole difference.
 *
 * Title-first is what makes the slid-open state readable — the sliver on show
 * is the top of each card, so the name has to live there.
 *
 * Hover slides the deck open like cigarettes out of a case: the front frame is
 * the case face and barely moves, the three behind it rise straight up the
 * card's long axis by increasing amounts, no rotation and no sideways drift.
 * The lateral stagger (stepX) is fixed in both states, the way sticks sit in
 * fixed lanes and only travel lengthwise. Colour bleeds back in as they slide.
 *
 * The feel comes from the RATIO, not the distance — 5px slivers packed at rest
 * opening to 28px is a 5.6x expansion, which reads far bigger than the 114px
 * of travel it actually is. Widening the rest step kills the effect.
 *
 * The grounds are picked so their greyscale luminances stay far apart — get
 * that wrong and two cards look identical at rest.
 *
 * Edit EXPERIMENTS to change what's shown. Order is back → front; put the
 * most visual project last so it's the one seen at rest. Every number that
 * positions the stack lives in STACK below and can be driven live from
 * /playground/experiments-stack — tune there, paste back here.
 */
type Experiment = {
  name: string;
  href: string;
  /** the whole card is this colour */
  ground: string;
  /** artwork and title are drawn in this one colour once filled */
  ink: string;
  status: "shipped" | "in-progress";
  art: ReactNode;
};

/* ---- artwork ------------------------------------------------------------ */

/* deterministic pseudo-random in [0,1) — Math.random would desync SSR */
function rand(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/* True while the deck is open and motion is allowed. The CSS patterns read
   this through the inherited --exp-play property; the wave needs it in JS. */
const DeckLive = createContext(false);

/* CSS custom properties aren't in React's CSSProperties */
type Vars = CSSProperties & Record<`--${string}`, string | number>;

/* Negative delays start every element mid-cycle, so nothing pops when the
   deck opens and the animations resume. */
const anim = (name: string, dur: number, delay: number, vars: Vars): Vars => ({
  animationName: name,
  animationDuration: `${dur}s`,
  animationDelay: `${-delay}s`,
  ...vars,
});

/** Gold Price Calculator — a comb of price ticks hanging from the top, ragged below */
function TickArt() {
  const n = 46;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
      {Array.from({ length: n }, (_, i) => {
        const t = i / (n - 1);
        const env = 0.58 + 0.42 * Math.sin(t * Math.PI * 1.1);
        const len = (24 + 74 * rand(i * 3.7)) * env;
        /* view-box origin is the top edge every tick hangs from, so scaleY
           grows them downward without needing a per-element origin */
        return (
          <line
            key={i}
            className="exp-anim"
            x1={1 + t * 98}
            y1="0"
            x2={1 + t * 98}
            y2={len}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            opacity="0.9"
            style={anim("exp-tick", 2.2, i * 0.045, {
              stroke: "var(--ink)",
              transformBox: "view-box",
              transformOrigin: "0 0",
              "--s": 0.55 + 0.85 * rand(i * 9.1),
            })}
          />
        );
      })}
    </svg>
  );
}

/** AI Content Machine — a contact sheet of portrait frames rendering in.
    Frames are 3:4 like the reels the product makes; a few carry a play mark.
    The same partial re-roll as the old mosaic: only some frames pulse. */
function ReelsArt() {
  const cols = 5;
  const rows = 7;
  return (
    <div
      className="grid h-full w-full gap-[3px] overflow-hidden"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridAutoRows: "min-content" }}
    >
      {Array.from({ length: cols * rows }, (_, i) => {
        const o = 0.18 + 0.75 * rand(i * 1.91);
        const live = rand(i * 5.03) > 0.5;
        const play = rand(i * 8.77) > 0.78;
        return (
          <span
            key={i}
            className={`relative aspect-[3/4] rounded-[2px]${live ? " exp-anim" : ""}`}
            style={
              live
                ? anim("exp-dither", 3.2, rand(i * 6.1) * 3.2, {
                    backgroundColor: "var(--ink)",
                    opacity: o,
                    "--o0": o,
                    "--o1": 0.15 + 0.8 * rand(i * 2.33),
                  })
                : { backgroundColor: "var(--ink)", opacity: o }
            }
          >
            {play && (
              <span
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "3px solid transparent",
                  borderBottom: "3px solid transparent",
                  borderLeft: "5px solid var(--exp-ground, #fff)",
                  opacity: 0.9,
                }}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}

/* Interactive Globe.
 *
 * A single-frequency travelling wave is exactly a rigid horizontal shift, so
 * no CSS transform can ever make one look like water — it can only slide the
 * picture sideways. Water reads as water because it is a SUPERPOSITION: several
 * components at different wavelengths moving at different speeds (longer waves
 * run faster). Their sum is not a translation of anything — crests build, peak
 * and flatten as they travel. That has to be summed per point, so the path is
 * recomputed each frame rather than transformed.
 *
 * Amplitudes sum to 1 so the field is no taller than the old single sine. */
const WAVE_LINES = 40;
const WAVE_SAMPLES = 34;
const WAVE_PARTS = [
  { len: 62, amp: 0.55, speed: 1.0, tilt: 0.9 },
  { len: 37, amp: 0.29, speed: 0.72, tilt: 1.6 },
  { len: 23, amp: 0.16, speed: 0.5, tilt: -1.2 },
];

function waveD(row: number, time: number) {
  const t = row / (WAVE_LINES - 1);
  /* lines bunch toward the middle and swell most there — the lens shape */
  const base = 2 + 96 * (t - 0.13 * Math.sin(2 * Math.PI * t));
  const env = 7 * Math.sin(Math.PI * t);
  let d = "";
  for (let s = 0; s < WAVE_SAMPLES; s++) {
    const x = (s * 100) / (WAVE_SAMPLES - 1);
    let y = base;
    for (const p of WAVE_PARTS) {
      /* `tilt` phase-shifts each row differently per component, so the crest
         line is a diagonal that itself bends instead of a rigid barber pole */
      y +=
        env *
        p.amp *
        Math.sin(
          (2 * Math.PI * x) / p.len - p.speed * time + t * Math.PI * 2 * p.tilt,
        );
    }
    d += `${s ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(2)}`;
  }
  return d;
}

function WaveArt() {
  const live = useContext(DeckLive);
  const paths = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    if (!live) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const time = (now - start) / 1000;
      /* setAttribute straight on the nodes — re-rendering 40 paths a frame
         through React would cost far more than the wave itself */
      for (let i = 0; i < paths.current.length; i++) {
        paths.current[i]?.setAttribute("d", waveD(i, time));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live]);

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
      {Array.from({ length: WAVE_LINES }, (_, i) => (
        <path
          key={i}
          ref={(el) => {
            paths.current[i] = el;
          }}
          d={waveD(i, 0)}
          fill="none"
          style={{ stroke: "var(--ink)" }}
          strokeWidth="1"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.85"
        />
      ))}
    </svg>
  );
}

/** Music Player — a product wireframe on a faint grid. Kept on `meet` so the
    dial stays a circle whatever the frame's aspect. */
function WireframeArt() {
  return (
    <svg viewBox="0 0 100 112" preserveAspectRatio="xMidYMid meet" className="h-full w-full">
      <g fill="none" style={{ stroke: "var(--ink)" }} strokeWidth="1" vectorEffect="non-scaling-stroke">
        <g opacity="0.16">
          {Array.from({ length: 11 }, (_, i) => (
            <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="112" />
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} />
          ))}
        </g>
        <g opacity="0.8">
          <rect x="5" y="6" width="90" height="100" rx="8" />
          <circle cx="32" cy="40" r="19" />
          <circle cx="32" cy="40" r="6" />
          {[26, 40, 54].map((y, i) => (
            <rect
              key={y}
              className="exp-anim"
              x="60"
              y={y}
              width="27"
              height="8"
              rx="3"
              style={anim("exp-level", 1.15, i * 0.38, {
                transformBox: "fill-box",
                transformOrigin: "left center",
                "--a": 0.3 + 0.22 * i,
              })}
            />
          ))}
          <rect
            className="exp-anim"
            x="14"
            y="72"
            width="72"
            height="5"
            rx="2.5"
            style={anim("exp-level", 7, 0, {
              transformBox: "fill-box",
              transformOrigin: "left center",
              "--a": 0.08,
            })}
          />
          <rect x="14" y="86" width="20" height="11" rx="3" />
          <rect x="40" y="86" width="20" height="11" rx="3" />
          <rect x="66" y="86" width="20" height="11" rx="3" />
        </g>
      </g>
    </svg>
  );
}

/* ---- data --------------------------------------------------------------- */

/** off-site experiments open in a new tab; in-app routes stay client-side */
const externalProps = (href: string) =>
  /^https?:\/\//.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};

/* the card's own line, shown in the arrow pill on hover */
const LINER = "Nights and weekends";

/* what an in-progress frame says when clicked, and how long it holds it */
const SOON_LABEL = "Coming soon";
const SOON_HOLD = 1600;

const REST_SHADOW = "0 1px 2px rgba(0,0,0,0.04)";
const LIFT_SHADOW =
  "0 1px 2px rgba(0,0,0,0.08), 0 8px 16px -8px rgba(20,20,30,0.30), 0 22px 40px -18px rgba(20,20,30,0.50)";

/* metal — once a frame fills, a diagonal sheen and a bevelled edge are laid
   over its ground. White and black at low alpha, so the same overlay reads as
   brushed metal on every ground from near-black to mint. */
const METAL_SHEEN =
  "linear-gradient(135deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0) 36%, rgba(0,0,0,0.16) 54%, rgba(255,255,255,0.14) 72%, rgba(255,255,255,0.02) 84%, rgba(0,0,0,0.26) 100%)";
const METAL_BEVEL =
  "inset 0 1px 0 rgba(255,255,255,0.42), inset 1px 0 0 rgba(255,255,255,0.16), inset 0 -1px 0 rgba(0,0,0,0.32), inset -1px 0 0 rgba(0,0,0,0.14)";

const EXPERIMENTS: Experiment[] = [
  {
    name: "Music Player",
    href: "/experiments/music-player",
    ground: "#141414",
    ink: "#EDEDED",
    status: "in-progress",
    art: <WireframeArt />,
  },
  {
    name: "Gold Price Calculator",
    href: "https://www.goldpricecalculate.com/",
    ground: "#A8401F",
    ink: "#F5E7CA",
    status: "shipped",
    art: <TickArt />,
  },
  {
    name: "AI Content Machine",
    href: "/experiments/ai-content-machine",
    ground: "#5B3FD9",
    ink: "#EFEAFF",
    status: "shipped",
    art: <ReelsArt />,
  },
  {
    name: "Interactive Globe",
    href: "/experiments/interactive-globe",
    ground: "#003F26",
    ink: "#FFFFFF",
    status: "shipped",
    art: <WaveArt />,
  },
];

/* ---- geometry ----------------------------------------------------------- */

export type StackGeometry = {
  /* the frame itself */
  frameW: number;
  frameH: number;
  /** unused since the frames lost their header row — kept as a live dial */
  headerH: number;
  /* rest — the stack is anchored to the card's RIGHT edge and each frame steps
     `stepX` right / `stepY` down from the one behind it. The front frame
     overhangs the card by `overhang` px so the card clips it at any width.
     `stackBottom` is how far above the card's bottom edge the stack is cut off,
     i.e. where the label gradient takes over. */
  stepX: number;
  stepY: number;
  overhang: number;
  baseTop: number;
  stackBottom: number;
  /* fan — how far each frame slides out of the case. `fanGap` is the EXTRA
     vertical separation added to stepY, so stepY + fanGap is the sliver of
     each frame on show once open; `fanShiftY` sets which frame acts as the
     fixed case face (at -1.5 x fanGap the front one holds still).
     spreadX/tailX/rotate are held at 0 for the cigarette read — dial them up
     only if you want the older splayed fan back. */
  fanGap: number;
  fanShiftY: number;
  fanSpreadX: number;
  fanTailX: number;
  fanRotate: number;
  fanTailRotate: number;
  /* look — the rest design, shared by every frame. Pure white on the bento's
     white so only the hairline and the stagger define the stack; artwork in a
     light zinc, title a step darker so the name still reads in the sliver.
     `colorFade` is how long the fill takes to arrive on hover. */
  restGround: string;
  restInk: string;
  restTitle: string;
  restBorder: number;
  colorFade: number;
  /* title — size in px, position as % of the frame so it scales with it.
     Keep titleTop + one line-height under the slid-open sliver (stepY +
     fanGap) or the names get guillotined by the frame in front. */
  titleSize: number;
  titleTop: number;
  titleLeft: number;
  titleRight: number;
  titleLeading: number;
  titleTracking: number;
  /* artwork box, % of the frame — one set of insets for all four cards, so
     the patterns always share a width */
  artTop: number;
  artBottom: number;
  artInset: number;
  /* which way the deck opens. Up: back frames sit higher and rise, the front
     one is the case face. Down mirrors all of it — the front frame is topmost
     and the others descend behind it — and mirrors each card's composition
     with it, because the sliver on show becomes the BOTTOM edge, so the title
     has to live there. Everything else is measured from the emerging edge and
     needs no re-dialling. */
  growDown: boolean;
  /* the spring that runs between the two states */
  stiffness: number;
  damping: number;
  mass: number;
  stagger: number;
};

export const STACK: StackGeometry = {
  frameW: 222,
  frameH: 311,
  headerH: 35,
  stepX: 18,
  stepY: 24.5,
  overhang: 23,
  baseTop: 76,
  stackBottom: 92,
  fanGap: 22,
  fanShiftY: -38,
  fanSpreadX: 0,
  fanTailX: 0,
  fanRotate: 0,
  fanTailRotate: 0,
  restGround: "#FFFFFF",
  restInk: "#D4D4D8",
  restTitle: "#71717A",
  restBorder: 0.12,
  colorFade: 600,
  titleSize: 20,
  titleTop: 7,
  titleLeft: 11,
  titleRight: 7,
  titleLeading: 1.08,
  titleTracking: -0.01,
  artTop: 17,
  artBottom: 9,
  artInset: 11,
  growDown: false,
  stiffness: 330,
  damping: 21,
  mass: 0.8,
  stagger: 0.05,
};

/* t runs 0 (back frame) → 1 (front frame) */
function fanAt(i: number, n: number, g: StackGeometry) {
  const t = n === 1 ? 0 : i / (n - 1);
  return {
    x: -g.fanSpreadX + (g.fanSpreadX + g.fanTailX) * t,
    y: (t - 0.5) * g.fanGap * (n - 1) + g.fanShiftY,
    r: g.fanRotate + (g.fanTailRotate - g.fanRotate) * t,
  };
}

/* Frames no longer own a CSS position per slot — they all sit on one anchor
   and every slot is a transform off it, so a frame can move between slots.
   Slot 0 is the back of the deck, slot n-1 the front. */
function anchor(n: number, g: StackGeometry) {
  return { right: -g.overhang + g.stepX * (n - 1), top: g.baseTop };
}

/* A caller's override can carry undefined values — DialKit rehydrating a
   persisted panel is the live example — and a plain spread would let those
   undefineds overwrite the defaults and put NaN into a style. Skip them. */
function withDefaults(o?: Partial<StackGeometry>): StackGeometry {
  if (!o) return STACK;
  const out: StackGeometry = { ...STACK };
  for (const [k, v] of Object.entries(o)) {
    if (v === undefined) continue;
    if (typeof v === "number" && !Number.isFinite(v)) continue;
    (out as Record<string, unknown>)[k] = v;
  }
  return out;
}

function slotTarget(slot: number, n: number, fanned: boolean, g: StackGeometry) {
  /* vertical order. Growing down reverses it so the FRONT frame is topmost,
     and flips fanShiftY's sign, which makes the motion an exact mirror of the
     upward one without touching any other dial. */
  const rank = g.growDown ? n - 1 - slot : slot;
  const x = g.stepX * slot;
  const y = g.stepY * rank;
  if (!fanned) return { x, y, r: 0 };
  const f = fanAt(rank, n, g.growDown ? { ...g, fanShiftY: -g.fanShiftY } : g);
  return { x: x + f.x, y: y + f.y, r: f.r };
}


function Frame({
  exp,
  slot,
  n,
  fanned,
  reduced,
  g,
}: {
  exp: Experiment;
  slot: number;
  n: number;
  fanned: boolean;
  reduced: boolean;
  g: StackGeometry;
}) {
  const wip = exp.status === "in-progress";
  const to = slotTarget(slot, n, fanned, g);
  /* an in-progress frame doesn't navigate — it shakes its head and its title
     rolls up to say "Coming soon", then rolls back */
  const [soon, setSoon] = useState(false);
  const soonTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (soonTimer.current) clearTimeout(soonTimer.current); }, []);
  const onClick = wip
    ? (e: MouseEvent) => {
        e.preventDefault();
        setSoon(true);
        if (soonTimer.current) clearTimeout(soonTimer.current);
        soonTimer.current = setTimeout(() => setSoon(false), SOON_HOLD);
      }
    : undefined;
  const swap = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 30 };
  const delay = fanned
    ? (n - 1 - slot) * g.stagger
    : slot * g.stagger * 0.57;

  return (
    <motion.div
      /* the outer box stays parked at the anchor while the inner one slides,
         so it must not hit-test — otherwise the front frame's empty wrapper
         (highest z) swallows clicks on every sliver fanned out beneath it */
      className="absolute pointer-events-none"
      style={{ ...anchor(n, g), width: g.frameW, height: g.frameH, zIndex: slot + 1 }}
      variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
    >
      <motion.div
        className="h-full w-full pointer-events-auto"
        initial={false}
        animate={{ x: to.x, y: to.y, rotate: to.r }}
        transition={
          reduced
            ? { duration: 0 }
            : { type: "spring", stiffness: g.stiffness, damping: g.damping, mass: g.mass, delay }
        }
        style={{ transformOrigin: "50% 50%" }}
      >
        <motion.div
          className="h-full w-full"
          animate={soon && !reduced ? { x: [0, -4, 4, -3, 3, 0] } : { x: 0 }}
          transition={{ duration: 0.38, ease: "easeInOut" }}
        >
        <Link
          href={exp.href}
          {...externalProps(exp.href)}
          onClick={onClick}
          aria-label={`${exp.name}${wip ? " (in progress)" : ""}`}
          /* rounded-card, not a literal, so the frames stay locked to the bento
             card's own radius if that token ever moves */
          className="group/frame relative block h-full w-full overflow-hidden rounded-card border ease-out hover:-translate-y-[2px] motion-reduce:!transform-none"
          style={{
            background: fanned ? exp.ground : g.restGround,
            borderColor: fanned ? "transparent" : `rgba(0,0,0,${g.restBorder})`,
            boxShadow: fanned ? LIFT_SHADOW : REST_SHADOW,
            /* --ink is a registered <color> property (globals.css), so it
               interpolates here on the frame and every artwork element that
               references it follows — one transition instead of hundreds */
            "--ink": fanned ? exp.ink : g.restInk,
            "--exp-ground": fanned ? exp.ground : g.restGround,
            transitionProperty: "background-color, border-color, box-shadow, --ink, transform",
            transitionDuration: reduced
              ? "0ms"
              : `${g.colorFade}ms, ${g.colorFade}ms, ${g.colorFade}ms, ${g.colorFade}ms, 300ms`,
          } as Vars}
        >
          {/* metallic sheen — fades in with the ground colour, sits under the
              artwork and title */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-card"
            style={{
              background: METAL_SHEEN,
              boxShadow: METAL_BEVEL,
              opacity: fanned ? 1 : 0,
              transition: `opacity ${reduced ? 0 : g.colorFade}ms ease-out`,
            }}
          />
          <div
            className="absolute"
            style={{
              [g.growDown ? "bottom" : "top"]: `${g.artTop}%`,
              [g.growDown ? "top" : "bottom"]: `${g.artBottom}%`,
              left: `${g.artInset}%`,
              right: `${g.artInset}%`,
            }}
          >
            {exp.art}
          </div>
          {/* title inset is kept under one line-height so the name clears the
              sliver that shows when the deck slides open */}
          <div
            className="absolute"
            style={{
              [g.growDown ? "bottom" : "top"]: `${g.titleTop}%`,
              left: `${g.titleLeft}%`,
              right: `${g.titleRight}%`,
            }}
          >
            <h4
              className="relative overflow-hidden"
              aria-live={wip ? "polite" : undefined}
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: g.titleSize,
                lineHeight: g.titleLeading,
                letterSpacing: `${g.titleTracking}em`,
                color: fanned ? exp.ink : g.restTitle,
                transition: `color ${reduced ? 0 : g.colorFade}ms ease-out`,
              }}
            >
              <motion.span
                className="block"
                initial={false}
                animate={{ y: soon ? "-100%" : "0%", opacity: soon ? 0 : 1 }}
                transition={swap}
              >
                {exp.name}
              </motion.span>
              {wip && (
                <motion.span
                  className="absolute inset-x-0 top-0 block"
                  aria-hidden={!soon}
                  initial={false}
                  animate={{ y: soon ? "0%" : "100%", opacity: soon ? 1 : 0 }}
                  transition={swap}
                >
                  {soon ? SOON_LABEL : ""}
                </motion.span>
              )}
            </h4>
          </div>
        </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* the stack is designed for the 258px bento column; narrower cards scale it
   down from the top-right corner so the overhang and clipping stay the same */
const DESIGN_W = 258;

function useStackScale() {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setScale(w > 0 && w < DESIGN_W ? w / DESIGN_W : 1);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, scale };
}

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return coarse;
}

export default function ExperimentsCard({
  geometry,
  state,
}: {
  /** override any STACK value — used by /playground/experiments-stack */
  geometry?: Partial<StackGeometry>;
  /** pin a pose instead of reacting to the pointer */
  state?: "idle" | "fanned";
}) {
  const reduced = useReducedMotion() ?? false;
  const coarse = useCoarsePointer();
  const [hot, setHot] = useState(false);
  const { ref: stackRef, scale } = useStackScale();
  const g = withDefaults(geometry);
  const n = EXPERIMENTS.length;

  const fanned = state ? state === "fanned" : coarse || hot;
  /* patterns run on real hover only — never permanently on touch, where
     `fanned` is true from the start */
  const animating = state ? state === "fanned" : hot;
  /* the arrow is a card-level affordance, so it points at the frame you see
     at rest — the front of the deck */
  const featured = EXPERIMENTS[n - 1];

  return (
    <div className="row-span-2 max-md:row-span-1 max-md:h-[135cqw]">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        variants={{
          hidden: { opacity: 0, y: 12 },
          show: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
              when: "beforeChildren",
              staggerChildren: 0.06,
            },
          },
        }}
        onMouseEnter={() => setHot(true)}
        onMouseLeave={() => setHot(false)}
        onFocusCapture={() => setHot(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHot(false);
        }}
        className="group/card bg-white rounded-card border-2 border-surface-border overflow-hidden relative h-full"
      >
        {/* the stack — absolutely placed, clipped by the card */}
        <div
          ref={stackRef}
          className="absolute inset-x-0 top-0"
          style={{
            bottom: g.stackBottom,
            transform: `scale(${scale})`,
            transformOrigin: "100% 0%",
            "--exp-play": animating && !reduced ? "running" : "paused",
          } as Vars}
        >
          <DeckLive.Provider value={animating && !reduced}>
          {EXPERIMENTS.map((exp, i) => (
            <Frame
              key={exp.name}
              exp={exp}
              slot={i}
              n={n}
              fanned={fanned}
              reduced={reduced}
              g={g}
            />
          ))}
          </DeckLive.Provider>
        </div>

        {/* softens the bottom of the stack so the arrow stays legible over it */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-white via-white/85 to-transparent" />

        {/* the same arrow the other bento cards use */}
        <div className="absolute bottom-2 left-2 z-20 flex items-center gap-2 group/arrow opacity-0 pointer-events-none transition-opacity duration-200 group-hover/card:opacity-100 group-hover/card:pointer-events-auto group-focus-within/card:opacity-100 group-focus-within/card:pointer-events-auto">
          <Link
            href={featured.href}
            {...externalProps(featured.href)}
            aria-label={`Open ${featured.name}`}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 relative overflow-hidden transition-shadow duration-300"
            style={{ boxShadow: "0 0 0 2px rgba(0,0,0,0.1)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 0 2px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.1)";
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(0,0,0,0.6)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/arrow:translate-x-[120%] group-hover/arrow:-translate-y-[120%] motion-reduce:!transform-none"
            >
              <line x1="5" y1="19" x2="19" y2="5" />
              <polyline points="9 5 19 5 19 15" />
            </svg>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(0,0,0,0.9)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute translate-x-[-120%] translate-y-[120%] transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/arrow:translate-x-0 group-hover/arrow:translate-y-0 motion-reduce:!transform-none"
            >
              <line x1="5" y1="19" x2="19" y2="5" />
              <polyline points="9 5 19 5 19 15" />
            </svg>
          </Link>
          <div
            className="h-[32px] rounded-full bg-white/70 backdrop-blur-md flex items-center px-4 max-w-0 opacity-0 group-hover/arrow:max-w-[600px] group-hover/arrow:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] overflow-hidden whitespace-nowrap"
            style={{ boxShadow: "0 0 0 1.5px rgba(0,0,0,0.08)" }}
          >
            <p className="text-[13px] font-medium text-txt-heading">
              {LINER}
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
