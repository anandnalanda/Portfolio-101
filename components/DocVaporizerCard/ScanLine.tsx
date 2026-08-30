"use client";

import { motion } from "framer-motion";
import { COLORS, SIZES } from "./variants";

/**
 * Vertical scan line at SIZES.scanPct across the expanded card: 2px bright
 * core with a soft bloom either side and a slow shimmer. Height matches the
 * chip's inner window.
 */
export default function ScanLine({
  reduced,
  leftPct = SIZES.scanPct,
  height = SIZES.chip - SIZES.bezel * 2,
}: {
  reduced: boolean;
  leftPct?: number;
  height?: number;
}) {
  return (
    <div
      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${leftPct}%`, height, width: 80 }}
      aria-hidden
    >
      {/* bloom */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, transparent, ${COLORS.scanBloom} 50%, transparent)`,
        }}
      />
      {/* core + shimmer */}
      <motion.div
        className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2"
        style={{
          backgroundColor: COLORS.scanCore,
          boxShadow: `0 0 12px 2px ${COLORS.scanBloom}`,
        }}
        animate={reduced ? { opacity: 1 } : { opacity: [0.65, 1, 0.65] }}
        transition={
          reduced ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
        }
      />
    </div>
  );
}
