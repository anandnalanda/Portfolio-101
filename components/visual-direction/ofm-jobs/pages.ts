/**
 * OFM Jobs - full-page captures of the shipped site, used by the two "shipped
 * site" beats at the end of the case study (each shows a pair of pages in an
 * overlapping browser-window composition).
 */
export type SitePage = { label: string; src: string };

export const OFM_SCREENS: Record<string, SitePage> = {
  home: { label: "Home", src: "/vd/pages/home.jpg" },
  pricing: { label: "Pricing", src: "/vd/pages/pricing.jpg" },
  compare: { label: "Compare", src: "/vd/pages/compare.jpg" },
  insights: { label: "Insights", src: "/vd/pages/insights.jpg" },
};
