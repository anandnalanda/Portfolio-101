"use client";

import { motion } from "framer-motion";

const columns = ["First name", "Last name", "Location", "Description"];
const rows = 4;

export default function StapleTablesCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -2,
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
      }}
      className="col-span-2 bg-white rounded-card border border-surface-border overflow-hidden relative cursor-pointer p-6 flex flex-col justify-end"
    >
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
  );
}
