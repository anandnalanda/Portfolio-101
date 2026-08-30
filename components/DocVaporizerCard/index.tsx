"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import DoorIllustration from "@/app/components/cards/DoorIllustration";
import Chip from "./Chip";
import DocConveyor from "./DocConveyor";
import ParticleCanvas from "./ParticleCanvas";
import ScanLine from "./ScanLine";
import {
  cardAVariants,
  COLORS,
  EXPAND_REDUCED,
  EXPAND_SPRING,
  sceneLayer,
  SIZES,
  TIMING,
} from "./variants";

/**
 * "Documents → Data" hover card. Rest: 2-col grid — placeholder card (A) and
 * the chip card (B, doors closed). Hover B: it FLIPs to full row width via
 * framer-motion `layout`, the doors open, a document conveyor streams
 * left→right dissolving at a cyan scan line, and a canvas particle mist
 * drifts out the right side. Choreography lives in variants.ts.
 *
 * Doors integration: DoorIllustration, driven only via its `open` prop.
 */
export default function DocVaporizerCard() {
  const reduced = useReducedMotion() ?? false;
  const [hovered, setHovered] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const doorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    if (doorTimer.current) clearTimeout(doorTimer.current);
    leaveTimer.current = null;
    doorTimer.current = null;
  };
  useEffect(() => clearTimers, []);

  const enter = () => {
    clearTimers();
    setHovered(true);
    // doors begin ~100ms after the expansion starts
    doorTimer.current = setTimeout(
      () => setDoorsOpen(true),
      TIMING.doorsDelayMs,
    );
  };
  const leave = () => {
    clearTimers();
    // grazing the card edge must not flicker the whole sequence
    leaveTimer.current = setTimeout(() => {
      setHovered(false);
      setDoorsOpen(false);
    }, TIMING.leaveDebounceMs);
  };
  // touch: no hover — tap toggles
  const tap = () => {
    if (window.matchMedia("(hover: none)").matches) {
      if (hovered) leave();
      else enter();
    }
  };

  const spring = reduced ? EXPAND_REDUCED : EXPAND_SPRING;

  return (
    <div
      className="relative grid grid-cols-2 gap-6"
      style={{ height: SIZES.rowH }}
    >
      {/* Card A — placeholder slot (fades under the expansion) */}
      <motion.div
        variants={cardAVariants}
        initial={false}
        animate={hovered ? "hovered" : "rest"}
        className="flex items-center justify-center rounded-3xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
      >
        <span className="text-sm text-gray-300">Card A slot</span>
      </motion.div>

      {/* invisible sizer keeps the grid stable while Card B floats */}
      <div aria-hidden />

      {/* Card B — the chip card; FLIPs between half-width and full row */}
      <motion.div
        layout
        transition={spring}
        onHoverStart={enter}
        onHoverEnd={leave}
        onTap={tap}
        style={{ borderRadius: 24 }}
        className={`absolute top-0 bottom-0 z-10 cursor-pointer overflow-hidden bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] ${
          hovered ? "left-0 right-0" : "left-[calc(50%+12px)] right-0"
        }`}
      >
        {/* ── scene layers (only while hovered) ── */}
        <AnimatePresence>
          {hovered && (
            <>
              {/* 1 · radial glow, slow pulse */}
              <motion.div
                key="glow"
                variants={sceneLayer(TIMING.glowDelay)}
                initial="hidden"
                animate="show"
                exit="exit"
                className="pointer-events-none absolute top-1/2 z-0 -translate-y-1/2"
                style={{
                  left: `${SIZES.scanPct - 8}%`,
                  width: 560,
                  height: SIZES.chip + 40,
                }}
              >
                <motion.div
                  className="h-full w-full"
                  style={{
                    background: `radial-gradient(closest-side, ${COLORS.glow}, transparent)`,
                  }}
                  animate={reduced ? undefined : { scale: [1, 1.06, 1] }}
                  transition={
                    reduced
                      ? undefined
                      : { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }
                />
              </motion.div>

              {/* 2 · document conveyor (behind the chip, through the window) */}
              <motion.div
                key="conveyor"
                variants={sceneLayer(TIMING.conveyorDelay)}
                initial="hidden"
                animate="show"
                exit="exit"
                className="pointer-events-none absolute inset-0 z-10"
              >
                <DocConveyor reduced={reduced} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 3 · the chip — persistent; repositions with the FLIP. Centred via
            negative margins (not CSS transforms) so framer-motion's layout
            animation owns `transform` without stomping the centring. */}
        <motion.div
          layout
          transition={spring}
          className={`absolute top-1/2 z-20 ${
            hovered ? "left-[42%]" : "left-1/2"
          }`}
          style={{ marginLeft: -SIZES.chip / 2, marginTop: -SIZES.chip / 2 }}
        >
          <Chip active={hovered}>
            <div className="absolute inset-0">
              <DoorIllustration open={doorsOpen} />
            </div>
          </Chip>
        </motion.div>

        <AnimatePresence>
          {hovered && (
            <>
              {/* 4 · scan line */}
              <motion.div
                key="scan"
                variants={sceneLayer(TIMING.glowDelay)}
                initial="hidden"
                animate="show"
                exit="exit"
                className="pointer-events-none absolute inset-0 z-30"
              >
                <ScanLine reduced={reduced} />
              </motion.div>

              {/* 5 · particle mist */}
              <motion.div
                key="particles"
                variants={sceneLayer(TIMING.particlesDelay)}
                initial="hidden"
                animate="show"
                exit="exit"
                className="pointer-events-none absolute inset-0 z-40"
              >
                <ParticleCanvas reduced={reduced} />
              </motion.div>

              {/* 6 · ↗ button */}
              <motion.button
                key="cta"
                type="button"
                aria-label="Open"
                variants={sceneLayer(TIMING.buttonDelay, 8)}
                initial="hidden"
                animate="show"
                exit="exit"
                whileHover="ctaHover"
                className="group absolute bottom-6 left-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white"
              >
                <motion.svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={{
                    ctaHover: { scale: 1.05, x: 2, y: -2 },
                  }}
                  transition={{ duration: 0.15 }}
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="9 7 17 7 17 15" />
                </motion.svg>
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
