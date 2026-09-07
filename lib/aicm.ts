/* AI Content Machine access gate — shared server helpers.
   The live product is a separate deploy; this gate just decides who gets
   the link. Secrets are read from env inside the route handlers only. */

import { timingSafeEqual } from "node:crypto";

export const AICM_URL = "https://aicm-navy.vercel.app/";

export const ENV = {
  password: "AICM_ACCESS_PASSWORD",
  resendKey: "RESEND_API_KEY",
  requestsTo: "AICM_REQUESTS_TO",
} as const;

/** Constant-time string compare so wrong guesses don't leak length/prefix. */
export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) {
    // still burn a comparison of equal cost
    timingSafeEqual(ab, ab);
    return false;
  }
  return timingSafeEqual(ab, bb);
}

/** Tiny in-memory window limiter: `limit` hits per `windowMs` per key.
    Per-instance and reset on cold start — fine for slowing a guesser down,
    not a security boundary on its own. */
export function createWindowLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return {
    hit(key: string, now = Date.now()): { ok: boolean; retryAfterMs: number } {
      const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (list.length >= limit) {
        hits.set(key, list);
        return { ok: false, retryAfterMs: windowMs - (now - list[0]) };
      }
      list.push(now);
      hits.set(key, list);
      if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
      return { ok: true, retryAfterMs: 0 };
    },
  };
}

export function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "local";
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
