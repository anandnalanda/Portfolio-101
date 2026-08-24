"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";
import type { CSSProperties } from "react";

/* OFM case-study highlight frame — the Staple AccentFrame idiom rebuilt in the
   OFM brand so the two design systems never cross-import (see the isolation
   rule). A 2px brand-green border, a whisper of fill, and a soft glow; fades in
   on mount, static under reduced motion. `alive` gives it a slow, barely-there
   breath so it never reads as a frozen sticker.

   `inset` is a CSS inset string on the absolutely-positioned wrapper: positive
   pulls the frame inward, negative pushes it outward past the target. The
   parent must be `position: relative`. */
export const OFM_HIGHLIGHT = "#0B885A"; // ofm-500 — a lively brand green

export default function AccentFrame({
  inset,
  radius,
  alive = false,
  enter,
  enterTransition,
  style,
}: {
  inset: string;
  radius: number;
  alive?: boolean;
  /** Where the frame travels in from, relative to its final spot. Default is a
      small drop from above ({y: -16}); pass e.g. {x: -520} to fly in from the
      left and settle onto the target. */
  enter?: { x?: number; y?: number };
  /** Override the entrance spring (e.g. a gentler glide for a long travel). */
  enterTransition?: Transition;
  style?: CSSProperties;
}) {
  const reduceMotion = useReducedMotion();
  const breathe = alive && !reduceMotion;
  const ex = enter?.x ?? 0;
  const ey = enter?.y ?? -16;
  return (
    <motion.div
      aria-hidden
      style={{
        position: "absolute",
        inset,
        pointerEvents: "none",
        transformOrigin: "center",
        ...style,
      }}
      initial={reduceMotion ? false : { opacity: 0, x: ex, y: ey, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : (enterTransition ?? {
              /* Organic, gel-like spring — the frame expands into place and
                 settles with a lively overshoot (Dynamic-Island feel), alive
                 in the transition, calm at rest. Low damping = the bounce. */
              type: "spring",
              stiffness: 240,
              damping: 14,
              mass: 0.9,
              opacity: { duration: 0.24, ease: "easeOut" },
            })
      }
    >
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          border: `2px solid ${OFM_HIGHLIGHT}`,
          background: `color-mix(in srgb, ${OFM_HIGHLIGHT} 3%, transparent)`,
          boxShadow: `0 0 0 4px color-mix(in srgb, ${OFM_HIGHLIGHT} 10%, transparent), 0 0 20px color-mix(in srgb, ${OFM_HIGHLIGHT} 14%, transparent)`,
        }}
        animate={breathe ? { scale: [1, 1.01, 1], opacity: [1, 0.85, 1] } : undefined}
        transition={
          breathe
            ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      />
    </motion.div>
  );
}
