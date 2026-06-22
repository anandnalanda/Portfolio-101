"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function SwooshCard() {
  return (
    <Link href="/staple-chat">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        whileHover="hover"
        className="bg-white rounded-card border-2 border-surface-border overflow-hidden relative flex items-center justify-center cursor-pointer h-full"
      >
      <motion.div
        variants={{
          hover: { y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" },
        }}
        className="absolute inset-0"
      />
      <svg
        viewBox="0 0 258 258"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Back arc - lighter */}
        <path
          d="M80 165 C80 120, 110 90, 145 90 C180 90, 195 115, 195 140 L185 140 C185 120, 172 98, 145 98 C115 98, 90 125, 90 165Z"
          fill="#d4d4d4"
        />
        {/* Front arc - darker */}
        <path
          d="M95 165 C95 130, 115 105, 145 105 C175 105, 188 125, 188 150 L175 150 C175 130, 165 113, 145 113 C122 113, 108 135, 108 165Z"
          fill="#a8a8a8"
        />
      </svg>

      <motion.div
        className="absolute bottom-2 left-2 right-4 flex items-center gap-3"
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
          <strong className="font-semibold text-txt-heading">Staple Chat</strong>
          {" — "}
          Conversational AI for document analysis.
        </p>
      </motion.div>
      </motion.div>
    </Link>
  );
}
