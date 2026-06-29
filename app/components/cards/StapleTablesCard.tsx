"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const columns = ["First name", "Last name", "Location", "Description"];
const rows = 4;

export default function StapleTablesCard() {
  return (
    <Link href="/staple-tables" className="col-span-2">
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      initial="rest"
      whileHover="hover"
      className="relative h-full"
    >
      <div className="bg-white rounded-card border-2 border-surface-border overflow-hidden relative cursor-pointer p-6 flex flex-col justify-end h-full">
        <div className="border border-black/[0.06] rounded-xl overflow-hidden">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-black/[0.06]">
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2.5 font-medium text-txt-heading bg-[#fafafa]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, i) => (
                <tr
                  key={i}
                  className={
                    i < rows - 1 ? "border-b border-black/[0.04]" : ""
                  }
                >
                  <td className="px-4 py-2.5 text-txt-secondary">Add name</td>
                  <td className="px-4 py-2.5 text-txt-secondary">Add name</td>
                  <td className="px-4 py-2.5 text-txt-secondary">Add location</td>
                  <td className="px-4 py-2.5 text-txt-secondary truncate max-w-[120px]">
                    Add des...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          className="h-[32px] rounded-full bg-white backdrop-blur-md flex items-center px-4 max-w-0 opacity-0 group-hover/arrow:max-w-[600px] group-hover/arrow:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] overflow-hidden whitespace-nowrap"
          style={{ boxShadow: "0 0 0 1.5px rgba(0,0,0,0.08)" }}
        >
          <p className="text-[13px] text-txt-primary font-medium">
            <strong className="font-semibold text-txt-heading">Staple Tables</strong>
            {" — "}
            Structured data editing for teams.
          </p>
        </div>
      </motion.div>
    </motion.div>
    </Link>
  );
}
