"use client";

/* f9 — "Internet speed." A live connection check that runs on its own: the
   dial fills, the number climbs, and the reading lands above the 25 Mbps the
   work needs. A weak reading is flagged for a retry, not scored as a fail.

   Mobbin refs: Starlink speed test (dial + big Mbps + latency), Ookla-style
   gauge, Quo connection breakdown. OFM (Kibo) candidate system. */

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowUp, Activity, Waves, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import TestChrome from "./TestChrome";

const MAX = 100; // gauge max, Mbps
const RESULT = 87; // measured download
const PASS = 25; // required Mbps
const SWEEP_MS = 2600;
const START = 135; // gauge start angle (deg)
const ARC = 270; // total sweep (deg)
const CX = 150;
const CY = 150;
const R = 116;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function polar(f: number, r = R) {
  const rad = ((START + f * ARC) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}
function arcPath(f0: number, f1: number, r = R) {
  const a = polar(f0, r);
  const b = polar(f1, r);
  const laf = (f1 - f0) * ARC > 180 ? 1 : 0;
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${laf} 1 ${b.x} ${b.y}`;
}

export default function SpeedTest() {
  const reduceMotion = useReducedMotion();
  const [val, setVal] = useState(0); // current download reading (Mbps)
  const [running, setRunning] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    if (reduceMotion) {
      setVal(RESULT);
      return;
    }
    const start = setTimeout(() => {
      setRunning(true);
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / SWEEP_MS);
        setVal(RESULT * easeOut(t));
        if (t < 1) raf.current = requestAnimationFrame(tick);
        else setRunning(false);
      };
      raf.current = requestAnimationFrame(tick);
    }, 800);
    return () => {
      clearTimeout(start);
      cancelAnimationFrame(raf.current);
    };
  }, [reduceMotion]);

  const f = val / MAX;
  const mbps = Math.round(val);
  const done = !running && val >= RESULT - 0.5;
  const progress = val / RESULT; // 0..1 for the secondary metrics
  const ping = mbps > 0 ? Math.max(42, Math.round(120 - progress * 78)) : 0;
  const passF = PASS / MAX;
  const edge = polar(f, R); // the fill edge, where the leading dot rides
  const pass1 = polar(passF, R - 11); // the 25 Mbps bar, notched across the dial
  const pass2 = polar(passF, R + 11);

  const tiles = [
    { icon: ArrowUp, label: "Upload", value: Math.round(progress * 28), unit: "Mbps" },
    { icon: Activity, label: "Ping", value: ping, unit: "ms" },
    { icon: Waves, label: "Jitter", value: mbps > 0 ? 6 : 0, unit: "ms" },
  ];

  return (
    <TestChrome test="Internet speed">
      <div className="flex w-[800px] flex-col">
        {/* header */}
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-ofm-label font-semibold uppercase tracking-[0.08em] text-zinc-400">
            Connection check
          </span>
          {running && (
            <span className="flex items-center gap-1.5 text-ofm-label text-zinc-400">
              <span className="size-1.5 animate-pulse rounded-full bg-ofm-500" />
              Testing your connection
            </span>
          )}
        </div>

        {/* card */}
        <div className="rounded-2xl border border-zinc-200/60 bg-white p-10 shadow-[0_2px_4px_rgba(24,24,27,0.03),0_18px_44px_-24px_rgba(24,24,27,0.20)]">
          {/* gauge */}
          <div className="relative mx-auto" style={{ width: 360, height: 342 }}>
            <svg width="360" height="342" viewBox="0 0 300 285">
              <defs>
                <linearGradient
                  id="speedFill"
                  gradientUnits="userSpaceOnUse"
                  x1="55"
                  y1="150"
                  x2="255"
                  y2="150"
                >
                  <stop offset="0%" stopColor="#34C77F" />
                  <stop offset="100%" stopColor="#006E42" />
                </linearGradient>
              </defs>
              {/* track */}
              <path
                d={arcPath(0, 1)}
                fill="none"
                stroke="#f4f4f5"
                strokeWidth="18"
                strokeLinecap="round"
              />
              {/* fill — a green gradient that grows with the reading */}
              {f > 0.004 && (
                <path
                  d={arcPath(0, f)}
                  fill="none"
                  stroke="url(#speedFill)"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
              )}
              {/* the 25 Mbps bar, notched across the dial */}
              <line
                x1={pass1.x}
                y1={pass1.y}
                x2={pass2.x}
                y2={pass2.y}
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* tick labels */}
              {[0, 25, 50, 75, 100].map((v) => {
                const lp = polar(v / MAX, R + 24);
                return (
                  <text
                    key={v}
                    x={lp.x}
                    y={lp.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="12"
                    className={
                      v === PASS
                        ? "fill-ofm-600 font-semibold"
                        : "fill-zinc-400"
                    }
                  >
                    {v}
                  </text>
                );
              })}
              {/* leading dot rides the fill edge as the reading climbs */}
              {f > 0.004 && (
                <>
                  <circle cx={edge.x} cy={edge.y} r="9" fill="white" />
                  <circle cx={edge.x} cy={edge.y} r="5.5" fill="#006E42" />
                </>
              )}
            </svg>

            {/* centre reading */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pb-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[62px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-zinc-900">
                  {mbps}
                </span>
                <span className="text-ofm-title text-zinc-400">Mbps</span>
              </div>
              <span className="mt-1.5 text-ofm-caption text-zinc-400">
                download speed
              </span>
            </div>
          </div>

          {/* pass line */}
          <div className="mt-1 flex h-7 items-center justify-center">
            <span
              className={`flex items-center gap-1.5 rounded-full bg-ofm-50 px-3 py-1 text-ofm-caption font-medium text-ofm-700 transition-opacity duration-500 ${
                done ? "opacity-100" : "opacity-0"
              }`}
            >
              <Check className="size-3.5" strokeWidth={3} />
              Clears the {PASS} Mbps the work needs
            </span>
          </div>

          {/* metric tiles */}
          <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-xl border border-zinc-200/70">
            {tiles.map((t, i) => (
              <div
                key={t.label}
                className={`flex flex-col items-center py-4 ${
                  i > 0 ? "border-l border-zinc-200/70" : ""
                }`}
              >
                <span className="flex items-center gap-1.5 text-ofm-caption text-zinc-400">
                  <t.icon className="size-3.5" strokeWidth={2} />
                  {t.label}
                </span>
                <span className="mt-1 text-ofm-title font-semibold tabular-nums text-zinc-800">
                  {t.value}
                  <span className="ml-1 text-ofm-caption font-normal text-zinc-400">
                    {t.unit}
                  </span>
                </span>
              </div>
            ))}
          </div>

          {/* re-run — available once the reading lands */}
          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              disabled={!done}
              className={`transition-opacity duration-500 ${
                done ? "opacity-100" : "opacity-0"
              }`}
            >
              <RotateCcw strokeWidth={2} />
              Check again
            </Button>
          </div>
        </div>

        <p className="mt-3 text-center text-ofm-caption text-zinc-400">
          A weak reading is flagged for a retry, not scored as a fail
        </p>
      </div>
    </TestChrome>
  );
}
