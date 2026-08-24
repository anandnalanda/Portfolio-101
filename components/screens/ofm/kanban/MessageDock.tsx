"use client";

/* d3 — "The conversation lives on the board." The leak began at messaging, so
   the talking moves ONTO the card. A fake cursor clicks a candidate's "Message"
   action and a compact chat widget pops up (Etsy-style floating card, Mobbin
   ref) over the board — the board stays visible, the point being it never left.
   The WHOLE exchange plays from empty: the employer types + sends, Sarah types
   + replies, the employer types + sends again. Beside the candidate, on the
   board. The highlight frame spotlights the chat box. OFM system throughout. */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Image as ImageIcon, Sparkle, X } from "lucide-react";
import AccentFrame from "@/components/screens/ofm/AccentFrame";

const EASE = [0.22, 1, 0.36, 1] as const;
type Pt = { x: number; y: number };
type Msg = { from: "you" | "sarah"; text: string; sent?: boolean };

const dp = (id: string) =>
  `https://images.unsplash.com/${id}?w=72&h=72&fit=crop&crop=faces&auto=format&q=80`;
const SARAH = dp("photo-1494790108377-be9c29b29330");

const MSG1 = "Hi Sarah! Impressed by your work. Open to a quick call this week?";
const REPLY = "Yes, I'd love to! Thursday afternoon works great.";
const MSG2 = "Perfect, I'll send a calendar invite for 2pm Thursday.";

function Cursor({ entry, target, pressed }: { entry: Pt; target: Pt; pressed: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 z-40"
      initial={{ x: entry.x, y: entry.y, opacity: 0 }}
      animate={{ x: target.x, y: target.y, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.75, ease: EASE, opacity: { duration: 0.3 } }}
    >
      {pressed && (
        <motion.span
          className="absolute -left-1.5 -top-1.5 block size-7 rounded-full bg-ofm-500/25"
          initial={{ scale: 0, opacity: 0.7 }}
          animate={{ scale: 1.7, opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      )}
      <motion.svg
        width="22"
        height="22"
        viewBox="0 0 20 20"
        fill="none"
        animate={{ scale: pressed ? 0.82 : 1 }}
        transition={{ duration: 0.12 }}
        style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.25))" }}
      >
        <path
          d="M3 2 L3 16.5 L6.8 12.9 L9.2 18.2 L11.6 17.1 L9.2 11.9 L14.4 11.9 Z"
          fill="#18181b"
          stroke="#ffffff"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.div>
  );
}

function Typing() {
  return (
    <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-md bg-zinc-100 px-3.5 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-zinc-400"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </div>
  );
}

function Bubble({ from, text, sent = false }: Msg) {
  const you = from === "you";
  return (
    <div className={`flex flex-col gap-1 ${you ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-ofm-body leading-snug ${
          you
            ? "rounded-br-md bg-ofm-600 text-white"
            : "rounded-bl-md bg-zinc-100 text-zinc-800"
        }`}
      >
        {text}
      </div>
      <span className="px-1 text-ofm-micro text-zinc-400">
        {you ? "You" : "Sarah"} · Just now{you && sent ? " · Sent" : ""}
      </span>
    </div>
  );
}

export default function MessageDock() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [trigger, setTrigger] = useState<Pt | null>(null);
  const [inputPt, setInputPt] = useState<Pt | null>(null);
  const [sendPt, setSendPt] = useState<Pt | null>(null);
  const [phase, setPhase] = useState<"trigger" | "input" | "send" | "idle">(
    "trigger",
  );
  const [pressed, setPressed] = useState(false);
  const [open, setOpen] = useState(false);
  const [frame, setFrame] = useState(false);
  const [typed, setTyped] = useState("");
  const [sarahTyping, setSarahTyping] = useState(false);
  const [thread, setThread] = useState<Msg[]>([]);
  const [done, setDone] = useState(false);

  const measure = (sel: string): Pt | null => {
    const canvas = rootRef.current?.closest("[data-stage-canvas]");
    const el = canvas?.querySelector(sel);
    if (!canvas || !el) return null;
    const c = canvas.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    const s = c.width / 1440 || 1;
    return {
      x: (b.left + b.width / 2 - c.left) / s,
      y: (b.top + b.height / 2 - c.top) / s,
    };
  };

  useLayoutEffect(() => {
    setTrigger(measure("[data-message-trigger]"));
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setOpen(true);
      setFrame(true);
      setThread([
        { from: "you", text: MSG1, sent: true },
        { from: "sarah", text: REPLY },
        { from: "you", text: MSG2, sent: true },
      ]);
      setDone(true);
      return;
    }
    const t: ReturnType<typeof setTimeout>[] = [];
    const type = (msg: string, start: number, step = 26) => {
      for (let i = 0; i < msg.length; i++) {
        t.push(setTimeout(() => setTyped(msg.slice(0, i + 1)), start + i * step));
      }
      return start + msg.length * step;
    };

    // open + spotlight
    t.push(setTimeout(() => setPressed(true), 1200)); // click Message
    t.push(setTimeout(() => setPressed(false), 1360));
    t.push(setTimeout(() => setOpen(true), 1450));
    t.push(setTimeout(() => setFrame(true), 1950));

    // 1 — employer types + sends the first message
    t.push(
      setTimeout(() => {
        setInputPt(measure("[data-composer]"));
        setSendPt(measure("[data-send]"));
        setPhase("input");
      }, 1900),
    );
    const t1End = type(MSG1, 2400);
    t.push(setTimeout(() => setPhase("send"), t1End + 200));
    t.push(setTimeout(() => setPressed(true), t1End + 850));
    t.push(
      setTimeout(() => {
        setPressed(false);
        setThread([{ from: "you", text: MSG1, sent: true }]);
        setTyped("");
        setPhase("idle");
      }, t1End + 970),
    );

    // 2 — Sarah types + replies
    t.push(setTimeout(() => setSarahTyping(true), t1End + 1500));
    t.push(
      setTimeout(() => {
        setSarahTyping(false);
        setThread((p) => [...p, { from: "sarah", text: REPLY }]);
      }, t1End + 2900),
    );

    // 3 — employer types + sends the follow-up
    const t2Start = t1End + 3400;
    t.push(setTimeout(() => setPhase("input"), t2Start - 300));
    const t2End = type(MSG2, t2Start);
    t.push(setTimeout(() => setPhase("send"), t2End + 200));
    t.push(setTimeout(() => setPressed(true), t2End + 850));
    t.push(
      setTimeout(() => {
        setPressed(false);
        setThread((p) => [...p, { from: "you", text: MSG2, sent: true }]);
        setTyped("");
        setDone(true);
      }, t2End + 970),
    );

    return () => t.forEach((x) => clearTimeout(x));
  }, [reduceMotion]);

  const target =
    phase === "send" && sendPt
      ? sendPt
      : phase === "input" && inputPt
        ? inputPt
        : phase === "idle" && sendPt
          ? sendPt
          : trigger;
  const entry = trigger ? { x: trigger.x - 40, y: trigger.y + 150 } : null;
  const focused = (phase === "input" || phase === "send") && !done;
  const hasThread = thread.length > 0 || sarahTyping;

  return (
    <motion.div
      ref={rootRef}
      className="kibo absolute inset-0 z-30"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {open && (
        <div className="absolute bottom-4 right-5 flex items-end">
          {/* the conversation — Sarah, spotlighted by the highlight frame */}
          <div className="relative">
            <motion.div
              className="flex h-[512px] w-[368px] flex-col overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-[0_24px_70px_-15px_rgba(0,0,0,0.3)]"
              initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
            >
              {/* header — candidate + AI score, so the chat is tied to who it's about */}
              <div className="flex items-center gap-2.5 border-b border-zinc-200/70 px-4 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={SARAH}
                  alt="Sarah Chen"
                  className="size-9 shrink-0 rounded-full bg-zinc-100 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-ofm-body font-semibold text-zinc-900">
                    Sarah Chen
                  </p>
                  <p className="truncate text-ofm-caption text-zinc-500">
                    Senior Chatter
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-0.5 rounded-md bg-ofm-900 py-0.5 pl-1 pr-1.5 text-ofm-label font-bold tabular-nums text-white">
                  <Sparkle className="size-2.5" strokeWidth={2.5} />
                  92
                </span>
                <button className="flex size-7 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600">
                  <X className="size-4" strokeWidth={2} />
                </button>
              </div>

              {/* thread — builds from empty */}
              <div className="flex flex-1 flex-col justify-end gap-2.5 overflow-y-auto px-4 py-4">
                {hasThread && (
                  <div className="text-center text-ofm-micro text-zinc-400">
                    Today
                  </div>
                )}
                {thread.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <Bubble from={m.from} text={m.text} sent={m.sent} />
                  </motion.div>
                ))}
                {sarahTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Typing />
                  </motion.div>
                )}
              </div>

              {/* composer — grows as the message wraps */}
              <div className="flex items-end gap-2 border-t border-zinc-200/70 px-3 py-3">
                <div
                  data-composer
                  className={`flex flex-1 items-end gap-2 rounded-xl border px-3 py-2 transition-colors ${
                    focused ? "border-ofm-400 ring-2 ring-ofm-100" : "border-zinc-200/70"
                  }`}
                >
                  <div className="min-w-0 flex-1 text-ofm-body leading-snug">
                    {typed ? (
                      <span className="whitespace-pre-wrap break-words text-zinc-700">
                        {typed}
                        <span className="ml-px inline-block h-[15px] w-px translate-y-[3px] bg-ofm-600 align-baseline" />
                      </span>
                    ) : (
                      <span className="text-zinc-400">Write a message</span>
                    )}
                  </div>
                  <ImageIcon className="mb-0.5 size-4 shrink-0 text-zinc-400" strokeWidth={2} />
                </div>
                <button
                  data-send
                  className="mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-ofm-600 text-white transition-colors hover:bg-ofm-700"
                >
                  <ArrowUp className="size-4" strokeWidth={2.4} />
                </button>
              </div>
            </motion.div>
            {frame && (
              <AccentFrame
                inset="-4px"
                radius={20}
                enter={{ x: -520, y: 0 }}
                enterTransition={{
                  type: "spring",
                  stiffness: 170,
                  damping: 24,
                  mass: 1,
                  opacity: { duration: 0.3, ease: "easeOut" },
                }}
              />
            )}
          </div>
        </div>
      )}

      {!reduceMotion && trigger && entry && target && !done && (
        <Cursor entry={entry} target={target} pressed={pressed} />
      )}
    </motion.div>
  );
}
