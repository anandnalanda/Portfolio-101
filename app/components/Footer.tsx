"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="flex justify-between items-center px-12 pt-6 pb-12 max-w-[1200px] mx-auto max-md:px-5 max-md:flex-col max-md:gap-3 max-md:text-center"
    >
      <span className="text-sm text-txt-secondary">
        ANAND M
      </span>
      <span className="text-sm text-txt-secondary flex items-center gap-1">
        Let&apos;s chat &rarr;{" "}
        <a
          href="mailto:anand97nalanda@gmail.com"
          className="font-bold text-txt-heading hover:text-accent transition-colors"
        >
          anand97nalanda@gmail.com
        </a>
      </span>
    </motion.footer>
  );
}
