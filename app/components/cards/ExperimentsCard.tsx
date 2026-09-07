"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

/**
 * Experiments with AI — a stack of app frames pushed past the card's right
 * edge so the card clips them (the "not fully disclosed" beat). Hovering or
 * focusing the card fans the stack so every frame's header is readable and
 * each frame is its own link. Touch devices get the fanned state by default.
 *
 * Edit EXPERIMENTS to change what's shown. Order is back → front; put the
 * most visual project last so it's the one seen at rest. Works for 3 or 4.
 */
type Experiment = {
  name: string;
  href: string;
  accent: string;
  status: "shipped" | "in-progress";
  preview: ReactNode;
};

/* ---- mini previews: abstract UI in each product's accent ------------------ */

function ChatPreview({ accent }: { accent: string }) {
  return (
    <div className="flex h-full flex-col justify-end gap-2 p-3">
      <div className="mr-8 rounded-[10px] rounded-bl-[3px] bg-white p-2 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
        <div className="h-1.5 w-10/12 rounded bg-zinc-300/80" />
        <div className="mt-1.5 h-1.5 w-7/12 rounded bg-zinc-300/80" />
      </div>
      <div
        className="ml-10 rounded-[10px] rounded-br-[3px] p-2"
        style={{ background: accent }}
      >
        <div className="h-1.5 w-9/12 rounded bg-white/70" />
        <div className="mt-1.5 h-1.5 w-5/12 rounded bg-white/70" />
      </div>
      <div className="mr-6 rounded-[10px] rounded-bl-[3px] bg-white p-2 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
        <div className="mb-1.5 inline-flex items-center gap-1 rounded-full border border-zinc-200 px-1.5 py-0.5">
          <span className="h-1.5 w-1.5 rounded-sm bg-red-400" />
          <span className="h-1 w-9 rounded bg-zinc-300" />
        </div>
        <div className="h-1.5 w-full rounded bg-zinc-300/80" />
        <div className="mt-1.5 h-1.5 w-8/12 rounded bg-zinc-300/80" />
      </div>
      <div className="mt-1 flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-2.5 py-1.5">
        <div className="h-1.5 flex-1 rounded bg-zinc-200" />
        <span className="h-3 w-3 rounded-full" style={{ background: accent }} />
      </div>
    </div>
  );
}

function TablesPreview({ accent }: { accent: string }) {
  const cells = Array.from({ length: 15 }, (_, i) => i);
  const hot = new Set([1, 5, 7, 12]);
  return (
    <div className="flex h-full items-center gap-2 p-3">
      <div className="flex w-[52px] shrink-0 flex-col gap-1.5 rounded-[6px] bg-white p-2 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
        <div className="h-1.5 w-8/12 rounded bg-zinc-400/70" />
        <div className="h-1 w-full rounded bg-zinc-300/80" />
        <div className="h-1 w-full rounded bg-zinc-300/80" />
        <div className="h-1 w-9/12 rounded bg-zinc-300/80" />
        <div className="h-1 w-full rounded bg-zinc-300/80" />
        <div className="h-1 w-7/12 rounded bg-zinc-300/80" />
        <div className="h-1 w-full rounded bg-zinc-300/80" />
      </div>
      <svg width="14" height="10" viewBox="0 0 14 10" className="shrink-0 text-zinc-400">
        <path d="M1 5h11M8 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="grid flex-1 grid-cols-3 gap-[3px] rounded-[6px] bg-white p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
        {cells.map((i) => (
          <div
            key={i}
            className="h-[11px] rounded-[2px]"
            style={{
              background: i < 3 ? "#E4E4E7" : hot.has(i) ? accent : "#F4F4F5",
              opacity: hot.has(i) ? 0.85 : 1,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function KanbanPreview({ accent }: { accent: string }) {
  const cols: number[][] = [
    [22, 30],
    [26, 22, 30],
    [30],
  ];
  return (
    <div className="flex h-full gap-2 p-3">
      {cols.map((cards, c) => (
        <div key={c} className="flex flex-1 flex-col gap-1.5">
          <div className="mb-0.5 h-1.5 w-7/12 rounded bg-zinc-400/60" />
          {cards.map((h, i) => (
            <div
              key={i}
              className="relative rounded-[6px] bg-white p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
              style={{ height: h }}
            >
              <div className="h-1 w-10/12 rounded bg-zinc-300/80" />
              {h > 24 && <div className="mt-1 h-1 w-6/12 rounded bg-zinc-300/80" />}
              {c === 1 && i === 1 && (
                <span
                  className="absolute bottom-1.5 right-1.5 h-2 w-4 rounded-full"
                  style={{ background: accent }}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function TestsPreview({ accent }: { accent: string }) {
  return (
    <div className="flex h-full flex-col gap-2 p-3 opacity-80">
      <div className="flex items-center gap-1.5">
        <div className="h-4 w-4 rounded-full border border-dashed border-zinc-400" />
        <div className="h-1.5 w-7/12 rounded bg-zinc-300/80" />
      </div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex items-center gap-2 rounded-[6px] border border-dashed border-zinc-300 bg-white/60 p-2"
        >
          <div className="h-5 w-5 shrink-0 rounded-full bg-zinc-200" />
          <div className="flex-1">
            <div className="h-1.5 w-8/12 rounded bg-zinc-300/80" />
            <div className="mt-1 h-1 w-5/12 rounded bg-zinc-200" />
          </div>
          <span
            className="h-2 w-6 rounded-full"
            style={{ background: i === 0 ? accent : "#E4E4E7", opacity: i === 0 ? 0.7 : 1 }}
          />
        </div>
      ))}
    </div>
  );
}

/* ---- data --------------------------------------------------------------- */

const EXPERIMENTS: Experiment[] = [
  {
    name: "OFM Jobs Tests",
    href: "/ofm-jobs-tests",
    accent: "#FF6E8E",
    status: "in-progress",
    preview: <TestsPreview accent="#FF6E8E" />,
  },
  {
    name: "Kanban AI",
    href: "/kanban-and-ai",
    accent: "#FFA24B",
    status: "shipped",
    preview: <KanbanPreview accent="#FFA24B" />,
  },
  {
    name: "Staple Tables",
    href: "/staple-tables",
    accent: "#2FC08A",
    status: "shipped",
    preview: <TablesPreview accent="#2FC08A" />,
  },
  {
    name: "Staple Chat",
    href: "/staple-chat",
    accent: "#6D7BFF",
    status: "shipped",
    preview: <ChatPreview accent="#6D7BFF" />,
  },
];

/* ---- geometry ----------------------------------------------------------- */

const FRAME_W = 200;
const FRAME_H = 268;
const HEADER_H = 34;
/* rest: each frame steps 10px right and 16px down from the one behind it.
   The stack is anchored to the card's RIGHT edge, with the front frame
   overhanging it by OVERHANG px so the card clips it at any card width. */
const STEP_X = 10;
const STEP_Y = 16;
const OVERHANG = 30;
const BASE_TOP = 62;

/* fan: back frames swing up-left, the front eases down-right, so every header
   clears the frame in front of it. Values run back → front. */
const FAN: Record<number, { x: number; y: number; r: number }[]> = {
  3: [
    { x: -22, y: -40, r: -5.5 },
    { x: -8, y: -16, r: -2 },
    { x: 6, y: 6, r: 1 },
  ],
  4: [
    { x: -26, y: -46, r: -6 },
    { x: -14, y: -28, r: -3.5 },
    { x: -4, y: -12, r: -1 },
    { x: 6, y: 6, r: 1 },
  ],
};

function Frame({ exp, i, fanned, reduced }: { exp: Experiment; i: number; fanned: boolean; reduced: boolean }) {
  const n = EXPERIMENTS.length;
  const fan = (FAN[n] ?? FAN[4])[i] ?? { x: 0, y: 0, r: 0 };
  const rest = { right: -OVERHANG + STEP_X * (n - 1 - i), top: BASE_TOP + STEP_Y * i };
  const wip = exp.status === "in-progress";

  return (
    <motion.div
      className="absolute"
      style={{ ...rest, width: FRAME_W, height: FRAME_H, zIndex: i + 1 }}
      variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
    >
      <motion.div
        className="h-full w-full"
        initial={false}
        animate={fanned ? { x: fan.x, y: fan.y, rotate: fan.r } : { x: 0, y: 0, rotate: 0 }}
        transition={
          reduced
            ? { duration: 0 }
            : { type: "spring", stiffness: 260, damping: 24, mass: 0.8, delay: fanned ? (n - 1 - i) * 0.035 : i * 0.02 }
        }
        style={{ transformOrigin: "50% 50%" }}
      >
        <Link
          href={exp.href}
          aria-label={`${exp.name}${wip ? " (in progress)" : ""}`}
          className={`group/frame block h-full w-full overflow-hidden rounded-[16px] bg-white transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-[2px] motion-reduce:!transform-none ${
            wip ? "border border-dashed border-zinc-300" : "border border-black/[0.08]"
          }`}
          style={{
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.05), 0 14px 28px -14px rgba(20,20,30,0.28)",
          }}
        >
          <div
            className="flex items-center gap-1.5 px-3"
            style={{ height: HEADER_H }}
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: exp.accent, opacity: wip ? 0.55 : 1 }}
            />
            <span className="truncate text-[12px] font-semibold leading-none text-zinc-900">
              {exp.name}
            </span>
            <span className="ml-auto shrink-0 text-[10px] font-medium leading-none text-zinc-400">
              {wip ? "In progress" : "Shipped"}
            </span>
          </div>
          <div
            className="mx-3 rounded-[10px] bg-[#F5F5F6]"
            style={{ height: FRAME_H - HEADER_H - 12 }}
          >
            {exp.preview}
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* the stack is designed for the 258px bento column; narrower cards scale it
   down from the top-right corner so the overhang and clipping stay the same */
const DESIGN_W = 258;

function useStackScale() {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setScale(w > 0 && w < DESIGN_W ? w / DESIGN_W : 1);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, scale };
}

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return coarse;
}

export default function ExperimentsCard() {
  const reduced = useReducedMotion() ?? false;
  const coarse = useCoarsePointer();
  const [hot, setHot] = useState(false);
  const fanned = coarse || hot;
  const { ref: stackRef, scale } = useStackScale();

  return (
    <div className="row-span-2 max-md:row-span-1 max-md:h-[135cqw]">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        variants={{
          hidden: { opacity: 0, y: 12 },
          show: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
              when: "beforeChildren",
              staggerChildren: 0.06,
            },
          },
        }}
        onMouseEnter={() => setHot(true)}
        onMouseLeave={() => setHot(false)}
        onFocusCapture={() => setHot(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHot(false);
        }}
        className="bg-white rounded-card border-2 border-surface-border overflow-hidden relative h-full"
      >
        {/* the stack — absolutely placed, clipped by the card */}
        <div
          ref={stackRef}
          className="absolute inset-x-0 top-0 bottom-[92px]"
          style={{ transform: `scale(${scale})`, transformOrigin: "100% 0%" }}
        >
          {EXPERIMENTS.map((exp, i) => (
            <Frame key={exp.name} exp={exp} i={i} fanned={fanned} reduced={reduced} />
          ))}
        </div>

        {/* label */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 px-5 pb-4 pt-10 bg-gradient-to-t from-white via-white/90 to-transparent">
          <h3 className="text-[14px] font-semibold text-txt-heading leading-tight">
            Experiments with AI
          </h3>
          <p className="text-[12px] text-txt-secondary mt-0.5 leading-snug">
            Products built with AI, from concept to shipped.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
