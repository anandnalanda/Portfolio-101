"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function VisualDirectionCard() {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href="/visual-direction" className="relative">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        initial="rest"
        whileHover="hover"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="relative h-full"
      >
        <div
          className="group rounded-card border-2 overflow-hidden relative flex items-center justify-center cursor-pointer h-full transition-all duration-100"
          style={{
            backgroundColor: hovered ? "#1c1c1e" : "#ffffff",
            borderColor: hovered ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.03)",
            boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.2)" : "none",
          }}
        >
          <motion.div
            animate={{ y: hovered ? -18 : 0 }}
            transition={{
              type: "spring",
              stiffness: 130,
              damping: 10,
              mass: 1.6,
            }}
          >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[180px] h-[180px]"
            style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }}
          >
            {/* Main swatch — stays in place */}
            <g className="transition-opacity duration-100" style={{ opacity: hovered ? 1 : 0 }}>
              <path d="M10 4.5V18C10 19.08 9.56 20.07 8.86 20.79L8.82 20.83C8.73 20.92 8.63 21.01 8.54 21.08C8.24 21.34 7.9 21.54 7.55 21.68C7.44 21.73 7.33 21.77 7.22 21.81C6.83 21.94 6.41 22 6 22C5.73 22 5.46 21.97 5.2 21.92C5.07 21.89 4.94 21.86 4.81 21.82C4.65 21.77 4.5 21.72 4.35 21.65C4.35 21.64 4.35 21.64 4.34 21.65C4.06 21.51 3.79 21.35 3.54 21.16L3.53 21.15C3.4 21.05 3.28 20.95 3.17 20.83C3.06 20.71 2.95 20.59 2.84 20.46C2.65 20.21 2.49 19.94 2.35 19.66C2.36 19.65 2.36 19.65 2.35 19.65C2.35 19.65 2.35 19.64 2.34 19.63C2.28 19.49 2.23 19.34 2.18 19.19C2.14 19.06 2.11 18.93 2.08 18.8C2.03 18.54 2 18.27 2 18V4.5C2 3 3 2 4.5 2H7.5C9 2 10 3 10 4.5Z" fill="#5e6ad2" />
            </g>
            <path d="M10 4.5V18C10 19.08 9.56 20.07 8.86 20.79L8.82 20.83C8.73 20.92 8.63 21.01 8.54 21.08C8.24 21.34 7.9 21.54 7.55 21.68C7.44 21.73 7.33 21.77 7.22 21.81C6.83 21.94 6.41 22 6 22C5.73 22 5.46 21.97 5.2 21.92C5.07 21.89 4.94 21.86 4.81 21.82C4.65 21.77 4.5 21.72 4.35 21.65C4.35 21.64 4.35 21.64 4.34 21.65C4.06 21.51 3.79 21.35 3.54 21.16L3.53 21.15C3.4 21.05 3.28 20.95 3.17 20.83C3.06 20.71 2.95 20.59 2.84 20.46C2.65 20.21 2.49 19.94 2.35 19.66C2.36 19.65 2.36 19.65 2.35 19.65C2.35 19.65 2.35 19.64 2.34 19.63C2.28 19.49 2.23 19.34 2.18 19.19C2.14 19.06 2.11 18.93 2.08 18.8C2.03 18.54 2 18.27 2 18V4.5C2 3 3 2 4.5 2H7.5C9 2 10 3 10 4.5Z" stroke={hovered ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.08)"} strokeWidth="0.4" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 100ms" }}/>
            <path d="M4.81 21.82C4.21 21.64 3.64 21.31 3.17 20.83C2.69 20.36 2.36 19.79 2.18 19.19C2.57 20.44 3.56 21.43 4.81 21.82Z" stroke={hovered ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.08)"} strokeWidth="0.4" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 100ms" }}/>
            <path d="M6 19C6.55 19 7 18.55 7 18C7 17.45 6.55 17 6 17C5.45 17 5 17.45 5 18C5 18.55 5.45 19 6 19Z" stroke={hovered ? "#ffffff" : "rgba(0,0,0,0.08)"} strokeWidth="0.4" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 100ms" }}/>

            {/* Diagonal blade */}
            <g className="transition-opacity duration-100" style={{ opacity: hovered ? 1 : 0 }}>
              <path d="M18.37 11.29L15.66 14L8.86 20.79C9.56 20.07 10 19.08 10 18V8.34L12.71 5.63C13.77 4.57 15.19 4.57 16.25 5.63L18.37 7.75C19.43 8.81 19.43 10.23 18.37 11.29Z" fill="#006E42" />
            </g>
            <path d="M18.37 11.29L15.66 14L8.86 20.79C9.56 20.07 10 19.08 10 18V8.34L12.71 5.63C13.77 4.57 15.19 4.57 16.25 5.63L18.37 7.75C19.43 8.81 19.43 10.23 18.37 11.29Z" stroke={hovered ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.08)"} strokeWidth="0.4" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 100ms" }}/>

            {/* Bottom panel */}
            <g className="transition-opacity duration-100" style={{ opacity: hovered ? 1 : 0 }}>
              <path d="M22 16.5V19.5C22 21 21 22 19.5 22H6C6.41 22 6.83 21.94 7.22 21.81C7.33 21.77 7.44 21.73 7.55 21.68C7.9 21.54 8.24 21.34 8.54 21.08C8.63 21.01 8.73 20.92 8.82 20.83L8.86 20.79L15.66 14H19.5C21 14 22 15 22 16.5Z" fill="#d9e682" />
            </g>
            <path d="M22 16.5V19.5C22 21 21 22 19.5 22H6C6.41 22 6.83 21.94 7.22 21.81C7.33 21.77 7.44 21.73 7.55 21.68C7.9 21.54 8.24 21.34 8.54 21.08C8.63 21.01 8.73 20.92 8.82 20.83L8.86 20.79L15.66 14H19.5C21 14 22 15 22 16.5Z" stroke={hovered ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.08)"} strokeWidth="0.4" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 100ms" }}/>
          </svg>
          </motion.div>
        </div>

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
              <strong className="font-semibold text-txt-heading">Visual Direction</strong>
              {" — "}
              OFM Jobs & Jobsly — UI design and visual systems.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
}
