import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Globe · Anand",
  description:
    "A spinnable canvas globe on the OFM Jobs homepage: dots for land, arcs between hiring cities, no dependencies.",
};

export default function InteractiveGlobeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
