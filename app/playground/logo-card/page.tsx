"use client";

import { useState } from "react";
import LogoCard from "@/components/LogoCard/LogoCard";

/**
 * Demo: the three LogoCard states side by side (rest / hover / highlighted),
 * plus a card whose `highlighted` prop you can toggle live.
 */
export default function LogoCardPlayground() {
  const [on, setOn] = useState(false);

  return (
    <main className="min-h-dvh bg-[#fafafa] px-8 py-16">
      <div className="mx-auto max-w-[820px]">
        <h1 className="text-lg font-semibold text-neutral-800">LogoCard</h1>
        <p className="mt-1 text-sm text-neutral-500">
          OFM Jobs mark · step-forward parallax morph. Hover or tab through the
          cards.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3">
          <Cell label="Default (rest)">
            <LogoCard label="OFM Jobs" />
          </Cell>

          <Cell label="Hover / focus me">
            <LogoCard label="OFM Jobs Tests" href="/ofm-jobs-tests" />
          </Cell>

          <Cell label="Highlighted (persistent)">
            <LogoCard label="OFM Jobs" highlighted />
          </Cell>
        </div>

        <div className="mt-14">
          <div className="mx-auto max-w-[220px]">
            <Cell label={on ? "highlighted = true" : "highlighted = false"}>
              <LogoCard label="OFM Jobs" highlighted={on} />
            </Cell>
          </div>
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={() => setOn((v) => !v)}
              className="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              Toggle highlighted
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="w-full">{children}</div>
      <p className="mt-3 text-center text-xs font-medium text-neutral-400">
        {label}
      </p>
    </div>
  );
}
