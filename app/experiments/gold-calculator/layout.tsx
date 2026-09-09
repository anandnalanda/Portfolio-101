import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gold Price Calculator · Anand",
  description:
    "A calculator for what a piece of jewellery should actually cost: weight, purity, making charges and tax, shown as a breakdown you can follow.",
};

export default function GoldCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
