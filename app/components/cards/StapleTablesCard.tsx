"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const columns: { label: string; align: "left" | "right" }[] = [
  { label: "Item", align: "left" },
  { label: "Description", align: "left" },
  { label: "Rate", align: "left" },
];

const data = [
  { item: "SSL Certificate", description: "1-year wildcard certificate", rate: "$120.00" },
  { item: "Website Maintenance", description: "Monthly security and updates", rate: "$450.00" },
  { item: "Cloud Hosting Plan", description: "Monthly subscription", rate: "$89.00" },
  { item: "Premium Support Plan", description: "24/7 IT assistance", rate: "$200.00" },
];

/* ─────────────────────────────────────────────────────────
 * HOVER STORYBOARD — one selection gesture, plays once
 *
 *   0%   cursor at rest (bottom-right)
 *  28%   glides up to the first cell (top-left)
 *  40%   mouse-down — selection begins
 *  70%   dragging down-right, selection box grows with cursor
 * 100%   drag ends over a 3×3 block; holds while hovered
 *
 *  On un-hover everything eases back to the starting position.
 * ───────────────────────────────────────────────────────── */
const PLAY_TIMES = [0, 0.28, 0.4, 0.7, 1];
const PLAY = {
  duration: 1.9,
  times: PLAY_TIMES,
  // smooth sinusoidal ease-in-out on every segment
  ease: [0.37, 0, 0.63, 1] as [number, number, number, number],
};

export default function StapleTablesCard() {
  return (
    <Link href="/staple-tables" className="col-span-2">
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      initial="rest"
      whileHover="hover"
      className="relative h-full"
    >
      <div className="bg-white rounded-card border-2 border-surface-border overflow-hidden relative cursor-pointer flex flex-col justify-center h-full">
        {/* Stage — zooms into the selected block as the drag completes */}
        <motion.div
          className="relative w-full"
          style={{ transformOrigin: "34% 48%" }}
          variants={{
            rest: { scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
            hover: { scale: [1, 1, 1, 1.05, 1.1], transition: PLAY },
          }}
        >
        <table className="w-full min-w-[560px] text-left text-[16px] table-fixed">
          <thead>
            <tr className="border-b border-black/[0.06]">
              {columns.map((col) => (
                <th
                  key={col.label}
                  className={`px-6 py-3.5 text-[14px] font-medium text-txt-heading whitespace-nowrap ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={row.item}
                className={
                  i < data.length - 1 ? "border-b border-black/[0.04]" : ""
                }
              >
                <td className="px-6 py-3.5 font-normal text-txt-secondary whitespace-nowrap">{row.item}</td>
                <td className="px-6 py-3.5 font-normal text-txt-secondary truncate max-w-0">{row.description}</td>
                <td className="px-6 py-3.5 font-normal text-txt-secondary whitespace-nowrap">{row.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Range selection drawn by the teammate (anchored top-left, grows to cursor) */}
        <motion.div
          className="absolute rounded-[3px] border-[1.5px] border-[#7c3aed] bg-[#7c3aed]/[0.08] pointer-events-none z-[1]"
          style={{ left: "7%", top: "21%" }}
          variants={{
            rest: {
              width: "0%",
              height: "0%",
              opacity: 0,
              transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
            },
            hover: {
              width: ["0%", "0%", "3%", "27%", "53%"],
              height: ["0%", "0%", "3%", "29%", "53%"],
              opacity: [0, 0, 1, 1, 1],
              transition: PLAY,
            },
          }}
        >
          {[
            "-left-[3px] -top-[3px]",
            "-right-[3px] -top-[3px]",
            "-left-[3px] -bottom-[3px]",
            "-right-[3px] -bottom-[3px]",
          ].map((pos) => (
            <span
              key={pos}
              className={`absolute w-[6px] h-[6px] bg-white border border-[#7c3aed] rounded-[1px] ${pos}`}
            />
          ))}
        </motion.div>

        {/* Teammate cursor — glides through the storyboard waypoints */}
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[2]"
          variants={{
            rest: {
              left: "77%",
              top: "79%",
              transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
            },
            hover: {
              left: ["77%", "12%", "12%", "34%", "60%"],
              top: ["79%", "28%", "28%", "50%", "74%"],
              transition: PLAY,
            },
          }}
        >
          <div className="relative w-[52px] h-[52px]">
            {/* crosshair lines */}
            <span className="absolute left-1/2 top-0 -translate-x-1/2 w-[1.5px] h-full bg-black/40" />
            <span className="absolute top-1/2 left-0 -translate-y-1/2 h-[1.5px] w-full bg-black/40" />
            {/* center circle */}
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[28px] h-[28px] rounded-full bg-black/[0.06] ring-[1.5px] ring-black/40" />
            {/* purple presence dot */}
            <span className="absolute left-[34px] top-[34px] w-[13px] h-[13px] rounded-full bg-[#7c3aed] shadow-[0_2px_6px_rgba(124,58,237,0.4)]" />
          </div>
        </motion.div>
        </motion.div>
      </div>
      <motion.div
        className="absolute bottom-2 left-2 flex items-center gap-2 group/arrow z-10"
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 relative overflow-hidden transition-shadow duration-300"
          style={{ boxShadow: "0 0 0 2px rgba(0,0,0,0.1)" }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.08)"}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.1)"}
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
            <strong className="font-semibold text-txt-heading">Staple Tables</strong>
            {": "}
            Structured data editing for teams.
          </p>
        </div>
      </motion.div>
    </motion.div>
    </Link>
  );
}
