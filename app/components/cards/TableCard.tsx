"use client";

import { motion } from "framer-motion";

const headers = ["First name", "Last name", "Location", "Description"];
const rows = 4;

export default function TableCard() {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="col-span-2 card-base overflow-hidden"
    >
      <table className="w-full h-full border-collapse text-[13px]">
        <thead>
          <tr className="bg-black/[0.02]">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-5 py-3.5 font-medium text-txt-secondary border-b border-surface-border whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <motion.tr
              key={rowIdx}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + rowIdx * 0.08 }}
              className="hover:bg-black/[0.02] transition-colors group"
            >
              <td className="px-5 py-3 text-txt-secondary border-b border-black/[0.04]">
                Add name
              </td>
              <td className="px-5 py-3 text-txt-secondary border-b border-black/[0.04]">
                {rowIdx === 2 ? (
                  <span className="inline-flex items-center gap-1">
                    Add name
                    <span className="relative w-4 h-4">
                      <span className="absolute w-px h-full left-1/2 bg-txt-secondary" />
                      <span className="absolute h-px w-full top-1/2 bg-txt-secondary" />
                    </span>
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-accent-purple"
                    />
                  </span>
                ) : (
                  "Add name"
                )}
              </td>
              <td className="px-5 py-3 text-txt-secondary border-b border-black/[0.04]">
                Add location
              </td>
              <td className="px-5 py-3 text-txt-secondary border-b border-black/[0.04]">
                Add description
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
