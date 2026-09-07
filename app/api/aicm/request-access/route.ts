/* POST { email } → emails Anand via Resend so he can send the password.
   Five requests per hour per IP. Nothing is stored. */

import { NextResponse } from "next/server";
import { ENV, EMAIL_RE, createWindowLimiter, clientKey } from "@/lib/aicm";

export const runtime = "nodejs";

const limiter = createWindowLimiter(5, 60 * 60 * 1000);

export async function POST(req: Request) {
  const key = process.env[ENV.resendKey];
  const to = process.env[ENV.requestsTo];
  if (!key || !to) {
    return NextResponse.json({ ok: false, error: "Requests aren't set up on this server yet." }, { status: 503 });
  }

  const gate = limiter.hit(clientKey(req));
  if (!gate.ok) {
    return NextResponse.json({ ok: false, error: "Too many requests from here — try again later." }, { status: 429 });
  }

  let email = "";
  try {
    const body = (await req.json()) as { email?: unknown };
    if (typeof body.email === "string") email = body.email.trim().toLowerCase();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "That doesn't look like an email address." }, { status: 400 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: "AI Content Machine <onboarding@resend.dev>",
      to: [to],
      reply_to: email,
      subject: `Access request: ${email}`,
      text: `${email} asked for the AI Content Machine password.\n\nReply to this email to send it to them.\n\nFrom: ${clientKey(req)}\nAt: ${new Date().toISOString()}`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[aicm/request-access] resend", res.status, detail.slice(0, 300));
    return NextResponse.json({ ok: false, error: "Couldn't send the request just now. Try again in a minute." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
