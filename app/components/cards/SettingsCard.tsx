"use client";

import { motion } from "framer-motion";
import { useState } from "react";

function Toggle({ initialOn = false, delay = 0 }: { initialOn?: boolean; delay?: number }) {
  const [on, setOn] = useState(initialOn);
  return (
    <motion.button
      onClick={(e) => {
        e.preventDefault();
        setOn(!on);
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`w-7 h-4 rounded-full relative flex-shrink-0 cursor-pointer transition-colors duration-200 ${
        on ? "bg-accent-purple/30" : "bg-black/10"
      }`}
    >
      <motion.div
        animate={{ x: on ? 12 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute top-[2px] w-3 h-3 rounded-full transition-colors duration-200 ${
          on ? "bg-accent-purple" : "bg-black/20"
        }`}
      />
    </motion.button>
  );
}

function Slider({ width = "100%", delay = 0 }: { width?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex-1 h-1 bg-black/[0.06] rounded-full relative origin-left"
      style={{ maxWidth: width }}
    >
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black/[0.12]" />
    </motion.div>
  );
}

export default function SettingsCard() {
  return (
    <motion.a
      href="#"
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="card-base bg-surface-muted flex items-center justify-center p-6 cursor-pointer"
    >
      <div className="w-full h-full bg-black/[0.03] rounded-2xl p-5 flex flex-col gap-3.5 border border-surface-border">
        <div className="flex items-center gap-2.5">
          <div className="w-[40%] h-1.5 bg-black/[0.08] rounded-full" />
          <div className="flex-1" />
          <Toggle initialOn delay={0.3} />
        </div>
        <div className="h-px bg-black/[0.06]" />
        <div className="flex items-center gap-2.5">
          <div className="w-[50%] h-1.5 bg-black/[0.08] rounded-full" />
          <Slider delay={0.4} />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-[35%] h-1.5 bg-black/[0.08] rounded-full" />
          <Slider width="60%" delay={0.5} />
        </div>
        <div className="h-px bg-black/[0.06]" />
        <div className="flex items-center gap-2.5">
          <div className="w-[45%] h-1.5 bg-black/[0.08] rounded-full" />
          <div className="flex-1" />
          <Toggle delay={0.6} />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-[55%] h-1.5 bg-black/[0.08] rounded-full" />
          <div className="flex-1" />
          <Toggle initialOn delay={0.7} />
        </div>
        <div className="h-px bg-black/[0.06]" />
        <div className="flex items-center gap-2.5">
          <div className="w-[40%] h-1.5 bg-black/[0.08] rounded-full" />
          <Slider delay={0.8} />
        </div>
      </div>
    </motion.a>
  );
}
