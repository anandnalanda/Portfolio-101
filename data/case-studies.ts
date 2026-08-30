import type { ComponentType } from "react";
import { OfmLogo, StapleLogo } from "./logos";

export type CaseStudy = {
  slug: string; // route segment, e.g. "staple-chat"
  name: string; // label shown in the menu
  brand: string; // saturated brand hex, e.g. "#2E7CF6"
  href: string; // "/work/staple-chat"
  logo: ComponentType<{ className?: string }>; // SVG mark, currentColor-friendly
  status?: "live" | "coming-soon";
  caption?: string; // optional secondary line, e.g. "Coming soon"
};

export const caseStudies: CaseStudy[] = [
  { slug: "staple-chat", name: "Staple Chat", brand: "#2E7CF6", href: "/work/staple-chat", logo: StapleLogo, status: "live" },
  { slug: "ofm-jobs-tests", name: "Tests in OFM Jobs", brand: "#1FA2A0", href: "/work/ofm-jobs-tests", logo: OfmLogo, status: "live" },
  { slug: "ofm-jobs-kanban", name: "Kanban in OFM Jobs", brand: "#E0328A", href: "/work/ofm-jobs-kanban", logo: OfmLogo, status: "live" },
  { slug: "staple-tables", name: "Tables in Staple AI", brand: "#F28C28", href: "/work/staple-tables", logo: StapleLogo, status: "coming-soon", caption: "Coming soon" },
];
