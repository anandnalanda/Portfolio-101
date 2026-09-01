"use client";

/**
 * <DocumentStackAnimation /> — a document-stack build-in that ends in a loop.
 *
 * One imperative timeline (useAnimate) is the single source of truth, so it
 * can never drift. Everything is transform/opacity only (GPU).
 *
 *   Beat 1  fly-to-stack   docs fly from off-screen corners straight into a
 *                          fanned pile at centre, staggered, with a spring thud
 *   Beat 2  hold           sit as a stack for a beat
 *   Beat 3  spread         burst out into an evenly-spaced row (centre → edges),
 *                          straightening only as they arrive
 *   Beat 4  flip           each card does one Y-flip; at the invisible midpoint
 *                          it gains the accent "stroke", with a highlight sweep
 *   Beat 5  marquee        the whole row travels right→left, forever, seamless
 *                          (a hidden ghost copy sits one loop-width to the right)
 *
 * `freeze` holds the docs in the pile (for tuning positions with DialKit).
 * Reduced-motion: skips the motion and just shows the final row.
 */

import { useAnimate, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export type PilePos = { x: number; y: number; rot: number };

/* ── every tunable lives here ─────────────────────────────────────── */
const CONFIG = {
  accent: "#003B4A", // "final" card stroke colour (from design.md)
  // gradient stroke for the finished card — stays in the brand teal family
  accentGradient: "linear-gradient(135deg, #0B6E86 0%, #003B4A 100%)",
  docWidth: 56, // px (default; tunable via the `docWidth` prop)
  docAspect: 540 / 400, // height / width (matches the doc art)
  radius: 6,

  // Beat 1 — fly-to-stack: each card flies in from a bottom corner into the pile
  flyStagger: 105, // ms between docs
  entryFadeIn: 0.08, // s, near-instant so docs read as opaque white in flight
  entryScale: 0.9,
  flyDuration: 0.85, // s, smooth glide into the stack
  flyEase: [0.22, 1, 0.36, 1] as const, // easeOutExpo — no bounce
  // off-screen origins as multiples of the container half-size (bottom corners)
  entryOrigins: [
    { x: -1.1, y: 1.85 }, // doc 1 — bottom-left
    { x: 1.1, y: 1.85 }, // doc 2 — bottom-right
    { x: -1.55, y: 1.7 }, // doc 3 — bottom-left
    { x: 1.5, y: 1.7 }, // doc 4 — bottom-right
    { x: -0.7, y: 2.0 }, // doc 5 — bottom-left
    { x: 1.3, y: 1.95 }, // doc 6 — bottom-right
  ],
  anglePool: [-18, -12, -7, -3, 4, 8, 12, 15, 18, -15], // entry tilts

  // the fanned pile — overridable per-doc via the `pile` prop
  pile: [
    { x: 0, y: 0, rot: 12 },
    { x: 0, y: 0, rot: 8 },
    { x: 0, y: 0, rot: 4 },
    { x: 0, y: 0, rot: -12 },
    { x: 0, y: 0, rot: -8 },
    { x: 0, y: 0, rot: 0 },
  ] as PilePos[],

  // Beat 2 — hold as a stack before spreading
  stackHoldMs: 800,

  // Beat 3 — spread into a row
  rowGap: 4, // px between adjacent docs in the row
  spreadSpring: { type: "spring", stiffness: 170, damping: 30 } as const, // smooth, no bounce
  spreadRotDuration: 0.6, // s (docs straighten to 0° over this window)
  spreadStagger: 55, // ms per ring out from centre

  // Beat 4 — flip into final cards
  flipHalf: 0.23, // s per half (×2 ≈ 460ms total per card)
  flipStagger: 85, // ms, l→r
  sweepOpacity: 0.15,

  // Beat 5 — marquee
  marqueePxPerSec: 38, // scroll speed (slow, ambient)
  marqueeStartPauseMs: 600, // hold the finished row before it starts moving
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* document content, fully desaturated — colours off, structure visible */
const DOC_IMG_STYLE: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  filter: "grayscale(1)",
};

type Props = {
  images: string[];
  loop?: boolean;
  /** global time multiplier — 2 = twice as fast. Default 1. */
  speed?: number;
  /** per-doc pile arrangement; falls back to CONFIG.pile */
  pile?: PilePos[];
  /** hold the docs in the pile (no loop) — for tuning positions */
  freeze?: boolean;
  /** run the sequence when true; hide the docs when false (e.g. on hover) */
  play?: boolean;
  /** document width in px (height derives from the doc aspect ratio) */
  docWidth?: number;
};

export default function DocumentStackAnimation({
  images,
  loop = true,
  speed = 1,
  pile: pileProp,
  freeze = false,
  play = true,
  docWidth = CONFIG.docWidth,
}: Props) {
  const dh = Math.round(docWidth * CONFIG.docAspect); // doc height
  const [scope, animate] = useAnimate();
  const reduced = useReducedMotion() ?? false;
  const docRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ghostRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sweepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const marqueeRef = useRef<ReturnType<typeof animate> | null>(null);
  // unique id per effect run — a stale async run can't resurrect itself
  const runIdRef = useRef(0);
  const [final, setFinal] = useState<boolean[]>(() => images.map(() => false));

  const pile = pileProp ?? CONFIG.pile;
  const pileKey = JSON.stringify(pile); // stable dep — re-run only when values change

  useEffect(() => {
    const myRun = ++runIdRef.current;
    const alive = () => runIdRef.current === myRun;
    const N = images.length;
    const spd = speed > 0 ? speed : 1;
    const d = (s: number) => s / spd;
    const wait = (ms: number) => sleep(ms / spd);

    const doc = (i: number) => docRefs.current[i];
    const allDocs = () =>
      docRefs.current.slice(0, N).filter(Boolean) as HTMLDivElement[];
    const pileAt = (i: number) => pile[i % pile.length];

    const geom = () => {
      const w = scope.current?.clientWidth ?? 285;
      const h = scope.current?.clientHeight ?? 104;
      return { hw: w / 2, hh: h / 2, w };
    };
    const originOf = (i: number) => {
      const { hw, hh } = geom();
      const o = CONFIG.entryOrigins[i % CONFIG.entryOrigins.length];
      return { x: o.x * hw, y: o.y * hh };
    };
    // Row geometry: fixed doc spacing + the marquee's seamless period.
    const pitch = () => docWidth + CONFIG.rowGap;
    const slotX = (i: number) => (i - (N - 1) / 2) * pitch();
    const loopWidth = () => N * pitch(); // one repeat = N docs at `pitch`

    const setFinalSafe = (next: boolean[] | ((p: boolean[]) => boolean[])) => {
      if (alive()) setFinal(next);
    };

    // Snap every doc straight into the pile (used for freeze).
    const placePile = (opacity: number) =>
      Promise.all(
        allDocs().map((el, i) => {
          const p = pileAt(i);
          return animate(
            el,
            { x: p.x, y: p.y, rotate: p.rot, rotateY: 0, scale: 1, opacity },
            { duration: 0 },
          );
        }),
      );

    /* ── freeze: hold the pile so positions can be tuned live ── */
    if (freeze) {
      setFinalSafe(images.map(() => false));
      placePile(1);
      return () => {
        runIdRef.current++;
      };
    }

    /* ── not playing (e.g. not hovered): hide everything, stop the marquee ── */
    if (!play) {
      marqueeRef.current?.stop();
      marqueeRef.current = null;
      setFinalSafe(images.map(() => false));
      ghostRefs.current
        .slice(0, N)
        .forEach((el) => el && animate(el, { opacity: 0 }, { duration: 0 }));
      allDocs().forEach((el) =>
        animate(el, { opacity: 0 }, { duration: d(0.25), ease: "easeIn" }),
      );
      return () => {
        runIdRef.current++;
      };
    }

    // Park every doc off-screen (bottom corner), invisible, pre-tilted.
    const resetToEntry = (angles: number[]) => {
      setFinalSafe(images.map(() => false));
      ghostRefs.current
        .slice(0, N)
        .forEach((el) => el && animate(el, { opacity: 0 }, { duration: 0 }));
      if (trackRef.current) animate(trackRef.current, { x: 0 }, { duration: 0 });
      return Promise.all(
        allDocs().map((el, i) => {
          const o = originOf(i);
          return animate(
            el,
            {
              x: o.x,
              y: o.y,
              rotate: angles[i],
              rotateY: 0,
              scale: CONFIG.entryScale,
              opacity: 0,
            },
            { duration: 0 },
          );
        }),
      );
    };

    // Beat 1 — each card flies from its off-screen origin into the pile slot.
    const flyToStack = (i: number) =>
      (async () => {
        const el = doc(i);
        if (!el) return;
        await wait(i * CONFIG.flyStagger);
        if (!alive()) return; // hover left mid-stagger — don't re-show this doc
        const p = pileAt(i);
        animate(el, { opacity: 1 }, { duration: d(CONFIG.entryFadeIn), ease: "linear" });
        await animate(
          el,
          { x: p.x, y: p.y, rotate: p.rot, scale: 1 },
          { duration: d(CONFIG.flyDuration), ease: CONFIG.flyEase },
        );
      })();

    // Beat 3 — burst out to the row; straighten only in the last stretch.
    const spread = (i: number) =>
      (async () => {
        const el = doc(i);
        if (!el) return;
        const ring = Math.round(Math.abs(i - (N - 1) / 2)); // 0 = centre
        await wait(ring * CONFIG.spreadStagger);
        if (!alive()) return; // superseded by hover-out — abort the spread
        // straighten to 0° AND travel together, both awaited so the row is
        // guaranteed flat (no residual tilt) before the flip beat runs
        await Promise.all([
          animate(el, { rotate: 0 }, {
            duration: d(CONFIG.spreadRotDuration),
            ease: "easeInOut",
          }),
          animate(el, { x: slotX(i), y: 0, scale: 1 }, {
            x: CONFIG.spreadSpring,
            y: CONFIG.spreadSpring,
            scale: { duration: d(0.4) },
          }),
        ]);
      })();

    // Beat 4 — one Y-flip; the accent stroke appears at the invisible midpoint.
    const flip = (i: number) =>
      (async () => {
        const el = doc(i);
        if (!el) return;
        await wait(i * CONFIG.flipStagger);
        if (!alive()) return; // superseded by hover-out — abort the flip
        const sweep = sweepRefs.current[i];
        if (sweep) {
          animate(
            sweep,
            { x: ["-160%", "260%"], opacity: [0, CONFIG.sweepOpacity, 0] },
            { duration: d(CONFIG.flipHalf * 2), ease: "easeInOut" },
          );
        }
        await animate(el, { rotateY: 90 }, { duration: d(CONFIG.flipHalf), ease: "easeIn" });
        setFinalSafe((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
        await animate(el, { rotateY: 0 }, { duration: d(CONFIG.flipHalf), ease: "easeOut" });
      })();

    // Beat 5 — infinite right→left marquee of the whole row.
    const startMarquee = () => {
      const lw = loopWidth();
      // place the ghost row one loop-width to the right, as finished cards
      ghostRefs.current.slice(0, N).forEach((el, i) => {
        if (el)
          animate(
            el,
            { x: slotX(i) + lw, y: 0, rotate: 0, scale: 1, opacity: 1 },
            { duration: 0 },
          );
      });
      const dur = lw / (CONFIG.marqueePxPerSec * spd);
      if (trackRef.current) {
        marqueeRef.current = animate(
          trackRef.current,
          { x: [0, -lw] },
          { duration: dur, ease: "linear", repeat: Infinity },
        );
      }
    };

    /* ── reduced-motion: just show the final row ── */
    const runReduced = async () => {
      setFinalSafe(images.map(() => true));
      await Promise.all(
        allDocs().map((el, i) =>
          animate(
            el,
            { x: slotX(i), y: 0, rotate: 0, rotateY: 0, scale: 1, opacity: 0 },
            { duration: 0 },
          ),
        ),
      );
      await Promise.all(
        allDocs().map((el) => animate(el, { opacity: 1 }, { duration: d(0.4) })),
      );
    };

    /* ── the full timeline: build once, then loop the marquee ── */
    const runFull = async () => {
      const angles = images.map(
        (_, i) => CONFIG.anglePool[(i * 2) % CONFIG.anglePool.length],
      );
      await resetToEntry(angles);
      if (!alive()) return;
      await Promise.all(images.map((_, i) => flyToStack(i))); // Beat 1: fly to stack
      await wait(CONFIG.stackHoldMs); // Beat 2
      if (!alive()) return;
      // defensive snap: normalise every doc to its exact pile slot before the
      // burst — a janked/interrupted fly-in must never leak residual x/y into
      // the spread (it read as a card arriving from the bottom)
      await placePile(1);
      await Promise.all(images.map((_, i) => spread(i))); // Beat 3
      await Promise.all(images.map((_, i) => flip(i))); // Beat 4
      if (!alive()) return;
      await wait(CONFIG.marqueeStartPauseMs);
      if (alive() && loop) startMarquee(); // Beat 5
    };

    (reduced ? runReduced() : runFull()).catch(() => {});

    return () => {
      runIdRef.current++;
      marqueeRef.current?.stop();
      marqueeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, loop, speed, reduced, freeze, pileKey, play, docWidth]);

  // A finished card + its raw page share this style; `isFinal` adds the stroke.
  const cardStyle = (i: number, isFinal: boolean): React.CSSProperties => ({
    position: "absolute",
    left: "50%",
    top: "50%",
    width: docWidth,
    height: dh,
    marginLeft: -docWidth / 2,
    marginTop: -dh / 2,
    boxSizing: "border-box",
    borderRadius: CONFIG.radius,
    overflow: "hidden",
    // finished cards get a gradient (brand-teal) stroke via the padding/border-box
    // trick; the doc image fills the padding box, the gradient shows in the ring
    background: isFinal
      ? `linear-gradient(#fff, #fff) padding-box, ${CONFIG.accentGradient} border-box`
      : "#fff",
    opacity: 0, // owned by Framer after mount; constant here so React never re-writes it
    zIndex: i,
    transformOrigin: "center",
    backfaceVisibility: "hidden",
    willChange: "transform",
    border: isFinal ? "1.5px solid transparent" : "1px solid rgba(0,0,0,0.08)",
    boxShadow: isFinal ? "0 1px 3px rgba(0,0,0,0.06)" : "0 4px 12px rgba(0,0,0,0.08)",
  });

  return (
    <div
      ref={scope}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        aspectRatio: "285 / 120", // band sits lower (more gap under the symbol), still clears the docs
        background: "transparent",
      }}
    >
      {/* track carries the marquee translate; the docs live inside it */}
      <div
        ref={trackRef}
        style={{ position: "absolute", inset: 0 }}
      >
        {/* the real docs — grayscale content + stroke, beats 1–4 */}
        {images.map((src, i) => (
          <div
            key={`doc-${i}`}
            ref={(el) => {
              docRefs.current[i] = el;
            }}
            style={cardStyle(i, final[i])}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" draggable={false} style={DOC_IMG_STYLE} />
            {/* highlight sweep — rides across each card as it finishes its flip */}
            <div
              ref={(el) => {
                sweepRefs.current[i] = el;
              }}
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: "40%",
                opacity: 0,
                pointerEvents: "none",
                background:
                  "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)",
              }}
            />
          </div>
        ))}

        {/* ghost copy — finished cards, hidden until the marquee places them one
            loop-width to the right so the scroll wraps with no seam */}
        {images.map((src, i) => (
          <div
            key={`ghost-${i}`}
            ref={(el) => {
              ghostRefs.current[i] = el;
            }}
            aria-hidden
            style={cardStyle(i, true)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" draggable={false} style={DOC_IMG_STYLE} />
          </div>
        ))}
      </div>
    </div>
  );
}
