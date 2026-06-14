"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const projects = [
  { name: "Bentley", href: "#", comingSoon: true },
  { name: "Docufai", href: "#" },
  { name: "Ripcord", href: "#" },
  { name: "Karhoo", href: "#" },
  { name: "Reuters", href: "#" },
];

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 px-12 pt-6 bg-white/95 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between h-10 max-w-[1104px] mx-auto">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="w-10 h-10 rounded-full bg-black/[0.03] flex items-center justify-center cursor-pointer hover:bg-black/[0.06] transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(37,36,41,0.4)"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="2" x2="12" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
          </svg>
        </motion.div>

        {/* Selected Work */}
        <div
          className="relative"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-black/[0.04] cursor-pointer hover:bg-black/[0.07] transition-colors"
          >
            <div className="grid grid-cols-3 gap-[2px]">
              {Array.from({ length: 9 }).map((_, i) => (
                <span
                  key={i}
                  className="w-1 h-1 rounded-full bg-txt-secondary"
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-txt-secondary">
              Selected work
            </span>
          </motion.div>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white border border-surface-border rounded-2xl p-2 min-w-[180px] shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
              >
                {projects.map((project, i) => (
                  <motion.a
                    key={project.name}
                    href={project.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="block px-3 py-2 rounded-[10px] text-sm font-semibold text-txt-primary hover:bg-black/[0.04] transition-colors"
                  >
                    {project.comingSoon && (
                      <span className="block text-xs font-normal text-txt-secondary mb-0.5">
                        Coming soon
                      </span>
                    )}
                    {project.name}
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mail */}
        <motion.a
          href="mailto:m@lfs.gd"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="w-10 h-10 rounded-full bg-black/[0.03] flex items-center justify-center hover:bg-black/[0.06] transition-colors"
          title="Let's chat"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(37,36,41,0.4)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 7l-10 7L2 7" />
          </svg>
        </motion.a>
      </div>
    </motion.nav>
  );
}
