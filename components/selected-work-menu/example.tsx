"use client";

/* Usage example — drop this where the "Selected work" pill currently lives in
   your nav (app/components/Navbar.tsx). It's isolated here so it doesn't
   disturb the existing bespoke navbar; move the <SelectedWorkMenu/> block into
   the nav's center slot when you're ready to switch over. */

import { caseStudies } from "@/data/case-studies";
import SelectedWorkMenu from "./SelectedWorkMenu";

function SparkleMono() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M8 1.5l1.3 3.9L13.2 6.7 9.3 8 8 11.9 6.7 8 2.8 6.7 6.7 5.4 8 1.5z"
        fill="currentColor"
      />
    </svg>
  );
}

function SparkleColor() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
      <defs>
        <linearGradient id="swm-sparkle" x1="2" y1="2" x2="14" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2E7CF6" />
          <stop offset="0.5" stopColor="#E0328A" />
          <stop offset="1" stopColor="#F28C28" />
        </linearGradient>
      </defs>
      <path
        d="M8 1.5l1.3 3.9L13.2 6.7 9.3 8 8 11.9 6.7 8 2.8 6.7 6.7 5.4 8 1.5z"
        fill="url(#swm-sparkle)"
      />
    </svg>
  );
}

export default function SelectedWorkMenuExample() {
  return (
    <SelectedWorkMenu
      items={caseStudies}
      label="Selected work"
      icon={{ mono: <SparkleMono />, color: <SparkleColor /> }}
      align="left"
      onSelect={(item) => {
        // fires before navigation — analytics, close side-effects, etc.
        console.log("selected", item.slug);
      }}
    />
  );
}
