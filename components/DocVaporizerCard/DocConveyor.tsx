"use client";

import { motion } from "framer-motion";
import { COLORS, RADII, SIZES } from "./variants";

/**
 * Infinite left→right stream of fake document pages. The whole strip is
 * duplicated once and translated 0% → 50% (linear, looped) for a seamless
 * conveyor; the initial -? offset means it is always "mid-stream" on mount.
 * A horizontal mask dissolves pages across a band at the scan line — nothing
 * survives intact to its right.
 */

const ink = { backgroundColor: COLORS.pageInk } as const;

/** A justified paragraph block: n thin lines, last one short (deterministic
 *  widths — no randomness, so SSR/client markup match). */
function Para({ n, last = 55 }: { n: number; last?: number }) {
  const widths = Array.from({ length: n }, (_, i) =>
    i === n - 1 ? last : 94 + ((i * 7) % 6),
  );
  return (
    <div className="flex flex-col gap-[3px]">
      {widths.map((w, i) => (
        <div key={i} className="h-px" style={{ ...ink, width: `${w}%` }} />
      ))}
    </div>
  );
}

/* ── 5 page variants — dense, paper-like documents (pure JSX/SVG) ── */

function PageText() {
  return (
    <div className="flex h-full flex-col gap-2 p-2.5">
      <div className="h-[3px] w-2/5" style={ink} />
      <Para n={8} />
      <Para n={7} last={40} />
      <Para n={9} last={62} />
    </div>
  );
}

function PageFormula() {
  return (
    <div className="flex h-full flex-col gap-2 p-2.5">
      <div className="h-1 w-3/5" style={ink} />
      <Para n={6} />
      {/* centred display formula */}
      <div className="mx-auto my-0.5 flex w-3/4 items-center justify-center gap-1 border-y py-1"
        style={{ borderColor: COLORS.pageBorder }}
      >
        <div className="h-[3px] w-2/5" style={ink} />
        <div className="h-[3px] w-1/6" style={ink} />
      </div>
      <Para n={7} last={48} />
    </div>
  );
}

function PageFlowchart() {
  return (
    <div className="flex h-full flex-col gap-2 p-2.5">
      <div className="h-[3px] w-1/2" style={ink} />
      <Para n={4} last={70} />
      <svg viewBox="0 0 96 72" className="mx-auto w-4/5">
        <g fill="none" stroke={COLORS.pageInk} strokeWidth="1">
          <rect x="32" y="2" width="32" height="12" rx="2" />
          <rect x="6" y="30" width="32" height="12" rx="2" />
          <rect x="58" y="30" width="32" height="12" rx="2" />
          <rect x="32" y="58" width="32" height="12" rx="2" />
          <path d="M48 14v8M48 22H22v8M48 22h26v8M22 42v10h26v6M74 42v10H48" />
        </g>
      </svg>
      <Para n={4} last={35} />
    </div>
  );
}

function PageTwoCol() {
  return (
    <div className="flex h-full flex-col gap-1.5 p-2.5">
      <div className="h-[3px] w-1/2" style={ink} />
      <div className="flex flex-1 gap-2">
        <div className="flex flex-1 flex-col gap-2">
          <Para n={9} />
          <Para n={8} last={44} />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <Para n={5} last={66} />
          <div className="h-10 border" style={{ borderColor: COLORS.pageInk }}>
            <div className="m-1.5 h-px" style={ink} />
            <div className="m-1.5 h-px w-3/4" style={ink} />
            <div className="m-1.5 h-px w-1/2" style={ink} />
          </div>
          <Para n={6} last={38} />
        </div>
      </div>
    </div>
  );
}

function PageTable() {
  return (
    <div className="flex h-full flex-col gap-2 p-2.5">
      <div className="h-[3px] w-3/5" style={ink} />
      <Para n={6} last={58} />
      {/* small results table */}
      <div className="grid grid-cols-3 border-t border-l"
        style={{ borderColor: COLORS.pageInk }}
      >
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="border-b border-r p-1"
            style={{ borderColor: COLORS.pageInk }}
          >
            <div className="h-px" style={{ ...ink, width: `${55 + ((i * 13) % 35)}%` }} />
          </div>
        ))}
      </div>
      <Para n={5} last={42} />
    </div>
  );
}

const PAGE_VARIANTS = [PageText, PageFormula, PageFlowchart, PageTwoCol, PageTable];

/** Real document pages (e.g. the Staple Chat /rail docs, 400×540) or the
 *  built-in JSX variants when no images are given. */
function Strip({ images }: { images?: string[] }) {
  if (images) {
    const h = Math.round((SIZES.pageW * 540) / 400); // keep the docs' aspect
    return (
      <>
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt=""
            draggable={false}
            className="shrink-0 border bg-white shadow-sm"
            style={{
              width: SIZES.pageW,
              height: h,
              borderRadius: RADII.page,
              borderColor: COLORS.pageBorder,
              filter: "grayscale(1)",
            }}
          />
        ))}
      </>
    );
  }
  return (
    <>
      {PAGE_VARIANTS.map((Page, i) => (
        <div
          key={i}
          className="shrink-0 border bg-white shadow-sm"
          style={{
            width: SIZES.pageW,
            height: SIZES.pageH,
            borderRadius: RADII.page,
            borderColor: COLORS.pageBorder,
          }}
        >
          <Page />
        </div>
      ))}
    </>
  );
}

export default function DocConveyor({
  reduced,
  scanPct = SIZES.scanPct,
  images,
}: {
  reduced: boolean;
  scanPct?: number;
  images?: string[];
}) {
  // one full strip (pages + gaps) scrolls past per loop
  const loopSecs = (images?.length ?? PAGE_VARIANTS.length) * SIZES.pageSecs;
  const mask = `linear-gradient(to right, black 0%, black ${
    scanPct - SIZES.dissolveBandPct
  }%, transparent ${scanPct + SIZES.dissolveBandPct}%)`;

  // container height = the actual page height, so the strip is centred in the
  // card by construction (equal top/bottom gaps), not via flex alignment
  const stripH = images
    ? Math.round((SIZES.pageW * 540) / 400)
    : SIZES.pageH;

  return (
    <div
      className="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden opacity-95"
      style={{
        height: stripH,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    >
      <motion.div
        className="flex w-max items-center"
        style={{ gap: SIZES.pageGap, paddingRight: SIZES.pageGap }}
        initial={{ x: "-50%" }}
        animate={reduced ? { x: "-25%" } : { x: "0%" }}
        transition={
          reduced
            ? { duration: 0 }
            : { duration: loopSecs, ease: "linear", repeat: Infinity }
        }
      >
        <Strip images={images} />
        <Strip images={images} />
      </motion.div>
    </div>
  );
}
