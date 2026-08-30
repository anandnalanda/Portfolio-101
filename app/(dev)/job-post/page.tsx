"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import JobPostWizard from "@/components/screens/ofm/tests/JobPostWizard";

/* Dev preview: the full "Post a job" wizard, click-through.
   The shell is a fixed 1440×900 design, scaled to fit the viewport so its
   fixed widths always render correctly. `?step=N` opens a given step (dev aid). */
function Frame() {
  const params = useSearchParams();
  const step = Number(params.get("step") ?? 0) || 0;
  const autoplay = params.get("autoplay") === "1";
  return (
    <main
      className="fixed inset-0 flex items-center justify-center bg-[#f5f0eb] p-6"
      style={{ containerType: "size" }}
    >
      <div
        className="relative overflow-hidden rounded-2xl bg-white shadow-lg"
        style={{
          width: 1440,
          height: 900,
          transform: "scale(min(calc((100cqw - 48px) / 1440), calc((100cqh - 48px) / 900)))",
          transformOrigin: "center",
        }}
      >
        <JobPostWizard initialStep={step} autoplay={autoplay} />
      </div>
    </main>
  );
}

export default function JobPostFlowPage() {
  return (
    <Suspense fallback={null}>
      <Frame />
    </Suspense>
  );
}
