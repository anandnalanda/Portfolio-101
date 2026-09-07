/* POST { password } → { ok: true, url } or 401. Ten tries per 15 minutes
   per IP. The password only ever lives in AICM_ACCESS_PASSWORD. */

import { NextResponse } from "next/server";
import { AICM_URL, ENV, safeEqual, createWindowLimiter, clientKey } from "@/lib/aicm";

export const runtime = "nodejs";

const limiter = createWindowLimiter(10, 15 * 60 * 1000);

export async function POST(req: Request) {
  const expected = process.env[ENV.password];
  if (!expected) {
    return NextResponse.json({ ok: false, error: "Access isn't configured on this server yet." }, { status: 503 });
  }

  const gate = limiter.hit(clientKey(req));
  if (!gate.ok) {
    const mins = Math.max(1, Math.ceil(gate.retryAfterMs / 60_000));
    return NextResponse.json({ ok: false, error: `Too many tries. Wait about ${mins} min.` }, { status: 429 });
  }

  let password = "";
  try {
    const body = (await req.json()) as { password?: unknown };
    if (typeof body.password === "string") password = body.password;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  if (!password || password.length > 200 || !safeEqual(password.trim(), expected)) {
    return NextResponse.json({ ok: false, error: "That's not it." }, { status: 401 });
  }
  return NextResponse.json({ ok: true, url: AICM_URL });
}
