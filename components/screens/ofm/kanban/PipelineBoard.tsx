/* Pipeline board — the OFM hiring Kanban, in Linear's board language (Mobbin
   ref): status-dot column headers with a count, compact cards, skill tags, a
   muted footer with per-candidate actions. Our content (candidates) and our
   design system (ofm green, zinc, type scale, Inter) — the AI match score is
   kept as the loudest element on each card. */

"use client";

import { Fragment, useEffect, useRef } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  MoreHorizontal,
  Plus,
  User,
  MessageSquare,
  Columns3,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
  Search,
  Sparkle,
  SquarePen,
  Users,
  Check,
  Clock,
  ArrowDownAZ,
  Activity,
  Eye,
} from "lucide-react";
import AccentFrame from "@/components/screens/ofm/AccentFrame";

export type Candidate = {
  name: string;
  role: string;
  ago: string;
  score: number;
  skills: string[];
  img: string;
};

const COLUMNS: {
  id: string;
  name: string;
  dot: string;
  tint: string;
  count: string;
  cards: Candidate[];
}[] = [
  {
    id: "applied",
    name: "Applied",
    dot: "bg-zinc-300",
    tint: "from-zinc-100",
    count: "text-zinc-400",
    cards: [
      { name: "Sarah Chen", role: "Senior Chatter", ago: "2d", score: 92, skills: ["English C2", "88 WPM"], img: "photo-1494790108377-be9c29b29330" },
      { name: "Marcus Johnson", role: "Chatter", ago: "3d", score: 85, skills: ["Sales", "Retention"], img: "photo-1500648767791-00dcc994a43e" },
      { name: "Priya Patel", role: "Chatter", ago: "4d", score: 78, skills: ["English C1", "PPV"], img: "photo-1438761681033-6461ffad8d80" },
      { name: "Noah Bennett", role: "Support Agent", ago: "5d", score: 74, skills: ["Empathy", "CRM"], img: "photo-1502685104226-ee32379fefbe" },
      { name: "James Wilson", role: "Chatter", ago: "6d", score: 71, skills: ["Night shift"], img: "photo-1472099645785-5658abf4ff4e" },
    ],
  },
  {
    id: "screening",
    name: "Screening",
    dot: "bg-zinc-400",
    tint: "from-zinc-100",
    count: "text-zinc-400",
    cards: [
      { name: "Aisha Rahman", role: "Senior Chatter", ago: "1w", score: 88, skills: ["Retention", "EN/FR"], img: "photo-1544005313-94ddf0286df2" },
      { name: "David Kim", role: "Chatter", ago: "1w", score: 83, skills: ["Sales", "82 WPM"], img: "photo-1506794778202-cad84cf45f1d" },
      { name: "Maya Singh", role: "Chatter", ago: "2w", score: 81, skills: ["PPV", "Upsells"], img: "photo-1554151228-14d9def656e4" },
      { name: "Elena Volkov", role: "Support Agent", ago: "2w", score: 76, skills: ["EN/RU", "CRM"], img: "photo-1517841905240-472988babdf9" },
    ],
  },
  {
    id: "interview",
    name: "Interview",
    dot: "bg-zinc-500",
    tint: "from-zinc-100",
    count: "text-zinc-400",
    cards: [
      { name: "Tomoko Sato", role: "Senior Chatter", ago: "1w", score: 95, skills: ["Retention", "95 WPM"], img: "photo-1487412720507-e7ab37603c6f" },
      { name: "Ryan O'Brien", role: "Chatter", ago: "2w", score: 91, skills: ["Sales", "Night shift"], img: "photo-1531427186611-ecfd6d936c79" },
      { name: "Omar Haddad", role: "Chatter", ago: "2w", score: 89, skills: ["EN/AR", "Upsells"], img: "photo-1568602471122-7832951cc4c5" },
      { name: "Grace Liu", role: "Chat Team Lead", ago: "3w", score: 87, skills: ["Coaching", "QA"], img: "photo-1524504388940-b1c1722653e1" },
    ],
  },
  {
    id: "offer",
    name: "Offer",
    dot: "bg-zinc-700",
    tint: "from-zinc-100",
    count: "text-zinc-500",
    cards: [
      { name: "Liam Carter", role: "Senior Chatter", ago: "3w", score: 97, skills: ["Sales", "Retention"], img: "photo-1507003211169-0a1dd7228f2d" },
      { name: "Ethan Brooks", role: "Senior Chatter", ago: "4w", score: 94, skills: ["English C2", "PPV"], img: "photo-1545996124-0501ebae84d0" },
    ],
  },
];

/* Real portraits from Unsplash (free license), face-cropped square. */
export const dp = (id: string) =>
  `https://images.unsplash.com/${id}?w=96&h=96&fit=crop&crop=faces&auto=format&q=80`;

/* AI-score chip: a single brand-green identity, tiered by *darkness* (not hue)
   so it never collides with the pastel stage colors. Strong match = loud dark
   chip; the number itself carries the rest. */
export function scoreTone(score: number) {
  if (score >= 90) return "bg-ofm-900 text-white";
  if (score >= 80) return "bg-ofm-100 text-ofm-800";
  return "bg-zinc-100 text-zinc-500";
}

/* The score is auditable, not a black box: it decomposes into the three signals
   the match is built from. Derived deterministically per candidate (no RNG) so
   the numbers feel individual but the overall stays anchored to the score. */
export function signals(c: Candidate) {
  const seed = c.name.charCodeAt(0) + c.name.length;
  return [
    { label: "Skills", v: Math.min(99, c.score + (seed % 5) - 1) },
    { label: "Experience", v: Math.max(45, c.score - (seed % 4) - 2) },
    { label: "Role fit", v: Math.min(99, c.score + (seed % 3)) },
  ];
}

export function Card({
  c,
  target = false,
  forceBreakdown = false,
  scorePop = false,
  popDelay = 0,
  scoreFrame = false,
  lifted = false,
}: {
  c: Candidate;
  target?: boolean;
  /** hold the AI-match breakdown open (cursor "hovering" it). */
  forceBreakdown?: boolean;
  /** d4 rank demo: pop/highlight the score chip once the sort lands. */
  scorePop?: boolean;
  popDelay?: number;
  /** d4 rank demo: spotlight the (top) score chip with the accent frame. */
  scoreFrame?: boolean;
  /** d6 drag demo: picked-up (lifted) state while being dragged. */
  lifted?: boolean;
}) {
  return (
    <div
      data-card={c.name}
      className={`group/card cursor-pointer rounded-xl border bg-white p-3 transition-all ${
        lifted
          ? "border-ofm-300 shadow-xl ring-2 ring-ofm-100"
          : "border-zinc-200/70 shadow-sm hover:border-zinc-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dp(c.img)}
            alt={c.name}
            className="size-8 shrink-0 rounded-full bg-zinc-100 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-ofm-body font-semibold text-zinc-900">
              {c.name}
            </p>
            <p className="truncate text-ofm-caption text-zinc-500">{c.role}</p>
          </div>
        </div>
        <div className="group/score relative mt-0.5 shrink-0">
          <motion.span
            className={`flex items-center gap-0.5 rounded-md py-0.5 pl-1 pr-1.5 text-ofm-label font-bold tabular-nums ${scoreTone(c.score)}`}
            animate={scorePop ? { scale: [1, 1.24, 1] } : undefined}
            transition={
              scorePop
                ? { duration: 0.55, delay: popDelay, ease: [0.22, 1, 0.36, 1] }
                : undefined
            }
          >
            <Sparkle className="size-2.5" strokeWidth={2.5} />
            {c.score}
          </motion.span>
          {/* auditable AI: the score's own breakdown, on hover (or forced open) */}
          <div
            className={`pointer-events-none absolute right-0 top-full z-20 mt-1.5 w-48 origin-top-right rounded-lg border border-zinc-200/70 bg-white p-2.5 shadow-lg transition-all duration-150 ${
              forceBreakdown
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0 group-hover/score:scale-100 group-hover/score:opacity-100"
            }`}
          >
            <div className="mb-2 flex items-center gap-1 text-ofm-micro font-semibold uppercase tracking-[0.06em] text-zinc-400">
              <Sparkle className="size-2.5 text-ofm-600" strokeWidth={2.5} />
              AI match
            </div>
            <div className="flex flex-col gap-1.5">
              {signals(c).map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="w-16 shrink-0 text-ofm-micro text-zinc-500">{s.label}</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                    <span
                      className="block h-full rounded-full bg-ofm-500"
                      style={{ width: `${s.v}%` }}
                    />
                  </span>
                  <span className="w-5 shrink-0 text-right text-ofm-micro font-semibold tabular-nums text-zinc-700">
                    {s.v}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {scoreFrame && <AccentFrame inset="-3px" radius={9} enter={{ y: -8 }} />}
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1">
        {c.skills.map((s) => (
          <span
            key={s}
            className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-ofm-micro font-medium text-zinc-600"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-ofm-micro text-zinc-400">Applied {c.ago} ago</span>
        <div
          className={`flex items-center gap-0.5 transition-opacity ${
            target ? "opacity-100" : "opacity-0 group-hover/card:opacity-100"
          }`}
        >
          <button
            title="View profile"
            className="flex size-6 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
          >
            <User className="size-3.5" strokeWidth={2} />
          </button>
          <button
            title="Message"
            data-message-trigger={target ? "" : undefined}
            className={`flex size-6 items-center justify-center rounded-md transition-colors ${
              target
                ? "bg-ofm-50 text-ofm-600"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
            }`}
          >
            <MessageSquare className="size-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Tab({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof Columns3;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex h-7 items-center gap-1.5 rounded-md px-2.5 text-ofm-label font-medium transition-colors ${
        active
          ? "bg-white text-zinc-900 shadow-sm"
          : "text-zinc-500 hover:text-zinc-800"
      }`}
    >
      <Icon className="size-3.5" strokeWidth={2} />
      {label}
    </button>
  );
}

function Chip({
  icon: Icon,
  label,
  caret,
  dataSort,
}: {
  icon: typeof Columns3;
  label: string;
  caret?: boolean;
  dataSort?: boolean;
}) {
  return (
    <button
      data-sort={dataSort ? "" : undefined}
      className="flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200/70 px-2.5 text-ofm-label font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
    >
      <Icon className="size-3.5 text-zinc-400" strokeWidth={2} />
      {label}
      {caret ? <ChevronDown className="-mr-0.5 size-3.5 text-zinc-400" strokeWidth={2} /> : null}
    </button>
  );
}

/* d4 rank demo: the "list" order each stage starts in (scores scattered) before
   the whole board re-sorts itself by AI score. */
const RANK_UNSORTED: Record<string, string[]> = {
  applied: ["Priya Patel", "Noah Bennett", "Sarah Chen", "James Wilson", "Marcus Johnson"],
  screening: ["Maya Singh", "Aisha Rahman", "Elena Volkov", "David Kim"],
  interview: ["Grace Liu", "Tomoko Sato", "Omar Haddad", "Ryan O'Brien"],
};
const RANK_COLS = Object.keys(RANK_UNSORTED);

/* d6 drag demo: the human drags candidates forward through the stages — the
   Kanban visibly moving — one card at a time (a drag always wins). */
export const DRAG_MOVES: { card: string; to: string }[] = [
  { card: "Sarah Chen", to: "screening" },
  { card: "David Kim", to: "interview" },
  { card: "Grace Liu", to: "offer" },
];

export const ALL_CANDIDATES: Candidate[] = COLUMNS.flatMap((col) => col.cards);

/* The per-column card lists after `moveCount` moves have been applied. Each
   moved card lands at the top of its new stage. `floating` (the card currently
   being carried by the cursor) is lifted out of the board entirely. */
function dragPlacement(
  moveCount: number,
  floating: string | null,
): Record<string, Candidate[]> {
  const place: Record<string, Candidate[]> = {};
  COLUMNS.forEach((col) => {
    place[col.id] = [...col.cards];
  });
  for (let i = 0; i < moveCount && i < DRAG_MOVES.length; i++) {
    const m = DRAG_MOVES[i];
    let card: Candidate | undefined;
    let fromId: string | undefined;
    for (const id of Object.keys(place)) {
      const found = place[id].find((x) => x.name === m.card);
      if (found) {
        card = found;
        fromId = id;
        break;
      }
    }
    if (card && fromId) {
      place[fromId] = place[fromId].filter((x) => x.name !== m.card);
      place[m.to] = [card, ...place[m.to]];
    }
  }
  if (floating) {
    for (const id of Object.keys(place)) {
      place[id] = place[id].filter((c) => c.name !== floating);
    }
  }
  return place;
}

/* d4: a real Sort control with a dropdown of options — the cursor opens it and
   picks "AI score", switching the board from a list (by date) to a ranking. */
const SORT_OPTIONS: {
  id: "ai" | "date" | "name" | "stage" | "activity";
  label: string;
  icon: typeof Sparkle;
}[] = [
  { id: "ai", label: "AI score", icon: Sparkle },
  { id: "date", label: "Date applied", icon: Clock },
  { id: "name", label: "Name", icon: ArrowDownAZ },
  { id: "stage", label: "Stage", icon: Columns3 },
  { id: "activity", label: "Last activity", icon: Activity },
];

function SortControl({
  sortBy,
  menuOpen,
}: {
  sortBy: "ai" | "date";
  menuOpen: boolean;
}) {
  return (
    <div className="relative">
      <button
        data-sort
        className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-ofm-label font-medium transition-colors ${
          menuOpen
            ? "border-ofm-200 bg-ofm-50 text-ofm-700"
            : "border-zinc-200/70 text-zinc-600 hover:bg-zinc-50"
        }`}
      >
        <ArrowUpDown
          className={`size-3.5 ${menuOpen ? "text-ofm-600" : "text-zinc-400"}`}
          strokeWidth={2}
        />
        Sort: {sortBy === "ai" ? "AI score" : "Date applied"}
        <ChevronDown className="-mr-0.5 size-3.5 text-zinc-400" strokeWidth={2} />
      </button>
      {menuOpen && (
        <div className="absolute right-0 top-full z-30 mt-1.5 w-48 rounded-lg border border-zinc-200/70 bg-white p-1 shadow-lg">
          <p className="px-2.5 pb-1 pt-1.5 text-ofm-caption font-medium text-zinc-400">
            Sort by
          </p>
          {SORT_OPTIONS.map((o) => {
            const selected = o.id === sortBy;
            return (
              <button
                key={o.id}
                data-sort-ai={o.id === "ai" ? "" : undefined}
                className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-ofm-label transition-colors ${
                  selected
                    ? "font-medium text-ofm-700"
                    : "text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                <o.icon
                  className={`size-3.5 shrink-0 ${selected ? "text-ofm-600" : "text-zinc-400"}`}
                  strokeWidth={2}
                />
                <span className="flex-1 text-left">{o.label}</span>
                {selected && (
                  <Check className="size-3.5 shrink-0 text-ofm-600" strokeWidth={2.5} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Column({
  col,
  targetName,
  isRankCol = false,
  rankSorted = false,
  rankScoreHi = false,
  rankScoreFrame = false,
  dragCards,
  isDropTarget = false,
}: {
  col: (typeof COLUMNS)[number];
  targetName?: string | null;
  /** d4: this stage is part of the rank demo (starts as a list, re-sorts). */
  isRankCol?: boolean;
  rankSorted?: boolean;
  /** d4: pop/highlight the score chips once the sort lands. */
  rankScoreHi?: boolean;
  /** d4: spotlight the top score chip with the accent frame at the end. */
  rankScoreFrame?: boolean;
  /** d6: this column's cards after cross-stage drags. The card being carried by
      the cursor is lifted out of the board (rendered as a floating clone in the
      DragFlow overlay), so it's simply absent here and the column reflows. */
  dragCards?: Candidate[];
  /** d6: the carried card is hovering this stage — show a drop line up top. */
  isDropTarget?: boolean;
}) {
  let cards = col.cards;
  if (isRankCol) {
    cards = rankSorted
      ? [...col.cards].sort((a, b) => b.score - a.score)
      : (RANK_UNSORTED[col.id] ?? col.cards.map((c) => c.name)).map(
          (n) => col.cards.find((c) => c.name === n)!,
        );
  } else if (dragCards) {
    cards = dragCards;
  }

  return (
    <div
      data-col={col.id}
      className="group flex w-[280px] shrink-0 flex-col self-stretch rounded-xl border border-zinc-200/70 bg-zinc-50/40"
    >
      <div className={`flex items-center gap-2 rounded-t-xl bg-gradient-to-b to-transparent px-3 pb-5 pt-2.5 ${col.tint}`}>
        <span className={`size-2 shrink-0 rounded-full ${col.dot}`} />
        <span className="flex items-baseline gap-1.5">
          <span className="text-ofm-label font-semibold text-zinc-800">{col.name}</span>
          <span className={`text-ofm-label font-semibold tabular-nums ${col.count}`}>
            {cards.length}
          </span>
        </span>
        <div className="ml-auto flex items-center gap-0.5 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100">
          <button className="flex size-5 items-center justify-center rounded-md hover:bg-zinc-200/60">
            <MoreHorizontal className="size-3.5" strokeWidth={2} />
          </button>
          <button className="flex size-5 items-center justify-center rounded-md hover:bg-zinc-200/60">
            <Plus className="size-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>
      <div className="-mt-2 flex flex-col gap-2 px-2 pb-2">
        {isRankCol ? (
          cards.map((c, i) => (
            <motion.div
              key={c.name}
              layout
              transition={{ type: "spring", stiffness: 320, damping: 40 }}
            >
              <Card
                c={c}
                scorePop={rankScoreHi}
                popDelay={i * 0.07}
                scoreFrame={rankScoreFrame && i === 0}
              />
            </motion.div>
          ))
        ) : dragCards ? (
          <>
            <AnimatePresence>
              {isDropTarget && (
                <motion.div
                  key="drop-line"
                  layout
                  className="flex items-center gap-1.5 py-0.5"
                  initial={{ opacity: 0, scaleX: 0.7 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0.7 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{ transformOrigin: "left" }}
                >
                  <span className="size-2 shrink-0 rounded-full bg-ofm-500 ring-2 ring-ofm-100" />
                  <span className="h-[3px] flex-1 rounded-full bg-ofm-500" />
                </motion.div>
              )}
            </AnimatePresence>
            {cards.map((c) => (
              <motion.div
                key={c.name}
                layout
                data-card={c.name}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  layout: { type: "spring", stiffness: 460, damping: 42 },
                  opacity: { duration: 0.28, ease: "easeOut" },
                  scale: { type: "spring", stiffness: 480, damping: 30 },
                }}
              >
                <Card c={c} />
              </motion.div>
            ))}
          </>
        ) : (
          cards.map((c) => (
            <Card key={c.name} c={c} target={!!targetName && c.name === targetName} />
          ))
        )}
        <button className="mt-0.5 flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-ofm-caption font-medium text-zinc-400 transition-colors hover:bg-white hover:text-zinc-600">
          <Plus className="size-3.5" strokeWidth={2} />
          Add candidate
        </button>
      </div>
    </div>
  );
}

/* The stage the employer just added in the Edit-stages modal, now a real
   (empty) column on the board — the payoff for saving. */
function AddedStageColumn({ name }: { name: string }) {
  return (
    <motion.div
      className="relative flex w-[280px] shrink-0 flex-col self-stretch rounded-xl border border-zinc-200/70 bg-zinc-50/40"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-2 rounded-t-xl bg-gradient-to-b from-zinc-100 to-transparent px-3 pb-5 pt-2.5">
        <span className="size-2 shrink-0 rounded-full bg-zinc-400" />
        <span className="flex items-baseline gap-1.5">
          <span className="text-ofm-label font-semibold text-zinc-800">{name}</span>
          <span className="text-ofm-label font-semibold tabular-nums text-zinc-400">0</span>
        </span>
      </div>
      <div className="-mt-2 flex flex-1 flex-col px-2 pb-2">
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-200 py-6">
          <span className="flex size-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
            <Users className="size-4" strokeWidth={2} />
          </span>
          <span className="text-ofm-micro text-zinc-400">Drag candidates here</span>
        </div>
        <button className="mt-2 flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-ofm-caption font-medium text-zinc-400 transition-colors hover:bg-white hover:text-zinc-600">
          <Plus className="size-3.5" strokeWidth={2} />
          Add candidate
        </button>
      </div>
      <AccentFrame inset="-5px" radius={16} />
    </motion.div>
  );
}

export default function PipelineBoard({
  highlight = false,
  editing = false,
  extraStage = null,
  messaging = false,
  rankDemo = false,
  rankSorted = false,
  rankScoreHi = false,
  rankScoreFrame = false,
  sortMenuOpen = false,
  dragDemo = false,
  dragMoveCount = 0,
  draggingCard = null,
  dropStage = null,
  sortManual = false,
}: {
  /** Case-study highlight: draw the brand accent frame around the board. */
  highlight?: boolean;
  /** d2: render the "Edit stages" control in its active/open state. */
  editing?: boolean;
  /** d2 payoff: a saved custom stage appended to the board; the board
      auto-scrolls to reveal it. */
  extraStage?: string | null;
  /** d3: surface the "Message" action on the target candidate (Sarah Chen)
      as the trigger for the conversation dock. */
  messaging?: boolean;
  /** d4 rank demo: several stages start unsorted, then re-sort by AI score and
      the score chips pop/highlight. */
  rankDemo?: boolean;
  rankSorted?: boolean;
  rankScoreHi?: boolean;
  rankScoreFrame?: boolean;
  sortMenuOpen?: boolean;
  /** d6 drag demo: the human drags candidates forward across stages; after
      `dragMoveCount` moves the board reflects the new placement, `draggingCard`
      lifts, and the Sort control flips to "Manual" (a drag always wins). */
  dragDemo?: boolean;
  dragMoveCount?: number;
  draggingCard?: string | null;
  /** d6: the stage the carried card is hovering over — shows a drop line. */
  dropStage?: string | null;
  sortManual?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const targetName = messaging ? "Sarah Chen" : null;
  const place = dragDemo ? dragPlacement(dragMoveCount, draggingCard) : null;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (extraStage) {
      requestAnimationFrame(() =>
        el.scrollTo({ left: el.scrollWidth, behavior: "smooth" }),
      );
    } else {
      el.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [extraStage]);

  return (
    <div className="flex h-full flex-col">
      {/* view tabs + filters */}
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-200/70 px-5 py-2.5">
        <div className="flex h-8 items-center gap-0.5 rounded-lg bg-zinc-100 p-0.5">
          <Tab icon={Columns3} label="Board" active />
          <Tab icon={List} label="List" />
        </div>
        <div className="flex items-center gap-2">
          <label className="flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200/70 px-2.5 text-zinc-400 transition-colors focus-within:border-ofm-400 focus-within:ring-2 focus-within:ring-ofm-100">
            <Search className="size-3.5 shrink-0" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search by name, skills, etc."
              className="w-[190px] bg-transparent text-ofm-label font-medium text-zinc-700 placeholder:font-medium placeholder:text-zinc-400 focus:outline-none"
            />
          </label>
          <Chip icon={SlidersHorizontal} label="Filter" />
          {rankDemo ? (
            <SortControl sortBy={rankSorted ? "ai" : "date"} menuOpen={sortMenuOpen} />
          ) : (
            <Chip
              icon={ArrowUpDown}
              label={dragDemo && sortManual ? "Sort: Manual" : "Sort: AI score"}
              caret
              dataSort
            />
          )}
          <span className="mx-0.5 h-5 w-px bg-zinc-200/70" />
          <button
            data-edit-stages
            className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-ofm-label font-medium transition-colors ${
              editing
                ? "border-ofm-200 bg-ofm-50 text-ofm-700"
                : "border-zinc-200/70 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            <SquarePen
              className={`size-3.5 ${editing ? "text-ofm-600" : "text-zinc-400"}`}
              strokeWidth={2}
            />
            Edit stages
          </button>
          <button className="flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200/70 px-2.5 text-ofm-label font-medium text-zinc-600 transition-colors hover:bg-zinc-50">
            <Eye className="size-3.5 text-zinc-400" strokeWidth={2} />
            View posting
          </button>
        </div>
      </div>
      {/* columns */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          className="flex h-full gap-4 overflow-x-auto px-5 py-4"
        >
          {place ? (
            <LayoutGroup>
              {COLUMNS.map((col) => (
                <Column
                  key={col.id}
                  col={col}
                  dragCards={place[col.id]}
                  isDropTarget={dropStage === col.id}
                />
              ))}
            </LayoutGroup>
          ) : (
            COLUMNS.map((col) => (
              <Fragment key={col.id}>
                {extraStage && col.id === "offer" && (
                  <AddedStageColumn name={extraStage} />
                )}
                <Column
                  col={col}
                  targetName={targetName}
                  isRankCol={rankDemo && RANK_COLS.includes(col.id)}
                  rankSorted={rankSorted}
                  rankScoreHi={rankScoreHi}
                  rankScoreFrame={rankScoreFrame && col.id === "applied"}
                />
              </Fragment>
            ))
          )}
        </div>
        {highlight && <AccentFrame inset="8px" radius={16} />}
      </div>
    </div>
  );
}
