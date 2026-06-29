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
  showButton?: boolean;
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
      className="absolute flex items-center gap-2 group/arrow z-10"
      style={{ bottom: btn.bottom, left: btn.left }}
      variants={{
        rest: { opacity: 0 },
        hover: { opacity: 1 },
      }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="rounded-full bg-white flex items-center justify-center flex-shrink-0 relative overflow-hidden transition-shadow duration-300"
        style={{ width: btn.size, height: btn.size, boxShadow: "0 0 0 2px rgba(0,0,0,0.1)" }}
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
          <strong className="font-semibold text-txt-heading">{title}</strong>
          {" — "}
          {descriptor}
        </p>
      </div>
    </motion.div>
  );
}

export default function BentoTile({
  title,
  descriptor,
  artifactLabel,
  variant = "square",
  href,
  showButton = false,
}: BentoTileProps) {
  const content = href ? (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      initial="rest"
      whileHover="hover"
      className="relative h-full"
    >
      <div className="bg-white rounded-card border-2 border-surface-border overflow-hidden relative flex items-center justify-center cursor-pointer h-full">
        <span className="text-[11px] font-mono tracking-[0.12em] text-black/[0.15] uppercase select-none">
          {artifactLabel}
        </span>
      </div>
      <CaseStudyBar title={title} descriptor={descriptor} />
    </motion.div>
  ) : showButton ? (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      initial="rest"
      whileHover="hover"
      className="relative h-full"
    >
      <div className="bg-white rounded-card border-2 border-surface-border overflow-hidden relative flex items-center justify-center cursor-pointer h-full">
        <span className="text-[11px] font-mono tracking-[0.12em] text-black/[0.15] uppercase select-none">
          {artifactLabel}
        </span>
      </div>
      <CaseStudyBar title={title} descriptor={descriptor} />
    </motion.div>
  ) : (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-card border-2 border-surface-border overflow-hidden relative flex items-center justify-center cursor-pointer h-full group"
    >
      <span className="text-[11px] font-mono tracking-[0.12em] text-black/[0.15] uppercase select-none">
        {artifactLabel}
      </span>
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-10 bg-gradient-to-t from-white/90 to-transparent">
        <h3 className="text-[14px] font-semibold text-txt-heading leading-tight">
          {title}
        </h3>
        <p className="text-[12px] text-txt-secondary mt-0.5 leading-snug">
          {descriptor}
        </p>
      </div>
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
