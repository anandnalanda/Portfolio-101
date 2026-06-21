"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const projects = [
  { name: "Staple Chat", href: "/staple-chat" },
  { name: "Staple Tables", href: "/staple-tables" },
  { name: "Kanban and AI", href: "/kanban-and-ai" },
  { name: "OFM Jobs", href: "/ofm-jobs-tests" },
];

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="px-12 pt-6 max-md:px-4 max-md:pt-4"
    >
      <div className="relative flex items-center justify-center h-10 max-w-[1104px] mx-auto">
        <motion.div
          className="absolute left-0 w-10 h-10 rounded-full border-2 flex items-center justify-center cursor-pointer"
          whileHover="hover"
          initial="rest"
          variants={{
            rest: { scale: 1, backgroundColor: "rgba(0,0,0,0)", borderColor: "rgba(0,0,0,0.1)" },
            hover: { scale: 1.05, backgroundColor: "rgba(0,0,0,0.04)", borderColor: "rgba(0,0,0,0.2)" },
          }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            variants={{
              rest: { fill: "rgba(0,0,0,0.35)", rotate: 0 },
              hover: { fill: "rgba(0,0,0,0.8)", rotate: 30 },
            }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <path fillRule="evenodd" clipRule="evenodd" d="M12.2911 4.73456C12.705 5.53167 13.7546 5.53854 14.1772 4.74691L15.7024 1.89055C16.12 1.10848 17.153 1.10339 17.5771 1.88132L19.8469 6.04564C20.0453 6.40963 20.0513 6.86144 19.8625 7.23151L16.9436 12.9544C16.7516 13.3309 16.3879 13.5643 15.9932 13.5643H11.8112C10.9781 13.5643 10.4542 14.545 10.8641 15.3371L12.3599 18.2273C12.7699 19.0193 12.2459 20 11.4128 20H6.93119C6.53894 20 6.17707 19.7694 5.98406 19.3965L0.142407 8.10941C-0.267508 7.31739 0.256454 6.33668 1.08953 6.33668H4.27443C5.10822 6.33668 5.6321 5.35445 5.22075 4.56241L3.7727 1.77427C3.36135 0.98223 3.88523 0 4.71903 0H9.19854C9.59021 0 9.95165 0.229916 10.1449 0.601975L12.2911 4.73456ZM8.77922 11.3089C9.19246 12.1074 10.2431 12.1151 10.6662 11.3228L12.216 8.42026C12.6389 7.6282 12.1157 6.63367 11.2761 6.63367H8.22414C7.39107 6.63367 6.86711 7.61436 7.27702 8.40639L8.77922 11.3089Z" />
          </motion.svg>
        </motion.div>

        <div
          className="relative z-50"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <motion.div
            className="flex items-center gap-2 px-4 h-10 rounded-full border-2 border-black/[0.1] bg-transparent cursor-pointer hover:bg-black/[0.03] transition-colors"
            whileHover="hover"
            initial="rest"
          >
            <motion.svg
              width="24"
              height="24"
              viewBox="-1 -1 23 23"
              fill="none"
              strokeWidth="1.4"
              strokeMiterlimit="10"
              style={{ mixBlendMode: "multiply", overflow: "visible" }}
              xmlns="http://www.w3.org/2000/svg"
              variants={{
                rest: { rotate: 0 },
                hover: { rotate: 1170 },
              }}
              transition={{ type: "spring", visualDuration: 0.35, bounce: 0.15 }}
            >
              <motion.path
                d="M10.351 20.3604C13.3131 20.3604 15.7144 18.12 15.7144 15.3564C15.7144 12.5929 13.3131 10.3526 10.351 10.3526C7.38888 10.3526 4.98761 12.5929 4.98761 15.3564C4.98761 18.12 7.38888 20.3604 10.351 20.3604Z"
                variants={{
                  rest: { stroke: "rgba(37,36,41,0.35)", fill: "rgba(251,146,60,0)", strokeWidth: 1.4 },
                  hover: { stroke: "#ea580c", fill: "rgba(251,146,60,0.55)", strokeWidth: 1.4 },
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.path
                d="M10.351 10.3681C13.3131 10.3681 15.7144 8.12782 15.7144 5.36425C15.7144 2.60067 13.3131 0.360352 10.351 0.360352C7.38888 0.360352 4.98761 2.60067 4.98761 5.36425C4.98761 8.12782 7.38888 10.3681 10.351 10.3681Z"
                variants={{
                  rest: { stroke: "rgba(37,36,41,0.35)", fill: "rgba(59,130,246,0)", strokeWidth: 1.4 },
                  hover: { stroke: "#2563eb", fill: "rgba(59,130,246,0.55)", strokeWidth: 1.4 },
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.path
                d="M14.996 12.8623C17.9581 12.8623 20.3594 10.622 20.3594 7.8584C20.3594 5.09483 17.9581 2.85451 14.996 2.85451C12.0338 2.85451 9.63256 5.09483 9.63256 7.8584C9.63256 10.622 12.0338 12.8623 14.996 12.8623Z"
                variants={{
                  rest: { stroke: "rgba(37,36,41,0.35)", fill: "rgba(6,182,212,0)", strokeWidth: 1.4 },
                  hover: { stroke: "#0891b2", fill: "rgba(6,182,212,0.55)", strokeWidth: 1.4 },
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.path
                d="M5.72278 17.8662C8.68491 17.8662 11.0862 15.6259 11.0862 12.8623C11.0862 10.0987 8.68491 7.8584 5.72278 7.8584C2.76065 7.8584 0.359375 10.0987 0.359375 12.8623C0.359375 15.6259 2.76065 17.8662 5.72278 17.8662Z"
                variants={{
                  rest: { stroke: "rgba(37,36,41,0.35)", fill: "rgba(239,68,68,0)", strokeWidth: 1.4 },
                  hover: { stroke: "#dc2626", fill: "rgba(239,68,68,0.55)", strokeWidth: 1.4 },
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.path
                d="M5.72278 12.8623C8.68491 12.8623 11.0862 10.622 11.0862 7.8584C11.0862 5.09483 8.68491 2.85451 5.72278 2.85451C2.76065 2.85451 0.359375 5.09483 0.359375 7.8584C0.359375 10.622 2.76065 12.8623 5.72278 12.8623Z"
                variants={{
                  rest: { stroke: "rgba(37,36,41,0.35)", fill: "rgba(168,85,247,0)", strokeWidth: 1.4 },
                  hover: { stroke: "#9333ea", fill: "rgba(168,85,247,0.55)", strokeWidth: 1.4 },
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.path
                d="M14.996 17.8662C17.9581 17.8662 20.3594 15.6259 20.3594 12.8623C20.3594 10.0987 17.9581 7.8584 14.996 7.8584C12.0338 7.8584 9.63256 10.0987 9.63256 12.8623C9.63256 15.6259 12.0338 17.8662 14.996 17.8662Z"
                variants={{
                  rest: { stroke: "rgba(37,36,41,0.35)", fill: "rgba(34,197,94,0)", strokeWidth: 1.4 },
                  hover: { stroke: "#16a34a", fill: "rgba(34,197,94,0.55)", strokeWidth: 1.4 },
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.svg>
            <motion.span
              className="text-[15px] font-medium"
              variants={{
                rest: { color: "rgba(0,0,0,0.35)" },
                hover: { color: "rgba(0,0,0,0.8)" },
              }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              Selected work
            </motion.span>
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
                    {project.name}
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.a
          href="mailto:anand97nalanda@gmail.com"
          className="absolute right-0 h-10 rounded-full border-2 flex items-center justify-center cursor-pointer overflow-hidden"
          title="Get in touch"
          whileHover="hover"
          initial="rest"
          variants={{
            rest: { width: 40, paddingLeft: 0, paddingRight: 0, backgroundColor: "rgba(0,0,0,0)", borderColor: "rgba(0,0,0,0.1)" },
            hover: { width: 144, paddingLeft: 2, paddingRight: 2, backgroundColor: "rgba(0,0,0,0.04)", borderColor: "rgba(0,0,0,0.2)" },
          }}
          transition={{ type: "spring", visualDuration: 0.35, bounce: 0.15 }}
        >
          <motion.span
            className="text-[15px] font-medium whitespace-nowrap"
            variants={{
              rest: { opacity: 0, color: "rgba(0,0,0,0.35)", filter: "blur(4px)", width: 0, marginRight: 0 },
              hover: { opacity: 1, color: "rgba(0,0,0,0.8)", filter: "blur(0px)", width: "auto", marginRight: 8 },
            }}
            transition={{
              hover: { type: "spring", visualDuration: 0.35, bounce: 0.15 },
              rest: { duration: 0.15, ease: "easeOut" },
            }}
          >
            Let&apos;s chat
          </motion.span>
          <motion.svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0, position: "relative", zIndex: 10 }}
            variants={{
              rest: { stroke: "rgba(0,0,0,0.35)", rotate: 0 },
              hover: { stroke: "rgba(0,0,0,0.8)", rotate: 10 },
            }}
            transition={{ type: "spring", visualDuration: 0.35, bounce: 0.15 }}
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 7l-10 7L2 7" />
          </motion.svg>
        </motion.a>
      </div>
    </motion.nav>
  );
}
