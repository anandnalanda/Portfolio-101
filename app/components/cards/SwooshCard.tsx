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
        whileHover={{
          y: -2,
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        }}
        className="bg-white rounded-card border-2 border-surface-border overflow-hidden relative flex items-center justify-center cursor-pointer h-full"
      >
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

      <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-10 bg-gradient-to-t from-white/90 to-transparent">
        <h3 className="text-[14px] font-semibold text-txt-heading leading-tight">
          Staple Chat
        </h3>
        <p className="text-[12px] text-txt-secondary mt-0.5 leading-snug">
          Conversational AI for document analysis.
        </p>
      </div>
      </motion.div>
    </Link>
  );
}
