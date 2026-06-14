"use client";

import { motion } from "framer-motion";

export default function SocialCard() {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="card-base p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-2.5 mb-3.5">
          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 overflow-hidden flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 opacity-60">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
            </svg>
          </motion.div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-accent-purple text-white text-[9px] font-bold flex items-center justify-center">
                M
              </span>
            </div>
            <span className="text-[13px] text-txt-secondary">@msllrs</span>
          </div>
        </div>

        <p className="text-sm font-semibold text-txt-secondary leading-[1.4] mb-3">
          photoshoperator/figmagician/framercurial/systemplar{" "}
          <a href="#" className="text-accent-teal hover:underline">
            @lovable
          </a>
        </p>
      </div>

      <motion.a
        href="#"
        whileHover={{ scale: 1.03, backgroundColor: "rgba(0,0,0,0.03)" }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="flex items-center gap-2 px-4 py-2.5 border border-black/10 rounded-full text-[13px] font-semibold text-txt-heading w-fit"
      >
        Follow me on
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </motion.a>
    </motion.div>
  );
}
