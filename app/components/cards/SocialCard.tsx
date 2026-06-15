"use client";

import { motion } from "framer-motion";

export default function SocialCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -2,
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
      }}
      className="bg-white rounded-card border border-surface-border overflow-hidden relative cursor-pointer p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-[14px] font-bold">
            A
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-semibold text-txt-heading">
                Anand
              </span>
              <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-white" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </span>
            </div>
            <span className="text-[12px] text-txt-secondary">@anandnalanda</span>
          </div>
        </div>

        <p className="text-[13px] leading-[1.5] text-txt-primary">
          designengineer/figma
          magician/nextjs/react/
          systemthinker{" "}
          <span className="text-blue-500">@staple</span>
        </p>
      </div>

      <a
        href="https://x.com"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-2 px-5 py-2.5 border border-black/10 rounded-full text-[13px] font-semibold text-txt-heading hover:bg-black/[0.03] transition-colors w-fit"
      >
        Follow me on
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
    </motion.div>
  );
}
