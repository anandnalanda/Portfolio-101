/**
 * chibi.tsx — the shared cast + pen-doodle language for the Staple Chat case
 * study's two hand-drawn illustrations (the Impact hub-and-spoke and the
 * analyst-bottleneck maze). One source of truth so the SAME people read across
 * both beats: the bespectacled protagonist is buried at the bottleneck here and
 * freed at the hub there.
 *
 * Skill language: naive rough-pen outlines (a displacement filter), dot-eye
 * faces, mini figures, simple flat fills, lots of white space.
 */

export const INK = "#12333b";
export const TEAL = "#0e7c8b";
export const TEAL_SOFT = "#d3eef1";
export const WARM = "#f4c86a";
export const PINK = "#e0699a";
export const SKIN = "#f6ddc4";
export const SKIN_BROWN = "#a8734d";
export const HAIR = "#241d19";
export const HAIR_BROWN = "#3a2416";
export const DENIM = "#7ba7cf";
export const NAVY = "#2b3a4a";
export const CORAL = "#e08a6e";
export const SWEATER = "#a7b0cb";

/** The rough hand-drawn filter. Give it a unique id per SVG. */
export function RoughFilter({
  id,
  baseFrequency = 0.016,
  scale = 3.4,
  seed = 5,
}: {
  id: string;
  baseFrequency?: number;
  scale?: number;
  seed?: number;
}) {
  return (
    <filter id={id}>
      <feTurbulence type="fractalNoise" baseFrequency={baseFrequency} numOctaves={2} seed={seed} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={scale} xChannelSelector="R" yChannelSelector="G" />
    </filter>
  );
}

type Mood = "happy" | "frazzled";

/** The protagonist — round glasses, dark swept-up hair, stubble, denim.
    mood="frazzled" makes him the overwhelmed analyst: squiggle mouth, sweat,
    a stray upset hair-tuft. */
export function Hero({ x, y, s = 1, mood = "happy" }: { x: number; y: number; s?: number; mood?: Mood }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -18 34 Q -20 9 0 9 Q 20 9 18 34 Z" fill={DENIM} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M -7 9 L 0 22 L 7 9 Z" fill="#fff" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M -8 9 L -1.5 15 M 8 9 L 1.5 15" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <circle cx={0} cy={-9} r={14.5} fill={SKIN} stroke={INK} strokeWidth={2.4} />
      <path d="M -13 -8 Q -13 6 0 6 Q 13 6 13 -8 Q 9 2 0 2 Q -9 2 -13 -8 Z" fill={HAIR} opacity={0.28} />
      <path d="M -15 -11 Q -18 -30 -2 -30 Q 4 -34 12 -28 Q 18 -26 14 -11 Q 11 -21 2 -22 Q -8 -22 -15 -11 Z" fill={HAIR} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      {/* frazzled: an upset stray tuft springing off the top */}
      {mood === "frazzled" && (
        <path d="M 2 -30 q 4 -8 -2 -12" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      )}
      {mood === "frazzled" ? (
        // stressed slanted brows
        <g fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round">
          <path d="M -9 -13 q 3 1.4 5.4 0.4" />
          <path d="M 3.6 -12.6 q 2.4 -1 5.4 0.4" />
        </g>
      ) : (
        <g fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round">
          <path d="M -8 -9 q 2.5 -2.6 5 0" />
          <path d="M 3 -9 q 2.5 -2.6 5 0" />
        </g>
      )}
      <g stroke={INK} strokeWidth={1.8} fill="none">
        <circle cx={-5.5} cy={-9} r={5.4} />
        <circle cx={5.5} cy={-9} r={5.4} />
        <path d="M -0.1 -9 h 0.2" strokeWidth={2} />
        <path d="M -10.9 -9 q -3 -0.4 -4 0.8 M 10.9 -9 q 3 -0.4 4 0.8" />
      </g>
      {mood === "frazzled" ? (
        // flat, worried squiggle mouth + a sweat bead by the temple
        <>
          <path d="M -5 0 q 2.5 -2.6 5 0 q 2.5 2.6 5 0" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
          <path d="M 13 -14 q -3 4 0 6 q 3 -2 0 -6 Z" fill="#8fd0e6" stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
        </>
      ) : (
        <path d="M -4 -1 q 4 4 8 0" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
      )}
    </g>
  );
}

/** Short-haired woman in dark sunglasses and a navy tee. */
export function Woman({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -17 34 Q -19 9 0 9 Q 19 9 17 34 Z" fill={NAVY} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M -6 9 q 6 5 12 0" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
      <circle cx={0} cy={-9} r={14} fill={SKIN} stroke={INK} strokeWidth={2.4} />
      <path d="M -15 -8 Q -19 -30 0 -28 Q 19 -30 15 -8 Q 17 3 11 8 L 10 -7 Q 7 -19 0 -19 Q -8 -19 -11 -7 L -13 8 Q -17 2 -15 -8 Z" fill={HAIR} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <g stroke={INK} strokeWidth={1.8}>
        <path d="M -12 -11 q 0 8 6 8 q 6 0 6 -7 q -6 -2 -12 -1 Z" fill="#1b2b2e" />
        <path d="M 0 -11 q 0 8 6 8 q 6 0 6 -7 q -6 -2 -12 -1 Z" fill="#1b2b2e" />
        <path d="M -0.5 -10 h 1" fill="none" />
      </g>
      <path d="M -3 2 q 3 1.6 6 0" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
    </g>
  );
}

/** Beaming man with a big open smile, coral polo, arms crossed. */
export function SmilingMan({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -19 34 Q -21 9 0 9 Q 21 9 19 34 Z" fill={CORAL} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M -17 21 Q 0 15 17 21 Q 15 31 0 29 Q -15 31 -17 21 Z" fill="#d1785c" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d="M -6 9 L 0 16 L 6 9" fill="#fff" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M 0 12 v 5" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
      <circle cx={0} cy={-9} r={14} fill={SKIN} stroke={INK} strokeWidth={2.4} />
      <path d="M -14 -10 Q -16 -27 0 -26 Q 16 -27 14 -10 Q 10 -20 0 -20 Q -10 -20 -14 -10 Z" fill={HAIR} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <g fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round">
        <path d="M -8 -9 q 2.6 -3 5 0" />
        <path d="M 3 -9 q 2.6 -3 5 0" />
      </g>
      <path d="M -6 -2 Q 0 6 6 -2 Q 0 0 -6 -2 Z" fill="#fff" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
    </g>
  );
}

/** Curly-haired woman, warm brown skin, big smile, periwinkle sweatshirt
    with a little beaded necklace. */
export function CurlyWoman({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -18 34 Q -20 9 0 9 Q 20 9 18 34 Z" fill={SWEATER} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M -7 9 q 7 5 14 0" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
      <path d="M -6 11 q 6 8 13 0" fill="none" stroke="#cfd4dd" strokeWidth={1.1} />
      <circle cx={-3} cy={16} r={1.3} fill={CORAL} />
      <circle cx={1.5} cy={17} r={1.3} fill="#8fbfc4" />
      <circle cx={6} cy={16} r={1.3} fill={WARM} />
      <circle cx={0} cy={-8} r={13.5} fill={SKIN_BROWN} stroke={INK} strokeWidth={2.4} />
      <path
        d="M -13 0 Q -28 -2 -23 -14 Q -32 -21 -21 -28 Q -23 -39 -8 -35 Q 0 -42 8 -35 Q 23 -39 21 -27 Q 31 -20 22 -12 Q 28 -1 13 0 Q 12 -9 7 -13 Q 3 -17 0 -17 Q -3 -17 -7 -13 Q -12 -9 -13 0 Z"
        fill={HAIR_BROWN}
        stroke={INK}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <g fill={HAIR_BROWN} stroke={INK} strokeWidth={1.4}>
        <circle cx={-21} cy={-22} r={4.2} />
        <circle cx={-25} cy={-11} r={4} />
        <circle cx={-1} cy={-37} r={4.6} />
        <circle cx={13} cy={-32} r={4} />
        <circle cx={22} cy={-21} r={4.2} />
        <circle cx={25} cy={-10} r={4} />
      </g>
      <g fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round">
        <path d="M -7.5 -8 q 2.6 -3 5 0" />
        <path d="M 2.5 -8 q 2.6 -3 5 0" />
      </g>
      <path d="M -6 -1 Q 0 7 6 -1 Q 0 1 -6 -1 Z" fill="#fff" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
    </g>
  );
}

/** A mini generic person. */
export function Chibi({ x, y, s = 1, color }: { x: number; y: number; s?: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -13 30 Q -15 7 0 7 Q 15 7 13 30 Z" fill={color} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <circle cx={0} cy={-7} r={13} fill={SKIN} stroke={INK} strokeWidth={2.4} />
      <g fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round">
        <path d="M -6 -10 q 2.6 -3 5 0" />
        <path d="M 1 -10 q 2.6 -3 5 0" />
        <path d="M -3.5 -4 q 3.5 3 7 0" />
      </g>
    </g>
  );
}

/** A little hand-drawn "?" thought bubble — the waiting non-technical asker. */
export function WaitBubble({ x, y, s = 1, color = INK }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M -11 -8 Q -11 -17 0 -17 Q 12 -17 12 -8 Q 12 0 1 0 L -4 6 L -4 0 Q -11 -1 -11 -8 Z"
        fill="#fff"
        stroke={INK}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <text x={0.5} y={-4} fontSize={13} fontWeight={700} textAnchor="middle" fill={color} style={{ fontFamily: "Georgia, serif" }}>
        ?
      </text>
    </g>
  );
}
