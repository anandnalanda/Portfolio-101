"use client";

import { motion } from "framer-motion";

export default function BioCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="col-span-2 row-span-2 bg-white rounded-card border-2 border-surface-border overflow-hidden p-6 flex flex-col justify-between"
    >
      <div>
        <h1 className="text-[22px] leading-[1.3] text-txt-secondary mb-4">
          <strong className="text-txt-heading font-bold">Anand</strong>{" "}
          <span className="text-txt-secondary font-medium">— Design engineer and product builder at{" "}</span>
          <strong className="text-txt-heading font-bold">GTSS</strong>
        </h1>

        <div className="flex flex-col gap-3">
          <p className="text-[18px] leading-[1.3] text-black/[0.55] font-normal">
            <strong className="text-txt-heading font-bold">Design + code</strong>{" "}
            is my creative edge on the internet, born out of the golden age of
            interface craft, back when design still lived in Figma.
          </p>

          <p className="text-[18px] leading-[1.3] text-black/[0.55] font-normal">
            Four years in, measured mostly in pixels and easing curves,
            I&apos;ve built for{" "}
            <span className="text-[#2aa198] font-semibold">startups</span>,
            fast-moving{" "}
            <span className="text-[#e6994a] font-semibold">teams</span>, and
            ambitious{" "}
            <span className="text-[#d95b5b] font-semibold">founders</span>.
            The kind of work where you design it on Monday and ship it by Friday.
          </p>

          <p className="text-[18px] leading-[1.3] text-black/[0.55] font-normal">
            At my core is a deep{" "}
            <span className="line-through">passion</span> obsession for
            the details nobody notices but everybody feels. The moment a
            product stops feeling like software and starts feeling alive.
          </p>

          <p className="text-[18px] leading-[1.3] text-black/[0.55] font-normal">
            I build for the moment AI made shipping easy. When everyone can
            make the thing, craft is the only thing left that&apos;s scarce.
          </p>

          <p className="text-[18px] leading-[1.3] text-black/[0.55] font-normal">
            Most designers stop at the mockup. I build mine.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <img
          src="/avatar.png"
          alt="Anand M"
          className="object-contain"
          style={{ width: 83, marginTop: -56, marginRight: -4 }}
        />
      </div>
    </motion.div>
  );
}
