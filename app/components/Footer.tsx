"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="flex justify-between items-center px-12 pt-6 pb-12 max-w-[1200px] mx-auto"
    >
      <span className="text-sm text-txt-secondary">
        &copy; 2026 - Matt Sellers
      </span>
      <span className="text-sm text-txt-secondary flex items-center gap-1">
        Let&apos;s chat &rarr;{" "}
        <motion.a
          href="mailto:m@lfs.gd"
          whileHover={{ scale: 1.03 }}
          className="font-bold text-txt-heading hover:underline"
        >
          m@lfs.gd
        </motion.a>
      </span>
    </motion.footer>
  );
}
