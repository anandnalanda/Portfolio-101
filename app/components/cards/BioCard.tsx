"use client";

import { motion } from "framer-motion";

const paragraph = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function BioCard() {
  return (
    <div className="col-span-2 row-span-2 card-base p-9 flex flex-col justify-between group">
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-[22px] leading-[1.4] text-txt-secondary mb-6"
      >
        <strong className="text-txt-heading font-bold">Matt Sellers</strong> —
        Software designer and interface alchemist at{" "}
        <motion.strong
          className="text-txt-heading font-bold inline-block"
          whileHover={{ scale: 1.05, color: "#8b5cf6" }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          Lovable
        </motion.strong>
      </motion.h1>

      <div className="flex flex-col gap-4">
        <motion.p
          custom={0}
          variants={paragraph}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-[15px] leading-[1.65] text-txt-primary"
        >
          <strong className="font-bold">LFSGD</strong> is my creative alias on
          the internet, born out of the golden age of interface design (aka the
          Photoshop era).
        </motion.p>

        <motion.p
          custom={1}
          variants={paragraph}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-[15px] leading-[1.65] text-txt-primary"
        >
          With over twenty years of experience spent at ~12800% zoom, I&apos;ve
          collaborated with some of the world&apos;s top{" "}
          <a
            href="#"
            className="text-accent-teal font-semibold hover:underline transition-colors"
          >
            studios
          </a>
          , innovative{" "}
          <a
            href="#"
            className="text-accent-coral font-semibold hover:underline transition-colors"
          >
            startups
          </a>
          , and leading{" "}
          <a
            href="#"
            className="text-accent-orange font-semibold hover:underline transition-colors"
          >
            companies
          </a>
          , offering a blend of craftsmanship and expertise.
        </motion.p>

        <motion.p
          custom={2}
          variants={paragraph}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-[15px] leading-[1.65] text-txt-primary"
        >
          At my core is a deep{" "}
          <s className="text-txt-secondary">passion</s> obsession for
          simplicity, meticulous pixel perfection, and human-centric design.
        </motion.p>

        <motion.p
          custom={3}
          variants={paragraph}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-[15px] leading-[1.65] text-txt-primary"
        >
          I specialize in building robust design systems, quality user
          interfaces, and custom iconography.
        </motion.p>

        <motion.p
          custom={4}
          variants={paragraph}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-[15px] leading-[1.65] text-txt-primary"
        >
          Life is good. Let&apos;s create something beautiful together.
        </motion.p>
      </div>

      <motion.span
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, type: "spring", stiffness: 300, damping: 15 }}
        className="text-2xl mt-2"
      >
        🌞
      </motion.span>
    </div>
  );
}
