"use client";

import { motion } from "framer-motion";

export default function BioCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="col-span-2 row-span-2 card-base p-9 flex flex-col justify-between"
    >
      <div>
        <h1 className="text-[22px] leading-[1.4] text-txt-secondary mb-7">
          <strong className="text-txt-heading font-bold">Anand Nalanda</strong>{" "}
          — Design engineer. I design in Figma and ship in Next.js.
        </h1>

        <div className="flex flex-col gap-4">
          <p className="text-[15px] leading-[1.65] text-txt-primary">
            With three years across early-stage startups, I&apos;ve learned that
            the fastest path from idea to shipped product is one person who owns
            both the design and the code. That&apos;s the role I play.
          </p>

          <p className="text-[15px] leading-[1.65] text-txt-primary">
            I work end-to-end — product thinking in Figma, then production UI in{" "}
            <span className="text-accent font-semibold">Next.js</span> and{" "}
            <span className="text-accent font-semibold">React</span>. Design
            systems, component libraries, and pixel-level polish are my comfort
            zone.
          </p>

          <p className="text-[15px] leading-[1.65] text-txt-primary">
            My obsession is shipping velocity without sacrificing craft — every
            detail considered, every interaction intentional, every deploy on
            time.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <motion.a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.03)" }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2.5 border border-black/10 rounded-full text-[13px] font-semibold text-txt-heading transition-colors"
        >
          Follow on X
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3.5 h-3.5"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </motion.a>

        <a
          href="mailto:anand97nalanda@gmail.com"
          className="text-[13px] text-txt-secondary hover:text-accent transition-colors"
        >
          anand97nalanda@gmail.com
        </a>
      </div>
    </motion.div>
  );
}
