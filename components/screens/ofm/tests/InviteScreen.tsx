"use client";

/* f2 — "What the candidate opens." The invite page: the five tests laid out
   with an honest time estimate, a mic + connection pre-check that runs on
   mount (pulse → green), then the Begin button wakes up. OFM system. */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpenText,
  Mic,
  Headphones,
  Gauge,
  Keyboard,
  Check,
  Wifi,
} from "lucide-react";
import TestChrome from "./TestChrome";

const TESTS = [
  { icon: BookOpenText, label: "English", detail: "Reading & grammar", time: "3 min" },
  { icon: Mic, label: "Verbal", detail: "One spoken answer", time: "2 min" },
  { icon: Headphones, label: "Listening", detail: "A short clip, then questions", time: "2 min" },
  { icon: Gauge, label: "Internet speed", detail: "Runs by itself", time: "1 min" },
  { icon: Keyboard, label: "Typing", detail: "A timed passage", time: "2 min" },
];

function PrecheckChip({
  icon: Icon,
  label,
  ready,
}: {
  icon: typeof Mic;
  label: string;
  ready: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors duration-500 ${
        ready ? "border-ofm-200 bg-ofm-50" : "border-zinc-200/70 bg-white"
      }`}
    >
      <Icon
        className={`size-4 ${ready ? "text-ofm-600" : "text-zinc-400"}`}
        strokeWidth={1.75}
      />
      <span
        className={`text-ofm-label font-medium ${
          ready ? "text-ofm-700" : "text-zinc-600"
        }`}
      >
        {label}
      </span>
      {ready ? (
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="flex size-4 items-center justify-center rounded-full bg-ofm-600"
        >
          <Check className="size-3 text-white" strokeWidth={3} />
        </motion.span>
      ) : (
        <span className="relative flex size-4 items-center justify-center">
          <span className="absolute size-2 animate-ping rounded-full bg-zinc-300" />
          <span className="size-2 rounded-full bg-zinc-300" />
        </span>
      )}
    </div>
  );
}

export default function InviteScreen() {
  const reduceMotion = useReducedMotion();
  const [micReady, setMicReady] = useState(false);
  const [netReady, setNetReady] = useState(false);
  const ready = micReady && netReady;

  useEffect(() => {
    if (reduceMotion) {
      setMicReady(true);
      setNetReady(true);
      return;
    }
    const t = [
      setTimeout(() => setMicReady(true), 1400),
      setTimeout(() => setNetReady(true), 2300),
    ];
    return () => t.forEach(clearTimeout);
  }, [reduceMotion]);

  return (
    <TestChrome
      step={0}
      topRight={
        <span className="rounded-full border border-zinc-200/70 bg-white px-2.5 py-1 text-ofm-caption font-medium text-zinc-500">
          About 10 minutes
        </span>
      }
    >
      <div className="w-[620px] rounded-xl border border-zinc-200/70 bg-white shadow-sm">
        {/* head */}
        <div className="px-8 pb-6 pt-8">
          <h1 className="text-ofm-hero font-semibold text-zinc-900">
            Acme Studio asked you to show your skills
          </h1>
          <p className="mt-2 text-ofm-body text-zinc-500">
            Five short tests for the Virtual Chatter role. Everything runs here
            in the browser, no account, nothing to install.
          </p>
        </div>

        {/* the battery */}
        <div className="border-y border-zinc-200/70">
          {TESTS.map((t, i) => (
            <div
              key={t.label}
              className={`flex items-center gap-3 px-8 py-2.5 ${
                i > 0 ? "border-t border-zinc-100" : ""
              }`}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-ofm-50">
                <t.icon className="size-4 text-ofm-600" strokeWidth={1.75} />
              </span>
              <span className="flex-1">
                <span className="block text-ofm-body font-medium leading-tight text-zinc-800">
                  {t.label}
                </span>
                <span className="block text-ofm-caption leading-tight text-zinc-400">
                  {t.detail}
                </span>
              </span>
              <span className="text-ofm-caption tabular-nums text-zinc-400">
                {t.time}
              </span>
            </div>
          ))}
        </div>

        {/* pre-check + CTA */}
        <div className="flex items-center justify-between gap-4 px-8 py-5">
          <div className="flex items-center gap-2">
            <PrecheckChip icon={Mic} label="Microphone" ready={micReady} />
            <PrecheckChip icon={Wifi} label="Connection" ready={netReady} />
          </div>
          <button
            className={`rounded-lg px-4 py-2 text-ofm-body font-medium text-white transition-colors duration-500 ${
              ready ? "bg-ofm-600 hover:bg-ofm-700" : "bg-zinc-300"
            }`}
          >
            Begin the check
          </button>
        </div>
      </div>
    </TestChrome>
  );
}
