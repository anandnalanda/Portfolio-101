"use client";

/* d4 — "Rank, and show your work." A fake cursor drives the two halves of the
   beat on the board: it clicks "Sort: AI score" (the Applied column re-sorts
   itself, best-fit rising to the top — RANK), then moves to the new top card's
   score chip and holds there, opening its auditable breakdown (SHOW YOUR WORK).
   The board reorders + the breakdown live in PipelineBoard; this overlay owns
   the cursor and fires the callbacks that trigger them. OFM system. */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;
type Pt = { x: number; y: number };

function Cursor({ entry, target, pressed }: { entry: Pt; target: Pt; pressed: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 z-40"
      initial={{ x: entry.x, y: entry.y, opacity: 0 }}
      animate={{ x: target.x, y: target.y, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: EASE, opacity: { duration: 0.3 } }}
    >
      {pressed && (
        <motion.span
          className="absolute -left-1.5 -top-1.5 block size-7 rounded-full bg-ofm-500/25"
          initial={{ scale: 0, opacity: 0.7 }}
          animate={{ scale: 1.7, opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      )}
      <motion.svg
        width="22"
        height="22"
        viewBox="0 0 20 20"
        fill="none"
        animate={{ scale: pressed ? 0.82 : 1 }}
        transition={{ duration: 0.12 }}
        style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.25))" }}
      >
        <path
          d="M3 2 L3 16.5 L6.8 12.9 L9.2 18.2 L11.6 17.1 L9.2 11.9 L14.4 11.9 Z"
          fill="#18181b"
          stroke="#ffffff"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.div>
  );
}

export default function RankFlow({
  onOpenMenu,
  onSort,
  onHighlightScore,
  onFrameScore,
}: {
  onOpenMenu: () => void;
  onSort: () => void;
  onHighlightScore: () => void;
  onFrameScore: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const cbs = useRef({ onOpenMenu, onSort, onHighlightScore, onFrameScore });
  useEffect(() => {
    cbs.current = { onOpenMenu, onSort, onHighlightScore, onFrameScore };
  });

  const [sortPt, setSortPt] = useState<Pt | null>(null);
  const [aiPt, setAiPt] = useState<Pt | null>(null);
  const [phase, setPhase] = useState<"sort" | "ai">("sort");
  const [pressed, setPressed] = useState(false);
  const [done, setDone] = useState(false);

  const measure = (sel: string): Pt | null => {
    const canvas = rootRef.current?.closest("[data-stage-canvas]");
    const el = canvas?.querySelector(sel);
    if (!canvas || !el) return null;
    const c = canvas.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    const s = c.width / 1440 || 1;
    return {
      x: (b.left + b.width / 2 - c.left) / s,
      y: (b.top + b.height / 2 - c.top) / s,
    };
  };

  useLayoutEffect(() => {
    setSortPt(measure("[data-sort]"));
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      cbs.current.onSort();
      cbs.current.onHighlightScore();
      cbs.current.onFrameScore();
      return;
    }
    const t: ReturnType<typeof setTimeout>[] = [];
    // 1 — click the Sort control → the dropdown opens (held so it can be read)
    t.push(setTimeout(() => setPressed(true), 1500));
    t.push(setTimeout(() => setPressed(false), 1680));
    t.push(setTimeout(() => cbs.current.onOpenMenu(), 1600));
    // 2 — move to "AI score" and pick it → the whole board re-sorts
    t.push(
      setTimeout(() => {
        setAiPt(measure("[data-sort-ai]"));
        setPhase("ai");
      }, 2700),
    );
    t.push(setTimeout(() => setPressed(true), 4000));
    t.push(setTimeout(() => setPressed(false), 4180));
    t.push(setTimeout(() => cbs.current.onSort(), 4100));
    // 3 — the score chips light up across the board, then the top match's
    //     score gets spotlighted with the frame
    t.push(setTimeout(() => cbs.current.onHighlightScore(), 5100));
    t.push(setTimeout(() => setDone(true), 5400));
    t.push(setTimeout(() => cbs.current.onFrameScore(), 5800));
    return () => t.forEach((x) => clearTimeout(x));
  }, [reduceMotion]);

  const target = phase === "ai" && aiPt ? aiPt : sortPt;
  const entry = sortPt ? { x: sortPt.x - 30, y: sortPt.y - 90 } : null;

  return (
    <div ref={rootRef} className="kibo absolute inset-0 z-30">
      {!reduceMotion && !done && sortPt && entry && target && (
        <Cursor entry={entry} target={target} pressed={pressed} />
      )}
    </div>
  );
}
