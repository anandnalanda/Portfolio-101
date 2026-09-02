"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import ArcCarousel from "@/components/arc-carousel/ArcCarousel";
import type { ArcSlide } from "@/components/arc-carousel/types";

/** Idle animation — disabled (illustrations stay still). Kept for signature compatibility. */
function floatAnim(_reduce: boolean | null, _amp: number, _duration: number, _delay = 0) {
  return {};
}

/** A 6-step accent ramp (strong → mist), drawn from the design-system hues. */
type Ramp = {
  strong: string;
  mid: string;
  soft: string;
  wash: string;
  tint: string;
  mist: string;
  rgb: string; // strong colour channels, for the card border / glow
};

/** Design-system accent families: green + the palette used in Visual Direction. */
const THEMES: Ramp[] = [
  { strong: "#4caf50", mid: "#81c784", soft: "#a5d6a7", wash: "#c8e6c9", tint: "#e8f5e9", mist: "#f1f8e9", rgb: "76,175,80" },
  { strong: "#6366f1", mid: "#818cf8", soft: "#a5b4fc", wash: "#c7d2fe", tint: "#e0e7ff", mist: "#eef2ff", rgb: "99,102,241" },
  { strong: "#7c3aed", mid: "#a78bfa", soft: "#c4b5fd", wash: "#ddd6fe", tint: "#ede9fe", mist: "#f5f3ff", rgb: "124,58,237" },
  { strong: "#ec4899", mid: "#f472b6", soft: "#f9a8d4", wash: "#fbcfe8", tint: "#fce7f3", mist: "#fdf2f8", rgb: "236,72,153" },
  { strong: "#3b82f6", mid: "#60a5fa", soft: "#93c5fd", wash: "#bfdbfe", tint: "#dbeafe", mist: "#eff6ff", rgb: "59,130,246" },
  { strong: "#14b8a6", mid: "#2dd4bf", soft: "#5eead4", wash: "#99f6e4", tint: "#ccfbf1", mist: "#f0fdfa", rgb: "20,184,166" },
  { strong: "#f59e0b", mid: "#fbbf24", soft: "#fcd34d", wash: "#fde68a", tint: "#fef3c7", mist: "#fffbeb", rgb: "245,158,11" },
];

type SceneProps = {
  hovered: boolean;
  reduce: boolean | null;
  lift: { type: "spring"; stiffness: number; damping: number };
  c: Ramp;
};

/* ────────────────────────────────────────────────────────────
   Grey neutrals stay fixed across every theme:
   #e0e0e0  #d9d9d9 placeholder · #f5f5f5 chrome · #f7f9f7 card
──────────────────────────────────────────────────────────── */

/** Shared greys. The white sheet is drawn by Illustration; scenes fill the inner area
    ≈ x[174..366] y[112..430] (clipped to the sheet, so edge chrome tucks under the radius). */
const GREY = "#d7d9de";
const GREY_LITE = "#e7e9ec";

/* 1 ── New-chat hero (Staple Chat) — logo, greeting, sources, composer, chips ── */
function Variant1({ c, reduce, hovered, lift }: SceneProps) {
  const on = hovered && !reduce;
  return (
    <motion.g animate={floatAnim(reduce, 5, 6)}>
      {/* greeting */}
      <rect x="196" y="196" width="148" height="9" rx="4.5" fill={c.strong} />
      <rect x="168" y="212" width="204" height="5" rx="2.5" fill={GREY} />
      <rect x="196" y="221" width="148" height="5" rx="2.5" fill={GREY_LITE} />
      {/* "N sources connected" pill */}
      <rect x="232" y="234" width="76" height="12" rx="6" fill={c.tint} />
      <circle cx="242" cy="240" r="2.5" fill={c.strong} />
      <rect x="249" y="238.5" width="52" height="3.5" rx="1.75" fill={c.mid} />
      {/* composer (leading dot · text · two trailing dots · send node) */}
      <rect x="150" y="254" width="240" height="30" rx="11" fill="white" stroke="#e6e9ec" strokeWidth="1.2" />
      <circle cx="164" cy="269" r="3.5" fill="#dfe2e6" />
      <rect x="176" y="266.5" width="118" height="5" rx="2.5" fill={GREY_LITE} />
      <circle cx="352" cy="269" r="4.5" fill="#eceef1" />
      {/* pulse ring behind the send node while hovered */}
      <motion.circle
        cx="374"
        cy="269"
        r={9}
        opacity={0}
        fill="none"
        stroke={c.soft}
        strokeWidth="2"
        /* explicit initial seeds framer's SVG attr values — without it the
           first hydration render writes r="undefined" (console error) */
        initial={{ r: 9, opacity: 0 }}
        animate={on ? { r: [9, 16, 9], opacity: [0.8, 0, 0.8] } : { r: 9, opacity: 0 }}
        transition={on ? { duration: 1.1, repeat: Infinity, ease: "easeOut" } : { duration: 0.2 }}
      />
      <motion.circle cx="374" cy="269" r={9} fill={c.strong} initial={{ r: 9 }} animate={{ r: on ? 11.5 : 9 }} transition={lift} />
      <rect x="370.5" y="266" width="7" height="6" rx="1.5" fill="white" />
      {/* 2×2 starter chips (accent dot + two lines) — lift with stagger on hover */}
      {[0, 1, 2, 3].map((i) => {
        const cx = 156 + (i % 2) * 122;
        const cy = 298 + Math.floor(i / 2) * 30;
        return (
          <motion.g key={i} animate={{ y: on ? -8 : 0, x: on ? (i % 2 ? 3 : -3) : 0 }} transition={{ ...lift, delay: i * 0.07 }}>
            <rect x={cx} y={cy} width="112" height="24" rx="7" fill="#f7f8f9" stroke="#eceef1" strokeWidth="1" />
            <rect x={cx + 9} y={cy + 8} width="3" height="8" rx="1.5" fill={c.soft} />
            <rect x={cx + 20} y={cy + 7} width={74 - (i % 3) * 10} height="4" rx="2" fill={GREY_LITE} />
            <rect x={cx + 20} y={cy + 14} width={46 - (i % 2) * 8} height="3.5" rx="1.75" fill="#eef0f2" />
          </motion.g>
        );
      })}
    </motion.g>
  );
}

/** Shared landscape app chrome: left icon sidebar + top bar. Main area ≈ x[124..448] y[200..365]. */
function chrome(c: Ramp) {
  return (
    <>
      <rect x="80" y="163" width="36" height="214" fill="#f7f8f9" />
      <line x1="116" y1="163" x2="116" y2="377" stroke="#eef0f2" strokeWidth="1" />
      <rect x="88" y="172" width="16" height="16" rx="4" fill={c.strong} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x="89" y={198 + i * 24} width="14" height="14" rx="3.5" fill={i === 3 ? c.soft : "#e6e8ec"} />
          <rect x="87" y={214 + i * 24} width="18" height="2.5" rx="1.25" fill={i === 3 ? c.wash : "#eef0f2"} />
        </g>
      ))}
      <circle cx="98" cy="368" r="6" fill="#e6e8ec" />
      <rect x="124" y="172" width="132" height="15" rx="7.5" fill="#f2f3f5" />
      <rect x="132" y="177.5" width="64" height="4" rx="2" fill="#e4e7ea" />
      <rect x="238" y="178" width="12" height="3" rx="1.5" fill="#dfe2e6" />
      <circle cx="424" cy="180" r="6" fill="#eceef1" />
      <circle cx="442" cy="180" r="7" fill={c.soft} />
      <line x1="124" y1="196" x2="448" y2="196" stroke="#eef0f2" strokeWidth="1" />
    </>
  );
}

/* 2 ── Chat thread (Staple Chat) — avatar, thinking, source, 3-col table ── */
function Variant2({ c, reduce, hovered, lift }: SceneProps) {
  const on = hovered && !reduce;
  return (
    <motion.g animate={floatAnim(reduce, 5, 6)}>
      {/* header */}
      <rect x="94" y="180" width="90" height="6" rx="3" fill={GREY} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={412 + i * 15} cy="183" r="5" fill="#eceef1" />
      ))}
      <line x1="80" y1="196" x2="460" y2="196" stroke="#eef0f2" strokeWidth="1" />
      {/* user bubble + timestamp (right) — nudges in on hover */}
      <motion.g animate={{ x: on ? -12 : 0 }} transition={lift}>
        <rect x="300" y="204" width="148" height="22" rx="9" fill={c.tint} />
        <rect x="308" y="210" width="132" height="4.5" rx="2.25" fill={c.soft} />
        <rect x="392" y="230" width="24" height="3" rx="1.5" fill="#e6e8ec" />
      </motion.g>
      {/* assistant avatar (plain node) */}
      <circle cx="100" cy="246" r="8" fill={c.strong} />
      <rect x="96.5" y="244.5" width="7" height="3" rx="1.5" fill="white" />
      {/* thinking drawer */}
      <rect x="116" y="240" width="34" height="5" rx="2.5" fill={GREY} />
      <rect x="155" y="241" width="76" height="4" rx="2" fill={GREY_LITE} />
      <rect x="298" y="241" width="12" height="2.5" rx="1.25" fill="#d5d7db" />
      {/* file source badge */}
      <rect x="116" y="254" width="130" height="14" rx="7" fill={c.tint} />
      <rect x="123" y="258" width="8" height="6" rx="1.5" fill={c.strong} />
      <rect x="135" y="258.5" width="100" height="4" rx="2" fill={c.mid} />
      {/* inline table artifact (3 cols, 3 rows) — lifts on hover */}
      <motion.g animate={{ y: on ? -5 : 0 }} transition={{ ...lift, delay: 0.08 }}>
      <rect x="116" y="276" width="332" height="66" rx="7" fill="white" stroke="#e9ebee" strokeWidth="1" />
      <rect x="124" y="283" width="44" height="4" rx="2" fill="#c4c7cc" />
      <rect x="432" y="282" width="8" height="8" rx="2" fill={c.soft} />
      <rect x="124" y="296" width="30" height="3.5" rx="1.75" fill="#b9bcc2" />
      <rect x="250" y="296" width="24" height="3.5" rx="1.75" fill="#b9bcc2" />
      <rect x="404" y="296" width="30" height="3.5" rx="1.75" fill="#b9bcc2" />
      <line x1="124" y1="304" x2="440" y2="304" stroke="#f1f2f4" strokeWidth="1" />
      {[0, 1, 2].map((r) => (
        <g key={r}>
          <rect x="124" y={310 + r * 10} width={64 - r * 8} height="4" rx="2" fill={GREY} />
          <rect x="250" y={310 + r * 10} width="40" height="4" rx="2" fill={GREY_LITE} />
          <rect x={434 - (28 + r * 6)} y={310 + r * 10} width={28 + r * 6} height="4" rx="2" fill={r === 2 ? c.strong : GREY} />
        </g>
      ))}
      </motion.g>
      {/* composer */}
      <rect x="94" y="350" width="354" height="15" rx="7.5" fill="#f7f8f9" stroke="#e9ebee" strokeWidth="1" />
      <rect x="102" y="355.5" width="90" height="4.5" rx="2.25" fill={GREY} />
      <motion.circle
        cx="440"
        cy="357.5"
        r={7}
        fill={c.strong}
        initial={{ r: 7 }}
        animate={on ? { r: [7, 9.5, 8.5] } : { r: 7 }}
        transition={on ? { duration: 0.5, ease: "easeOut" } : lift}
      />
    </motion.g>
  );
}

/* 3 ── Chat workspace (Staple Chat) — sidebar, top bar, bar-chart answer ── */
function Variant3({ c, reduce, hovered, lift }: SceneProps) {
  const on = hovered && !reduce;
  return (
    <motion.g animate={floatAnim(reduce, 5, 6)}>
      {chrome(c)}
      {/* chat title */}
      <rect x="124" y="206" width="80" height="6" rx="3" fill={GREY} />
      {/* user bubble (right) */}
      <rect x="300" y="220" width="148" height="20" rx="8" fill={c.tint} />
      <rect x="308" y="226" width="130" height="4" rx="2" fill={c.soft} />
      {/* assistant avatar + prose */}
      <circle cx="130" cy="252" r="7" fill={c.strong} />
      <rect x="126.5" y="250.5" width="7" height="3" rx="1.5" fill="white" />
      <rect x="142" y="249" width="130" height="4.5" rx="2.25" fill={GREY} />
      {/* bar chart artifact (wide) with y-axis + value label */}
      <rect x="124" y="264" width="324" height="82" rx="7" fill="white" stroke="#e9ebee" strokeWidth="1" />
      <rect x="132" y="271" width="44" height="4" rx="2" fill="#c4c7cc" />
      <rect x="432" y="270" width="8" height="8" rx="2" fill={c.soft} />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="152" y1={296 + i * 12} x2="440" y2={296 + i * 12} stroke="#f4f5f7" strokeWidth="1" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <rect key={`y${i}`} x="132" y={294 + i * 12} width="10" height="3" rx="1.5" fill="#e2e4e7" />
      ))}
      {/* bars — static, baseline 334, contained in the chart card; group lifts on hover */}
      <motion.g animate={{ y: on ? -3 : 0 }} transition={lift}>
        {[14, 22, 18, 28, 20, 30, 24, 38, 26, 34, 22, 30].map((h, i) => (
          <rect
            key={i}
            x={156 + i * 24}
            y={334 - h}
            width="14"
            height={h}
            rx="1.5"
            fill={i === 7 ? c.strong : c.soft}
          />
        ))}
      </motion.g>
      {/* value label above the highlighted bar — pops up a touch on hover */}
      <motion.g animate={{ y: on ? -8 : 0 }} transition={{ ...lift, delay: 0.24 }}>
        <rect x="316" y="286" width="24" height="8" rx="2" fill={c.tint} />
        <rect x="320" y="289" width="16" height="3" rx="1.5" fill={c.mid} />
      </motion.g>
      {/* legend */}
      <circle cx="130" cy="356" r="3.5" fill={c.strong} />
      <rect x="138" y="353.5" width="42" height="4" rx="2" fill={GREY_LITE} />
      <circle cx="200" cy="356" r="3.5" fill={c.soft} />
      <rect x="208" y="353.5" width="42" height="4" rx="2" fill={GREY_LITE} />
    </motion.g>
  );
}

/* 4 ── Connect-data modal (Staple Chat) — search, breadcrumb, file rows ── */
function Variant4({ c, reduce, hovered, lift }: SceneProps) {
  const files = [0, 1, 2, 3, 4];
  const on = hovered && !reduce;
  return (
    <motion.g animate={floatAnim(reduce, 5, 6)}>
      {/* header + close node */}
      <rect x="94" y="182" width="100" height="6" rx="3" fill={GREY} />
      <circle cx="440" cy="185" r="5" fill="#eceef1" />
      <line x1="80" y1="196" x2="460" y2="196" stroke="#eef0f2" strokeWidth="1" />
      {/* search */}
      <rect x="94" y="204" width="354" height="15" rx="7.5" fill="#f2f3f5" />
      <rect x="104" y="209.5" width="70" height="4" rx="2" fill={GREY_LITE} />
      {/* breadcrumb + select-all */}
      <rect x="94" y="227" width="30" height="4" rx="2" fill={GREY_LITE} />
      <circle cx="132" cy="229" r="1.5" fill="#c9ccd1" />
      <rect x="140" y="227" width="38" height="4" rx="2" fill={GREY} />
      <rect x="410" y="226" width="38" height="4" rx="2" fill={c.mid} />
      {/* file rows: checkbox + type glyph + name + subpath + tag */}
      {files.map((r) => {
        const y = 240 + r * 22;
        const checked = r < 3;
        return (
          <g key={r}>
            <motion.g animate={{ scale: on && checked ? 1.45 : 1 }} transition={{ ...lift, delay: r * 0.08 }} style={{ originX: `${100}px`, originY: `${y + 6}px` }}>
              <rect x="94" y={y} width="12" height="12" rx="3" fill={checked ? c.strong : "white"} stroke={checked ? c.strong : "#c9ccd1"} strokeWidth="1.2" />
              {checked && <rect x="97" y={y + 4.5} width="6" height="3" rx="1.5" fill="white" />}
            </motion.g>
            <rect x="114" y={y} width="11" height="13" rx="2" fill={r % 2 ? c.soft : "#dfe3e7"} />
            <rect x="132" y={y + 1} width={84 - (r % 2) * 12} height="4.5" rx="2.25" fill={GREY} />
            <rect x="132" y={y + 8} width={56 - (r % 3) * 8} height="3.5" rx="1.75" fill={GREY_LITE} />
            <rect x="404" y={y + 1.5} width="44" height="9" rx="4.5" fill={r % 2 ? c.tint : "#f0f1f3"} />
            {r < 4 && <line x1="94" y1={y + 18} x2="448" y2={y + 18} stroke="#f4f5f7" strokeWidth="1" />}
          </g>
        );
      })}
      {/* footer: N selected + Connect */}
      <line x1="80" y1="352" x2="460" y2="352" stroke="#eef0f2" strokeWidth="1" />
      <rect x="94" y="357" width="70" height="4.5" rx="2.25" fill={GREY_LITE} />
      <motion.rect x="374" y={355} width="74" height="14" rx="7" fill={c.strong} initial={{ y: 355, width: 74, x: 374 }} animate={{ y: on ? 350 : 355, width: on ? 80 : 74, x: on ? 368 : 374 }} transition={lift} />
    </motion.g>
  );
}

/* 5 ── Voice input (Staple Chat) — pulsing dot + waveform + stop ── */
function Variant5({ c, reduce, hovered, lift }: SceneProps) {
  const bars = Array.from({ length: 26 }, (_, i) => i);
  const on = hovered && !reduce;
  return (
    <motion.g animate={floatAnim(reduce, 5, 6)}>
      {/* header */}
      <rect x="94" y="180" width="80" height="6" rx="3" fill={GREY} />
      <line x1="80" y1="194" x2="460" y2="194" stroke="#eef0f2" strokeWidth="1" />
      {/* user bubble + assistant snippet (context) */}
      <rect x="300" y="204" width="148" height="20" rx="8" fill={c.tint} />
      <rect x="308" y="210" width="130" height="4" rx="2" fill={c.soft} />
      <rect x="94" y="234" width="180" height="4.5" rx="2.25" fill={GREY} />
      <rect x="94" y="244" width="130" height="4.5" rx="2.25" fill={GREY_LITE} />
      {/* listening composer */}
      <rect x="94" y="264" width="354" height="58" rx="14" fill="#f7f8f9" stroke="#e9ebee" strokeWidth="1" />
      <motion.circle cx="120" cy="293" r={11} fill={c.tint} initial={{ r: 11 }} animate={{ r: on ? 13 : 11 }} transition={lift} />
      <circle cx="120" cy="293" r="6.5" fill={c.soft} />
      <circle cx="120" cy="293" r="3" fill={c.strong} />
      {bars.map((i) => {
        const h = Math.max(6, 24 - Math.abs(i - 12.5) * 1.4);
        const h2 = Math.max(4, h * 0.35);
        const h3 = Math.min(40, h * 1.6 + 6);
        return (
          <motion.rect
            key={i}
            x={150 + i * 9.4}
            y={293 - h / 2}
            width="3.4"
            height={h}
            rx="1.7"
            fill={i % 2 ? c.soft : c.strong}
            initial={{ height: h, y: 293 - h / 2 }}
            animate={
              on
                ? { height: [h, h3, h2, h], y: [293 - h / 2, 293 - h3 / 2, 293 - h2 / 2, 293 - h / 2] }
                : { height: h, y: 293 - h / 2 }
            }
            transition={
              on
                ? { duration: 0.55, repeat: Infinity, ease: "easeInOut", delay: (i % 6) * 0.07 }
                : lift
            }
          />
        );
      })}
      <circle cx="424" cy="293" r="11" fill={c.strong} />
      <rect x="420" y="289" width="8" height="8" rx="1.5" fill="white" />
      {/* forming transcript + cursor + timer */}
      <rect x="94" y="332" width="150" height="4.5" rx="2.25" fill={GREY} />
      <rect x="248" y="332" width="60" height="4.5" rx="2.25" fill={GREY_LITE} />
      <rect x="312" y="331" width="5" height="7" rx="1" fill={c.strong} />
      <rect x="404" y="330" width="44" height="10" rx="5" fill="#f0f1f3" />
    </motion.g>
  );
}

/* 6 ── Reasoning (Staple Chat) — expanded "Thinking" step list on a rail ── */
function Variant6({ c, reduce, hovered, lift }: SceneProps) {
  const steps = [0, 1, 2, 3];
  const on = hovered && !reduce;
  return (
    <motion.g animate={floatAnim(reduce, 5, 6)}>
      {/* header */}
      <rect x="94" y="180" width="80" height="6" rx="3" fill={GREY} />
      <line x1="80" y1="194" x2="460" y2="194" stroke="#eef0f2" strokeWidth="1" />
      {/* user bubble (right) */}
      <rect x="300" y="202" width="148" height="22" rx="8" fill={c.tint} />
      <rect x="308" y="208" width="130" height="4.5" rx="2.25" fill={c.soft} />
      {/* thinking header: node + label + summary + source chips */}
      <circle cx="100" cy="238" r="4.5" fill={c.soft} />
      <rect x="110" y="235" width="40" height="5.5" rx="2.75" fill={GREY} />
      <rect x="156" y="236" width="70" height="4" rx="2" fill={GREY_LITE} />
      <rect x="234" y="234" width="26" height="8" rx="4" fill={c.tint} />
      <rect x="264" y="234" width="26" height="8" rx="4" fill={c.tint} />
      <rect x="432" y="237" width="12" height="2.5" rx="1.25" fill="#d5d7db" />
      {/* numbered step rail (node + two lines each) */}
      <line x1="104" y1="256" x2="104" y2="330" stroke="#e6e9ec" strokeWidth="1.5" />
      {steps.map((i) => {
        const y = 258 + i * 19;
        return (
          <motion.g key={i} animate={{ x: on ? 14 : 0 }} transition={{ ...lift, delay: i * 0.09 }}>
            <circle cx="104" cy={y} r="5" fill={c.tint} />
            <circle cx="104" cy={y} r="2" fill={c.strong} />
            <rect x="118" y={y - 4} width={200 - (i % 2) * 40} height="4.5" rx="2.25" fill={GREY} />
            <rect x="118" y={y + 4} width={140 - (i % 3) * 30} height="4" rx="2" fill={GREY_LITE} />
          </motion.g>
        );
      })}
      {/* result: file badge + prose + number pill */}
      <rect x="94" y="342" width="104" height="14" rx="7" fill={c.tint} />
      <rect x="101" y="346" width="8" height="6" rx="1.5" fill={c.strong} />
      <rect x="113" y="346.5" width="76" height="4.5" rx="2.25" fill={c.mid} />
      <rect x="206" y="346" width="130" height="4.5" rx="2.25" fill={GREY} />
      <rect x="404" y="341" width="44" height="15" rx="4" fill={c.strong} />
      <rect x="412" y="346.5" width="28" height="5" rx="2.5" fill={c.tint} />
    </motion.g>
  );
}

/* 7 ── Table answer (Staple Chat) — inline comparison table with change column ── */
function Variant7({ c, reduce, hovered, lift }: SceneProps) {
  const rows = [0, 1, 2, 3, 4];
  const on = hovered && !reduce;
  return (
    <motion.g animate={floatAnim(reduce, 5, 6)}>
      {/* header */}
      <rect x="94" y="180" width="80" height="6" rx="3" fill={GREY} />
      <line x1="80" y1="194" x2="460" y2="194" stroke="#eef0f2" strokeWidth="1" />
      {/* user bubble (right) */}
      <rect x="300" y="202" width="148" height="20" rx="8" fill={c.tint} />
      <rect x="308" y="208" width="130" height="4" rx="2" fill={c.soft} />
      {/* prose */}
      <rect x="94" y="234" width="180" height="4.5" rx="2.25" fill={GREY} />
      {/* inline comparison table */}
      <rect x="94" y="248" width="354" height="94" rx="7" fill="white" stroke="#e9ebee" strokeWidth="1" />
      <rect x="102" y="256" width="44" height="4" rx="2" fill="#c4c7cc" />
      <rect x="432" y="255" width="8" height="8" rx="2" fill={c.soft} />
      {/* header row + sort marker on the first column */}
      <rect x="110" y="272" width="34" height="4" rx="2" fill="#b9bcc2" />
      <rect x="148" y="272.5" width="8" height="3" rx="1.5" fill="#d5d7db" />
      <rect x="216" y="272" width="24" height="4" rx="2" fill="#b9bcc2" />
      <rect x="300" y="272" width="24" height="4" rx="2" fill="#b9bcc2" />
      <rect x="404" y="272" width="30" height="4" rx="2" fill="#b9bcc2" />
      <line x1="102" y1="282" x2="440" y2="282" stroke="#f1f2f4" strokeWidth="1" />
      {/* data rows with a change (up/down) column */}
      {rows.map((r) => {
        const y = 288 + r * 9;
        const up = r % 2 === 0;
        return (
          <g key={r}>
            <rect x="110" y={y} width={48 - (r % 2) * 8} height="4" rx="2" fill={GREY} />
            <rect x="216" y={y} width="28" height="4" rx="2" fill={GREY_LITE} />
            <rect x="300" y={y} width="28" height="4" rx="2" fill={GREY_LITE} />
            <rect x="393" y={y - 0.5} width="5" height="5" rx="1.5" fill={up ? c.strong : c.soft} />
            {/* grows leftward on hover — right edge stays fixed inside the card */}
            <motion.rect
              x={412}
              y={y}
              width={24}
              height="4"
              rx="2"
              fill={up ? c.strong : c.soft}
              initial={{ x: 412, width: 24 }}
              animate={{ x: on ? 404 : 412, width: on ? 32 : 24 }}
              transition={{ ...lift, delay: r * 0.07 }}
            />
          </g>
        );
      })}
      {/* totals row */}
      <line x1="102" y1="336" x2="440" y2="336" stroke="#eceef1" strokeWidth="1" />
      <rect x="110" y="329" width="40" height="4.5" rx="2.25" fill={c.mid} />
      <rect x="300" y="329" width="28" height="4.5" rx="2.25" fill={GREY} />
      <rect x="414" y="329" width="22" height="4.5" rx="2.25" fill={c.strong} />
    </motion.g>
  );
}

/* 8 ── Chart answer (Staple Chat) — prose + inline line chart + confirm ── */
function Variant8({ c, reduce, hovered, lift }: SceneProps) {
  const on = hovered && !reduce;
  return (
    <motion.g animate={floatAnim(reduce, 5, 6)}>
      {/* header */}
      <rect x="94" y="180" width="84" height="6" rx="3" fill={GREY} />
      <line x1="80" y1="194" x2="460" y2="194" stroke="#eef0f2" strokeWidth="1" />
      {/* user bubble (right) */}
      <rect x="300" y="202" width="148" height="22" rx="8" fill={c.tint} />
      <rect x="308" y="208" width="132" height="4.5" rx="2.25" fill={c.soft} />
      <rect x="308" y="217" width="80" height="4.5" rx="2.25" fill={c.wash} />
      {/* file badge + prose (left) */}
      <rect x="94" y="234" width="110" height="14" rx="7" fill={c.tint} />
      <rect x="102" y="238" width="90" height="4.5" rx="2.25" fill={c.mid} />
      <rect x="212" y="238" width="120" height="4.5" rx="2.25" fill={GREY} />
      {/* line chart artifact (wide) */}
      <rect x="94" y="256" width="354" height="86" rx="7" fill="white" stroke="#e9ebee" strokeWidth="1" />
      <rect x="102" y="264" width="44" height="4" rx="2" fill="#c4c7cc" />
      <rect x="432" y="263" width="8" height="8" rx="2" fill={c.soft} />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="110" y1={284 + i * 13} x2="440" y2={284 + i * 13} stroke="#f4f5f7" strokeWidth="1" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <circle key={`t${i}`} cx="104" cy={284 + i * 13} r="1.3" fill="#d5d7db" />
      ))}
      <motion.g animate={{ y: on ? -3 : 0 }} transition={lift}>
        <path d="M 112 318 L 158 306 L 204 311 L 250 294 L 296 299 L 342 284 L 388 288 L 426 276 L 426 326 L 112 326 Z" fill={c.tint} />
        {/* comparison series (dashed) */}
        <path d="M 112 322 L 158 316 L 204 319 L 250 308 L 296 311 L 342 301 L 388 304 L 426 294" fill="none" stroke={c.soft} strokeWidth="1.6" strokeDasharray="4 3" strokeLinecap="round" strokeLinejoin="round" />
        {/* main series redraws itself on hover */}
        <motion.path
          d="M 112 318 L 158 306 L 204 311 L 250 294 L 296 299 L 342 284 L 388 288 L 426 276"
          fill="none"
          stroke={c.strong}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={on ? { pathLength: [0, 1] } : { pathLength: 1 }}
          transition={on ? { duration: 0.9, ease: "easeInOut" } : { duration: 0.2 }}
        />
        {[[112, 318], [250, 294]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill={c.strong} stroke="white" strokeWidth="1.5" />
        ))}
        <motion.circle cx="426" cy="276" r={3} fill={c.strong} stroke="white" strokeWidth="1.5" initial={{ r: 3 }} animate={{ r: on ? 5 : 3 }} transition={{ ...lift, delay: 0.85 }} />
      </motion.g>
      {/* x-axis labels */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={`x${i}`} x={120 + i * 54} y="332" width="18" height="3" rx="1.5" fill="#e2e4e7" />
      ))}
      {/* confirm */}
      <rect x="94" y="350" width="110" height="4.5" rx="2.25" fill={GREY_LITE} />
      <rect x="366" y="348" width="34" height="14" rx="7" fill={c.strong} />
      <rect x="406" y="348" width="42" height="14" rx="7" fill="white" stroke="#e0e2e6" strokeWidth="1" />
    </motion.g>
  );
}

/* 9 ── Spaces (Staple Chat) — sidebar + zebra table with owners, star ── */
function Variant9({ c, reduce, hovered, lift }: SceneProps) {
  const rows = [0, 1, 2, 3];
  const owners = [c.strong, c.soft, c.mid, "#dbdee3"];
  const ty = 244;
  const rowH = 27;
  const on = hovered && !reduce;
  return (
    <motion.g animate={floatAnim(reduce, 5, 6)}>
      {chrome(c)}
      {/* title + new */}
      <rect x="124" y="204" width="80" height="6" rx="3" fill={c.strong} />
      <motion.rect x="396" y={202} width="52" height="13" rx="6.5" fill={c.strong} initial={{ y: 202, width: 52, x: 396 }} animate={{ y: on ? 198 : 202, width: on ? 58 : 52, x: on ? 390 : 396 }} transition={lift} />
      {/* search + segmented toggle */}
      <rect x="124" y="218" width="150" height="14" rx="7" fill="#f2f3f5" />
      <rect x="132" y="223" width="54" height="4" rx="2" fill={GREY_LITE} />
      <rect x="386" y="218" width="62" height="14" rx="7" fill="#f0f1f3" />
      <rect x="388" y="220" width="29" height="10" rx="5" fill="white" />
      {/* column header row */}
      <rect x="124" y="236" width="40" height="3.5" rx="1.75" fill="#b9bcc2" />
      <rect x="300" y="236" width="24" height="3.5" rx="1.75" fill="#b9bcc2" />
      <rect x="374" y="236" width="28" height="3.5" rx="1.75" fill="#b9bcc2" />
      <line x1="116" y1="242" x2="460" y2="242" stroke="#eceef1" strokeWidth="1" />
      {/* rows: name/desc + owner + status pill + star */}
      {rows.map((r) => {
        const y = ty + r * rowH;
        return (
          <motion.g key={r} animate={{ x: on ? 12 : 0 }} transition={{ ...lift, delay: r * 0.08 }}>
            {r % 2 === 1 && <rect x="116" y={y} width="344" height={rowH} fill="#fafbfc" />}
            <rect x="124" y={y + 7} width={78 - (r % 2) * 10} height="5" rx="2.5" fill={GREY} />
            <rect x="124" y={y + 16} width={100 - (r % 3) * 14} height="4" rx="2" fill={GREY_LITE} />
            <circle cx="300" cy={y + 13} r="7" fill={owners[r]} />
            <rect x="312" y={y + 10} width="26" height="4" rx="2" fill={GREY_LITE} />
            <rect x="360" y={y + 9} width="38" height="9" rx="4.5" fill={r % 2 ? c.tint : "#f0f1f3"} />
            <rect x="431" y={y + 8} width="9" height="9" rx="2.5" fill={r === 0 ? c.strong : "#e6e8ec"} />
            {r < 3 && <line x1="116" y1={y + rowH} x2="460" y2={y + rowH} stroke="#f2f3f5" strokeWidth="1" />}
          </motion.g>
        );
      })}
      {/* pagination */}
      <rect x="124" y="356" width="30" height="9" rx="4.5" fill="#f0f1f3" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={360 + i * 22} y="354" width="13" height="13" rx="4" fill={i === 0 ? c.strong : "#f0f1f3"} />
      ))}
      <rect x="432" y="356" width="14" height="9" rx="4.5" fill="#f0f1f3" />
    </motion.g>
  );
}

/* 10 ── Configure (Staple Chat) — dimmed main + config panel with tabs ── */
function Variant10({ c, reduce, hovered, lift }: SceneProps) {
  const rows = [0, 1, 2, 3, 4, 5];
  const ty = 214;
  const rowH = 24;
  const on = hovered && !reduce;
  return (
    <motion.g animate={floatAnim(reduce, 5, 6)}>
      {/* dimmed main content (left) */}
      <g opacity="0.45">
        <rect x="94" y="184" width="120" height="6" rx="3" fill={GREY} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect key={i} x="94" y={202 + i * 16} width={i % 2 ? 90 : 130} height="4.5" rx="2.25" fill={GREY_LITE} />
        ))}
      </g>
      {/* config panel (right) — slides in on hover */}
      <motion.g animate={{ x: on ? -16 : 0 }} transition={lift}>
      <rect x="248" y="176" width="200" height="190" rx="8" fill="white" stroke="#e6e9ec" strokeWidth="1" />
      {/* tabs + close */}
      <rect x="260" y="190" width="34" height="6" rx="3" fill={c.strong} />
      <rect x="304" y="190" width="40" height="6" rx="3" fill={GREY_LITE} />
      <rect x="354" y="190" width="34" height="6" rx="3" fill={GREY_LITE} />
      <circle cx="432" cy="193" r="5" fill="#eceef1" />
      <rect x="260" y="200" width="34" height="2.5" rx="1.25" fill={c.strong} />
      <line x1="248" y1="204" x2="448" y2="204" stroke="#eef0f2" strokeWidth="1" />
      {/* data rows */}
      {rows.map((r) => {
        const y = ty + r * rowH;
        return (
          <g key={r}>
            <rect x="260" y={y + 5} width="7" height="7" rx="1.5" fill={r % 3 === 0 ? c.strong : c.soft} />
            <rect x="274" y={y + 3} width={70 - (r % 2) * 10} height="4.5" rx="2.25" fill={GREY} />
            <rect x="274" y={y + 12} width={50 - (r % 3) * 8} height="4" rx="2" fill={GREY_LITE} />
            <rect x="392" y={y + 5} width="44" height="11" rx="5.5" fill={r % 2 ? c.tint : "#f0f1f3"} />
            {r < rows.length - 1 && <line x1="260" y1={y + rowH - 2} x2="436" y2={y + rowH - 2} stroke="#f4f5f7" strokeWidth="1" />}
          </g>
        );
      })}
      </motion.g>
    </motion.g>
  );
}

const VARIANTS: { name: string; Scene: (p: SceneProps) => React.JSX.Element }[] = [
  { name: "New chat", Scene: Variant1 },
  { name: "Chat thread", Scene: Variant2 },
  { name: "Chat + chart", Scene: Variant3 },
  { name: "Connect data", Scene: Variant4 },
  { name: "Voice input", Scene: Variant5 },
  { name: "Reasoning", Scene: Variant6 },
  { name: "Table answer", Scene: Variant7 },
  { name: "Chart answer", Scene: Variant8 },
  { name: "Spaces", Scene: Variant9 },
  { name: "Configure", Scene: Variant10 },
];

/** One illustration = one full square SVG scene (dotted bg + themed colours). */
function Illustration({
  idx,
  Scene,
  c,
  reduce,
  lift,
  hovered,
}: {
  idx: number;
  Scene: (p: SceneProps) => React.JSX.Element;
  c: Ramp;
  reduce: boolean | null;
  lift: SceneProps["lift"];
  hovered: boolean;
}) {
  const dots = `ill-dots-${idx}`;
  const shadow = `ill-shadow-${idx}`;
  const clip = `ill-clip-${idx}`;
  return (
    <svg
      viewBox="54 137 432 270"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id={dots} width="17" height="17" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.3" fill="#e9ebef" />
        </pattern>
        <filter id={shadow} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#2b3a55" floodOpacity="0.12" />
        </filter>
        <clipPath id={clip}>
          <rect x="80" y="163" width="380" height="214" rx="21" />
        </clipPath>
      </defs>

      {/* subtle themed card background + faint dotted texture */}
      <rect x="0" y="0" width="540" height="540" fill={c.tint} opacity="0.45" />
      <rect x="0" y="0" width="540" height="540" fill={`url(#${dots})`} opacity="0.4" />

      {/* white 16:9 sheet + soft drop shadow */}
      <rect x="80" y="163" width="380" height="214" rx="21" fill="white" filter={`url(#${shadow})`} />
      {/* the product screen, clipped to the sheet so edge chrome tucks under the radius */}
      <g clipPath={`url(#${clip})`}>
        <Scene hovered={hovered} reduce={reduce} lift={lift} c={c} />
      </g>
      {/* crisp sheet border on top */}
      <rect x="80" y="163" width="380" height="214" rx="21" fill="none" stroke="#eef0f2" strokeWidth="1" />
    </svg>
  );
}

export default function LaptopCard() {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  // Track pointer-down position so a drag on the carousel doesn't count as a click.
  const down = useRef<{ x: number; y: number } | null>(null);

  // Clicking the card (but not the stepper/arrow/buttons, and not after a drag)
  // opens the Staple Chat case study.
  const onCardPointerDown = (e: React.PointerEvent) => {
    down.current = { x: e.clientX, y: e.clientY };
  };
  const onCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button, a")) return; // controls handle themselves
    const d = down.current;
    if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8) return; // was a drag
    router.push("/staple-chat");
  };
  // Deterministic on the server; a random design-system hue is chosen after mount,
  // so every page refresh recolours the illustrations.
  const [theme, setTheme] = useState(0);
  useEffect(() => {
    const pick = () => setTheme(Math.floor(Math.random() * THEMES.length));
    pick();
    // Also re-roll on bfcache restore (back/forward or some refreshes skip mount).
    window.addEventListener("pageshow", pick);
    return () => window.removeEventListener("pageshow", pick);
  }, []);

  const lift = { type: "spring" as const, stiffness: 170, damping: 14 };
  const c = THEMES[theme];

  // Dotted margin field behind the cards (shows around/between the arcing cards).
  const background = (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: "radial-gradient(circle, #e9ebef 1.3px, transparent 1.5px)",
        backgroundSize: "13px 13px",
        opacity: 0.45,
      }}
    />
  );

  const slides: ArcSlide[] = useMemo(
    () =>
      VARIANTS.map((variant, i) => ({
        id: `illustration-${i}`,
        label: variant.name,
        content: (
          <Illustration idx={i} Scene={variant.Scene} c={c} reduce={reduce} lift={lift} hovered={hovered} />
        ),
      })),
    // lift is stable in practice; theme colour, reduced-motion and hover matter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [c, reduce, hovered],
  );

  return (
    <div
      className="group/card relative col-span-2 row-span-2 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerDownCapture={onCardPointerDown}
      onClick={onCardClick}
    >
      <ArcCarousel
        slides={slides}
        bare
        wheelNav={false}
        showExpand={false}
        cardWidth={384}
        cardHeight={240}
        arc={{ bulgeX: 70, stepY: 270, rotStep: 0, fade: 0.54 }}
        autoplayMs={1700}
        autoplayStep={-1}
        background={background}
        className="h-full"
      />

      {/* Case-study arrow → Staple Chat — same affordance as the other cards */}
      <Link
        href="/staple-chat"
        aria-label="Staple Chat case study"
        className="absolute bottom-2 left-2 z-[300] flex items-center gap-2 group/arrow opacity-0 pointer-events-none transition-opacity duration-200 group-hover/card:opacity-100 group-hover/card:pointer-events-auto"
      >
        <div
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 relative overflow-hidden transition-shadow duration-300"
          style={{ boxShadow: "0 0 0 2px rgba(0,0,0,0.1)" }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.1)")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/arrow:translate-x-[120%] group-hover/arrow:-translate-y-[120%] motion-reduce:!transform-none">
            <line x1="5" y1="19" x2="19" y2="5" />
            <polyline points="9 5 19 5 19 15" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute translate-x-[-120%] translate-y-[120%] transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/arrow:translate-x-0 group-hover/arrow:translate-y-0 motion-reduce:!transform-none">
            <line x1="5" y1="19" x2="19" y2="5" />
            <polyline points="9 5 19 5 19 15" />
          </svg>
        </div>
        <div
          className="h-[32px] rounded-full bg-white/70 backdrop-blur-md flex items-center px-4 max-w-0 opacity-0 group-hover/arrow:max-w-[600px] group-hover/arrow:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] overflow-hidden whitespace-nowrap"
          style={{ boxShadow: "0 0 0 1.5px rgba(0,0,0,0.08)" }}
        >
          <p className="text-[13px] text-txt-primary font-medium">
            <span>💬</span> <strong className="font-semibold text-txt-heading">Staple Chat</strong>
            {": "}
            Conversational AI for document analysis.
          </p>
        </div>
      </Link>
    </div>
  );
}
