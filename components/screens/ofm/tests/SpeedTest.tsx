"use client";

/* f6 — "Internet speed." A live speedometer for the thing that silently
   decides whether chat work is possible at all. The needle sweeps, the
   numbers tick, and the result lands above a clear pass line. */

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUp, Activity, Check } from "lucide-react";
import TestChrome from "./TestChrome";

const TARGET = 0.87; // 87 Mbps on a 0–100 gauge
const PASS = 0.25; // pass line at 25 Mbps
const SWEEP_MS = 2600;

/* easeOutCubic */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 180) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const a = polar(cx, cy, r, from);
  const b = polar(cx, cy, r, to);
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${b.x} ${b.y}`;
}

export default function SpeedTest() {
  const reduceMotion = useReducedMotion();
  const [pct, setPct] = useState(0);
  const [running, setRunning] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    if (reduceMotion) {
      setPct(TARGET);
      return;
    }
    const start = setTimeout(() => {
      setRunning(true);
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / SWEEP_MS);
        setPct(TARGET * easeOut(t));
        if (t < 1) raf.current = requestAnimationFrame(tick);
        else setRunning(false);
      };
      raf.current = requestAnimationFrame(tick);
    }, 900);
    return () => {
      clearTimeout(start);
      cancelAnimationFrame(raf.current);
    };
  }, [reduceMotion]);

  const done = !running && pct >= TARGET - 0.001;
  const mbps = Math.round(pct * 100);
  const needleDeg = pct * 180;
  const passPt = {
    a: polar(110, 100, 78, PASS * 180),
    b: polar(110, 100, 92, PASS * 180),
  };

  const tiles = [
    { icon: ArrowDown, label: "Download", value: `${mbps}`, unit: "Mbps" },
    {
      icon: ArrowUp,
      label: "Upload",
      value: `${Math.round(pct * 28)}`,
      unit: "Mbps",
    },
    {
      icon: Activity,
      label: "Ping",
      value: pct > 0 ? `${Math.max(38, Math.round(120 - pct * 94))}` : "-",
      unit: "ms",
    },
  ];

  return (
    <TestChrome step={4}>
      <div className="w-[620px]">
        <div className="rounded-xl border border-zinc-200/70 bg-white shadow-sm">
          <div className="flex items-center justify-between px-8 pt-6">
            <span className="text-ofm-caption font-medium uppercase tracking-[0.08em] text-zinc-400">
              Connection check
            </span>
            <span className="text-ofm-caption text-zinc-400">
              Runs by itself · nothing to do
            </span>
          </div>

          {/* gauge */}
          <div className="flex flex-col items-center px-8 pt-2">
            <svg width="220" height="130" viewBox="0 0 220 130">
              {/* track */}
              <path
                d={arcPath(110, 100, 85, 0, 180)}
                fill="none"
                stroke="#f4f4f5"
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* fill */}
              {pct > 0.01 && (
                <path
                  d={arcPath(110, 100, 85, 0, needleDeg)}
                  fill="none"
                  stroke={done ? "#006E42" : "#0B885A"}
                  strokeWidth="14"
                  strokeLinecap="round"
                />
              )}
              {/* pass line */}
              <line
                x1={passPt.a.x}
                y1={passPt.a.y}
                x2={passPt.b.x}
                y2={passPt.b.y}
                stroke="#a1a1aa"
                strokeWidth="2"
                strokeDasharray="3 2"
              />
              {/* needle */}
              <g transform={`rotate(${needleDeg - 180} 110 100)`}>
                <line
                  x1="110"
                  y1="100"
                  x2="178"
                  y2="100"
                  stroke="#18181b"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>
              <circle cx="110" cy="100" r="6" fill="#18181b" />
            </svg>
            <div className="-mt-6 flex items-baseline gap-1.5">
              <span className="text-[40px] font-semibold tabular-nums leading-none tracking-[-0.02em] text-zinc-900">
                {mbps}
              </span>
              <span className="text-ofm-body text-zinc-400">Mbps</span>
            </div>
            <span
              className={`mt-2 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-ofm-caption font-medium transition-opacity duration-500 ${
                done ? "bg-ofm-50 text-ofm-700 opacity-100" : "opacity-0"
              }`}
            >
              <Check className="size-3" strokeWidth={3} />
              Well above the 25 Mbps the work needs
            </span>
          </div>

          {/* tiles */}
          <div className="mt-5 grid grid-cols-3 border-t border-zinc-200/70">
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
                <span className="mt-1 text-ofm-display font-semibold tabular-nums text-zinc-800">
                  {t.value}
                  <span className="ml-1 text-ofm-caption font-normal text-zinc-400">
                    {t.unit}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-center text-ofm-caption text-zinc-400">
          A weak reading is flagged for a retry, not scored as a fail
        </p>
      </div>
    </TestChrome>
  );
}
