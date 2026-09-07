/* Candidate-side shell for the OFM Jobs skills check — the calm counterpart to
   the employer's DashboardShell. A single top bar (who's asking, optional time
   estimate), then a centered canvas. Each test is launched on its own from the
   job detail page, taken, and left; there's no linear battery, so no stepper.
   Fixed 1440×900, mounted inside ScaledStage, caged in `.kibo`. */

import { type ReactNode } from "react";
import OfmLogo from "@/components/screens/ofm/OfmLogo";

export default function TestChrome({
  children,
  /** Name of the test being taken, e.g. "English" — shown in the top bar. */
  test,
  /** Right side of the top bar, e.g. a time estimate chip. */
  topRight,
}: {
  children?: ReactNode;
  test?: string;
  topRight?: ReactNode;
}) {
  return (
    <div className="kibo absolute inset-0 flex flex-col bg-zinc-50 text-zinc-700">
      {/* top bar */}
      <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-zinc-200/70 bg-white px-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <OfmLogo variant="brand" className="h-[30px] w-auto" />
            <span className="text-ofm-display font-semibold tracking-[-1px] text-zinc-700">
              OFM Jobs
            </span>
          </div>
          <span className="h-5 w-px bg-zinc-200/70" />
          <span className="text-ofm-body text-zinc-500">
            Skills check
            {test && (
              <>
                {" · "}
                <span className="font-medium text-zinc-700">{test}</span>
              </>
            )}
          </span>
        </div>
        <div className="flex items-center gap-3">{topRight}</div>
      </header>

      {/* canvas */}
      <main className="relative flex min-h-0 flex-1 items-center justify-center px-5 py-6">
        {children}
      </main>
    </div>
  );
}
