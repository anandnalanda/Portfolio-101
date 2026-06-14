"use client";

import { motion } from "framer-motion";

export default function ReadCvCard() {
  return (
    <motion.a
      href="#"
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="card-base bg-surface-muted flex items-center justify-center cursor-pointer"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex flex-col items-center gap-2"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="w-12 h-12 bg-black/[0.06] rounded-xl flex items-center justify-center text-xl font-bold text-txt-secondary"
        >
          Ⓜ️
        </motion.div>
        <span className="text-sm font-semibold text-txt-primary">Read.cv</span>
      </motion.div>
    </motion.a>
  );
}
