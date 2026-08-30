"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ARC, styleFor, type ArcConfig } from "./config";
import type { ArcCarouselProps, ArcSlide } from "./types";

/* inclusive integer range */
function range(a: number, b: number): number[] {
  const out: number[] = [];
  for (let i = a; i <= b; i++) out.push(i);
  return out;
}

/* wrap a virtual index into a real slide index */
function wrap(v: number, len: number): number {
  return ((v % len) + len) % len;
}

/**
 * One card. Its transform/opacity/z are derived live from the shared `position`
 * MotionValue via useTransform — so it re-derives every frame WITHOUT re-rendering React.
 */
const FRAME_CLASS =
  "relative grid place-items-center overflow-hidden rounded-[24px] bg-[#EEF6EF]";

/* mint frame contents — component owns the frame, consumer owns `slide.content` */
function CardInner({ slide }: { slide: ArcSlide }) {
  return (
    <>
      {/* pale-green "desk" blocks bleeding off the edges, clipped by the frame radius */}
      <span className="pointer-events-none absolute -top-8 -left-8 h-28 w-28 rounded-[20px] bg-[#DCEDDF]" />
      <span className="pointer-events-none absolute -bottom-10 -right-6 h-24 w-32 rounded-[20px] bg-[#DCEDDF]" />
      <span className="pointer-events-none absolute -top-6 right-10 h-20 w-20 rounded-[18px] bg-[#DCEDDF]" />
      <span className="pointer-events-none absolute bottom-6 -left-10 h-20 w-24 rounded-[18px] bg-[#DCEDDF]" />

      <div
        className="relative w-[62%] rounded-lg border border-black/5 bg-white p-3"
        style={{ boxShadow: "0 8px 24px -12px rgba(0,0,0,0.18)" }}
      >
        {slide.content}
      </div>
    </>
  );
}

function ArcCard({
  v,
  position,
  slide,
  active,
  reduced,
  bare,
  cardW,
  cardH,
  cfg,
}: {
  v: number;
  position: MotionValue<number>;
  slide: ArcSlide;
  active: boolean;
  reduced: boolean;
  bare: boolean;
  cardW: number;
  cardH: number;
  cfg: ArcConfig;
}) {
  const transform = useTransform(position, (p) => styleFor(v - p, cfg).transform);
  const opacity = useTransform(position, (p) => styleFor(v - p, cfg).opacity);
  const zIndex = useTransform(position, (p) => styleFor(v - p, cfg).zIndex);

  const size = { width: cardW, height: cardH };
  // Bare: the slide IS a bordered white card; its content draws the illustration inside.
  // Framed: mint device + white box.
  const frameClass = bare
    ? "relative overflow-hidden rounded-[28px] border border-black/[0.07] bg-white"
    : FRAME_CLASS;
  const inner = bare ? slide.content : <CardInner slide={slide} />;

  // Reduced motion: no arc, no rotation — just cross-fade the active card.
  if (reduced) {
    return (
      <div
        className="absolute inset-0 grid place-items-center transition-opacity duration-150"
        style={{
          opacity: active ? 1 : 0,
          zIndex: active ? 100 : 0,
          pointerEvents: active ? "auto" : "none",
        }}
        aria-hidden={!active}
      >
        <div style={size} className={frameClass}>
          {inner}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      style={{ zIndex }}
      className="absolute inset-0 grid place-items-center"
      aria-hidden={!active}
    >
      <motion.div
        style={{
          transform,
          opacity,
          ...size,
          willChange: "transform",
          pointerEvents: active ? "auto" : "none",
        }}
        className={frameClass}
      >
        {inner}
      </motion.div>
    </motion.div>
  );
}

/* Same glyph as the case-study arrow, rotated up (−45°) or down (135°). */
function Arrow({ up }: { up: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <g transform={up ? "rotate(-45 12 12)" : "rotate(135 12 12)"}>
        <line x1="5" y1="19" x2="19" y2="5" />
        <polyline points="9 5 19 5 19 15" />
      </g>
    </svg>
  );
}

/**
 * One half of the arrow pill. Rest = very light. Hover = darker icon + soft bg,
 * and the icon slides out in its own direction while a duplicate rolls in from the
 * opposite edge — looping while hovered.
 */
function StepButton({
  dir,
  onClick,
  ariaLabel,
  half,
}: {
  dir: 1 | -1;
  onClick: () => void;
  ariaLabel: string;
  half: "top" | "bottom";
}) {
  const [hover, setHover] = useState(false);
  const up = dir < 0;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={ariaLabel}
      className={`relative flex h-[42px] w-[38px] items-center justify-center border-2 border-black/[0.1] bg-white transition-colors duration-150 active:scale-[0.97] ${
        half === "top" ? "rounded-t-full rounded-b-md" : "rounded-b-full rounded-t-md"
      } ${hover ? "bg-black/[0.03] text-black/85" : "text-black/30"}`}
    >
      <Arrow up={up} />
    </button>
  );
}

export default function ArcCarousel({
  slides,
  initialIndex = 0,
  onIndexChange,
  onExpand,
  autoplayMs,
  autoplayStep = 1,
  className,
  debug = false,
  bare = false,
  wheelNav = true,
  showExpand = true,
  cardWidth,
  cardHeight,
  arc,
  background,
}: ArcCarouselProps) {
  const reduced = useReducedMotion() ?? false;
  const cfg: ArcConfig = { ...ARC, ...arc };
  const cardW = cardWidth ?? cfg.cardW;
  const cardH = cardHeight ?? cfg.cardH;
  const [panelHover, setPanelHover] = useState(false);
  const [panelFocus, setPanelFocus] = useState(false);
  const [announce, setAnnounce] = useState("");
  // `target` is the discrete destination the buttons/keys write to.
  // `position` is the spring that chases it — every card's transform reads THIS.
  // Incrementing target mid-flight just re-aims the same spring, so rapid clicks
  // blend into one accelerating travel instead of restarting.
  const target = useMotionValue(initialIndex);
  const position = useSpring(target, { stiffness: 170, damping: 26, mass: 1 });
  // Only the integer centre lives in React — flips a handful of times per gesture,
  // which is what drives windowing (mount/unmount) and the a11y index, not per-frame.
  const [center, setCenter] = useState(Math.round(initialIndex));

  useMotionValueEvent(position, "change", (v) => {
    const r = Math.round(v);
    if (r !== center) {
      setCenter(r);
      onIndexChange?.(wrap(r, slides.length));
    }
  });

  // Reduced motion: snap position straight to target so there's no visible arc —
  // the cards cross-fade by `active` instead.
  useMotionValueEvent(target, "change", (v) => {
    if (reduced) position.jump(v);
  });

  // Polite announcement after each settle (debounced).
  useEffect(() => {
    const id = window.setTimeout(() => {
      const i = wrap(center, slides.length);
      setAnnounce(`${slides[i]?.label ?? ""}, ${i + 1} of ${slides.length}`);
    }, 400);
    return () => window.clearTimeout(id);
  }, [center, slides]);

  // Autoplay — off unless autoplayMs is set; disabled under reduced motion;
  // pauses while the panel is hovered or focused.
  useEffect(() => {
    if (!autoplayMs || reduced || panelHover || panelFocus) return;
    const id = window.setInterval(() => target.set(target.get() + autoplayStep), autoplayMs);
    return () => window.clearInterval(id);
  }, [autoplayMs, autoplayStep, reduced, panelHover, panelFocus, target]);

  const visible = range(center - cfg.window, center + cfg.window);
  const slideFor = (v: number) => slides[wrap(v, slides.length)];

  // Re-derive every card's transform when the arc geometry changes (live tuning).
  useEffect(() => {
    position.set(position.get());
  }, [position, cfg.bulgeX, cfg.stepY, cfg.rotStep, cfg.fade]);

  // Re-aim the spring by one step. Mid-flight clicks accelerate the existing travel.
  const step = (dir: number) => target.set(target.get() + dir);

  const panelRef = useRef<HTMLDivElement>(null);

  // Keyboard — ↑/↓ and PageUp/PageDown when the panel has focus.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      step(-1);
    }
  };

  // Wheel / trackpad — native non-passive listener so we can preventDefault the page
  // scroll; accumulate delta and throttle so one gesture = one step.
  useEffect(() => {
    const el = panelRef.current;
    if (!el || !wheelNav) return;
    let accum = 0;
    let lock = false;
    let lockTimer = 0;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return; // ignore horizontal gestures
      e.preventDefault();
      if (lock) return;
      accum += e.deltaY;
      if (Math.abs(accum) >= 40) {
        target.set(target.get() + (accum > 0 ? 1 : -1));
        accum = 0;
        lock = true;
        lockTimer = window.setTimeout(() => {
          lock = false;
        }, 350);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(lockTimer);
    };
  }, [target, wheelNav]);

  // Vertical drag — maps distance to fractional position live; release snaps to the
  // nearest integer with a velocity nudge.
  const dragRef = useRef<{
    startY: number;
    startPos: number;
    lastY: number;
    lastT: number;
    vel: number; // px/ms, down-positive
    active: boolean;
  } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button, input, a")) return; // let controls win
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      startY: e.clientY,
      startPos: position.get(),
      lastY: e.clientY,
      lastT: performance.now(),
      vel: 0,
      active: true,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d?.active) return;
    const dy = e.clientY - d.startY;
    const pos = d.startPos - dy / ARC.stepY; // drag up → advance to next
    target.jump(pos);
    position.jump(pos); // keep them equal so the spring doesn't fight the finger
    const now = performance.now();
    const dt = now - d.lastT;
    if (dt > 0) d.vel = (e.clientY - d.lastY) / dt;
    d.lastY = e.clientY;
    d.lastT = now;
  };

  const endDrag = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d?.active) return;
    d.active = false;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    const indexVel = (-d.vel / ARC.stepY) * 1000; // index units / second
    const projected = position.get() + indexVel * 0.12;
    target.set(Math.round(projected)); // spring settles from current position
  };

  return (
    <div className={className}>
      <div
        ref={panelRef}
        role="group"
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPanelHover(true)}
        onMouseLeave={() => setPanelHover(false)}
        onFocus={() => setPanelFocus(true)}
        onBlur={() => setPanelFocus(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{ touchAction: "none" }}
        className="relative mx-auto aspect-square w-full max-w-[640px] cursor-grab select-none overflow-hidden rounded-[28px] border border-black/[0.06] bg-white outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-black/20"
      >
        {background && (
          <div className="pointer-events-none absolute inset-0 z-0">{background}</div>
        )}

        {visible.map((v) => (
          <ArcCard
            key={v} // keyed by VIRTUAL index → no DOM reuse across the loop seam
            v={v}
            position={position}
            slide={slideFor(v)}
            active={v === center}
            reduced={reduced}
            bare={bare}
            cardW={cardW}
            cardH={cardH}
            cfg={cfg}
          />
        ))}

        {/* Stepper — two separate rounded halves with a gap, left edge, centred */}
        <div className="absolute left-2 top-1/2 z-[200] flex -translate-y-1/2 flex-col gap-1.5">
          <StepButton dir={-1} ariaLabel="Previous slide" onClick={() => step(-1)} half="top" />
          <StepButton dir={1} ariaLabel="Next slide" onClick={() => step(1)} half="bottom" />
        </div>

        {/* Expand — bottom-left circular, fades in on panel hover */}
        {showExpand && (
          <button
            type="button"
            onClick={() => onExpand?.()}
            aria-label="Expand"
            tabIndex={panelHover ? 0 : -1}
            className={`absolute bottom-3 left-3 z-[200] grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/90 text-black/55 backdrop-blur transition-opacity duration-200 hover:text-black/90 ${
              panelHover ? "opacity-100" : "opacity-0"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="9 7 17 7 17 15" />
            </svg>
          </button>
        )}
      </div>

      {/* Polite announcement, updated after each settle */}
      <div aria-live="polite" className="sr-only">
        {announce}
      </div>

      {/* STEP 2 scrubber — tune ARC constants by eye before the spring goes on top. */}
      {debug && (
        <div className="mx-auto mt-4 flex max-w-[640px] items-center gap-3 text-xs text-neutral-500">
          <span className="tabular-nums">scrub</span>
          <input
            type="range"
            min={-2}
            max={slides.length + 2}
            step={0.01}
            defaultValue={initialIndex}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              target.set(v);
              position.jump(v); // track the thumb exactly while tuning, bypassing the spring
            }}
            className="flex-1 accent-neutral-700"
          />
          <span className="tabular-nums">t = virtualIndex − position</span>
        </div>
      )}
    </div>
  );
}
