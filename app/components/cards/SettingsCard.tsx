"use client";

import { motion } from "framer-motion";

export default function SettingsCard() {
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
      className="bg-white rounded-card border-2 border-surface-border overflow-hidden relative flex items-center justify-center cursor-pointer p-4"
    >
      <svg
        viewBox="0 0 220 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer frame */}
        <rect
          x="2"
          y="2"
          width="216"
          height="216"
          rx="14"
          fill="#f3f3f3"
          stroke="#e2e2e2"
          strokeWidth="0.75"
        />

        {/* Ruler tick marks - top */}
        {Array.from({ length: 28 }).map((_, i) => (
          <line
            key={`top-${i}`}
            x1={18 + i * 7}
            y1="8"
            x2={18 + i * 7}
            y2={i % 4 === 0 ? 14 : 11}
            stroke="#d0d0d0"
            strokeWidth="0.5"
          />
        ))}

        {/* Ruler tick marks - bottom */}
        {Array.from({ length: 28 }).map((_, i) => (
          <line
            key={`bottom-${i}`}
            x1={18 + i * 7}
            y1="209"
            x2={18 + i * 7}
            y2={i % 4 === 0 ? 203 : 206}
            stroke="#d0d0d0"
            strokeWidth="0.5"
          />
        ))}

        {/* Ruler tick marks - left */}
        {Array.from({ length: 28 }).map((_, i) => (
          <line
            key={`left-${i}`}
            x1="8"
            y1={18 + i * 7}
            x2={i % 4 === 0 ? 14 : 11}
            y2={18 + i * 7}
            stroke="#d0d0d0"
            strokeWidth="0.5"
          />
        ))}

        {/* Ruler tick marks - right */}
        {Array.from({ length: 28 }).map((_, i) => (
          <line
            key={`right-${i}`}
            x1="209"
            y1={18 + i * 7}
            x2={i % 4 === 0 ? 203 : 206}
            y2={18 + i * 7}
            stroke="#d0d0d0"
            strokeWidth="0.5"
          />
        ))}

        {/* Inner panel area */}
        <rect
          x="18"
          y="18"
          width="184"
          height="184"
          rx="8"
          fill="#f8f8f8"
          stroke="#dcdcdc"
          strokeWidth="0.5"
        />

        {/* Center divider */}
        <line
          x1="110"
          y1="26"
          x2="110"
          y2="194"
          stroke="#e0e0e0"
          strokeWidth="0.5"
        />

        {/* Left panel handle */}
        <line
          x1="104"
          y1="104"
          x2="104"
          y2="120"
          stroke="#c8c8c8"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Right panel handle */}
        <line
          x1="116"
          y1="104"
          x2="116"
          y2="120"
          stroke="#c8c8c8"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Bottom center dots */}
        <circle cx="104" cy="200" r="1.5" fill="#c8c8c8" />
        <circle cx="110" cy="200" r="1.5" fill="#c8c8c8" />
        <circle cx="116" cy="200" r="1.5" fill="#c8c8c8" />

        {/* Bottom-right icon (swoosh/leaf) */}
        <path
          d="M186 188 C190 182, 196 180, 200 184 C196 188, 190 192, 186 188Z"
          fill="#c0c0c0"
        />
        <path
          d="M190 184 C193 180, 198 178, 201 181 C198 184, 193 187, 190 184Z"
          fill="#b0b0b0"
        />
      </svg>
    </motion.div>
  );
}
