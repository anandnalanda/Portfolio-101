"use client";

import { memo, useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Check, Columns3, List, Search } from "lucide-react";

/* ─── timeline (ms, relative to sequence start) ─────────────────── */
export const SEQ = {
  start: 180,
  saturate: { at: 0, dur: 360, dotStagger: 70 },
  pickup: { at: 400, dur: 180 },
  gapClose: { at: 620 },
  /* starts inside the pickup spring's tail so lift flows into carry */
  flight: { at: 570, dur: 780, arc: -10 },
  slotOpen: { at: 900 },
  /* outline appears mid-flight, once the trajectory is legible */
  placeholder: { at: 1100 },
  drop: { at: 1400, dur: 160 },
  donePill: { at: 1560 },
  counts: { at: 1700, dur: 220 },
  end: 2600,
} as const;

/* second move — Marcus: Applied → Screening, plays only AFTER David lands
   so the two promotions read one-by-one, not at once */
const MOVE2 = {
  pickup: 1780,
  gapClose: 2000,
  flight: 1950,
  dur: 780,
  drop: 2780,
  pill: 2940,
} as const;

/* ─── board geometry: fixed so every travel is exact px ──────────
 * Sized for a 420×220 panel: 14px frame, three full 126px columns.
 * Candidate cards are 36px; four to a column, the last row bleeds
 * off the panel's bottom edge like a real board viewport.
 * Radii: panel 16, columns 8, cards 8 (dial-tuned).             */
const COL_W = 126;
const COL_GAP = 7;
const PITCH = COL_W + COL_GAP; // 133
const CARD_H = 36;
const SLOT_H = 42; // 36px card + 6px gap
const FLY_X = PITCH; // Screening -> Interview
const FLY_Y = SLOT_H * 1; // stays on slot index 1

const DOT = { applied: "#A1A1AA", screening: "#F2A93B", interview: "#37B26D" };

/* Unsplash headshots (48px, face-cropped) */
const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=48&h=48&fit=crop&crop=faces&auto=format&q=70`;

type Cand = {
  n: string; // name
  role: string;
  tags: string[];
  img: string; // avatar
};

const APPLIED: Cand[] = [
  { n: "Sarah Chen", role: "Senior Chatter", tags: ["English C2", "88 WPM"], img: U("1544005313-94ddf0286df2") },
  { n: "Marcus Jones", role: "Chatter", tags: ["Sales", "Retention"], img: U("1500648767791-00dcc994a43e") },
  { n: "Priya Patel", role: "Chatter", tags: ["English C1", "PPV"], img: U("1534528741775-53994a69daeb") },
  { n: "Leah Fisher", role: "Chatter", tags: ["English C1", "Chat"], img: U("1633332755192-727a05c4013d") },
];
const SCREENING: Cand[] = [
  { n: "Aisha Rahman", role: "Senior Chatter", tags: ["Retention", "EN/FR"], img: U("1438761681033-6461ffad8d80") },
  { n: "David Kim", role: "Chatter", tags: ["Sales", "82 WPM"], img: U("1507003211169-0a1dd7228f2d") }, // the target
  { n: "Maya Singh", role: "Chatter", tags: ["PPV", "Upsells"], img: U("1517841905240-472988babdf9") },
  { n: "Nina Kovač", role: "Chatter", tags: ["EN/DE", "Retention"], img: U("1607746882042-944635dfe10e") },
];
const INTERVIEW: Cand[] = [
  { n: "Tomoko Sato", role: "Senior Chatter", tags: ["Retention", "95 WPM"], img: U("1487412720507-e7ab37603c6f") },
  { n: "Ryan O'Brien", role: "Chatter", tags: ["Sales", "Night shift"], img: U("1506794778202-cad84cf45f1d") },
  { n: "Omar Haddad", role: "Chatter", tags: ["EN/AR", "Upsells"], img: U("1519085360753-af0119f7cbe7") },
  { n: "Hana Ito", role: "Senior Chatter", tags: ["PPV", "95 WPM"], img: U("1580489944761-15a19d654956") },
];

/* rotate a column so a different candidate lands in the moving slot each
   cycle — the choreography is positional, only the identities shift */
function rotate<T>(arr: T[], n: number): T[] {
  const k = ((n % arr.length) + arr.length) % arr.length;
  return arr.slice(k).concat(arr.slice(0, k));
}

const LIFT_SHADOW = "0 12px 24px -8px rgba(20,10,40,0.25)";
const REST_SHADOW = "0 0px 0px 0px rgba(20,10,40,0)";
const SETTLE_SHADOW = "0 1px 2px 0px rgba(20,10,40,0.06)";

/* ─── small pieces ──────────────────────────────────────────────── */

const CandidateCard = memo(function CandidateCard({
  c,
  transparent = false,
  dim = false,
}: {
  c: Cand;
  /** flyer variant: the motion wrapper owns the bg so the pulse shows */
  transparent?: boolean;
  /** idle state: mute the name so the board reads quieter at rest */
  dim?: boolean;
}) {
  return (
    <div
      className={`flex h-[36px] flex-col justify-center gap-[6px] rounded-[8px] border border-[#ECECEE] px-[7px] ${
        transparent ? "bg-transparent" : "bg-white"
      }`}
    >
      <div className="flex items-center gap-[6px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.img}
          alt=""
          className="size-[22px] shrink-0 rounded-full object-cover"
          loading="lazy"
          draggable={false}
        />
        <span className="min-w-0">
          <span
            className={`block truncate text-[9px] font-semibold leading-[11px] tracking-[-0.01em] ${
              dim ? "text-zinc-400" : "text-[#1F1F22]"
            }`}
          >
            {c.n}
          </span>
          <span className="block truncate text-[8px] leading-[10px] tracking-[-0.01em] text-[#8E8E93]">
            {c.role}
          </span>
        </span>
      </div>
    </div>
  );
});

function ColHeader({
  dot,
  label,
  dotDelay,
  playing,
}: {
  dot: string;
  label: string;
  dotDelay: number;
  playing: boolean;
}) {
  return (
    <div className="-mx-[6px] -mt-[6px] mb-[2px] flex items-center gap-1.5 rounded-t-[8px] bg-gradient-to-b from-zinc-100 to-transparent px-[9px] pb-[10px] pt-[7px]">
      <motion.span
        className="size-[7px] shrink-0 rounded-full"
        initial={false}
        animate={{ backgroundColor: playing ? dot : "#C7C7CC" }}
        transition={{ duration: 0.25, delay: playing ? dotDelay / 1000 : 0 }}
      />
      <span
        className={`flex-1 text-[10px] font-semibold tracking-[-0.01em] ${
          playing ? "text-[#1F1F22]" : "text-zinc-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── the mock ──────────────────────────────────────────────────── */

export const KanbanBoardMock = memo(function KanbanBoardMock({
  playing,
  reduced,
  variant = 0,
}: {
  /** true while the card is in its active state */
  playing: boolean;
  /** prefers-reduced-motion: jump straight to the end state */
  reduced: boolean;
  /** cycle index — rotates which candidates move so it's not always the same */
  variant?: number;
}) {
  const flight = useAnimationControls();
  const flight2 = useAnimationControls();
  const endState = reduced && playing;

  const [gapClosed, setGapClosed] = useState(endState);
  const [slotOpen, setSlotOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState(false);
  const [puck, setPuck] = useState(false);
  const [pill, setPill] = useState(endState);
  /* second move — Marcus: Applied → Screening, cascades behind David */
  const [gapClosedApplied, setGapClosedApplied] = useState(endState);
  const [puck2, setPuck2] = useState(false);
  const [pill2, setPill2] = useState(endState);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!playing || reduced) return;
    const at = (ms: number, fn: () => void) =>
      timers.current.push(setTimeout(fn, ms));

    /* pickup — grabbed */
    at(SEQ.pickup.at, () => {
      setPuck(true);
      flight.start({
        scale: 1.04,
        rotate: -2.5,
        boxShadow: LIFT_SHADOW,
        transition: { type: "spring", stiffness: 420, damping: 26 },
      });
    });
    /* source closes the gap + flight — carried, slight arc */
    at(SEQ.gapClose.at, () => setGapClosed(true));
    at(SEQ.flight.at, () =>
      flight.start({
        x: [0, FLY_X * 0.5, FLY_X],
        y: [FLY_Y, FLY_Y + SEQ.flight.arc, FLY_Y],
        transition: {
          duration: SEQ.flight.dur / 1000,
          times: [0, 0.5, 1],
          ease: [0.33, 0, 0.15, 1],
        },
      }),
    );
    /* target opens a slot; the dashed outline waits until mid-flight */
    at(SEQ.slotOpen.at, () => setSlotOpen(true));
    at(SEQ.placeholder.at, () => setPlaceholder(true));
    /* drop — magnetic settle */
    at(SEQ.drop.at, () => {
      setPuck(false);
      setSlotOpen(false);
      setPlaceholder(false);
      flight.start({
        rotate: 0,
        scale: 1,
        boxShadow: SETTLE_SHADOW,
        transition: { type: "spring", stiffness: 420, damping: 18 },
      });
    });
    at(SEQ.donePill.at, () => setPill(true));

    /* ── second move: Marcus (Applied → Screening), staggered behind David ── */
    at(MOVE2.pickup, () => {
      setPuck2(true);
      flight2.start({
        scale: 1.04,
        rotate: -2.5,
        boxShadow: LIFT_SHADOW,
        transition: { type: "spring", stiffness: 420, damping: 26 },
      });
    });
    at(MOVE2.gapClose, () => setGapClosedApplied(true));
    at(MOVE2.flight, () =>
      flight2.start({
        x: [0, FLY_X * 0.5, FLY_X],
        y: [SLOT_H, SLOT_H * 2 - 10, SLOT_H * 3],
        transition: {
          duration: MOVE2.dur / 1000,
          times: [0, 0.5, 1],
          ease: [0.33, 0, 0.15, 1],
        },
      }),
    );
    at(MOVE2.drop, () => {
      setPuck2(false);
      flight2.start({
        rotate: 0,
        scale: 1,
        boxShadow: SETTLE_SHADOW,
        transition: { type: "spring", stiffness: 420, damping: 18 },
      });
    });
    at(MOVE2.pill, () => setPill2(true));

    const list = timers.current;
    return () => {
      list.forEach(clearTimeout);
      timers.current = [];
      flight.stop();
      flight2.stop();
    };
  }, [playing, reduced, flight, flight2]);

  const colSpring = { type: "spring" as const, stiffness: 300, damping: 30 };

  /* each cycle promotes a different candidate; variant 0 keeps the original
     arrangement, later cycles rotate so it's never the same cards moving */
  const applied = rotate(APPLIED, variant);
  const screening = rotate(SCREENING, variant);
  const interview = rotate(INTERVIEW, variant);

  return (
    <div aria-hidden="true">
      {/* toolbar: Board/List view toggle + search — mirrors the case-study board */}
      <div className="flex h-[52px] items-center justify-between px-[12px]">
        {/* view toggle */}
        <div className="flex h-[26px] items-center gap-[2px] rounded-[8px] bg-zinc-100 p-[3px]">
          <span className="flex h-[20px] items-center gap-[4px] rounded-[6px] bg-white px-[8px] text-[10px] font-medium text-zinc-900 shadow-sm">
            <Columns3 className="size-[11px]" strokeWidth={2} />
            Board
          </span>
          <span className="flex h-[20px] items-center gap-[4px] rounded-[6px] px-[8px] text-[10px] font-medium text-zinc-500">
            <List className="size-[11px]" strokeWidth={2} />
            List
          </span>
        </div>
        {/* search */}
        <span className="flex h-[26px] items-center gap-[5px] rounded-[8px] border border-zinc-200/70 px-[9px] text-zinc-400">
          <Search className="size-[11px] shrink-0" strokeWidth={2} />
          <span className="text-[10px] font-medium tracking-[-0.01em] text-zinc-400">
            Search by name, skills, etc.
          </span>
        </span>
      </div>
      <div className="h-px bg-[#EDEDED]" />

      {/* board — desaturated at frame 0, lifts to full colour */}
      <motion.div
        className="mx-auto mt-[8px] flex w-[392px] gap-[7px]"
        initial={false}
        animate={
          playing
            ? { filter: "saturate(1)", opacity: 1 }
            : { filter: "saturate(0.15)", opacity: 0.9 }
        }
        transition={
          playing
            ? { duration: SEQ.saturate.dur / 1000, ease: "easeOut" }
            : { duration: 0 }
        }
      >
        {/* Applied */}
        <div className="relative z-30 w-[126px] shrink-0 rounded-t-[8px] border border-b-0 border-zinc-200/60 bg-zinc-50/50 p-[6px]">
          <ColHeader
            dot={DOT.applied}
            label="Applied"
            dotDelay={0}
            playing={playing}
          />
          <div className="relative h-[184px]">
            {/* slot 0 stays */}
            <div className="absolute inset-x-0 top-0">
              <CandidateCard c={applied[0]} dim={!playing} />
            </div>
            {/* slot 2 closes the gap when Marcus lifts out */}
            <motion.div
              className="absolute inset-x-0 top-0"
              initial={false}
              animate={{ y: gapClosedApplied ? SLOT_H : SLOT_H * 2 }}
              transition={colSpring}
            >
              <CandidateCard c={applied[2]} dim={!playing} />
            </motion.div>
            {/* slot 3 rides up behind Marcus as the gap closes */}
            <motion.div
              className="absolute inset-x-0 top-0"
              initial={false}
              animate={{ y: gapClosedApplied ? SLOT_H * 2 : SLOT_H * 3 }}
              transition={colSpring}
            >
              <CandidateCard c={applied[3]} dim={!playing} />
            </motion.div>
            {/* travelling card — Marcus, slot 1 → Screening slot 3 */}
            <motion.div
              className="absolute inset-x-0 top-0 z-[3] rounded-[8px] will-change-transform"
              initial={false}
              animate={flight2}
              style={
                endState
                  ? {
                      x: FLY_X,
                      y: SLOT_H * 3,
                      boxShadow: SETTLE_SHADOW,
                      backgroundColor: "#FFFFFF",
                    }
                  : {
                      y: SLOT_H,
                      boxShadow: REST_SHADOW,
                      backgroundColor: "#FFFFFF",
                    }
              }
            >
              <div className="relative">
                <CandidateCard c={applied[1]} transparent dim={!playing} />
                {/* pointer puck rides the card */}
                <motion.span
                  className="absolute -left-1 -top-1 z-[4] size-2.5 rounded-full bg-black"
                  initial={false}
                  animate={{ opacity: puck2 ? 0.7 : 0 }}
                  transition={{ duration: 0.16 }}
                />
                {/* landed check */}
                <motion.span
                  className="absolute -right-1 -top-1 z-[4] flex size-[15px] items-center justify-center rounded-full text-white"
                  style={{ background: DOT.screening }}
                  initial={false}
                  animate={
                    pill2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }
                  }
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                >
                  <Check className="size-[9px]" strokeWidth={3.2} />
                </motion.span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Screening — source column */}
        <div className="relative z-20 w-[126px] shrink-0 rounded-t-[8px] border border-b-0 border-zinc-200/60 bg-zinc-50/50 p-[6px]">
          <ColHeader
            dot={DOT.screening}
            label="Screening"
            dotDelay={SEQ.saturate.dotStagger}
            playing={playing}
          />
          <div className="relative h-[184px]">
            {/* slot 0 stays */}
            <div className="absolute inset-x-0 top-0">
              <CandidateCard c={screening[0]} dim={!playing} />
            </div>
            {/* slot 2 closes the gap when the target lifts out */}
            <motion.div
              className="absolute inset-x-0 top-0"
              initial={false}
              animate={{ y: gapClosed ? SLOT_H : SLOT_H * 2 }}
              transition={colSpring}
            >
              <CandidateCard c={screening[2]} dim={!playing} />
            </motion.div>
            {/* slot 3 rides up as the target leaves, opening the bottom slot for Marcus */}
            <motion.div
              className="absolute inset-x-0 top-0"
              initial={false}
              animate={{ y: gapClosed ? SLOT_H * 2 : SLOT_H * 3 }}
              transition={colSpring}
            >
              <CandidateCard c={screening[3]} dim={!playing} />
            </motion.div>
            {/* the travelling card — starts at slot 1 */}
            <motion.div
              className="absolute inset-x-0 top-0 z-[3] rounded-[8px] will-change-transform"
              initial={false}
              animate={flight}
              style={
                endState
                  ? {
                      x: FLY_X,
                      y: FLY_Y,
                      boxShadow: SETTLE_SHADOW,
                      backgroundColor: "#FFFFFF",
                    }
                  : {
                      y: FLY_Y,
                      boxShadow: REST_SHADOW,
                      backgroundColor: "#FFFFFF",
                    }
              }
            >
              <div className="relative">
                <CandidateCard c={screening[1]} transparent dim={!playing} />
                {/* pointer puck rides the card */}
                <motion.span
                  className="absolute -left-1 -top-1 z-[4] size-2.5 rounded-full bg-black"
                  initial={false}
                  animate={{ opacity: puck ? 0.7 : 0 }}
                  transition={{ duration: 0.16 }}
                />
                {/* landed check */}
                <motion.span
                  className="absolute -right-1 -top-1 z-[4] flex size-[15px] items-center justify-center rounded-full text-white"
                  style={{ background: DOT.interview }}
                  initial={false}
                  animate={
                    pill ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }
                  }
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                >
                  <Check className="size-[9px]" strokeWidth={3.2} />
                </motion.span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Interview — target column */}
        <div className="relative z-10 w-[126px] shrink-0 rounded-t-[8px] border border-b-0 border-zinc-200/60 bg-zinc-50/50 p-[6px]">
          <ColHeader
            dot={DOT.interview}
            label="Interview"
            dotDelay={SEQ.saturate.dotStagger * 2}
            playing={playing}
          />
          <div className="relative h-[184px]">
            <div className="absolute inset-x-0 top-0">
              <CandidateCard c={interview[0]} dim={!playing} />
            </div>
            {/* slots 1+ open a gap at index 1 while the card is in flight */}
            {interview.slice(1).map((c, i) => (
              <motion.div
                key={c.n}
                className="absolute inset-x-0 top-0"
                initial={false}
                animate={{
                  y:
                    slotOpen || pill || endState
                      ? SLOT_H * (i + 2)
                      : SLOT_H * (i + 1),
                }}
                transition={colSpring}
              >
                <CandidateCard c={c} dim={!playing} />
              </motion.div>
            ))}
            {/* dashed landing placeholder */}
            <motion.div
              className="pointer-events-none absolute inset-x-0 top-0 h-[36px] rounded-[8px] border border-dashed border-[#C7C7CC]"
              style={{ transform: `translateY(${SLOT_H}px)` }}
              initial={false}
              animate={{ opacity: placeholder ? 1 : 0 }}
              transition={{ duration: 0.18 }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
});
