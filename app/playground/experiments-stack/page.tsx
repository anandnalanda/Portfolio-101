"use client";

import { useState } from "react";
import { DialRoot, useDialKit } from "dialkit";
import "dialkit/styles.css";
import ExperimentsCard, {
  STACK,
  type StackGeometry,
} from "@/app/components/cards/ExperimentsCard";

/** slider tuple, typed so useDialKit resolves the folder to plain numbers */
const dial = (
  value: number,
  min: number,
  max: number,
  step: number,
): [number, number, number, number] => [value, min, max, step];

/**
 * Tuning bench for the "Experiments with AI" stack.
 *
 * Three copies of the real card, all driven by the same dials: one pinned to
 * idle, one pinned to fanned, one live so you can feel the spring. The cells
 * are 258 × 540 — exactly what the card gets in the bento grid at the 1200px
 * max width (a 258px column, row-span-2, 24px gutter), so what you see here is
 * what lands on the home page.
 *
 * When it looks right, hit "Copy STACK" and paste over STACK in
 * app/components/cards/ExperimentsCard.tsx.
 */

/* the dial keys deliberately match StackGeometry's, so the folders can be
   spread straight into a geometry override */
const CONFIG = {
  frame: {
    frameW: dial(STACK.frameW, 140, 340, 1),
    frameH: dial(STACK.frameH, 180, 460, 1),
    headerH: dial(STACK.headerH, 24, 56, 1),
  },
  look: {
    restGround: { type: "color" as const, default: STACK.restGround },
    restInk: { type: "color" as const, default: STACK.restInk },
    restTitle: { type: "color" as const, default: STACK.restTitle },
    restBorder: dial(STACK.restBorder, 0, 0.4, 0.01),
    colorFade: dial(STACK.colorFade, 0, 2000, 25),
  },
  title: {
    titleSize: dial(STACK.titleSize, 12, 48, 0.5),
    titleTop: dial(STACK.titleTop, 0, 60, 0.5),
    titleLeft: dial(STACK.titleLeft, 0, 40, 0.5),
    titleRight: dial(STACK.titleRight, 0, 40, 0.5),
    titleLeading: dial(STACK.titleLeading, 0.8, 1.6, 0.01),
    titleTracking: dial(STACK.titleTracking, -0.08, 0.1, 0.005),
  },
  art: {
    artTop: dial(STACK.artTop, 0, 80, 0.5),
    artBottom: dial(STACK.artBottom, 0, 60, 0.5),
    artInset: dial(STACK.artInset, 0, 40, 0.5),
  },
  rest: {
    stepX: dial(STACK.stepX, -20, 40, 0.5),
    stepY: dial(STACK.stepY, 0, 44, 0.5),
    overhang: dial(STACK.overhang, -40, 160, 1),
    baseTop: dial(STACK.baseTop, -60, 220, 1),
    stackBottom: dial(STACK.stackBottom, 0, 260, 1),
  },
  /* the tucked rest pose — how much of the deck peeks before you hover, and
     how far it travels right-to-left on the way in */
  tuck: {
    tuckX: dial(STACK.tuckX, 0, 260, 1),
    tuckStepX: dial(STACK.tuckStepX, -20, 40, 0.5),
    tuckStepY: dial(STACK.tuckStepY, 0, 44, 0.5),
  },
  fan: {
    fanGap: dial(STACK.fanGap, 0, 56, 0.5),
    fanShiftY: dial(STACK.fanShiftY, -100, 100, 1),
    fanSpreadX: dial(STACK.fanSpreadX, -60, 140, 1),
    fanTailX: dial(STACK.fanTailX, -80, 100, 1),
    fanRotate: dial(STACK.fanRotate, -24, 24, 0.5),
    fanTailRotate: dial(STACK.fanTailRotate, -24, 24, 0.5),
    growDown: STACK.growDown,
  },
  spring: {
    stiffness: dial(STACK.stiffness, 40, 700, 5),
    damping: dial(STACK.damping, 4, 70, 1),
    mass: dial(STACK.mass, 0.2, 3, 0.05),
    stagger: dial(STACK.stagger, 0, 0.2, 0.005),
  },
};

const CELL_W = 258;
const CELL_H = 540;

export default function ExperimentsStackPlayground() {
  const d = useDialKit("Experiments stack", CONFIG);

  const geometry: StackGeometry = {
    ...d.frame,
    ...d.look,
    ...d.title,
    ...d.art,
    ...d.rest,
    ...d.tuck,
    ...d.fan,
    ...d.spring,
  };

  /* how much of each frame behind the front one shows when the stack fans */
  const reveal = geometry.stepY + geometry.fanGap;
  /* where the title's first line ends, in px from the frame top */
  const titleEnd =
    (geometry.titleTop / 100) * geometry.frameH +
    geometry.titleSize * geometry.titleLeading;
  const titleClears = titleEnd <= reveal;
  /* A frame sits `x` px right of its anchor, and the 258px cell clips it, so
     the strip still on show at rest is `253 - x`. Front frame = highest slot. */
  const n = 4;
  const strip = (slot: number) =>
    253 - (geometry.tuckStepX * slot + geometry.tuckX);
  const frontStrip = strip(n - 1);
  const backStrip = strip(0);
  /* how far the front frame slides left when the deck opens */
  const travel =
    geometry.tuckStepX * (n - 1) + geometry.tuckX - geometry.stepX * (n - 1);
  const stripOk = frontStrip > 2 && backStrip < 253;
  /* the title starts titleLeft% in from the frame's left edge, so it only
     stays hidden at rest while the strip is narrower than that */
  const titleInset = (geometry.titleLeft / 100) * geometry.frameW;
  const titleHiddenAtRest = backStrip <= titleInset;

  const snippet =
    "export const STACK: StackGeometry = {\n" +
    (Object.keys(STACK) as (keyof StackGeometry)[])
      .map((k) => `  ${k}: ${JSON.stringify(geometry[k])},`)
      .join("\n") +
    "\n};";

  return (
    <main className="min-h-dvh bg-[#fafafa] px-10 py-14">
      <DialRoot position="top-right" defaultOpen mode="popover" theme="light" />

      <div className="max-w-[1104px]">
        <h1 className="text-lg font-semibold text-neutral-800">
          Experiments stack
        </h1>
        <p className="mt-1 max-w-[560px] text-sm text-neutral-500">
          Cells are 258 × 540, the card&apos;s real size in the bento at the
          1200px max width. Open the panel top-right to size the frames and move
          them; idle (outline) and hover (filled) are pinned side by side so you can
          tune both without chasing the cursor.
        </p>

        <div className="mt-10 flex flex-wrap gap-6">
          <Cell label="Idle">
            <ExperimentsCard geometry={geometry} state="idle" />
          </Cell>
          <Cell label="Hover / focus">
            <ExperimentsCard geometry={geometry} state="fanned" />
          </Cell>
          <Cell label="Live, hover me">
            <ExperimentsCard geometry={geometry} />
          </Cell>
        </div>

        <div className="mt-12 max-w-[560px]">
          <div className="flex items-center gap-3">
            <CopyButton snippet={snippet} />
            <span
              className={`text-xs font-medium ${
                titleClears ? "text-neutral-400" : "text-amber-600"
              }`}
            >
              {`sliver ${geometry.stepY}px shut -> ${reveal}px open (${(
                reveal / Math.max(geometry.stepY, 0.5)
              ).toFixed(1)}x) · title line ends ${titleEnd.toFixed(0)}px ${
                titleClears ? "· clears" : "CLIPPED when open"
              }`}
            </span>
          </div>
          <div className="mt-2">
            <span
              className={`text-xs font-medium ${
                stripOk ? "text-neutral-400" : "text-amber-600"
              }`}
            >
              {`tucked: back frame shows ${backStrip.toFixed(0)}px, front ${frontStrip.toFixed(
                0,
              )}px · slides ${travel.toFixed(0)}px right-to-left on hover${
                stripOk ? "" : ". Nothing peeks, raise tuckX or lower it"
              }`}
            </span>
            <span
              className={`ml-2 text-xs font-medium ${
                titleHiddenAtRest ? "text-neutral-400" : "text-amber-600"
              }`}
            >
              {titleHiddenAtRest
                ? "· titles hidden at rest"
                : `· titles peek (need a strip under ${titleInset.toFixed(0)}px)`}
            </span>
          </div>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-neutral-200 bg-white p-4 text-[11px] leading-relaxed text-neutral-600">
            {snippet}
          </pre>
        </div>
      </div>
    </main>
  );
}

function CopyButton({ snippet }: { snippet: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(snippet).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        });
      }}
      className="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
    >
      {copied ? "Copied" : "Copy STACK"}
    </button>
  );
}

/* the grid rows reproduce the bento's row-span-2, which is where the card's
   h-full gets its height from */
function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        className="grid grid-rows-2"
        style={{ width: CELL_W, height: CELL_H }}
      >
        {children}
      </div>
      <p className="mt-3 text-center text-xs font-medium text-neutral-400">
        {label}
      </p>
    </div>
  );
}
