import type { Metadata } from "next";
import DocVaporizerCard from "@/components/DocVaporizerCard";

export const metadata: Metadata = {
  title: "Doc Vaporizer Playground",
  description:
    "Documents → data hover animation: chip card expands, doors open, pages dissolve into a particle mist.",
};

export default function DocVaporizerPlaygroundPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f4f5f6] p-8">
      <div className="w-full max-w-[760px]">
        <DocVaporizerCard />
      </div>
    </main>
  );
}
