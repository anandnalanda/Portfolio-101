"use client";

import { motion } from "framer-motion";

export default function ChatCard() {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="card-base bg-surface-muted flex items-center justify-center"
    >
      <motion.div
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-[120px] h-[120px] bg-black/[0.05] rounded-full flex flex-col items-center justify-center gap-2.5"
      >
        {[50, 40, 46].map((w, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-1.5 bg-black/10 rounded-full origin-left"
            style={{ width: `${w}px` }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
