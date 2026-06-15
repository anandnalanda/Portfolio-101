"use client";

import { motion } from "framer-motion";

export default function StickerCard() {
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
      className="bg-white rounded-card border border-surface-border overflow-hidden relative flex items-center justify-center cursor-pointer"
    >
      <svg
        viewBox="0 0 258 258"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Rotated rounded square - main shape */}
        <g transform="translate(129, 120) rotate(12)">
          <rect
            x="-62"
            y="-62"
            width="124"
            height="124"
            rx="18"
            fill="white"
            stroke="#d8d8d8"
            strokeWidth="0.75"
            strokeDasharray="3 2"
          />
        </g>

        {/* Peel/fold at bottom-right corner */}
        <path
          d="M168 168 C168 152, 172 148, 182 142 L182 168 Z"
          fill="#ededed"
          stroke="#d8d8d8"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        <path
          d="M168 168 C176 162, 180 155, 182 142"
          fill="none"
          stroke="#d0d0d0"
          strokeWidth="0.75"
        />
        {/* Peel shadow */}
        <path
          d="M168 168 L182 168 C180 170, 172 172, 168 168Z"
          fill="#e0e0e0"
          opacity="0.5"
        />
      </svg>

      <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-10 bg-gradient-to-t from-white/90 to-transparent">
        <h3 className="text-[14px] font-semibold text-txt-heading leading-tight">
          Resume
        </h3>
        <p className="text-[12px] text-txt-secondary mt-0.5 leading-snug">
          Download my resume.
        </p>
      </div>
    </motion.div>
  );
}
