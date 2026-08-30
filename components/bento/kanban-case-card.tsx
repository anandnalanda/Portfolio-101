"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { KanbanBoardMock, SEQ } from "./kanban-board-mock";
import { useHoverSequence } from "./use-hover-sequence";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* mesh gradient sampled from the reference — layered radials, no assets */
const MESH: React.CSSProperties = {
  backgroundColor: "#EC4E70",
  backgroundImage: [
    "radial-gradient(120% 90% at 8% 12%,  #EC4E70 0%, transparent 60%)",
    "radial-gradient(100% 80% at 0% 100%, #B536AC 0%, transparent 62%)",
    "radial-gradient(90% 70% at 78% 4%,   #F9D8B2 0%, transparent 58%)",
    "radial-gradient(95% 85% at 100% 72%, #7BA2EE 0%, transparent 60%)",
    "radial-gradient(70% 60% at 55% 45%,  #FBFDFF 0%, transparent 55%)",
  ].join(","),
};

export type KanbanCaseCardProps = {
  href: string;
  title: string;
  caption: string;
  /** shorter line for the arrow pill; falls back to caption */
  pillCaption?: string;
  className?: string;
  /** force the active state — for screenshots and Storybook */
  forceActive?: boolean;
  /** fill the parent (bento grid cell) instead of the 5/3 demo aspect */
  fill?: boolean;
};

export default function KanbanCaseCard({
  href,
  title,
  caption,
  pillCaption,
  className = "",
  forceActive = false,
  fill = false,
}: KanbanCaseCardProps) {
  const { ref, isActive, seqKey, loopTick, handlers, reduced } =
    useHoverSequence({ forceActive });

  return (
    <Link
      ref={ref}
      href={href}
      aria-label={`${title}, ${caption}`}
      className={`group block h-full rounded-card outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2 ${className}`}
      {...handlers}
    >
      <motion.div
        initial={false}
        animate={isActive ? "active" : "rest"}
        className={`relative w-full overflow-hidden rounded-card bg-white ${
          fill ? "h-full border-2 border-surface-border" : ""
        }`}
        style={fill ? undefined : { aspectRatio: "5 / 3", minHeight: 320 }}
      >
        {/* 1 · gradient surface */}
        <motion.div
          className={`absolute inset-0 z-0 rounded-card ${
            isActive ? "will-change-[transform,opacity]" : ""
          }`}
          style={{
            ...MESH,
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.35)",
          }}
          variants={{
            rest: {
              opacity: 0,
              scale: 0.94,
              transition: {
                opacity: { duration: 0.3, ease: "easeOut" },
                scale: { duration: 0, delay: 0.3 },
              },
            },
            active: {
              opacity: 1,
              scale: 1,
              transition: { duration: SEQ.start / 1000 + 0.06, ease: EASE },
            },
          }}
        >
          {/* ambient drift: one radial slowly wanders ~4%; transform only */}
          {isActive && !reduced && (
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(95% 85% at 100% 72%, #7BA2EE 0%, transparent 60%)",
              }}
              animate={{ x: ["0%", "4%"] }}
              transition={{
                duration: 12,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          )}
        </motion.div>

        {/* 2 · illustration panel — 420×250, floats centered, nudged down 50px */}
        <div
          className="absolute inset-0 z-10 flex items-center justify-center max-md:scale-75"
          style={{ translate: "0 50px" }}
        >
        <motion.div
          className="relative h-[250px] w-[420px] overflow-hidden rounded-[16px] border bg-white"
          variants={{
            rest: {
              y: 0,
              borderColor: "rgba(0,0,0,0.08)",
              boxShadow: "0 18px 40px -12px rgba(20,10,40,0)",
              transition: { duration: 0.24, ease: EASE },
            },
            active: {
              y: -14,
              borderColor: "rgba(0,0,0,0)",
              boxShadow: "0 18px 40px -12px rgba(20,10,40,0.28)",
              transition: {
                y: { duration: 0.53, ease: [0.43, 1, 0.3, 1] },
                boxShadow: { duration: 0.26, ease: EASE },
                borderColor: { duration: 0.16, ease: "linear" },
              },
            },
          }}
        >
          {/* the board; key bump on exit resets to frame 0, loopTick replays
              it on a cadence while hovered. crossfade masks the loop seam so
              the reset reads as a dissolve, not a teleport. */}
          <AnimatePresence initial={false}>
            <motion.div
              key={`${seqKey}-${loopTick}`}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <KanbanBoardMock
                playing={isActive}
                reduced={reduced}
                variant={loopTick}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
        </div>

        {/* 3 · case-study bar — shared arrow + expanding pill */}
        <motion.div
          className="absolute bottom-2 left-2 flex items-center gap-2 group/arrow z-20"
          variants={{ rest: { opacity: 0 }, active: { opacity: 1 } }}
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
              <strong className="font-semibold text-txt-heading">{title}</strong>
              {": "}
              {pillCaption ?? caption}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
}
