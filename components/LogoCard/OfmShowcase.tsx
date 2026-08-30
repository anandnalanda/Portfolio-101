"use client";

import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

/**
 * OFM Jobs animated showcase — on hover the mark simply zooms in with a small
 * pop and colourises grey→white; reverses on leave. No lift, no wordmark.
 *
 * Colour inherits the card's rest/active variant; the front figure keeps its
 * knockout stroke.
 */

const FRONT_TORSO =
  "M4.32544 12.3047C10.9252 12.3047 16.2822 17.7831 16.2822 24.5323H4.32544V12.3047Z";
const FRONT_HEAD =
  "M9.87776 11.3562C12.9442 11.3562 15.4301 8.81399 15.4301 5.67808C15.4301 2.54216 12.9442 0 9.87776 0C6.8113 0 4.32544 2.54216 4.32544 5.67808C4.32544 8.81399 6.8113 11.3562 9.87776 11.3562Z";
const BACK_TORSO =
  "M20.2814 28.0011H8.32471C8.32471 21.2519 13.6817 15.7734 20.2814 15.7734V28.0011Z";
const BACK_HEAD =
  "M14.7283 14.8209C17.7948 14.8209 20.2807 12.2788 20.2807 9.14293C20.2807 6.00701 17.7948 3.46484 14.7283 3.46484C11.6619 3.46484 9.17603 6.00701 9.17603 9.14293C9.17603 12.2788 11.6619 14.8209 14.7283 14.8209Z";

// centre the mark (bbox centre 12.303,14) inside a 40×40 box
const CENTER = "translate(7.697 6)";

const ZOOM = 1.1; // hover zoom

export default function OfmShowcase({
  playing,
  active,
}: {
  playing: boolean;
  active: boolean;
}) {
  const reduce = useReducedMotion() ?? false;
  const knockout = active ? "var(--brand)" : "#ffffff";

  const markScale = useMotionValue(1);

  useEffect(() => {
    if (reduce) {
      markScale.set(1);
      return;
    }
    animate(
      markScale,
      playing ? ZOOM : 1,
      playing
        ? { duration: 0.26, ease: [0.34, 1.4, 0.64, 1] }
        : { duration: 0.28, ease: "easeOut" },
    );
  }, [playing, reduce, markScale]);

  return (
    <div className="absolute inset-0">
      {/* scale the flex-centered container (HTML element) so the zoom origin is
          reliably the card centre — not a fill-box guess on an inner <g> */}
      <motion.div
        className="absolute inset-0 flex origin-center items-center justify-center"
        style={{ scale: markScale }}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-[64%] w-auto"
          role="img"
          aria-label="OFM Jobs"
        >
          {/* colour wrapper — inherits the card's rest/active variant */}
          <motion.g
            variants={{ rest: { color: "#D1D1D1" }, active: { color: "#FFFFFF" } }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <g transform={CENTER}>
              <path d={BACK_TORSO} fill="currentColor" />
              <path d={BACK_HEAD} fill="currentColor" />
              <path
                d={FRONT_TORSO}
                fill="currentColor"
                stroke={knockout}
                strokeWidth={1}
                strokeLinejoin="round"
              />
              <path
                d={FRONT_HEAD}
                fill="currentColor"
                stroke={knockout}
                strokeWidth={1}
                strokeLinejoin="round"
              />
            </g>
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
}
