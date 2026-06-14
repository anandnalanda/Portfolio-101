"use client";

import { motion } from "framer-motion";

export default function SwooshCard() {
  return (
    <motion.a
      href="#"
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="card-base bg-surface-muted flex items-center justify-center cursor-pointer"
    >
      <motion.svg
        viewBox="0 0 200 200"
        fill="none"
        className="w-[70%] h-auto"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.path
          d="M30 170 C50 100, 80 60, 110 90 C140 120, 150 50, 170 40"
          stroke="#1a1a1a"
          strokeWidth="32"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
        <motion.path
          d="M40 180 C60 110, 90 70, 120 100 C150 130, 160 60, 180 50"
          stroke="#2a2a2a"
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        />
      </motion.svg>
    </motion.a>
  );
}
