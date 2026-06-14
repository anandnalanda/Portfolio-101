"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";

const papers = [
  { w: 80, h: 100, rot: -12, x: "15%", y: "10%" },
  { w: 70, h: 90, rot: 8, x: "30%", y: "5%" },
  { w: 90, h: 110, rot: -5, x: "45%", y: "15%" },
  { w: 60, h: 80, rot: 15, x: "60%", y: "0%" },
  { w: 85, h: 105, rot: -18, x: "20%", y: "30%" },
  { w: 75, h: 95, rot: 10, x: "50%", y: "25%" },
  { w: 65, h: 85, rot: -8, x: "38%", y: "35%" },
];

export default function LaptopCard() {
  const ref = useRef<HTMLAnchorElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useTransform(mouseY, [0, 1], [3, -3]);
  const rotateY = useTransform(mouseX, [0, 1], [-3, 3]);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  return (
    <motion.a
      ref={ref}
      href="#"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0.5);
        mouseY.set(0.5);
      }}
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="col-span-2 row-span-2 card-base bg-surface-muted flex flex-col items-center justify-center p-6 gap-4 cursor-pointer"
    >
      {/* Laptop */}
      <div className="flex-1 w-full flex items-center justify-center">
        <motion.div
          style={{ rotateX, rotateY, perspective: 800 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="w-[320px] h-[210px] border-2 border-black/10 rounded-2xl bg-white relative shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
        >
          <div className="w-full h-full rounded-[14px] overflow-hidden grid grid-cols-2 gap-2 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-black/[0.03] rounded-lg"
              />
            ))}
          </div>
          <div className="absolute -bottom-3 -left-[10px] -right-[10px] h-2 bg-black/[0.06] rounded-b-lg" />
        </motion.div>
      </div>

      {/* Arrows */}
      <div className="flex flex-col gap-1">
        {["M12 19V5m-7 7l7-7 7 7", "M12 5v14m7-7l-7 7-7-7"].map((d, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.03)" }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 border border-black/[0.08] rounded-[10px] bg-white flex items-center justify-center cursor-pointer"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(37,36,41,0.4)"
              strokeWidth="2"
              strokeLinecap="round"
              className="w-4 h-4"
            >
              <path d={d} />
            </svg>
          </motion.button>
        ))}
      </div>

      {/* Scattered documents */}
      <div className="flex-1 w-full relative min-h-[140px]">
        {papers.map((paper, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
            whileInView={{
              opacity: 1,
              scale: 1,
              rotate: paper.rot,
            }}
            viewport={{ once: true }}
            transition={{
              delay: 0.5 + i * 0.08,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="absolute bg-white/90 border border-black/[0.06] rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            style={{
              width: paper.w,
              height: paper.h,
              left: paper.x,
              top: paper.y,
            }}
          >
            <div
              className="absolute bg-blue-300/20 rounded-sm"
              style={{
                top: "15%",
                left: "15%",
                right: "15%",
                height: 3,
              }}
            />
            <div
              className="absolute bg-blue-300/15 rounded-sm"
              style={{
                top: "30%",
                left: "15%",
                right: "25%",
                height: 3,
              }}
            />
            <div
              className="absolute bg-blue-300/10 rounded-sm"
              style={{
                top: "45%",
                left: "15%",
                right: "30%",
                height: 3,
              }}
            />
          </motion.div>
        ))}
      </div>
    </motion.a>
  );
}
