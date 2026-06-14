"use client";

import { motion } from "framer-motion";

export default function DocuFaiCard() {
  return (
    <motion.a
      href="#"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="col-span-2 card-base p-7 flex flex-col justify-between cursor-pointer"
    >
      <div className="flex flex-col gap-4">
        {/* Search bar */}
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0"
          >
            <span className="text-white text-base font-bold">✦</span>
          </motion.div>

          <div className="flex-1 h-10 border border-black/[0.08] rounded-[10px] px-3.5 flex items-center relative">
            <span className="text-sm text-txt-secondary">
              Ask your documents anything
            </span>
            <span
              className="inline-block w-[2px] h-4 bg-txt-secondary/60 ml-0.5"
              style={{ animation: "blink 1s infinite" }}
            />
            <svg
              className="absolute right-3 text-txt-secondary"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
            </svg>
          </div>
        </div>

        {/* File chip */}
        <div className="self-center inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-black/[0.08] rounded-lg text-[13px] text-txt-primary w-fit">
          <span className="text-accent-coral text-xs">📄</span>
          BitcoinWhitepaper.pdf
        </div>
      </div>

      <p className="text-[17px] font-medium text-txt-heading mt-1">
        What&apos;s the deal with magic internet money?
      </p>
    </motion.a>
  );
}
