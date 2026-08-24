"use client";

/**
 * BigTypeVisual — the "moment of silence" beat for the Staple Chat case study.
 *
 * A deliberate pause after the two dense diagram beats: one line of display
 * type, alone on the white panel. The emptiness around it is the design —
 * no imagery, no accent color, no second element.
 *
 * Type: Spectral (the case study's narrator serif), heading ink, deliberately
 * broken as a two-line lockup so the wrap is always balanced. Motion is a
 * single quiet fade-up when the beat activates; reduced-motion shows it
 * static.
 */
import { motion, useReducedMotion } from "framer-motion";
import { Spectral } from "next/font/google";

const spectral = Spectral({
  subsets: ["latin"],
  weight: "400",
  style: "normal",
  display: "swap",
});

/** Flip to "left" to compare the left-aligned variant. */
const ALIGN: "center" | "left" = "center";

export function BigTypeVisual({ active }: { active: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`absolute inset-0 bg-white flex flex-col justify-center px-[9%] ${
        ALIGN === "center" ? "items-center text-center" : "items-start text-left"
      }`}
    >
      <motion.p
        className={`${spectral.className} text-txt-heading text-[clamp(44px,5vw,92px)] leading-[1.08] tracking-[-0.02em]`}
        initial={false}
        animate={
          reduceMotion
            ? { opacity: 1, y: 0 }
            : active
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 14 }
        }
        transition={
          reduceMotion ? { duration: 0 } : { duration: 0.4, ease: "easeOut" }
        }
      >
        <span className="block">Nobody wanted</span>
        <span className="block">a better dashboard.</span>
      </motion.p>
    </div>
  );
}
