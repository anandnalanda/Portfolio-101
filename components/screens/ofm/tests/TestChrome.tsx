/* Candidate-side shell for the OFM Jobs skills check — the calm counterpart to
   the employer's DashboardShell. A single top bar (who's asking, time), a
   battery stepper that orients the candidate across the five tests, then a
   centered canvas. Fixed 1440×900, mounted inside ScaledStage, caged in `.kibo`. */

import { Fragment, type ReactNode } from "react";
import { Check } from "lucide-react";
import OfmLogo from "@/components/screens/ofm/OfmLogo";

const BATTERY = ["English", "Verbal", "Listening", "Internet speed", "Typing"] as const;

/* stepper across the five tests. `step` is 1-based (0 = intro, 6 = all done). */
function BatteryStepper({ step }: { step: number }) {
  return (
    <div className="mx-auto flex w-full max-w-[560px] items-start">
      {BATTERY.map((name, i) => {
        const n = i + 1;
        const state = n < step ? "done" : n === step ? "active" : "upcoming";
        return (
          <Fragment key={name}>
            {i > 0 && (
              <div className="mt-[13px] h-0.5 flex-1 rounded-full">
                <div
                  className={`h-full rounded-full ${
                    n <= step ? "bg-ofm-500" : "bg-zinc-200"
                  }`}
                />
              </div>
            )}
            <div className="flex w-[92px] shrink-0 flex-col items-center">
              <span
                className={`flex size-7 items-center justify-center rounded-full text-ofm-caption font-semibold tabular-nums ${
                  state === "done"
                    ? "bg-ofm-600 text-white"
                    : state === "active"
                    ? "bg-ofm-600 text-white ring-4 ring-ofm-100"
                    : "border-2 border-zinc-200 bg-white text-zinc-400"
                }`}
              >
                {state === "done" ? (
                  <Check className="size-3.5" strokeWidth={3} />
                ) : (
                  n
                )}
              </span>
              <span
                className={`mt-1.5 whitespace-nowrap text-ofm-micro ${
                  state === "active"
                    ? "font-semibold text-ofm-700"
                    : state === "done"
                    ? "font-medium text-zinc-600"
                    : "font-medium text-zinc-400"
                }`}
              >
                {name}
              </span>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

export default function TestChrome({
  children,
  step,
  /** Right side of the top bar, e.g. a time estimate chip. */
  topRight,
}: {
  children?: ReactNode;
  /** 1-based test index; 0 = intro screen, 6 = all done (scorecard). */
  step?: number;
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
            Skills check · Virtual Chatter at{" "}
            <span className="font-medium text-zinc-700">Acme Studio</span>
          </span>
        </div>
        <div className="flex items-center gap-3">{topRight}</div>
      </header>

      {/* battery stepper */}
      {step !== undefined && (
        <div className="shrink-0 border-b border-zinc-200/70 bg-white px-5 py-3.5">
          <BatteryStepper step={step} />
        </div>
      )}

      {/* canvas */}
      <main className="relative flex min-h-0 flex-1 items-center justify-center px-5 py-6">
        {children}
      </main>
    </div>
  );
}
