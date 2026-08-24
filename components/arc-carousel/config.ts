/**
 * Arc geometry — every rendered card derives its transform from these constants and
 * its distance `t` to the animated `position`. Tune against the reference capture.
 */
export const ARC = {
  cardW: 336, // px
  cardH: 218, // px  (~3:2)
  stepY: 250, // px of vertical travel per step
  bulgeX: 178, // px of rightward bulge at |t| = 1 — applied as bulgeX * t²
  rotStep: 30, // deg of rotation per step
  fade: 0.85, // opacity falloff per unit |t|
  window: 2, // render virtual indices within ±2 of position (→ 5 cards)
} as const;

export type ArcConfig = { [K in keyof typeof ARC]: number };

export type ArcStyle = {
  transform: string;
  opacity: number;
  zIndex: number;
};

/**
 * t = virtualIndex - position.
 *   t = 0  → centred, upright.
 *   t = +1 → next, sits below-right, tilted.
 *   t = -1 → prev, sits above-right, tilted the other way.
 * The parabolic x is the signature: BOTH neighbours bulge to the same (right) side.
 */
export function styleFor(t: number, cfg: ArcConfig = ARC): ArcStyle {
  const x = cfg.bulgeX * t * t; // parabola → centre at x=0, both neighbours to the right
  const y = t * cfg.stepY; // +t below, -t above
  const rot = -cfg.rotStep * t; // next tilts one way, prev the other
  const opacity = Math.max(0, 1 - cfg.fade * Math.abs(t)); // 1 → 0.15 at |t|=1 → 0 by |t|≈1.18
  return {
    transform: `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`,
    opacity,
    zIndex: 100 - Math.round(Math.abs(t) * 10),
  };
}
