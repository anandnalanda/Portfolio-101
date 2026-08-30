"use client";

/**
 * Staple Chat brand card — hover interaction.
 *
 *   idle      : only the faint, desaturated Staple symbol, centred.
 *   hover-in  : symbol zooms + un-fades to grey, then lifts + colourises
 *               grey→teal; below it the DocumentStackAnimation plays
 *               (docs fly up from the bottom → stack → spread → flip →
 *               infinite marquee). CTA fades in.
 *   hover-out : everything reverses; the doc animation hides.
 *
 * Symbol motion is transform/opacity/filter only, driven from one hover
 * state. Reduced-motion users get crossfades.
 */

import {
  motion,
  useAnimationControls,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import DocumentStackAnimation from "@/components/DocumentStackAnimation";
import { UNCOVER_EVENT } from "@/app/components/cards/SettingsCard";

/* ── brand ─────────────────────────────────────────────────────── */
const BRAND = "#003B4A"; // Staple deep teal
const EASE = [0.22, 1, 0.36, 1] as const;

/* ── symbol timing (seconds from hover start) ──────────────────── */
const T = {
  rise: 0.44, // symbol lifts + colourises
} as const;
// docs only begin after the symbol has zoomed + finished rising
const DOC_START_MS = 420;
const DOC_SPEED = 2.5; // fast doc sequence — snaps in quickly

const MARK_SIZE = 116; // px, idle symbol size
const MARK_LIFT = -40; // px the symbol rises when it colourises (baked from DialKit)
const MARK_ZOOM = 1.07; // idle → hover zoom bump on the symbol
const ZOOM_DUR = 0.24; // zoom-in + un-fade to solid grey
const RISE_DUR = 0.32; // lift + colourise
const REVEAL_DUR = 0.2; // faint grey → solid grey
const ZOOM_EASE = [0.34, 1.4, 0.64, 1] as const; // slight overshoot pop

const DOCS = [
  "/rail/doc1.svg",
  "/rail/doc2.svg",
  "/rail/doc3.svg",
  "/rail/doc4.svg",
  "/rail/doc5.svg",
  "/rail/doc6.svg",
];

export default function SwooshCard() {
  const reduced = useReducedMotion() ?? false;
  const [hovered, setHovered] = useState(false);
  // docs are gated behind the symbol's lift so idle shows only the symbol
  const [docsPlay, setDocsPlay] = useState(false);
  const docTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const state = hovered ? "hover" : "idle";

  const onEnter = () => {
    setHovered(true);
    if (docTimer.current) clearTimeout(docTimer.current);
    docTimer.current = setTimeout(() => setDocsPlay(true), DOC_START_MS);
  };
  const onLeave = () => {
    setHovered(false);
    if (docTimer.current) clearTimeout(docTimer.current);
    docTimer.current = null;
    setDocsPlay(false);
  };
  useEffect(
    () => () => {
      if (docTimer.current) clearTimeout(docTimer.current);
    },
    [],
  );

  /* when the door card's overlay retracts off this card (left→right reveal),
     the symbol springs back in from the left */
  const markEntry = useAnimationControls();
  useEffect(() => {
    const onUncover = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      markEntry.set({ x: -70 });
      markEntry.start({
        x: 0,
        transition: {
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.12,
        },
      });
    };
    window.addEventListener(UNCOVER_EVENT, onUncover);
    return () => window.removeEventListener(UNCOVER_EVENT, onUncover);
  }, [markEntry]);

  /* ── variants ────────────────────────────────────────────────── */
  // Symbol: two beats. Beat 1 (immediate) — zoom in + un-fade to solid grey.
  // Beat 2 (at T.rise) — lift up + colourise grey→teal, zoom held.
  const markVariants: Variants = {
    idle: { opacity: 0.22, scale: 1, y: 0, filter: "grayscale(1)" },
    hover: {
      opacity: 1,
      scale: reduced ? 1 : MARK_ZOOM,
      y: reduced ? 0 : MARK_LIFT,
      filter: "grayscale(0)",
      transition: reduced
        ? { duration: 0.3 }
        : {
            opacity: { duration: REVEAL_DUR, ease: "easeOut" },
            scale: { duration: ZOOM_DUR, ease: ZOOM_EASE },
            y: { duration: RISE_DUR, ease: EASE, delay: T.rise },
            filter: { duration: RISE_DUR, ease: EASE, delay: T.rise },
          },
    },
  };

  return (
    <Link
      href="/staple-chat"
      aria-label="Staple Chat — conversational AI for document analysis"
      className="group/card relative z-0 block h-full cursor-pointer hover:z-30 focus-within:z-30"
    >
      <motion.div
        onHoverStart={onEnter}
        onHoverEnd={onLeave}
        initial={false}
        animate={state}
        className="relative h-full"
      >
        {/* visual card — clipped to the rounded corners; docs + symbol live here */}
        <div className="absolute inset-0 overflow-hidden rounded-card border-2 border-surface-border bg-white">
          {/* 1 · document animation — lives at the bottom, behind the symbol */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0">
            <DocumentStackAnimation images={DOCS} play={docsPlay} speed={DOC_SPEED} />
          </div>

        {/* 2 · logo layer — symbol centred in the card (hero, above the docs) */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <motion.div
            variants={markVariants}
            style={{ width: MARK_SIZE, height: MARK_SIZE }}
            className="shrink-0"
          >
            {/* inner wrapper owns the uncover re-entry spring so it composes
                with (not fights) the hover variants on the outer div */}
            <motion.div animate={markEntry} className="h-full w-full">
            <svg
              viewBox="0 0 1186 1213"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full"
              role="img"
              aria-label="Staple"
            >
              <g fill={BRAND}>
                <path d="M1185.38 384.284V765.793C1185.38 783.789 1170.98 798.418 1153.26 798.418C1135.49 798.371 1121.14 783.741 1121.14 765.693V404.713L471.311 84.641V166.01L1064.95 458.809C1076.02 464.215 1083.01 475.617 1083.01 488.115V869.621C1083.01 887.621 1068.72 902.251 1050.9 902.251C1033.17 902.199 1018.78 887.574 1018.78 869.522V508.542L370.09 188.621V270.238L963.673 561.602C974.742 567.004 981.843 578.41 981.843 590.904V973.554C981.843 991.554 967.546 1006.13 949.723 1006.18H949.675C931.952 1006.13 917.655 991.502 917.655 973.554V611.382L267.775 292.502V373.226L861.407 665.629C872.477 671.131 879.478 682.538 879.478 695.032V1076.44C879.478 1094.49 865.081 1109.07 847.357 1109.07C829.638 1109.07 815.241 1094.39 815.241 1076.44V715.362L226.621 425.489L217.09 420.778L165.461 395.341V476.809L759.042 769.558C770.115 774.964 777.212 786.37 777.212 798.864V1180.37C777.212 1198.37 762.915 1212.85 745.096 1212.95H745.044C727.32 1212.9 713.023 1198.37 713.023 1180.32V819.243L165.51 549.303V725.876C165.51 743.924 151.114 758.502 133.391 758.502C115.669 758.502 101.272 743.924 101.272 725.876V517.617L64.1886 499.37V828.713C64.1886 846.765 49.8917 861.343 32.0696 861.343C14.2477 861.343 0.000128889 846.765 0.000128889 828.713V447.307C-0.0495143 429.307 14.2477 414.679 31.9703 414.58C36.885 414.58 41.75 415.72 46.1186 417.952L101.272 445.175V343.277C101.272 325.228 115.669 310.65 133.441 310.65C138.207 310.65 142.972 311.79 147.341 313.922L203.537 341.591V240.487C203.537 229.231 209.246 218.818 218.628 212.818C227.962 206.917 239.677 206.223 249.656 211.083L305.901 238.652V136.556C305.901 118.507 320.348 103.929 338.07 103.929C342.935 103.929 347.701 105.07 352.02 107.202L407.123 134.375V32.6756C407.123 21.4198 412.833 10.9574 422.165 5.00718C431.548 -0.992637 443.363 -1.63724 453.241 3.27168L1167.26 354.88C1178.38 360.384 1185.43 371.788 1185.43 384.284H1185.38Z" />
                <path d="M226.656 425.487C223.181 424.495 219.954 422.909 217.125 420.776L226.656 425.487Z" />
              </g>
            </svg>
            </motion.div>
          </motion.div>
        </div>
        </div>

        {/* 3 · CTA — sits OUTSIDE the clipped card so the pill can extend past
            the card edge; CSS-hover driven, pointer-events-none while hidden */}
        <div className="absolute bottom-2 left-2 z-20 flex items-center gap-2 group/arrow opacity-0 pointer-events-none transition-opacity duration-200 group-hover/card:opacity-100 group-hover/card:pointer-events-auto">
          <div
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 relative overflow-hidden transition-shadow duration-300"
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
          <div
            className="h-[32px] rounded-full bg-white/70 backdrop-blur-md flex items-center px-4 max-w-0 opacity-0 group-hover/arrow:max-w-[600px] group-hover/arrow:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] overflow-hidden whitespace-nowrap"
            style={{ boxShadow: "0 0 0 1.5px rgba(0,0,0,0.08)" }}
          >
            <p className="text-[13px] text-txt-primary font-medium">
              <span>💬</span>{" "}
              <strong className="font-semibold text-txt-heading">Staple Chat</strong>
              {": "}
              Conversational AI for document analysis.
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
