"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const ease = [0.22, 1, 0.36, 1];

export default function SocialCard() {
  const [hovered, setHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);


  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease }}
      whileHover={{ y: -2 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="rounded-card border-2 overflow-hidden relative cursor-pointer p-6 flex flex-col justify-between transition-all duration-300"
      style={{
        backgroundColor: hovered ? "#1c1c1e" : "#ffffff",
        borderColor: hovered ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.02)",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.2)" : "none",
      }}
    >
      <div>
        <div className="flex items-center gap-3 mb-4">
          <img
            src="/avatar.jpeg"
            alt="Anand"
            className="w-[52px] h-[52px] rounded-full object-cover transition-all duration-300"
            style={{
              boxShadow: hovered
                ? "0 0 0 3px rgba(255,255,255,0.7)"
                : "0 0 0 2px rgba(0,0,0,0.6)",
            }}
          />
          <div className="flex flex-col gap-[2px]">
            <div className="flex items-center gap-1.5">
              <span
                className="text-[13px] font-semibold transition-colors duration-300"
                style={{ color: hovered ? "#ffffff" : "rgb(37, 36, 41)" }}
              >
                Anand
              </span>
            </div>
            <span
              className="text-[14px] transition-colors duration-300"
              style={{ color: hovered ? "rgba(255,255,255,0.45)" : "rgba(37, 36, 41, 0.4)" }}
            >
              @anandnalanda
            </span>
          </div>
        </div>

        <p
          className="text-[20px] transition-colors duration-300"
          style={{
            lineHeight: 1.28,
            marginTop: -2,
            color: hovered ? "rgba(255,255,255,0.85)" : "rgba(37, 36, 41, 0.8)",
          }}
        >
          designengineer/figma
          expert/productbuilder/
          systemthinker
        </p>
      </div>

      <a
        href="https://x.com/anandnalanda"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-2 rounded-full text-[16px] font-medium transition-all duration-200 w-full flex-shrink-0"
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={{
          minHeight: 40,
          height: 40,
          color: btnHovered && hovered ? "#000000" : hovered ? "rgba(255,255,255,0.8)" : "#000000",
          background: btnHovered && hovered
            ? "linear-gradient(180deg, #f5f5f5 0%, #d4d4d4 100%)"
            : hovered ? "rgba(255,255,255,0.04)" : "transparent",
          boxShadow: btnHovered && hovered
            ? "0 0 0 2px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 8px rgba(0,0,0,0.3)"
            : hovered ? "0 0 0 2px rgba(255,255,255,0.2)" : "0 0 0 2px rgba(0,0,0,0.1)",
        }}
      >
        <span>Follow me on</span>
        <svg viewBox="0 0 24 24" className="w-4 h-4 transition-colors duration-200" style={{ fill: btnHovered && hovered ? "#000000" : "currentColor" }}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
    </motion.div>
  );
}
