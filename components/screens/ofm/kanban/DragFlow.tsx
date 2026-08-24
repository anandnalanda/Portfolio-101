"use client";

/* d6 — "The human holds the pen." A fake cursor drags candidates FORWARD across
   stages, one at a time. It grabs a card, the card LIFTS out of the column onto
   the cursor (a floating clone that rides perfectly with the pointer), carries
   it into the next stage, and drops it there — so the movement reads as a real
   drag. AI orders the column, but a drag always wins: the moment the human moves
   a card, the board's sort flips to "Manual". The placement + sort label live in
   PipelineBoard; this overlay owns the cursor, the carried card, and the
   callbacks. Slow and deliberate. */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ALL_CANDIDATES,
  Card,
  DRAG_MOVES,
} from "@/components/screens/ofm/kanban/PipelineBoard";

const EASE = [0.22, 1, 0.36, 1] as const;
type Pt = { x: number; y: number };
type Cand = (typeof ALL_CANDIDATES)[number];

function Cursor({
  target,
  grabbing,
  carrying,
}: {
  target: Pt;
  grabbing: boolean;
  carrying: Cand | null;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 z-40"
      initial={{ x: target.x, y: target.y, opacity: 0 }}
      animate={{ x: target.x, y: target.y, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.95, ease: EASE, opacity: { duration: 0.35 } }}
    >
      {/* the carried card is a CHILD of the cursor, so it tracks the pointer
          exactly as it animates across the board — a true "carry" */}
      <AnimatePresence>
        {carrying && (
          <motion.div
            key={carrying.name}
            className="absolute w-[264px]"
            style={{ left: -128, top: -34 }}
            initial={{ opacity: 0, scale: 0.96, rotate: 0 }}
            animate={{ opacity: 1, scale: 1.03, rotate: -3 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 460, damping: 30 }}
          >
            <div style={{ filter: "drop-shadow(0 20px 34px rgba(0,0,0,0.20))" }}>
              <Card c={carrying} lifted />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.svg
        width="22"
        height="22"
        viewBox="0 0 20 20"
        fill="none"
        animate={{ scale: grabbing ? 0.8 : 1 }}
        transition={{ duration: 0.14 }}
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

export default function DragFlow({
  onGrab,
  onCarry,
  onDrop,
}: {
  onGrab: (card: string) => void;
  onCarry: (stage: string) => void;
  onDrop: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const cbs = useRef({ onGrab, onCarry, onDrop });
  useEffect(() => {
    cbs.current = { onGrab, onCarry, onDrop };
  });

  const [moveIdx, setMoveIdx] = useState(0);
  const [cursor, setCursor] = useState<Pt | null>(null);
  const [grabbing, setGrabbing] = useState(false);
  const [carrying, setCarrying] = useState<Cand | null>(null);
  const [done, setDone] = useState(false);

  const measure = (sel: string, topBias = false): Pt | null => {
    const canvas = rootRef.current?.closest("[data-stage-canvas]");
    const el = canvas?.querySelector(sel);
    if (!canvas || !el) return null;
    const c = canvas.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    const s = c.width / 1440 || 1;
    return {
      x: (b.left + b.width / 2 - c.left) / s,
      y: ((topBias ? b.top + 78 : b.top + b.height / 2) - c.top) / s,
    };
  };

  useLayoutEffect(() => {
    const first = measure(`[data-card="${DRAG_MOVES[0].card}"]`);
    if (first) setCursor({ x: first.x - 36, y: first.y + 150 });
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      DRAG_MOVES.forEach(() => cbs.current.onDrop());
      return;
    }
    if (moveIdx >= DRAG_MOVES.length) {
      const t = setTimeout(() => setDone(true), 700);
      return () => clearTimeout(t);
    }
    const m = DRAG_MOVES[moveIdx];
    const cand = ALL_CANDIDATES.find((c) => c.name === m.card) ?? null;
    const t: ReturnType<typeof setTimeout>[] = [];
    // 1 — glide onto the card
    t.push(setTimeout(() => setCursor(measure(`[data-card="${m.card}"]`)), 150));
    // 2 — grab: the card lifts OUT of the column and onto the cursor
    t.push(
      setTimeout(() => {
        setGrabbing(true);
        setCarrying(cand);
        cbs.current.onGrab(m.card);
      }, 1500),
    );
    // 3 — carry it into the next stage; the card rides with the cursor and a
    //     drop line appears in the target stage showing where it will land
    t.push(
      setTimeout(() => {
        setCursor(measure(`[data-col="${m.to}"]`, true));
        cbs.current.onCarry(m.to);
      }, 2050),
    );
    // 4 — drop: the clone settles away as the real card lands in the column
    t.push(
      setTimeout(() => {
        setGrabbing(false);
        setCarrying(null);
        cbs.current.onDrop();
      }, 3350),
    );
    // 5 — on to the next move (slow pause between)
    t.push(setTimeout(() => setMoveIdx((i) => i + 1), 4200));
    return () => t.forEach((x) => clearTimeout(x));
  }, [moveIdx, reduceMotion]);

  return (
    <div ref={rootRef} className="kibo absolute inset-0 z-30">
      {!reduceMotion && !done && cursor && (
        <Cursor target={cursor} grabbing={grabbing} carrying={carrying} />
      )}
    </div>
  );
}
