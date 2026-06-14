"use client";

import { motion } from "framer-motion";

type TileVariant = "large" | "tall" | "wide" | "square";

interface BentoTileProps {
  title: string;
  descriptor: string;
  artifactLabel: string;
  variant?: TileVariant;
}

const variantClasses: Record<TileVariant, string> = {
  large: "col-span-2 row-span-2",
  tall: "row-span-2",
  wide: "col-span-2",
  square: "",
};

export default function BentoTile({
  title,
  descriptor,
  artifactLabel,
  variant = "square",
}: BentoTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -3,
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        borderColor: "rgba(99, 102, 241, 0.2)",
      }}
      className={`card-base flex flex-col cursor-pointer ${variantClasses[variant]}`}
    >
      {/* Artifact placeholder */}
      <div className="flex-1 bg-surface-muted flex items-center justify-center p-6 min-h-0">
        <span className="text-[11px] font-mono tracking-[0.15em] text-txt-secondary/50 uppercase select-none">
          {artifactLabel}
        </span>
      </div>

      {/* Title + descriptor */}
      <div className="px-5 py-4 border-t border-surface-border">
        <h3 className="text-[14px] font-semibold text-txt-heading leading-tight">
          {title}
        </h3>
        <p className="text-[12px] text-txt-secondary mt-1 leading-snug">
          {descriptor}
        </p>
      </div>
    </motion.div>
  );
}
