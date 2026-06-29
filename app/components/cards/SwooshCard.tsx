"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function SwooshCard() {
  return (
    <Link href="/staple-chat" className="relative">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        initial="rest"
        whileHover="hover"
        className="relative h-full"
      >
        <motion.div
          variants={{
            rest: {},
            hover: {},
          }}
          className="bg-white rounded-card border-2 border-surface-border overflow-hidden relative flex items-center justify-center cursor-pointer h-full"
        >
          <svg
            viewBox="0 0 258 258"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M80 165 C80 120, 110 90, 145 90 C180 90, 195 115, 195 140 L185 140 C185 120, 172 98, 145 98 C115 98, 90 125, 90 165Z"
              fill="#d4d4d4"
            />
            <path
              d="M95 165 C95 130, 115 105, 145 105 C175 105, 188 125, 188 150 L175 150 C175 130, 165 113, 145 113 C122 113, 108 135, 108 165Z"
              fill="#a8a8a8"
            />
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-2 left-2 flex items-center gap-2 group/arrow z-10"
          variants={{
            rest: { opacity: 0 },
            hover: { opacity: 1 },
          }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 relative overflow-hidden transition-shadow duration-300"
            style={{ boxShadow: "0 0 0 2px rgba(0,0,0,0.1)" }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.08)"}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.1)"}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(0,0,0,0.6)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/arrow:translate-x-[120%] group-hover/arrow:-translate-y-[120%] motion-reduce:!transform-none"
            >
              <line x1="5" y1="19" x2="19" y2="5" />
              <polyline points="9 5 19 5 19 15" />
            </svg>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(0,0,0,0.9)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute translate-x-[-120%] translate-y-[120%] transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/arrow:translate-x-0 group-hover/arrow:translate-y-0 motion-reduce:!transform-none"
            >
              <line x1="5" y1="19" x2="19" y2="5" />
              <polyline points="9 5 19 5 19 15" />
            </svg>
          </div>
          <div
            className="h-[32px] rounded-full bg-white backdrop-blur-md flex items-center px-4 max-w-0 opacity-0 group-hover/arrow:max-w-[600px] group-hover/arrow:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] overflow-hidden whitespace-nowrap"
            style={{ boxShadow: "0 0 0 1.5px rgba(0,0,0,0.08)" }}
          >
            <p className="text-[13px] text-txt-primary font-medium">
              <span>💬</span> <strong className="font-semibold text-txt-heading">Staple Chat</strong>
              {" — "}
              Conversational AI for document analysis.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
}
