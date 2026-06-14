"use client";

import { motion } from "framer-motion";

const dots = [
  { top: "35%", left: "55%", delay: 0.3 },
  { top: "55%", left: "45%", delay: 0.5 },
  { top: "70%", left: "60%", delay: 0.7 },
];

const karhooLetters = ["K", "A", "R", "H", "O", "O"];

export default function PhoneCard() {
  return (
    <motion.a
      href="#"
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="row-span-2 card-base bg-surface-muted flex flex-col items-center justify-center p-6 gap-4 cursor-pointer"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-[160px] h-[320px] bg-[#1a1a1a] rounded-[28px] p-2 relative shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
      >
        <div className="w-full h-full bg-[#f5f5f5] rounded-[20px] relative overflow-hidden">
          {/* Notch */}
          <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[60px] h-5 bg-[#1a1a1a] rounded-[10px] z-10" />

          {/* Map grid */}
          <svg
            width="100%"
            height="100%"
            className="absolute inset-0"
          >
            {[25, 50, 75].map((p) => (
              <line
                key={`h${p}`}
                x1="0"
                y1={`${p}%`}
                x2="100%"
                y2={`${p}%`}
                stroke="rgba(0,0,0,0.04)"
                strokeWidth="0.5"
              />
            ))}
            {[25, 50, 75].map((p) => (
              <line
                key={`v${p}`}
                x1={`${p}%`}
                y1="0"
                x2={`${p}%`}
                y2="100%"
                stroke="rgba(0,0,0,0.04)"
                strokeWidth="0.5"
              />
            ))}
          </svg>

          {/* Location dots */}
          {dots.map((dot, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: dot.delay,
                type: "spring",
                stiffness: 300,
                damping: 15,
              }}
              className="absolute w-2 h-2"
              style={{ top: dot.top, left: dot.left }}
            >
              <div className="w-2 h-2 bg-accent-coral rounded-full relative z-10" />
              <motion.div
                animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                className="absolute -inset-1 bg-accent-coral/20 rounded-full"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* KARHOO text */}
      <div className="flex gap-1.5">
        {karhooLetters.map((letter, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.8 + i * 0.06,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="text-[28px] font-bold tracking-[6px] text-accent-coral"
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </motion.a>
  );
}
