"use client";

/* The door to AI Content Machine. The product lives on its own deploy; this
   page holds the password and the request-access form. Same visual
   language as the rest of the portfolio — it's a page here, not a mock. */

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const ease = [0.22, 1, 0.36, 1] as const;

type Phase = "idle" | "busy" | "error" | "done";

export default function AiContentMachineGate() {
  const [password, setPassword] = useState("");
  const [unlock, setUnlock] = useState<{ phase: Phase; msg?: string }>({ phase: "idle" });
  const [email, setEmail] = useState("");
  const [request, setRequest] = useState<{ phase: Phase; msg?: string }>({ phase: "idle" });

  const onUnlock = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim() || unlock.phase === "busy") return;
    setUnlock({ phase: "busy" });
    try {
      const res = await fetch("/api/aicm/unlock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = (await res.json()) as { ok: boolean; url?: string; error?: string };
      if (json.ok && json.url) {
        setUnlock({ phase: "done" });
        window.location.assign(json.url);
        return;
      }
      setUnlock({ phase: "error", msg: json.error ?? "That's not it." });
    } catch {
      setUnlock({ phase: "error", msg: "Couldn't reach the server." });
    }
  };

  const onRequest = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || request.phase === "busy") return;
    setRequest({ phase: "busy" });
    try {
      const res = await fetch("/api/aicm/request-access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) setRequest({ phase: "done" });
      else setRequest({ phase: "error", msg: json.error ?? "Couldn't send that." });
    } catch {
      setRequest({ phase: "error", msg: "Couldn't reach the server." });
    }
  };

  const field =
    "w-full h-11 rounded-xl border border-black/10 bg-white px-4 text-[15px] text-txt-heading placeholder:text-txt-secondary outline-none transition-shadow focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)] disabled:opacity-60";
  const button =
    "h-11 shrink-0 rounded-xl bg-txt-heading px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40";

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[440px] px-6 py-16 md:py-24">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[14px] text-txt-secondary transition-colors hover:text-txt-heading"
          >
            <span>←</span>
            Home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.05 }}
          className="mt-10"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-[12px] text-txt-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5B3FD9]" />
            Private beta
          </div>
          <h1 className="font-serif text-[36px] leading-[1.1] tracking-[-0.01em] text-txt-heading">
            AI Content Machine
          </h1>
          <p className="mt-3 text-[16px] leading-[1.5] text-txt-primary">
            Ultra-realistic AI images, video and reels from one dashboard, across
            27 providers. It&apos;s live, and it&apos;s behind a door.
          </p>
        </motion.div>

        <motion.form
          onSubmit={onUnlock}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
          className="mt-10"
        >
          <label htmlFor="aicm-password" className="mb-2 block text-[13px] font-medium text-txt-heading">
            Have the password?
          </label>
          <div className="flex gap-2">
            <input
              id="aicm-password"
              type="password"
              autoComplete="off"
              className={field}
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (unlock.phase === "error") setUnlock({ phase: "idle" }); }}
              disabled={unlock.phase === "busy" || unlock.phase === "done"}
            />
            <button type="submit" className={button} disabled={!password.trim() || unlock.phase === "busy" || unlock.phase === "done"}>
              {unlock.phase === "busy" ? "Checking…" : unlock.phase === "done" ? "Opening…" : "Enter"}
            </button>
          </div>
          <div className="mt-2 min-h-[20px] text-[13px] text-txt-secondary" aria-live="polite">
            {unlock.phase === "error" && unlock.msg}
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.15 }}
          className="mt-8 border-t border-black/[0.06] pt-8"
        >
          <form onSubmit={onRequest}>
            <label htmlFor="aicm-email" className="mb-1 block text-[13px] font-medium text-txt-heading">
              Request access
            </label>
            <p className="mb-3 text-[13px] leading-[1.5] text-txt-secondary">
              Leave your email and I&apos;ll send you the password.
            </p>
            {request.phase === "done" ? (
              <div className="rounded-xl border border-black/10 bg-surface px-4 py-3 text-[14px] text-txt-heading">
                Got it — I&apos;ll send the password to <span className="font-medium">{email.trim()}</span>.
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    id="aicm-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    className={field}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (request.phase === "error") setRequest({ phase: "idle" }); }}
                    disabled={request.phase === "busy"}
                  />
                  <button type="submit" className={button} disabled={!email.trim() || request.phase === "busy"}>
                    {request.phase === "busy" ? "Sending…" : "Request"}
                  </button>
                </div>
                <div className="mt-2 min-h-[20px] text-[13px] text-txt-secondary" aria-live="polite">
                  {request.phase === "error" && request.msg}
                </div>
              </>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
