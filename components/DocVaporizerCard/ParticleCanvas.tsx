"use client";

import { useEffect, useRef } from "react";
import { COLORS, PARTICLES, SIZES } from "./variants";

/**
 * The "data mist": canvas particles spawned along the scan line that drift
 * right, wander, rotate (glyphs) and fade over a 2–4s lifetime, thinning
 * toward the card edge. Fixed pool, object reuse, zero per-frame allocation.
 * One RAF loop, started on mount (the parent gates mounting on hover) and
 * cancelled + canvas cleared on unmount.
 *
 * reduced-motion: a single static low-density scatter, no RAF.
 */

type Kind = 0 | 1 | 2; // 0 glyph · 1 dot · 2 hollow circle

type Particle = {
  active: boolean;
  x: number;
  y: number;
  baseY: number;
  vx: number;
  wanderF: number;
  phase: number;
  rot: number;
  vr: number;
  size: number;
  kind: Kind;
  glyph: string;
  color: string;
  baseA: number;
  age: number;
  life: number;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

export default function ParticleCanvas({
  reduced,
  scanPct = SIZES.scanPct,
}: {
  reduced: boolean;
  scanPct?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const scanX = (scanPct / 100) * W;
    const spanX = Math.max(1, W - scanX);

    const pool: Particle[] = Array.from({ length: PARTICLES.pool }, () => ({
      active: false,
      x: 0,
      y: 0,
      baseY: 0,
      vx: 0,
      wanderF: 0,
      phase: 0,
      rot: 0,
      vr: 0,
      size: 0,
      kind: 0,
      glyph: "0",
      color: COLORS.particles[0],
      baseA: 0,
      age: 0,
      life: 1,
    }));

    const spawn = (p: Particle, preAge = 0) => {
      // glyphs dominate (binary stream); dots/circles are sparse texture
      const kind = (Math.random() < 0.7 ? 0 : Math.random() < 0.6 ? 1 : 2) as Kind;
      p.active = true;
      p.kind = kind;
      p.glyph = pick(PARTICLES.glyphs);
      p.color = pick(COLORS.particles);
      p.size =
        kind === 0
          ? rand(...PARTICLES.glyphPx)
          : kind === 1
            ? rand(...PARTICLES.dotPx)
            : rand(...PARTICLES.circlePx);
      // denser near vertical centre (sum of two uniforms ≈ triangular)
      p.baseY = H / 2 + (Math.random() + Math.random() - 1) * H * 0.32;
      p.vx = rand(...PARTICLES.driftX);
      p.wanderF = rand(0.5, 1.4);
      p.phase = rand(0, Math.PI * 2);
      p.rot = 0;
      p.vr = kind === 0 ? rand(-0.26, 0.26) : 0; // ±15° over lifetime
      p.baseA = rand(...PARTICLES.alpha);
      p.life = rand(...PARTICLES.life);
      p.age = preAge;
      // most stream out from the door edge; some just appear deeper in the
      // field and twinkle away — "comes and disappears" toward the right
      p.x =
        (Math.random() < 0.35
          ? scanX + rand(12, spanX * 0.7)
          : scanX + rand(-2, 6)) +
        p.vx * preAge;
      p.y = p.baseY;
    };

    const draw = (p: Particle) => {
      const t = p.age / p.life;
      // twinkle envelope: rise in, peak, dissolve out (sin arc over lifetime),
      // × density falloff so everything is gone before the card's right edge
      const falloff = Math.max(0, 1 - (p.x - scanX) / spanX);
      const a = p.baseA * Math.sin(Math.PI * Math.min(t, 1)) * (0.35 + 0.65 * falloff);
      if (a <= 0.01) return;
      ctx.globalAlpha = a;
      if (p.kind === 0) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.font = `${p.size}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.glyph, 0, 0);
        ctx.restore();
      } else if (p.kind === 1) {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    /* reduced motion: one static low-density scatter, no loop */
    if (reduced) {
      for (let i = 0; i < 40; i++) {
        const p = pool[i];
        spawn(p, rand(0, p.life * 0.9));
        p.age = Math.min(p.age, p.life * 0.9);
        draw(p);
      }
      return () => ctx.clearRect(0, 0, W, H);
    }

    // pre-seed so the mist exists immediately, not building from zero
    for (let i = 0; i < PARTICLES.preSeed; i++) {
      spawn(pool[i], rand(0, PARTICLES.life[1] * 0.7));
      if (pool[i].age >= pool[i].life) pool[i].active = false;
    }

    let raf = 0;
    let last = performance.now();
    let acc = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // continuous spawning
      acc += dt * PARTICLES.perSecond;
      while (acc >= 1) {
        acc -= 1;
        const slot = pool.find((p) => !p.active);
        if (slot) spawn(slot);
      }

      ctx.clearRect(0, 0, W, H);
      for (const p of pool) {
        if (!p.active) continue;
        p.age += dt;
        if (p.age >= p.life || p.x > W + 20) {
          p.active = false;
          continue;
        }
        p.x += p.vx * dt;
        p.y = p.baseY + Math.sin(p.age * p.wanderF * Math.PI) * PARTICLES.wanderY;
        p.rot += p.vr * dt;
        draw(p);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, W, H);
    };
  }, [reduced, scanPct]);

  return (
    <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />
  );
}
