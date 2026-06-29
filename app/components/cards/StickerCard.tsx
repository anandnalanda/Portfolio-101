"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StickerCard() {
  const [hovered, setHovered] = useState(false);

  const spring = { type: "spring" as const, stiffness: 200, damping: 25, mass: 1 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-card border-2 overflow-hidden relative flex flex-col items-center justify-center cursor-pointer bg-white hover:bg-[#f0d0c4] transition-colors duration-300"
      style={{ borderColor: "rgba(0,0,0,0.02)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg
        viewBox="44 44 168 168"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[160px] h-[160px] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] scale-[1.1] group-hover:scale-[1.1] group-hover:-translate-y-6 motion-reduce:!transform-none"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <defs>
          <filter id="stickerOuterShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="1" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.08" />
          </filter>
          <filter id="flapInnerShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feComponentTransfer in="SourceAlpha">
              <feFuncA type="table" tableValues="1 0" />
            </feComponentTransfer>
            <feGaussianBlur stdDeviation="3" />
            <feOffset dx="1" dy="2" result="offsetblur" />
            <feFlood floodColor="#000" floodOpacity="0.12" result="color" />
            <feComposite in2="offsetblur" operator="in" />
            <feComposite in2="SourceAlpha" operator="in" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#stickerOuterShadow)">
          <path
            d="M190.522 71.9882L105.521 49.2122C92.7183 45.7822 79.5573 53.3792 76.1273 66.1822L49.2103 166.64C45.7803 179.443 53.3773 192.603 66.1803 196.033L118.397 210.025C124.546 211.672 131.097 210.81 136.609 207.627L178.178 183.627C180.908 182.052 183.3 179.954 185.219 177.453C187.138 174.953 188.545 172.099 189.36 169.054L207.493 101.383C210.923 88.5792 203.325 75.4182 190.522 71.9882Z"
            fill="white"
          />
          <path
            d="M105.391 49.6952L190.393 72.4712C202.929 75.8302 210.369 88.7162 207.01 101.252L188.877 168.924C188.079 171.905 186.701 174.7 184.822 177.148C182.943 179.596 180.601 181.65 177.928 183.193L136.359 207.193C133.687 208.736 130.736 209.738 127.676 210.141C124.617 210.544 121.507 210.34 118.526 209.541L66.3103 195.549C53.7733 192.19 46.3343 179.304 49.6933 166.768L76.6103 66.3122C79.9693 53.7752 92.8553 46.3362 105.391 49.6952Z"
            stroke="#909197"
            strokeOpacity="0.5"
          />
        </g>

        <g
          transform="translate(130, 110) rotate(15)"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:!transition-none"
        >
          <rect x="-40" y="-23.5" width="80" height="9" rx="4.5" fill="#e8b4a6" opacity="0.7" stroke="#909197" strokeWidth="0.5" />
          <rect x="-40" y="-4.5" width="62.4" height="9" rx="4.5" fill="#e8b4a6" opacity="0.7" stroke="#909197" strokeWidth="0.5" />
          <rect x="-40" y="14.5" width="73.6" height="9" rx="4.5" fill="#e8b4a6" opacity="0.7" stroke="#909197" strokeWidth="0.5" />
        </g>

        <g filter="url(#flapInnerShadow)">
          <path
            d="M190 165.872L162.764 158.642C145.574 154.078 127.904 164.185 123.298 181.216L116 208.198L118.003 208.73C124.195 210.374 130.791 209.513 136.343 206.338L178.203 182.394C180.952 180.822 183.361 178.729 185.293 176.234C187.225 173.74 188.642 170.892 189.463 167.855L190 165.872Z"
            fill="white"
          />
          <path
            d="M190.377 166.194L190.506 165.711L190.023 165.582L162.978 158.335C145.64 153.689 127.819 163.978 123.173 181.316L115.926 208.362L115.797 208.845L116.28 208.974L118.269 209.507C124.545 211.189 131.233 210.308 136.86 207.059L178.429 183.059C184.056 179.81 188.162 174.459 189.844 168.183L190.377 166.194Z"
            stroke="#909197"
            strokeOpacity="0.5"
          />
        </g>
      </svg>

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 pb-3 pointer-events-none">
        <AnimatePresence>
          {hovered && (
            <>
              <motion.a
                href="/resume.pdf"
                download
                className="group/dl w-9 h-9 rounded-full flex items-center justify-center pointer-events-auto"
                initial={{ opacity: 0, x: 60, y: -50 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 60, y: -50 }}
                transition={spring}
                style={{
                  transition: "background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 0 0 1.5px rgba(0,0,0,0.12)",
                  backgroundColor: "rgba(255,255,255,0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.boxShadow = "0 0 0 1.5px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)";
                  e.currentTarget.style.boxShadow = "0 0 0 1.5px rgba(0,0,0,0.12)";
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-black/55 group-hover/dl:stroke-black transition-colors duration-300">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </motion.a>

              <motion.a
                href="https://read.cv/anand"
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn h-10 rounded-full flex items-center gap-1 px-4 text-[14px] font-medium border-[1.5px] pointer-events-auto"
                initial={{ opacity: 0, x: -40, y: -50 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: -40, y: -50 }}
                transition={{ ...spring, delay: 0.06 }}
                style={{
                  transition: "background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), color 300ms cubic-bezier(0.4, 0, 0.2, 1), border-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                  borderColor: "rgba(0,0,0,0.12)",
                  backgroundColor: "rgba(255,255,255,0.3)",
                  color: "rgba(0,0,0,0.7)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#2c2c2e";
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.8)";
                  e.currentTarget.style.boxShadow = "inset 0px 0px 4px #D1D1D187, 0 0px 40px #00000014";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)";
                  e.currentTarget.style.color = "rgba(0,0,0,0.7)";
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <span>Read.cv</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 ease-out group-hover/btn:translate-x-[2px]">
                  <line x1="5" y1="19" x2="19" y2="5" />
                  <polyline points="9 5 19 5 19 15" />
                </svg>
              </motion.a>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
