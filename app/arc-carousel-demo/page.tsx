"use client";

import ArcCarousel from "@/components/arc-carousel/ArcCarousel";
import type { ArcSlide } from "@/components/arc-carousel/types";

const bar = "rounded bg-black/10";
const pill = "rounded-full bg-[#69b46f]";

/* 6 skeleton arrangements, visibly different so travel direction is unambiguous */
const SKELETONS: React.ReactNode[] = [
  // 1 — header + lines + pill row
  <div key="1" className="flex flex-col gap-2">
    <div className={`${bar} h-3 w-1/2`} />
    <div className={`${bar} h-2 w-full`} />
    <div className={`${bar} h-2 w-5/6`} />
    <div className="mt-1 flex gap-1.5">
      <div className={`${pill} h-3 w-8`} />
      <div className={`${pill} h-3 w-6 opacity-70`} />
    </div>
  </div>,

  // 2 — avatar + two-column lines
  <div key="2" className="flex items-center gap-3">
    <div className={`${pill} h-9 w-9`} />
    <div className="flex flex-1 flex-col gap-1.5">
      <div className={`${bar} h-2.5 w-3/4`} />
      <div className={`${bar} h-2 w-full`} />
      <div className={`${bar} h-2 w-2/3`} />
    </div>
  </div>,

  // 3 — bar chart
  <div key="3" className="flex h-16 items-end justify-between gap-1.5">
    {[10, 22, 14, 30, 18, 26].map((h, i) => (
      <div key={i} className={`${i % 2 ? pill : "rounded bg-black/15"} w-3`} style={{ height: h }} />
    ))}
  </div>,

  // 4 — title + hero block
  <div key="4" className="flex flex-col gap-2">
    <div className={`${bar} h-2.5 w-1/3`} />
    <div className={`${pill} h-10 w-full opacity-90`} />
    <div className={`${bar} h-2 w-4/5`} />
  </div>,

  // 5 — list rows with dots
  <div key="5" className="flex flex-col gap-2">
    {[0, 1, 2].map((i) => (
      <div key={i} className="flex items-center gap-2">
        <div className={`${pill} h-2.5 w-2.5`} style={{ opacity: 1 - i * 0.25 }} />
        <div className={`${bar} h-2 flex-1`} style={{ width: `${90 - i * 12}%` }} />
      </div>
    ))}
  </div>,

  // 6 — 2×2 tile grid
  <div key="6" className="grid grid-cols-2 gap-2">
    {[0, 1, 2, 3].map((i) => (
      <div key={i} className={`${i === 0 ? pill : "rounded bg-black/[0.08]"} h-8`} />
    ))}
  </div>,
];

const slides: ArcSlide[] = SKELETONS.map((content, i) => ({
  id: `slide-${i + 1}`,
  label: `Slide ${i + 1}`,
  content,
}));

export default function ArcCarouselDemoPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral-50 p-8">
      <ArcCarousel
        slides={slides}
        autoplayMs={3500}
        onExpand={() => console.log("expand")}
        className="w-full max-w-[640px]"
      />
    </main>
  );
}
