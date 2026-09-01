"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import DocConveyor from "@/components/DocVaporizerCard/DocConveyor";
import ParticleCanvas from "@/components/DocVaporizerCard/ParticleCanvas";
import {
  EXPAND_REDUCED,
  EXPAND_SPRING,
  sceneLayer,
  TIMING,
} from "@/components/DocVaporizerCard/variants";
import DoorIllustration from "./DoorIllustration";

/**
 * Switch/panel card — the door illustration, unchanged, with the
 * "documents → data" hover scene (reference: chip processor mock):
 * on hover (lg+) the card FLIPs left over the Staple Chat card, tints to a
 * soft warm grey, the doors open, paper-like documents stream left→right and
 * dissolve at the chip's right edge — no visible scan line — into a teal
 * ghost-document glow with a symbol/sparkle mist. Teal dots mark the chip
 * corners; the Staple Chat double-arrow CTA sits bottom-left.
 * Below lg, hover just opens the doors in place.
 */

/* bento geometry (lg+): fixed 258px columns, 24px gap; this card is row 1
 * col 3. It expands LEFT only, covering the Staple Chat card (col 2). */
const CELL = 258;
const GAP = 24;
const EXPAND_LEFT = -(CELL + GAP); // -282 — over the Staple Chat card
const ILLO_LEFT_PCT = 45; // illustration centre, % of expanded card (540px)
/* documents must be fully dissolved BEFORE the chip's right edge (~65.7%),
 * so no page ever appears past the door — only data comes out */
const DISSOLVE_PCT = 60; // conveyor mask centre (gone by 64%)
const EMIT_PCT = 66; // binary mist emits at the chip's right edge
const RADIUS = 28; // rounded-card
/* expanded fill: quiet zinc gradient (design-system neutrals), top-left lit
 * to match the illustration's shadow model */
const EXPANDED_GRADIENT =
  "linear-gradient(160deg, #fafafa 0%, #f4f4f5 45%, #e9e9eb 100%)";
/* the door-window opening in illustration coords (the punched backing hole) */
const WIN = { x: 33.55, y: 32.4, size: 193.2, r: 8.78 } as const;
const BEAM_W = 72; // scanner beam width
const BEAM_SECS = 2.6; // one right→left sweep
/* emission pulse — baked from DialKit:
 * posX 64, posY -10, width 200, height 260, curvature 1.2,
 * intensity 0.65, spread 72 */
const PULSE = {
  left: "64%",
  width: 200,
  height: 260,
  top: "calc(50% - 140px)", // height/2 − posY(−10)
  bg: "radial-gradient(ellipse 200px 156px at 0% 50%, rgba(11,110,134,0.6) 0%, rgba(23,145,168,0.27) 36%, transparent 72%)",
} as const;
/* the actual Staple Chat documents (same rail as the SwooshCard animation) */
const DOCS = [
  "/rail/doc1.svg",
  "/rail/doc2.svg",
  "/rail/doc3.svg",
  "/rail/doc4.svg",
  "/rail/doc5.svg",
  "/rail/doc6.svg",
  "/rail/doc7.svg",
];
/** fired when the overlay starts contracting off the Staple Chat card, so its
 *  symbol can spring back in with the reveal (see SwooshCard) */
export const UNCOVER_EVENT = "staple-card-uncovered";

export default function SettingsCard() {
  const reduced = useReducedMotion() ?? false;

  const [expanded, setExpanded] = useState(false);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = null;
  };
  useEffect(() => clearTimers, []);

  const wasExpanded = useRef(false);

  const enter = () => {
    clearTimers();
    // simultaneous: the doors slide open WHILE the card expands (their springs
    // overlap). Below lg there is no expansion — hover just opens the doors.
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setExpanded(true);
      wasExpanded.current = true;
    }
    setDoorsOpen(true);
  };
  const leave = () => {
    clearTimers();
    leaveTimer.current = setTimeout(() => {
      // simultaneous: doors close WHILE the card contracts
      setDoorsOpen(false);
      setExpanded(false);
      if (wasExpanded.current) {
        wasExpanded.current = false;
        // the contraction reveals the Staple Chat card left→right
        window.dispatchEvent(new Event(UNCOVER_EVENT));
      }
    }, TIMING.leaveDebounceMs);
  };

  const spring = reduced ? EXPAND_REDUCED : EXPAND_SPRING;

  return (
    /* the grid cell — keeps its slot while the overlay floats above the row */
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
      style={{ zIndex: expanded ? 40 : undefined }}
    >
      <motion.div
        layout
        transition={spring}
        onHoverStart={enter}
        onHoverEnd={leave}
        className="absolute inset-y-0 cursor-pointer overflow-hidden border-2 border-surface-border bg-white"
        style={{
          borderRadius: RADIUS,
          left: expanded ? EXPAND_LEFT : 0,
          right: 0,
        }}
      >
        {/* preload the conveyor documents at mount so the first hover never
            hitches on network/decode mid-animation */}
        <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
          {DOCS.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" />
          ))}
        </div>

        {/* expanded fill — zinc gradient fading in under everything */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0"
          style={{ backgroundImage: EXPANDED_GRADIENT }}
          initial={false}
          animate={{ opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />

        {/* ── scene (builds once the doors start opening) ── */}
        <AnimatePresence>
          {expanded && doorsOpen && (
            <>
              {/* emission glow — teal wash off the chip's right edge, pulsing
                  on the same clock as the scanner beam (phase-locked) */}
              <motion.div
                key="pulse"
                variants={sceneLayer(TIMING.conveyorDelay)}
                initial="hidden"
                animate="show"
                exit="exit"
                className="pointer-events-none absolute z-10"
                style={{
                  left: PULSE.left,
                  width: PULSE.width,
                  height: PULSE.height,
                  // centred via top maths, NOT transform — framer-motion owns
                  // this element's transform (variants) and would stomp it
                  top: PULSE.top,
                }}
              >
                <motion.div
                  className="h-full w-full"
                  style={{ background: PULSE.bg }}
                  animate={reduced ? { opacity: 0.5 } : { opacity: [0.35, 0.9, 0.35] }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : {
                          duration: BEAM_SECS,
                          ease: "easeInOut",
                          repeat: Infinity,
                        }
                  }
                />
              </motion.div>

              {/* document conveyor — dissolves at the chip's right edge */}
              <motion.div
                key="conveyor"
                variants={sceneLayer(TIMING.conveyorDelay)}
                initial="hidden"
                animate="show"
                exit="exit"
                className="pointer-events-none absolute inset-0 z-10"
              >
                <DocConveyor reduced={reduced} scanPct={DISSOLVE_PCT} images={DOCS} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* the illustration — unchanged, FLIPs from filling the cell to its
            chip position */}
        <motion.div
          layout
          transition={spring}
          className={expanded ? "absolute top-1/2 z-20" : "absolute inset-0 z-20"}
          style={
            expanded
              ? {
                  left: `${ILLO_LEFT_PCT}%`,
                  width: CELL,
                  height: CELL,
                  marginLeft: -CELL / 2,
                  marginTop: -CELL / 2,
                  // keep the filter-heavy SVG cached on its own compositor
                  // layer so the FLIP never re-rasterises it per frame
                  willChange: "transform",
                }
              : { willChange: "transform" }
          }
        >
          <DoorIllustration open={doorsOpen} />

          {/* scanner beam — sweeps right→left inside the door window */}
          <AnimatePresence>
            {expanded && doorsOpen && (
              <motion.div
                key="beam"
                variants={sceneLayer(TIMING.conveyorDelay)}
                initial="hidden"
                animate="show"
                exit="exit"
                className="pointer-events-none absolute overflow-hidden"
                style={{
                  left: WIN.x,
                  top: WIN.y,
                  width: WIN.size,
                  height: WIN.size,
                  borderRadius: WIN.r,
                }}
              >
                <motion.div
                  className="absolute inset-y-0"
                  style={{
                    width: BEAM_W,
                    background:
                      "linear-gradient(to right, rgba(11,110,134,0.5), rgba(23,145,168,0.26) 35%, rgba(159,216,226,0.14) 70%, transparent)",
                  }}
                  initial={{ x: WIN.size }}
                  animate={
                    reduced
                      ? { x: (WIN.size - BEAM_W) / 2 }
                      : { x: [WIN.size, -BEAM_W] }
                  }
                  transition={
                    reduced
                      ? { duration: 0 }
                      : {
                          duration: BEAM_SECS,
                          ease: "linear",
                          repeat: Infinity,
                        }
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {expanded && doorsOpen && (
            <>
              {/* particle mist — symbols + sparkles drifting right */}
              <motion.div
                key="particles"
                variants={sceneLayer(TIMING.particlesDelay)}
                initial="hidden"
                animate="show"
                exit="exit"
                className="pointer-events-none absolute inset-0 z-40"
              >
                <ParticleCanvas reduced={reduced} scanPct={EMIT_PCT} />
              </motion.div>

              {/* CTA — same double-arrow as the Staple Chat card, and the same
                  destination: the Staple Chat case study */}
              <motion.div
                key="cta"
                variants={sceneLayer(TIMING.buttonDelay, 8)}
                initial="hidden"
                animate="show"
                exit="exit"
                className="group/arrow absolute bottom-2 left-2 z-50 flex items-center gap-2"
              >
                <Link
                  href="/staple-chat"
                  aria-label="Staple Chat case study"
                  className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white transition-shadow duration-300"
                  style={{ boxShadow: "0 0 0 2px rgba(0,0,0,0.1)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 0 0 2px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.08)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 0 0 2px rgba(0,0,0,0.1)")
                  }
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
                {/* expanding helper pill — same as the Staple Chat card */}
                <div
                  className="flex h-[32px] max-w-0 items-center overflow-hidden whitespace-nowrap rounded-full bg-white/70 px-4 opacity-0 backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/arrow:max-w-[600px] group-hover/arrow:opacity-100"
                  style={{ boxShadow: "0 0 0 1.5px rgba(0,0,0,0.08)" }}
                >
                  <p className="text-[13px] font-medium text-txt-primary">
                    <span>💬</span>{" "}
                    <strong className="font-semibold text-txt-heading">
                      Staple Chat
                    </strong>
                    {": "}
                    Conversational AI for document analysis.
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
