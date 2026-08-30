"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* one full board cycle (both promotions + a short settle) before it
   replays; the loop runs only while a fine pointer is hovering */
const HOVER_LOOP_MS = 3600;

/**
 * Enter/exit state for the bento case cards.
 *
 * - Hover only on (hover: hover) and (pointer: fine).
 * - Keyboard: focus-visible triggers the identical active state.
 * - Coarse pointer: run once when >= 60% visible, then hold the end state.
 * - Exit bumps `seqKey` so the illustration subtree remounts at frame 0
 *   (hard reset) while the surface fades out via variants.
 */
export function useHoverSequence({ forceActive = false } = {}) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [canHover, setCanHover] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [held, setHeld] = useState(false); // touch fallback: holds end state
  const [seqKey, setSeqKey] = useState(0);
  const [loopTick, setLoopTick] = useState(0); // bumps each cycle while hovered
  const firedOnce = useRef(false);

  useEffect(() => {
    const hoverMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncHover = () => setCanHover(hoverMq.matches);
    const syncMotion = () => setReduced(motionMq.matches);
    syncHover();
    syncMotion();
    hoverMq.addEventListener("change", syncHover);
    motionMq.addEventListener("change", syncMotion);
    return () => {
      hoverMq.removeEventListener("change", syncHover);
      motionMq.removeEventListener("change", syncMotion);
    };
  }, []);

  /* touch / coarse pointer: play once at >= 60% visibility, then hold */
  useEffect(() => {
    if (canHover || forceActive || firedOnce.current) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.6 && !firedOnce.current) {
          firedOnce.current = true;
          setHeld(true);
          io.disconnect();
        }
      },
      { threshold: [0.6] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [canHover, forceActive]);

  /* while a fine pointer hovers, replay the board on a fixed cadence so the
     movement never stops until the pointer leaves (reduced motion opts out) */
  useEffect(() => {
    if (!(canHover && hovered) || reduced) return;
    const id = window.setInterval(
      () => setLoopTick((t) => t + 1),
      HOVER_LOOP_MS,
    );
    return () => window.clearInterval(id);
  }, [canHover, hovered, reduced]);

  const activate = useCallback(() => setHovered(true), []);
  const deactivate = useCallback(() => {
    setHovered(false);
    /* hard reset: remount the illustration at frame 0 immediately */
    setSeqKey((k) => k + 1);
  }, []);

  const isActive = forceActive || held || (canHover && hovered);

  const handlers = {
    onPointerEnter: () => {
      if (canHover) activate();
    },
    onPointerLeave: () => {
      if (canHover) deactivate();
    },
    onFocus: (e: React.FocusEvent<HTMLAnchorElement>) => {
      if (e.currentTarget.matches(":focus-visible")) activate();
    },
    onBlur: () => deactivate(),
  };

  return { ref, isActive, seqKey, loopTick, handlers, reduced };
}
