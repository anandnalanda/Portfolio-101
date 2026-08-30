"use client";

/* f1 — "Set the bar when you post." The employer's job-post editor with a
   Required skills step built in: each skill is pulled from the shared library
   with a pass mark, and the job publishes gated. A new required skill drops
   in mid-demo to show the "add from library" move. OFM (Kibo) system. */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpenText,
  Mic,
  Gauge,
  Keyboard,
  ChevronRight,
  Lock,
  Plus,
  X,
} from "lucide-react";
import DashboardShell from "@/components/screens/ofm/DashboardShell";

const EASE = [0.22, 1, 0.36, 1] as const;

type Req = { icon: typeof Mic; label: string; bar: string };

const BASE: Req[] = [
  { icon: BookOpenText, label: "English", bar: "≥ 80 / 100" },
  { icon: Keyboard, label: "Typing", bar: "≥ 60 WPM" },
  { icon: Gauge, label: "Internet speed", bar: "≥ 25 Mbps" },
];
/* the one that drops in mid-demo, pulled from the library */
const ADDED: Req = { icon: Mic, label: "Verbal", bar: "≥ 75 / 100" };

function ReqRow({ req, fresh }: { req: Req; fresh?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ofm-50">
        <req.icon className="size-[18px] text-ofm-600" strokeWidth={1.75} />
      </span>
      <span className="flex-1">
        <span className="block text-ofm-body font-medium leading-tight text-zinc-800">
          {req.label}
        </span>
        <span className="block text-ofm-caption leading-tight text-zinc-400">
          From the OFM test library
        </span>
      </span>
      <span className="flex items-center gap-1.5">
        <span className="text-ofm-caption text-zinc-400">Pass mark</span>
        <span className="rounded-md border border-zinc-200/70 px-2 py-1 text-ofm-caption font-semibold tabular-nums text-zinc-700">
          {req.bar}
        </span>
      </span>
      <button className="flex size-7 items-center justify-center rounded-md text-zinc-300 hover:bg-zinc-50 hover:text-zinc-500">
        <X className="size-4" strokeWidth={2} />
      </button>
      {fresh && (
        <span className="ml-1 rounded-full bg-ofm-50 px-2 py-0.5 text-ofm-micro font-semibold text-ofm-700">
          Added
        </span>
      )}
    </div>
  );
}

export default function JobPostRequire() {
  const reduced = useReducedMotion();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (reduced) {
      setAdded(true);
      return;
    }
    const t = setTimeout(() => setAdded(true), 1800);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <div className="absolute inset-0">
      <DashboardShell
        headerLeft={
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="shrink-0 text-ofm-body text-zinc-400">Jobs</span>
            <ChevronRight className="size-4 shrink-0 text-zinc-300" strokeWidth={2} />
            <span className="truncate text-ofm-display font-semibold text-zinc-900">
              New job
            </span>
          </div>
        }
      >
        <div className="flex h-full items-start justify-center overflow-hidden px-5 py-4">
          <div className="w-[660px]">
            {/* job basics — compact summary */}
            <div className="rounded-t-xl border border-zinc-200/70 bg-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-ofm-title font-semibold text-zinc-900">
                    Virtual Chatter
                  </h2>
                  <p className="mt-0.5 text-ofm-label text-zinc-500">
                    Remote · Full-time · $4–6 / hr
                  </p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-ofm-caption font-medium text-zinc-500">
                  <Lock className="size-3.5" strokeWidth={2} />
                  Gated
                </span>
              </div>
            </div>

            {/* required skills — the heart of it */}
            <div className="border-x border-zinc-200/70 bg-white">
              <div className="flex items-center justify-between px-6 pb-2 pt-4">
                <div>
                  <h3 className="text-ofm-body font-semibold text-zinc-900">
                    Required skills to apply
                  </h3>
                  <p className="mt-0.5 text-ofm-caption text-zinc-400">
                    Applicants must clear every one of these to submit.
                  </p>
                </div>
                <span className="rounded-full bg-ofm-50 px-2.5 py-1 text-ofm-caption font-semibold tabular-nums text-ofm-700">
                  {added ? 4 : 3} required
                </span>
              </div>

              <div className="mt-1 divide-y divide-zinc-100 border-t border-zinc-100">
                {BASE.map((r) => (
                  <ReqRow key={r.label} req={r} />
                ))}
                <AnimatePresence initial={false}>
                  {added && (
                    <motion.div
                      initial={reduced ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <ReqRow req={ADDED} fresh />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* add from library */}
              <div className="px-6 py-3">
                <button
                  className={`flex w-full items-center justify-center gap-2 rounded-lg border border-dashed py-2.5 text-ofm-label font-medium transition-colors ${
                    added
                      ? "border-zinc-200/70 text-zinc-400"
                      : "border-ofm-300 bg-ofm-50/50 text-ofm-700"
                  }`}
                >
                  <Plus className="size-4" strokeWidth={2.2} />
                  Add a skill from the library
                </button>
              </div>
            </div>

            {/* footer */}
            <div className="flex items-center justify-between rounded-b-xl border border-zinc-200/70 bg-zinc-50/60 px-6 py-4">
              <span className="text-ofm-caption text-zinc-400">
                No proof, no application. The bar is public on the listing.
              </span>
              <button className="rounded-lg bg-ofm-600 px-4 py-2 text-ofm-label font-medium text-white hover:bg-ofm-700">
                Publish job
              </button>
            </div>
          </div>
        </div>
      </DashboardShell>
    </div>
  );
}
