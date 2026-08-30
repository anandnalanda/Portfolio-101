"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { COLORS, RADII, SIZES, TIMING } from "./variants";

/**
 * The IC-chip frame: light bezel ring with a pin-pad tick pattern on all four
 * edges and a punched (transparent) rounded window — the doc conveyor scrolls
 * behind it and shows only through the window. The doors slot into the window.
 */

const CHIP = SIZES.chip;
const BEZEL = SIZES.bezel;
const WIN = CHIP - BEZEL * 2;

/** Rounded-rect path (clockwise); two of them + evenodd = bezel with a hole. */
function rr(x: number, y: number, w: number, h: number, r: number) {
  return (
    `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}` +
    `V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}` +
    `A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`
  );
}

/** Pin ticks: 12 per edge, small rounded rects just inside the outer edge. */
function pins() {
  const out: { x: number; y: number; w: number; h: number }[] = [];
  const n = 12;
  const L = 8; // tick length (points inward)
  const T = 2.5; // tick thickness
  const inset = 7; // gap from the chip's outer edge
  const span = CHIP - 56; // keep clear of the rounded corners
  const step = span / (n - 1);
  for (let i = 0; i < n; i++) {
    const p = 28 + i * step;
    out.push({ x: p - T / 2, y: inset, w: T, h: L }); // top
    out.push({ x: p - T / 2, y: CHIP - inset - L, w: T, h: L }); // bottom
    out.push({ x: inset, y: p - T / 2, w: L, h: T }); // left
    out.push({ x: CHIP - inset - L, y: p - T / 2, w: L, h: T }); // right
  }
  return out;
}
const PINS = pins();

const HANDLE_POS = [
  { left: -3, top: -3 },
  { right: -3, top: -3 },
  { left: -3, bottom: -3 },
  { right: -3, bottom: -3 },
] as const;

export default function Chip({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative" style={{ width: CHIP, height: CHIP }}>
      {/* bezel ring with punched window (conveyor visible through the hole) */}
      <svg
        viewBox={`0 0 ${CHIP} ${CHIP}`}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          d={`${rr(0, 0, CHIP, CHIP, RADII.chipBezel)} ${rr(BEZEL, BEZEL, WIN, WIN, RADII.chipWindow)}`}
          fill={COLORS.bezel}
        />
        {PINS.map((p, i) => (
          <rect
            key={i}
            x={p.x}
            y={p.y}
            width={p.w}
            height={p.h}
            rx={1.25}
            fill={COLORS.bezelPin}
          />
        ))}
      </svg>

      {/* window slot — the doors live here, above the conveyor */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: BEZEL,
          top: BEZEL,
          width: WIN,
          height: WIN,
          borderRadius: RADII.chipWindow,
        }}
      >
        {children}
      </div>

      {/* corner selection handles — static, fade with hover */}
      {HANDLE_POS.map((pos, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute h-1.5 w-1.5 rounded-[1px] ring-1 ring-white"
          style={{ ...pos, backgroundColor: COLORS.handle }}
          initial={false}
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ duration: 0.2, delay: active ? TIMING.glowDelay : 0 }}
        />
      ))}
    </div>
  );
}
