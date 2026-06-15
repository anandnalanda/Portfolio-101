"use client";

import { motion } from "framer-motion";

export default function BioCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="col-span-2 row-span-2 bg-white rounded-card border border-surface-border overflow-hidden p-6 flex flex-col justify-between"
    >
      <div>
        <h1 className="text-[22px] leading-[1.4] text-txt-secondary mb-4">
          <strong className="text-txt-heading font-bold">Anand Nalanda</strong>{" "}
          — Design engineer and product builder at{" "}
          <strong className="text-txt-heading font-bold">Staple</strong>
        </h1>

        <div className="flex flex-col gap-3">
          <p className="text-[18px] leading-[1.65] text-txt-primary font-normal">
            <strong className="text-txt-heading font-bold">Design + code</strong>{" "}
            is my creative edge on the internet, born out of the golden age of
            interface craft (aka the Figma era).
          </p>

          <p className="text-[18px] leading-[1.65] text-txt-primary font-normal">
            With three years of experience spent at ~12800% zoom,
            I&apos;ve collaborated with innovative{" "}
            <span className="text-[#2aa198] font-semibold">startups</span>,
            fast-moving{" "}
            <span className="text-[#e6994a] font-semibold">teams</span>, and
            ambitious{" "}
            <span className="text-[#d95b5b] font-semibold">founders</span>,
            offering a blend of craftsmanship and speed.
          </p>

          <p className="text-[18px] leading-[1.65] text-txt-primary font-normal">
            At my core is a deep{" "}
            <span className="line-through">passion</span> obsession for
            simplicity, meticulous pixel perfection, and human-centric design.
          </p>

          <p className="text-[18px] leading-[1.65] text-txt-primary font-normal">
            I specialize in building robust design systems, quality user
            interfaces, and shipping products end-to-end.
          </p>

          <p className="text-[18px] leading-[1.65] text-txt-primary font-normal">
            Life is good. Let&apos;s create something beautiful together.
          </p>
        </div>
      </div>

      <div className="mt-2">
        <span className="text-[28px]" role="img" aria-label="sun">
          🌞
        </span>
      </div>
    </motion.div>
  );
}
