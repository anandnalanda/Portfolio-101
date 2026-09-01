"use client";

import { motion, useReducedMotion } from "framer-motion";

const BUILT_GRADIENT = "linear-gradient(135deg,#33333a 0%,#1c1c1e 100%)";
const INVIEW = { once: true as const, margin: "-60px" };

// Shared box metrics so the "mockup" frame and the built "mine" chip are the
// exact same height — a fixed height with flex-centred text, no eyeballing.
const TOKEN =
  "inline-flex items-center h-[26px] rounded-[6px] border px-[7px] text-[16px] leading-none align-middle";
const WIRE = "border-dashed border-black/25 font-medium tracking-tight text-black/40";

/* "mockup" — a low-fi, unfinished wireframe token: dashed, muted, slightly
   smaller. It reads as a placeholder that was never taken further. */
function MockupWord() {
  return (
    <span className={`${TOKEN} ${WIRE} mx-[1px]`}>mockup</span>
  );
}

/* "mine" — starts as the same wireframe ghost, then the real thing BUILDS in:
   a solid, shipped chip (the site's button language) springs over the ghost
   with a quick highlight sweep. The word literally gets built. */
function BuiltMine() {
  const reduce = useReducedMotion() ?? false;
  return (
    <span className="relative mx-[1px] inline-grid align-middle">
      {!reduce && (
        <motion.span
          aria-hidden
          className={`${TOKEN} ${WIRE} col-start-1 row-start-1`}
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 0 }}
          viewport={INVIEW}
          transition={{ duration: 0.22, delay: 0.55 }}
        >
          mine
        </motion.span>
      )}
      <motion.span
        className={`${TOKEN} relative col-start-1 row-start-1 overflow-hidden border-transparent font-semibold text-white`}
        style={{
          background: BUILT_GRADIENT,
          boxShadow: "0 1px 2px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
        initial={reduce ? false : { opacity: 0, scale: 0.9, y: 1 }}
        whileInView={reduce ? undefined : { opacity: 1, scale: 1, y: 0 }}
        viewport={INVIEW}
        transition={{ type: "spring", stiffness: 420, damping: 24, delay: 0.58 }}
      >
        mine
        {!reduce && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1/2"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
            }}
            initial={{ x: "-160%" }}
            whileInView={{ x: "320%" }}
            viewport={INVIEW}
            transition={{ duration: 0.6, ease: "easeInOut", delay: 0.72 }}
          />
        )}
      </motion.span>
    </span>
  );
}

export default function BioCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="col-span-2 row-span-2 bg-white rounded-card border-2 border-surface-border overflow-hidden p-6 flex flex-col justify-center"
    >
      <div>
        <h1 className="text-[22px] leading-[1.3] text-txt-secondary mb-4">
          <strong className="text-txt-heading font-bold">Anand</strong>
          <span className="text-txt-secondary font-medium">, design engineer and product builder at{" "}</span>
          <strong className="text-txt-heading font-bold">GTSS</strong>
        </h1>

        <div className="flex flex-col gap-4">
          <p className="text-[18px] leading-[1.45] text-black/[0.55] font-normal">
            <strong className="text-txt-heading font-bold">Design + code</strong>{" "}
            is my creative edge on the internet, born out of the golden age of
            interface craft, back when design still lived in Figma.
          </p>

          <p className="text-[18px] leading-[1.45] text-black/[0.55] font-normal">
            Four years in, measured mostly in pixels and easing curves,
            I&apos;ve built for{" "}
            <span className="text-[#2aa198] font-semibold">startups</span>,
            fast-moving{" "}
            <span className="text-[#e6994a] font-semibold">teams</span>, and
            ambitious{" "}
            <span className="text-[#d95b5b] font-semibold">founders</span>.
            The kind of work where you design it on Monday and ship it by Friday.
          </p>

          <p className="text-[18px] leading-[1.45] text-black/[0.55] font-normal">
            At my core is a deep{" "}
            <span className="line-through">passion</span> obsession for
            the details nobody notices but everybody feels. The moment a
            product stops feeling like software and starts feeling alive.
          </p>

          <p className="text-[18px] leading-[1.45] text-black/[0.55] font-normal">
            I build for the moment AI made shipping easy. When everyone can
            make the thing, craft is the only thing left that&apos;s scarce.
          </p>

          <p className="text-[18px] leading-[1.45] text-black/[0.55] font-normal">
            Most designers stop at the <MockupWord />. I build <BuiltMine />.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
