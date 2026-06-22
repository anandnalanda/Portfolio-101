"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type TileVariant = "large" | "tall" | "wide" | "square";

interface BentoTileProps {
  title: string;
  descriptor: string;
  artifactLabel: string;
  variant?: TileVariant;
  href?: string;
}

const variantClasses: Record<TileVariant, string> = {
  large: "col-span-2 row-span-2",
  tall: "row-span-2",
  wide: "col-span-2",
  square: "",
};

const btn = { bottom: 8, left: 8, size: 36 };

function CaseStudyBar({ title, descriptor }: { title: string; descriptor: string }) {
  return (
    <motion.div
      className="absolute right-4 flex items-center gap-3"
      style={{ bottom: btn.bottom, left: btn.left }}
      variants={{
        rest: { opacity: 0, y: 8 },
        hover: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="rounded-full bg-white shadow-[0_0_0_2px_rgba(0,0,0,0.1)] flex items-center justify-center flex-shrink-0"
        style={{ width: btn.size, height: btn.size }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(0,0,0,0.6)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 17L17 7" />
          <path d="M7 7h10v10" />
        </svg>
      </div>
      <p className="text-[13px] text-txt-primary truncate">
        <strong className="font-semibold text-txt-heading">{title}</strong>
        {" — "}
        {descriptor}
      </p>
    </motion.div>
  );
}

export default function BentoTile({
  title,
  descriptor,
  artifactLabel,
  variant = "square",
  href,
}: BentoTileProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
      {...(!href ? {} : {})}
      className="bg-white rounded-card border-2 border-surface-border overflow-hidden relative flex items-center justify-center cursor-pointer h-full group"
    >
      <motion.div
        variants={{
          hover: { y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" },
        }}
        className="absolute inset-0"
      />
      <span className="text-[11px] font-mono tracking-[0.12em] text-black/[0.15] uppercase select-none">
        {artifactLabel}
      </span>

      {href ? (
        <CaseStudyBar title={title} descriptor={descriptor} />
      ) : (
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-10 bg-gradient-to-t from-white/90 to-transparent">
          <h3 className="text-[14px] font-semibold text-txt-heading leading-tight">
            {title}
          </h3>
          <p className="text-[12px] text-txt-secondary mt-0.5 leading-snug">
            {descriptor}
          </p>
        </div>
      )}
    </motion.div>
  );

  const gridClass = variantClasses[variant];

  if (href) {
    return (
      <Link href={href} className={gridClass}>
        {content}
      </Link>
    );
  }

  return (
    <div className={gridClass}>
      {content}
    </div>
  );
}
