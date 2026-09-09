import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Inter, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

// Inter is scoped to the OFM Jobs product UI (`.kibo`) via globals.css;
// the rest of the portfolio keeps Geist.
// preload:false — Inter is only ever drawn inside the `.kibo` scope (the OFM
// Jobs product UI). Preloading it put a ~47KB font on the critical path of
// every route that never renders a single Inter glyph, the home page included.
// The @font-face still ships, so .kibo routes fetch it on demand.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap", preload: false });

// Editorial serif, used for the display titles on the Experiments cards.
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anand · Design engineer & Product builder",
  description:
    "Design engineer who designs in Figma and ships in Next.js. Building product UI at the intersection of design and code.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.className} ${inter.variable} ${newsreader.variable}`}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
