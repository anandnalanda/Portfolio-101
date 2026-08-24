"use client";

/* d2 — "Let them shape the pipeline." The full loop, modeled on Juicebox's
   "Edit Status List" (Mobbin ref). A fake cursor performs the whole gesture,
   step by step, unhurried:
     1. clicks "Edit stages" → the modal opens
     2. clicks "+ Add stage" → a blank row appears
     3. the name types itself in ("Trial shift", off-template)
     4. grabs the row and drags it up to REORDER — dropping it between the
        existing stages (before Offer)
     5. clicks "Save changes" → the modal closes and the board reveals the new
        stage as a real column, inserted in that same position.
   Add + rename + reorder, all in one contained place. OFM system throughout. */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Columns3, GripVertical, Plus, X } from "lucide-react";

type Row = {
  id: string;
  name: string;
  dot: string;
  count: number;
  isNew?: boolean;
};

const BASE: Row[] = [
  { id: "applied", name: "Applied", dot: "bg-zinc-300", count: 5 },
  { id: "screening", name: "Screening", dot: "bg-zinc-400", count: 4 },
  { id: "interview", name: "Interview", dot: "bg-zinc-500", count: 4 },
  { id: "offer", name: "Offer", dot: "bg-zinc-700", count: 2 },
];

/* Move the new "trial" row to just before Offer. */
function reorder(rows: Row[]): Row[] {
  const trial = rows.find((r) => r.id === "trial");
  if (!trial) return rows;
  const rest = rows.filter((r) => r.id !== "trial");
  const oi = rest.findIndex((r) => r.id === "offer");
  return [...rest.slice(0, oi), trial, ...rest.slice(oi)];
}

const EASE = [0.22, 1, 0.36, 1] as const;

type Pt = { x: number; y: number };

function Cursor({
  entry,
  target,
  pressed,
  grabbing,
}: {
  entry: Pt;
  target: Pt;
  pressed: boolean;
  grabbing: boolean;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 z-40"
      initial={{ x: entry.x, y: entry.y, opacity: 0 }}
      animate={{ x: target.x, y: target.y, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.85, ease: EASE, opacity: { duration: 0.3 } }}
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
        animate={{ scale: pressed || grabbing ? 0.82 : 1 }}
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

function StageRow({ row }: { row: Row }) {
  return (
    <div className="group flex items-center gap-3 rounded-lg border border-zinc-200/70 bg-white px-3 py-2.5 transition-colors hover:border-zinc-300 hover:bg-zinc-50/70">
      <GripVertical
        data-grip={row.id}
        className="size-4 shrink-0 cursor-grab text-zinc-400 transition-colors group-hover:text-zinc-500"
        strokeWidth={2}
      />
      <span className={`size-2 shrink-0 rounded-full ${row.dot}`} />
      <span className="flex-1 text-ofm-body text-zinc-800">{row.name}</span>
      <span className="text-ofm-caption tabular-nums text-zinc-400">{row.count}</span>
      <button className="flex size-6 items-center justify-center rounded-md text-zinc-400 opacity-0 transition-all hover:bg-zinc-100 hover:text-zinc-600 group-hover:opacity-100">
        <X className="size-4" strokeWidth={2} />
      </button>
    </div>
  );
}

function NewRow({ name, lifted }: { name: string; lifted: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border-2 border-ofm-400 bg-white px-3 py-2 ring-2 ring-ofm-100 transition-shadow ${
        lifted ? "shadow-xl" : ""
      }`}
    >
      <GripVertical
        data-grip="trial"
        className="size-4 shrink-0 cursor-grab text-zinc-400"
        strokeWidth={2}
      />
      <span className="size-2 shrink-0 rounded-full bg-ofm-500" />
      <span className="flex flex-1 items-center">
        <span className="text-ofm-body text-zinc-800">{name}</span>
        <span className="ml-px h-[16px] w-px bg-ofm-600" />
      </span>
      <span className="text-ofm-caption tabular-nums text-zinc-300">0</span>
      <button className="flex size-6 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600">
        <X className="size-4" strokeWidth={2} />
      </button>
    </div>
  );
}

export default function EditStagesModal({ onSave }: { onSave: () => void }) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  });

  const [trigger, setTrigger] = useState<Pt | null>(null);
  const [add, setAdd] = useState<Pt | null>(null);
  const [gripTrial, setGripTrial] = useState<Pt | null>(null);
  const [drop, setDrop] = useState<Pt | null>(null);
  const [save, setSave] = useState<Pt | null>(null);
  const [phase, setPhase] = useState<
    "trigger" | "add" | "grab" | "drag" | "save"
  >("trigger");
  const [pressed, setPressed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [rows, setRows] = useState<Row[]>(BASE);

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
    setTrigger(measure("[data-edit-stages]"));
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setOpen(true);
      setRows(reorder([...BASE, { id: "trial", name: "", dot: "bg-ofm-500", count: 0, isNew: true }]));
      setTyped("Trial shift");
      return;
    }
    const t: ReturnType<typeof setTimeout>[] = [];
    // 1 — click "Edit stages" → modal opens
    t.push(setTimeout(() => setPressed(true), 1300));
    t.push(setTimeout(() => setPressed(false), 1500));
    t.push(setTimeout(() => setOpen(true), 1600));
    // 2 — cursor to "+ Add stage", click → blank row appears
    t.push(
      setTimeout(() => {
        setAdd(measure("[data-add-stage]"));
        setPhase("add");
      }, 1950),
    );
    t.push(
      setTimeout(() => {
        setPressed(true);
        setRows((p) => [
          ...p,
          { id: "trial", name: "", dot: "bg-ofm-500", count: 0, isNew: true },
        ]);
      }, 2900),
    );
    t.push(setTimeout(() => setPressed(false), 3080));
    // 3 — the name types itself in (slower)
    const name = "Trial shift";
    for (let i = 0; i < name.length; i++) {
      t.push(setTimeout(() => setTyped(name.slice(0, i + 1)), 3500 + i * 115));
    }
    const typeEnd = 3500 + name.length * 115; // ~4765
    // 4 — grab the row and drag it up to reorder (before Offer)
    t.push(
      setTimeout(() => {
        setGripTrial(measure('[data-grip="trial"]'));
        setDrop(measure('[data-grip="offer"]'));
        setPhase("grab");
      }, typeEnd + 350),
    );
    t.push(setTimeout(() => setDragging(true), typeEnd + 1250)); // lift
    t.push(
      setTimeout(() => {
        setPhase("drag");
        setRows((p) => reorder(p));
      }, typeEnd + 1450),
    );
    t.push(setTimeout(() => setDragging(false), typeEnd + 2350)); // drop
    // 5 — cursor to "Save changes", click → save
    t.push(
      setTimeout(() => {
        setSave(measure("[data-save]"));
        setPhase("save");
      }, typeEnd + 2750),
    );
    t.push(setTimeout(() => setPressed(true), typeEnd + 3650));
    t.push(
      setTimeout(() => {
        setPressed(false);
        onSaveRef.current();
      }, typeEnd + 3830),
    );
    return () => t.forEach((x) => clearTimeout(x));
  }, [reduceMotion]);

  const target =
    phase === "save" && save
      ? save
      : phase === "drag" && drop
        ? drop
        : phase === "grab" && gripTrial
          ? gripTrial
          : phase === "add" && add
            ? add
            : trigger;
  const entry = trigger ? { x: trigger.x + 128, y: trigger.y + 172 } : null;

  return (
    <motion.div
      ref={rootRef}
      className="kibo absolute inset-0 z-30"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {open && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center p-8"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-zinc-900/10" />

          <motion.div
            className="relative w-[464px] overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-[0_20px_60px_-12px_rgba(9,110,66,0.18),0_8px_24px_-8px_rgba(0,0,0,0.12)]"
            initial={reduceMotion ? false : { scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          >
            {/* header */}
            <div className="flex items-start justify-between px-5 pb-4 pt-5">
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ofm-50 text-ofm-600">
                  <Columns3 className="size-5" strokeWidth={2} />
                </span>
                <div>
                  <h2 className="text-ofm-title font-semibold leading-tight text-zinc-900">
                    Edit stages
                  </h2>
                  <p className="mt-0.5 text-ofm-caption leading-tight text-zinc-400">
                    Drag to reorder your pipeline
                  </p>
                </div>
              </div>
              <button className="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600">
                <X className="size-4" strokeWidth={2} />
              </button>
            </div>

            {/* stage list */}
            <div className="flex flex-col gap-2 px-5 pb-1">
              {rows.map((r) => (
                <motion.div
                  key={r.id}
                  layout
                  initial={r.isNew ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  style={r.isNew && dragging ? { zIndex: 10 } : undefined}
                  transition={{
                    layout: { type: "spring", stiffness: 480, damping: 38 },
                    opacity: { duration: 0.25 },
                  }}
                >
                  {r.isNew ? (
                    <NewRow name={typed} lifted={dragging} />
                  ) : (
                    <StageRow row={r} />
                  )}
                </motion.div>
              ))}
            </div>

            {/* add */}
            <div className="px-5 pb-4 pt-2">
              <button
                data-add-stage
                className="flex w-full items-center gap-2 rounded-lg border border-dashed border-zinc-300 px-3 py-2.5 text-ofm-body font-medium text-zinc-500 transition-colors hover:border-ofm-300 hover:bg-ofm-50/50 hover:text-ofm-700"
              >
                <Plus className="size-4" strokeWidth={2} />
                Add stage
              </button>
            </div>

            {/* footer */}
            <div className="flex items-center justify-between border-t border-zinc-200/70 bg-zinc-50/50 px-5 py-3.5">
              <span className="text-ofm-caption text-zinc-400">
                {rows.length} stages
              </span>
              <div className="flex gap-2">
                <button className="rounded-lg px-3 py-2 text-ofm-label font-medium text-zinc-600 transition-colors hover:bg-zinc-100">
                  Cancel
                </button>
                <button
                  data-save
                  className="rounded-lg bg-ofm-600 px-3.5 py-2 text-ofm-label font-medium text-white shadow-sm transition-colors hover:bg-ofm-700"
                >
                  Save changes
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {!reduceMotion && trigger && entry && target && (
        <Cursor
          entry={entry}
          target={target}
          pressed={pressed}
          grabbing={dragging}
        />
      )}
    </motion.div>
  );
}
