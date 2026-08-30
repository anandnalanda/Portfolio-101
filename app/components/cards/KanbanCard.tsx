"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────
 * lfs.gd-style composition: a calm outer card with one
 * floating app window, cropped by the card's bottom edge.
 *
 * HOVER STORYBOARD — the window lifts, then one drag gesture:
 *   0%   cursor at rest (bottom-right of the window)
 *  30%   glides to the top-ranked card (Applied, 92)
 *  42%   mouse-down — card lifts onto the cursor
 *  78%   carried across to Screening; that column makes room
 * 100%   dropped at the top of Screening; Applied closes the gap
 * ───────────────────────────────────────────────────────── */
const TIMES = [0, 0.3, 0.42, 0.78, 1];
const PLAY = {
  duration: 2.2,
  times: TIMES,
  ease: [0.37, 0, 0.63, 1] as [number, number, number, number],
};
const BACK = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

/* OFM brand green (the case study's ofm-500 / ofm-600 family) */
const EMER = "#0B7A4E";

/* column pitch: 128px column + 10px gap */
const PITCH = 138;
/* card slot pitch: 40px card + 8px gap */
const SLOT = 48;

type Mini = { score: number; bar: number; sub: number };

const COLS: { label: string; cards: Mini[] }[] = [
  {
    label: "Applied",
    cards: [
      { score: 92, bar: 44, sub: 26 }, // the dragged one
      { score: 85, bar: 36, sub: 22 },
      { score: 78, bar: 40, sub: 30 },
    ],
  },
  {
    label: "Screening",
    cards: [
      { score: 88, bar: 38, sub: 24 },
      { score: 81, bar: 34, sub: 28 },
    ],
  },
  {
    label: "Interview",
    cards: [
      { score: 95, bar: 42, sub: 25 },
      { score: 87, bar: 37, sub: 21 },
    ],
  },
];

function Chip({ score }: { score: number }) {
  const strong = score >= 90;
  return (
    <span
      className="ml-auto flex h-[16px] shrink-0 items-center rounded-[4px] px-[4px] text-[9px] font-semibold tabular-nums"
      style={
        strong
          ? { background: EMER, color: "#fff" }
          : score >= 80
          ? { background: "rgba(11,122,78,0.12)", color: EMER }
          : { background: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.4)" }
      }
    >
      {score}
    </span>
  );
}

function MiniCard({ c }: { c: Mini }) {
  return (
    <div className="flex h-10 w-full items-center gap-1.5 rounded-[8px] border border-black/[0.07] bg-white px-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <span className="size-4 shrink-0 rounded-full bg-black/[0.08]" />
      <span className="min-w-0">
        <span
          className="block h-[4px] rounded-full bg-black/[0.12]"
          style={{ width: c.bar }}
        />
        <span
          className="mt-[3px] block h-[3px] rounded-full bg-black/[0.06]"
          style={{ width: c.sub }}
        />
      </span>
      <Chip score={c.score} />
    </div>
  );
}

export default function KanbanCard() {
  return (
    <Link href="/kanban-and-ai" className="col-span-2">
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        initial="rest"
        whileHover="hover"
        className="relative h-full"
      >
        <div className="bg-white rounded-card border-2 border-surface-border overflow-hidden relative cursor-pointer h-full">
          {/* the floating app window — cropped by the card's bottom edge */}
          <motion.div
            className="absolute left-1/2 top-10 w-[436px] -translate-x-1/2 rounded-[16px] border border-black/[0.08] bg-white p-4 pb-14"
            variants={{
              rest: {
                y: 0,
                boxShadow: "0 18px 40px -18px rgba(0,0,0,0.14)",
                transition: BACK,
              },
              hover: {
                y: -10,
                boxShadow: "0 30px 56px -20px rgba(0,0,0,0.2)",
                transition: BACK,
              },
            }}
          >
            {/* mini board */}
            <div className="relative flex w-[404px] gap-2.5">
              {COLS.map((col, ci) => (
                <div key={col.label} className="w-[128px] shrink-0">
                  <div className="flex items-center justify-between px-1 pb-[5px]">
                    <span className="text-[9.5px] font-medium text-black/35">
                      {col.label}
                    </span>
                    <span className="text-[9.5px] tabular-nums text-black/20">
                      {col.cards.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 rounded-[9px] bg-black/[0.025] p-[5px]">
                    {col.cards.map((c, i) => {
                      /* the drag hero: Applied's top card */
                      if (ci === 0 && i === 0) {
                        return (
                          <motion.div
                            key={c.score}
                            className="relative z-[3]"
                            variants={{
                              rest: {
                                x: 0,
                                y: 0,
                                scale: 1,
                                rotate: 0,
                                boxShadow: "0 0 0 rgba(0,0,0,0)",
                                transition: BACK,
                              },
                              hover: {
                                x: [0, 0, 0, PITCH, PITCH],
                                y: [0, 0, -3, -3, 0],
                                scale: [1, 1, 1.05, 1.05, 1],
                                rotate: [0, 0, -2.5, -2.5, 0],
                                boxShadow: [
                                  "0 0 0 rgba(0,0,0,0)",
                                  "0 0 0 rgba(0,0,0,0)",
                                  "0 8px 18px rgba(0,0,0,0.14)",
                                  "0 8px 18px rgba(0,0,0,0.14)",
                                  "0 2px 5px rgba(0,0,0,0.06)",
                                ],
                                transition: PLAY,
                              },
                            }}
                            style={{ borderRadius: 8 }}
                          >
                            <MiniCard c={c} />
                          </motion.div>
                        );
                      }
                      /* Applied's lower cards close the gap after the drop */
                      if (ci === 0) {
                        return (
                          <motion.div
                            key={c.score}
                            variants={{
                              rest: { y: 0, transition: BACK },
                              hover: { y: [0, 0, 0, 0, -SLOT], transition: PLAY },
                            }}
                          >
                            <MiniCard c={c} />
                          </motion.div>
                        );
                      }
                      /* Screening makes room while the card is carried over */
                      if (ci === 1) {
                        return (
                          <motion.div
                            key={c.score}
                            variants={{
                              rest: { y: 0, transition: BACK },
                              hover: { y: [0, 0, 0, SLOT, SLOT], transition: PLAY },
                            }}
                          >
                            <MiniCard c={c} />
                          </motion.div>
                        );
                      }
                      return <MiniCard key={c.score} c={c} />;
                    })}
                  </div>
                </div>
              ))}

              {/* demo cursor — grabs the 92 and carries it one stage forward */}
              <motion.div
                className="pointer-events-none absolute left-0 top-0 z-[4]"
                variants={{
                  rest: { x: 368, y: 138, transition: BACK },
                  hover: {
                    x: [368, 78, 78, 78 + PITCH, 78 + PITCH],
                    y: [138, 42, 38, 38, 44],
                    transition: PLAY,
                  },
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.25))" }}
                >
                  <path
                    d="M3 2 L3 16.5 L6.8 12.9 L9.2 18.2 L11.6 17.1 L9.2 11.9 L14.4 11.9 Z"
                    fill="#18181b"
                    stroke="#ffffff"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* case-study bar */}
        <motion.div
          className="absolute bottom-2 left-2 flex items-center gap-2 group/arrow z-10"
          variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
          transition={{ duration: 0.2 }}
        >
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
              <strong className="font-semibold text-txt-heading">Kanban and AI</strong>
              {": "}
              Hiring pipeline with AI-ranked candidates.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
}
