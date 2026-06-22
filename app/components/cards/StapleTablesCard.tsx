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
      whileHover="hover"
      className="bg-white rounded-card border-2 border-surface-border overflow-hidden relative cursor-pointer p-6 flex flex-col justify-end h-full"
    >
      <motion.div
        variants={{
          hover: { y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" },
        }}
        className="absolute inset-0"
      />
      <motion.div
        className="absolute bottom-2 left-2 right-4 flex items-center gap-3 z-10"
        variants={{
          rest: { opacity: 0, y: 8 },
          hover: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="w-9 h-9 rounded-full bg-white shadow-[0_0_0_2px_rgba(0,0,0,0.1)] flex items-center justify-center flex-shrink-0">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(0,0,0,0.6)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </div>
        <p className="text-[13px] text-txt-primary truncate">
          <strong className="font-semibold text-txt-heading">Staple Tables</strong>
          {" — "}
          Structured data editing for teams.
        </p>
      </motion.div>
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
    </motion.div>
    </Link>
  );
}
