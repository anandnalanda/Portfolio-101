"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import OfmShowcase from "./OfmShowcase";

/**
 * Interactive logo card, one source of truth:
 *   rest        — near-white card, desaturated grey mark, calm.
 *   hover/focus — brand flood + grey→white mark + zoom/lift showcase + ↗ badge.
 *   highlighted — persistent brand look + a low-opacity brand ring.
 *
 * Hover is detected on the OUTER wrapper (not the clipped card) so the arrow's
 * expanding helper pill — which lives outside the card's overflow-hidden frame —
 * can extend past the card edge without dropping the hover state.
 */

const DEFAULT_BRAND = "#064E3B"; // OFM deep emerald

// subtle hover flood: a slight lighter→deeper gradient derived from the brand
const BRAND_GRADIENT =
  "linear-gradient(150deg, color-mix(in srgb, var(--brand) 90%, white) 0%, var(--brand) 55%, color-mix(in srgb, var(--brand) 92%, black) 100%)";

const cardVariants = (): Variants => ({
  rest: { boxShadow: "0 1px 2px rgba(16,24,40,0.05)" },
  active: { boxShadow: "0 14px 34px rgba(6,78,59,0.22)" },
});

const floodVariants: Variants = {
  rest: { opacity: 0 },
  active: { opacity: 1 },
};

export default function LogoCard({
  logo,
  highlighted = false,
  href,
  label = "OFM Jobs",
  descriptor,
  brand = DEFAULT_BRAND,
}: {
  logo?: ReactNode;
  highlighted?: boolean;
  href?: string;
  label?: string;
  descriptor?: string;
  brand?: string;
}) {
  const reduce = useReducedMotion() ?? false;
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const engaged = hovered || focused; // pointer or keyboard
  const active = engaged || highlighted; // brand look
  const state = active ? "active" : "rest";

  // the clipped card (flood + rounded corners live here)
  const card = (
    <motion.div
      initial="rest"
      animate={state}
      variants={cardVariants()}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 24,
        staggerChildren: 0.06,
        delayChildren: 0.02,
      }}
      style={{ ["--brand" as string]: brand } as React.CSSProperties}
      className="relative aspect-square w-full overflow-hidden rounded-card border-2 border-surface-border bg-white"
    >
      {/* brand flood — subtle gradient derived from the brand colour */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundImage: BRAND_GRADIENT }}
        variants={floodVariants}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* highlighted ring */}
      {highlighted && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-card"
          style={{
            boxShadow:
              "inset 0 0 0 2px color-mix(in srgb, var(--brand) 38%, transparent)",
          }}
        />
      )}

      {/* logomark showcase */}
      <div className="absolute inset-0 z-10">
        {logo ?? <OfmShowcase playing={engaged} active={active} />}
      </div>
    </motion.div>
  );

  // the ↗ badge + expanding pill — OUTSIDE the clipped card so the pill escapes
  const badge = (
    <motion.div
      className="group/arrow pointer-events-none absolute bottom-2 left-2 z-40 flex items-center gap-2"
      initial={false}
      animate={engaged ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: reduce ? 0.15 : 0.2, ease: "easeOut" }}
    >
      <div
        className="pointer-events-auto relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white transition-shadow duration-300"
        style={{ boxShadow: "0 0 0 2px rgba(0,0,0,0.1)" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow =
            "0 0 0 2px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.08)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.1)")
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
      </div>

      {/* expanding helper pill — escapes the card frame (whitespace-nowrap) */}
      {descriptor && (
        <div
          className="flex h-[32px] max-w-0 items-center overflow-hidden whitespace-nowrap rounded-full bg-white/70 px-4 opacity-0 backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/arrow:max-w-[600px] group-hover/arrow:opacity-100"
          style={{ boxShadow: "0 0 0 1.5px rgba(0,0,0,0.08)" }}
        >
          <p className="text-[13px] font-medium text-txt-primary">
            <strong className="font-semibold text-txt-heading">{label}</strong>
            {": "}
            {descriptor}
          </p>
        </div>
      )}
    </motion.div>
  );

  const wrapperProps = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  };

  if (href) {
    return (
      <Link
        href={href}
        aria-label={label}
        className="relative z-0 block rounded-card outline-none hover:z-30 focus-within:z-30 focus-visible:ring-2 focus-visible:ring-black/20"
        {...wrapperProps}
      >
        {card}
        {badge}
      </Link>
    );
  }

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={label}
      className="relative z-0 rounded-card outline-none hover:z-30 focus-within:z-30 focus-visible:ring-2 focus-visible:ring-black/20"
      {...wrapperProps}
    >
      {card}
      {badge}
    </div>
  );
}
