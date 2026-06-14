"use client";

import { motion } from "framer-motion";

export default function IconCard() {
  return (
    <motion.a
      href="#"
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="card-base bg-surface-muted flex items-center justify-center cursor-pointer"
    >
      <motion.div
        initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
        whileInView={{ rotate: -15, scale: 1, opacity: 1 }}
        whileHover={{ rotate: 0, scale: 1.1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-[100px] h-[100px] rounded-3xl bg-black/[0.06] flex items-center justify-center border border-black/[0.04]"
      >
        <motion.div
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="w-10 h-10 rounded-[10px] border-[3px] border-black/[0.15]"
        />
      </motion.div>
    </motion.a>
  );
}
