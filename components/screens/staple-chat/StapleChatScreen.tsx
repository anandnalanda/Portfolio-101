"use client";

/**
 * StapleChatScreen - the Staple Chat data-analysis UI, built with the genuine
 * Untitled UI React library (vendored Button/Badge components + React Aria),
 * @untitledui/icons, and Untitled UI's design tokens.
 *
 * Styling comes from `ui.generated.css`, compiled by the isolated Tailwind v4
 * toolchain in /tools/staple-ui and scoped entirely under `.staple-theme`, so
 * none of it touches the rest of the (Tailwind v3) site. Utilities therefore
 * resolve as `.staple-theme .flex` - i.e. only on DESCENDANTS of the wrapper -
 * so the root element itself is laid out via inline style using the folded
 * design tokens (the ONE sanctioned inline-style usage in this file).
 *
 * Design-system rules enforced here:
 *  - Colors come ONLY from Untitled UI tokens (bg-brand-*, text-*, border-*).
 *  - Every interactive control is the vendored uui <Button>.
 *  - Every icon is from @untitledui/icons.
 *  - Arbitrary values are allowed for LAYOUT dimensions only (panel widths,
 *    content max-widths), never for color or type scale.
 *
 * NOTE: after adding any NEW Tailwind class here, regenerate the scoped CSS:
 *   cd tools/staple-ui && npm run build
 */
import "../_ui/ui.generated.css";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Inter, Playfair_Display } from "next/font/google";
import {
  ArrowUp,
  Bell01,
  BookOpen01,
  Check,
  ChevronDown,
  ChevronRight,
  ClockRewind,
  Copy01,
  CornerDownRight,
  Download01,
  DotsVertical,
  HelpCircle,
  LineChartUp03,
  List,
  Loading02,
  MessageChatCircle,
  Paperclip,
  Plus,
  Recording02,
  Rows02,
  SearchLg,
  Settings01,
  Stop,
  XClose,
} from "@untitledui/icons";
import { Button } from "../_ui/uui/button";
import { BadgeWithIcon } from "../_ui/uui/badges";
import { Input } from "../_ui/uui/input";
import { Tabs, TabList, Tab } from "../_ui/uui/tabs";
import { Avatar } from "../_ui/uui/avatar";
import type { IconComponentType } from "../_ui/uui/badge-types";
import { cx } from "../_ui/uui/utils/cx";
import {
  conversation,
  dataSources,
  followUps,
  starterChips,
  voiceAnswer,
  voiceQuestion,
  type ChartBar,
  type ChatMessage,
} from "./data";

// Four Fingers Invoices scenario
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

/* Hide the pinned follow-up row (used mid-sequence, before the answer). */
const EMPTY_FOLLOW_UPS: string[] = [];

/* Placeholder for the General Instructions field — shows the shape of what a
   user might type (plain, markdown-friendly), themed to the Four Fingers
   scenario. */
const INSTRUCTIONS_PLACEHOLDER = `Examples:
FF stands for Four Fingers.

- Treat any review below 3 stars as negative.
- Report revenue net of returns and taxes unless asked otherwise.
- When someone asks about "performance", they mean net sales.

(You can use markdown text)`;

/* The blank-canvas greeting only: a luxury serif moment in an otherwise
   utilitarian screen — the one place the product says hello. */
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

/* Mercor-style left rail - Staple's product sections */
const railItems: { label: string; icon: IconComponentType; active?: boolean }[] = [
  { label: "Analytics", icon: LineChartUp03 },
  { label: "Search", icon: SearchLg },
  { label: "Extract", icon: Copy01 },
  { label: "Models", icon: List },
  { label: "Matching", icon: Rows02 },
  { label: "AI Chat", icon: MessageChatCircle, active: true },
];

export default function StapleChatScreen({
  /* Case-study affordances (Staple Chat scrollytelling). All optional —
     defaults reproduce the full resting screen used everywhere else.
     Inline-styled where styling is new, on purpose: no new Tailwind classes,
     so no ui.generated.css rebuild needed. */
  highlightComposer = false,
  /* Which thread to show; defaults to the full demo conversation. */
  messages = conversation,
  /* Follow-up chips to pair with the thread. */
  followUpItems = followUps,
  /* When set, drives the Data/Instructions/Settings panel open/closed as the
     prop changes (the width animation plays). The Configure button still
     toggles it freely in between. */
  configurePanel,
  /* Single accent frame around the first answer's Thinking drawer
     (case study beat "d2": the plain-English interpretation IS the point). */
  highlightThinking = false,
  /* Drives the first answer's reasoning drawer open (steps visible). All
     drawers default collapsed and stay clickable either way. */
  reasoningExpanded,
  /* Single accent frame around the inline chart (case study beat "d3"). */
  highlightChart = false,
  /* Single accent frame around the uploaded-sources list in the data panel
     (case study beat "d4": the depth is your own data, one click away). */
  highlightSources = false,
  /* Blank-canvas beat ("d5"). "empty": bare chat, red problem frame on the
     input. "chips": starter chips under the input, accent frame on them.
     "chips-quiet": chips with NO highlight (the neutral flow walkthrough).
     "sequence": plays empty, then resolves into chips automatically. */
  blankCanvas,
  /* Resting scroll position for states whose subject sits at the thread's
     end (the flow walkthrough's chart step). No choreography — the screen
     simply rests scrolled to the bottom. */
  restScroll,
  /* Full-flow walkthrough (stepped, not scroll-driven). Which panel tab is
     shown. */
  panelTab = "data",
  /* Walkthrough step 1 — the genuine cold start: no data connected, empty
     conversation. Distinct from blankCanvas (which HAS data connected). */
  idle = false,
  /* Walkthrough step 2 — the connect-data modal overlay. */
  connectModal = false,
  /* Voice beat (12) — the same product in a new input mode. "listening":
     the composer is live with waveform + transcript. "answer": the spoken
     exchange sits in the thread with the playback indicator. "sequence":
     plays idle → listening → answer automatically. */
  voice,
  /* Combined ask→answer beat: plays the full round-trip automatically —
     the question is sent, the assistant processes (Thinking…), then the
     answer reveals (reasoning drawer expands, prose + table appear).
     Expects `messages` = [userQuestion, assistantAnswer]. */
  answerSequence = false,
  /* "Logic, set once" beat — the configure panel slides IN from the right
     (with the given panelTab selected) shortly after mount. */
  panelReveal = false,
}: {
  highlightComposer?: boolean;
  messages?: ChatMessage[];
  followUpItems?: string[];
  configurePanel?: boolean;
  highlightThinking?: boolean;
  reasoningExpanded?: boolean;
  highlightChart?: boolean;
  highlightSources?: boolean;
  blankCanvas?: "empty" | "chips" | "chips-quiet" | "sequence";
  restScroll?: "bottom" | "reveal";
  panelTab?: "data" | "instructions" | "settings";
  idle?: boolean;
  connectModal?: boolean;
  voice?: "listening" | "answer" | "sequence";
  answerSequence?: boolean;
  panelReveal?: boolean;
} = {}) {
  const reduceMotion = useReducedMotion();
  /* The Data/Instructions/Settings panel: open on landing (the ideal resting
     state), toggled by Configure, closed via Configure again or the ✕. When
     panelReveal is set it starts CLOSED and slides open after mount. */
  const [configureOpen, setConfigureOpen] = useState(
    panelReveal ? false : configurePanel ?? true
  );
  useEffect(() => {
    if (panelReveal) return; // panelReveal drives open/close itself
    if (configurePanel !== undefined) setConfigureOpen(configurePanel);
  }, [configurePanel, panelReveal]);
  useEffect(() => {
    if (!panelReveal) return;
    setConfigureOpen(false);
    const t = setTimeout(() => setConfigureOpen(true), reduceMotion ? 0 : 450);
    return () => clearTimeout(t);
  }, [panelReveal, reduceMotion]);

  /* Highlight + scroll choreography for the reasoning beat. The expanded
     drawer pushes the answer down; on short panels the category table would
     clip after one row, which reads as a bug. And the highlight must never
     spring at a moving target (that reads as a jump). So the sequence is:
     1. drawer opens (350ms) — highlight holds on the composer;
     2. if the conversation overflows, scroll so the DRAWER pins to the top
        of the view — it (and its highlight) must stay visible, and pinning
        it there leaves room for several table rows below (the visible
        reconciliation);
     3. only then release the highlight for one clean flight to a target
        that is now fully settled. Leaving the beat scrolls back to top. */
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [drawerSettled, setDrawerSettled] = useState(false);
  useEffect(() => {
    const el = chatScrollRef.current;
    if (!(highlightThinking && reasoningExpanded)) {
      setDrawerSettled(false);
      el?.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      return;
    }
    /* The drawer's offsetTop (distance from the top of the scroll content)
       is constant: its own expansion only grows content BELOW it, so the
       target can be computed up front. offsetTop is transform-safe inside
       the scaled canvas; the container is position:relative so the drawer's
       offsetParent chain resolves to it. */
    const drawerTop = () => {
      const drawer = el?.querySelector<HTMLElement>("[data-thinking-drawer]");
      let top = 0;
      for (
        let node = drawer;
        node && node !== el;
        node = node.offsetParent as HTMLElement | null
      ) {
        top += node.offsetTop;
      }
      return Math.max(0, top - 14);
    };
    const timers: ReturnType<typeof setTimeout>[] = [];
    let raf = 0;
    if (reduceMotion) {
      timers.push(
        setTimeout(() => {
          if (el && el.scrollHeight > el.clientHeight + 4) {
            el.scrollTo({ top: drawerTop(), behavior: "auto" });
          }
          setDrawerSettled(true);
        }, 60)
      );
      return () => timers.forEach(clearTimeout);
    }
    /* Scroll IN LOCKSTEP with the drawer's 350ms height animation: a manual
       tween that clamps to the growing scroll range every frame. The bubble
       above slides out while the drawer expands, so the thread makes ONE
       motion; a delayed native scroll here would read as a down-then-up
       bounce. The highlight is released only after both settle. */
    timers.push(
      setTimeout(() => {
        if (!el) return;
        const target = drawerTop();
        const t0 = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / 380);
          const eased = 1 - Math.pow(1 - p, 3);
          const max = Math.max(0, el.scrollHeight - el.clientHeight);
          el.scrollTop = Math.min(target * eased, max);
          if (p < 1) {
            raf = requestAnimationFrame(step);
          } else {
            timers.push(setTimeout(() => setDrawerSettled(true), 130));
          }
        };
        raf = requestAnimationFrame(step);
      }, 60)
    );
    return () => {
      timers.forEach(clearTimeout);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [highlightThinking, reasoningExpanded, reduceMotion]);
  /* Reveal beat (d1): the frame INTRODUCES the product by moving. It
     arrives around the whole screen, holds a beat, then flies down and
     tightens onto the composer: "chat is the entire product" in one
     gesture. Skipped when arriving FROM the reasoning beat (the frame
     already flies drawer → composer there) and under reduced motion
     (static frame on the composer). */
  const prevHighlightRef = useRef<
    "none" | "composer" | "thinking" | "chart" | "sources"
  >("none");
  const [revealFrameOnComposer, setRevealFrameOnComposer] = useState(false);
  useEffect(() => {
    if (!highlightComposer) {
      setRevealFrameOnComposer(false);
      return;
    }
    if (reduceMotion || prevHighlightRef.current === "thinking") {
      setRevealFrameOnComposer(true);
      return;
    }
    setRevealFrameOnComposer(false);
    const t = setTimeout(() => setRevealFrameOnComposer(true), 650);
    return () => clearTimeout(t);
  }, [highlightComposer, reduceMotion]);

  const composerHighlightOn =
    (highlightComposer && revealFrameOnComposer) ||
    (highlightThinking && !drawerSettled);

  /* Chart beat choreography (d2 → d3): the thread visibly SCROLLS down to
     the continuing exchange — a controlled tween, mirroring the reader's
     own scrolling — while the frame holds on the (collapsing) drawer. Once
     the scroll settles it flies to the chart in one spring. The chart box
     is fixed-height, so animating bars never shift the scroll. */
  const [chartSettled, setChartSettled] = useState(false);
  useEffect(() => {
    const el = chatScrollRef.current;
    let raf = 0;
    if (!highlightChart) {
      setChartSettled(false);
      /* Keep the conversation still when handing off to the panel beat —
         the thread (with the chart) stays calmly in place beside the
         opening panel. */
      if (!highlightSources) {
        el?.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      }
      return;
    }
    /* Returning from the panel beat: no scroll choreography, the frame just
       flies straight back. The closing panel reflows the chat column for
       ~500ms (it widens, text rewraps), so HOLD the thread pinned to the
       bottom through the whole animation or the chart drifts into a cut. */
    if (prevHighlightRef.current === "sources") {
      setChartSettled(true);
      if (!el) return;
      const t0 = performance.now();
      const pin = (now: number) => {
        el.scrollTop = Math.max(0, el.scrollHeight - el.clientHeight);
        if (now - t0 < (reduceMotion ? 80 : 750)) {
          raf = requestAnimationFrame(pin);
        }
      };
      raf = requestAnimationFrame(pin);
      return () => cancelAnimationFrame(raf);
    }
    if (reduceMotion) {
      const t = setTimeout(() => {
        el?.scrollTo({ top: el.scrollHeight, behavior: "auto" });
        setChartSettled(true);
      }, 60);
      return () => clearTimeout(t);
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(
      setTimeout(() => {
        if (!el) return;
        const from = el.scrollTop;
        const t0 = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / 600);
          const eased = 1 - Math.pow(1 - p, 3);
          /* Recompute the target every frame: the new exchange is still
             playing its entrance while we scroll. */
          const target = Math.max(0, el.scrollHeight - el.clientHeight);
          el.scrollTop = from + (target - from) * eased;
          if (p < 1) {
            raf = requestAnimationFrame(step);
          } else {
            timers.push(
              setTimeout(() => {
                /* Hard-pin: the chart must rest at the VERY bottom even if
                   late layout nudged the scroll range after the tween. */
                el.scrollTop = Math.max(0, el.scrollHeight - el.clientHeight);
                setChartSettled(true);
              }, 150)
            );
          }
        };
        raf = requestAnimationFrame(step);
      }, 150)
    );
    return () => {
      timers.forEach(clearTimeout);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [highlightChart, highlightSources, reduceMotion]);

  const thinkingHighlightOn =
    (highlightThinking && drawerSettled) ||
    /* d2 → d3 handoff: the frame stays on the drawer during the scroll,
       so its release to the chart reads as one continuous flight. */
    (highlightChart && !chartSettled && !reduceMotion);

  /* Panel beat (d4): the panel slides open (500ms) onto the Data tab and
     its source rows stagger in; the highlight then lands around the
     uploaded-sources list — the depth is your own data, one click away. */
  const panelBodyRef = useRef<HTMLDivElement>(null);
  const [panelSettled, setPanelSettled] = useState(false);
  useEffect(() => {
    if (!highlightSources) {
      setPanelSettled(false);
      panelBodyRef.current?.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    /* The thread must rest at the chart (very bottom) beside the panel.
       The panel's width animation reflows the chat column for ~500ms (it
       narrows, text rewraps, the thread grows), so pin to the bottom every
       frame until the layout settles — a single scroll would drift off
       and leave the chart cut. */
    const chat = chatScrollRef.current;
    let raf = 0;
    if (chat) {
      const t0 = performance.now();
      const pin = (now: number) => {
        chat.scrollTop = Math.max(0, chat.scrollHeight - chat.clientHeight);
        if (now - t0 < (reduceMotion ? 80 : 800)) {
          raf = requestAnimationFrame(pin);
        }
      };
      raf = requestAnimationFrame(pin);
    }
    const t = setTimeout(() => setPanelSettled(true), reduceMotion ? 60 : 1050);
    return () => {
      clearTimeout(t);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [highlightSources, reduceMotion]);

  /* d3 → d4 handoff: the frame HOLDS on the chart while the panel slides in
     from the right, then flies onto the whole panel in one spring. */
  const chartHighlightOn =
    (highlightChart && chartSettled) ||
    (highlightSources && !panelSettled && !reduceMotion);

  /* Blank-canvas beat: the empty input is the problem (red frame); the
     chips are the fix (accent frame). "sequence" holds on the problem, then
     resolves — the two highlights cross-fade rather than jump-cutting. */
  const [canvasPhase, setCanvasPhase] = useState<"empty" | "chips">(
    blankCanvas === "chips" || blankCanvas === "chips-quiet" ? "chips" : "empty"
  );
  useEffect(() => {
    if (!blankCanvas || blankCanvas === "empty") {
      setCanvasPhase("empty");
      return;
    }
    if (blankCanvas === "chips" || blankCanvas === "chips-quiet") {
      setCanvasPhase("chips");
      return;
    }
    const t = setTimeout(
      () => setCanvasPhase("chips"),
      reduceMotion ? 60 : 1700
    );
    return () => clearTimeout(t);
  }, [blankCanvas, reduceMotion]);

  const [chipsSettled, setChipsSettled] = useState(false);
  useEffect(() => {
    if (!(blankCanvas && canvasPhase === "chips")) {
      setChipsSettled(false);
      return;
    }
    const t = setTimeout(() => setChipsSettled(true), reduceMotion ? 60 : 650);
    return () => clearTimeout(t);
  }, [blankCanvas, canvasPhase, reduceMotion]);
  const chipsHighlightOn =
    !!blankCanvas &&
    blankCanvas !== "chips-quiet" &&
    canvasPhase === "chips" &&
    chipsSettled;

  /* d4 → d5 handoff: entering the blank canvas from the panel beat, the
     frame HOLDS on the (still open) panel while the chips arrive, then
     flies onto them — the highlight ARRIVES with movement rather than
     simply appearing. Latched at entry so mid-beat re-renders can't
     retrigger it. */
  const [panelHoldForChips, setPanelHoldForChips] = useState(false);
  useEffect(() => {
    if (!blankCanvas || blankCanvas === "chips-quiet") {
      setPanelHoldForChips(false);
      return;
    }
    if (prevHighlightRef.current === "sources" && !reduceMotion) {
      setPanelHoldForChips(true);
    }
  }, [blankCanvas, reduceMotion]);

  const sourcesHighlightOn =
    (highlightSources && panelSettled) ||
    (panelHoldForChips && !chipsHighlightOn);

  /* Which target held the highlight last render — read by the reveal, chart,
     and chips choreographies to choose a flight over a fresh entrance. Runs
     AFTER every choreography effect, so during a transition commit those
     effects still see the previous render's value. */
  useEffect(() => {
    prevHighlightRef.current = highlightThinking
      ? "thinking"
      : highlightComposer
      ? "composer"
      : highlightSources
      ? "sources"
      : highlightChart
      ? "chart"
      : "none";
  });

  /* Resting scroll. "bottom": land at the thread's end instantly (the
     cross-fade covers the jump). "reveal": the thread continues — start up
     at the prior answer, then smoothly scroll down to the new follow-up and
     chart while its bars animate in, so the reader watches it keep going. */
  useEffect(() => {
    if (!restScroll) return;
    const el = chatScrollRef.current;
    if (!el) return;
    if (restScroll === "bottom" || reduceMotion) {
      const t = setTimeout(
        () => el.scrollTo({ top: el.scrollHeight, behavior: "auto" }),
        60
      );
      return () => clearTimeout(t);
    }
    // reveal: hold near the previous answer, then tween down to the chart.
    el.scrollTop = 0;
    let raf = 0;
    const start = setTimeout(() => {
      const from = el.scrollTop;
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / 1100);
        const eased = 1 - Math.pow(1 - p, 3);
        const target = Math.max(0, el.scrollHeight - el.clientHeight);
        el.scrollTop = from + (target - from) * eased;
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, 500);
    return () => {
      clearTimeout(start);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [restScroll, reduceMotion]);

  /* Voice beat (12): the composer comes alive. "sequence" plays idle →
     listening (the input morphs, the transcript builds) → answer (the spoken
     exchange lands in the thread, playback indicator on). One highlight at a
     time: the live input while listening, the speaking row on the answer. */
  const [voicePhase, setVoicePhase] = useState<"idle" | "listening" | "answer">(
    voice === "listening" || voice === "answer" ? voice : "idle"
  );
  useEffect(() => {
    if (!voice) {
      setVoicePhase("idle");
      return;
    }
    if (voice !== "sequence") {
      setVoicePhase(voice);
      return;
    }
    setVoicePhase("idle");
    const timers = [
      setTimeout(() => setVoicePhase("listening"), reduceMotion ? 60 : 700),
      setTimeout(() => setVoicePhase("answer"), reduceMotion ? 2400 : 4600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [voice, reduceMotion]);

  /* Live transcription, word by word — as if being spoken. Reduced motion:
     the full question appears at once. */
  const voiceWords = voiceQuestion.split(" ");
  const [voiceWordCount, setVoiceWordCount] = useState(0);
  useEffect(() => {
    if (voicePhase !== "listening") {
      setVoiceWordCount(voicePhase === "answer" ? voiceWords.length : 0);
      return;
    }
    if (reduceMotion) {
      setVoiceWordCount(voiceWords.length);
      return;
    }
    setVoiceWordCount(0);
    const iv = setInterval(
      () => setVoiceWordCount((n) => Math.min(n + 1, voiceWords.length)),
      240
    );
    return () => clearInterval(iv);
  }, [voicePhase, reduceMotion, voiceWords.length]);

  /* Highlight settles on the live input just after it morphs into the
     listening state. (Voice is input-only: you ask out loud, but the answer
     comes back on screen — the product never speaks.) */
  const [voiceSettledA, setVoiceSettledA] = useState(false);
  useEffect(() => {
    if (voicePhase !== "listening") {
      setVoiceSettledA(false);
      return;
    }
    const t = setTimeout(() => setVoiceSettledA(true), reduceMotion ? 0 : 350);
    return () => clearTimeout(t);
  }, [voicePhase, reduceMotion]);

  /* The spoken exchange overflows the settled thread — follow it down. */
  useEffect(() => {
    if (voicePhase !== "answer") return;
    const el = chatScrollRef.current;
    const t = setTimeout(
      () =>
        el?.scrollTo({
          top: el.scrollHeight,
          behavior: reduceMotion ? "auto" : "smooth",
        }),
      reduceMotion ? 60 : 180
    );
    return () => clearTimeout(t);
  }, [voicePhase, reduceMotion]);

  /* Combined ask→answer beat, played like a real chat:
       typing   — the question types out in the composer, caret blinking;
       sent     — Enter: the question drops into the thread, composer clears;
       thinking — a spinning loader + animated ellipsis while it processes;
       answer   — the reasoning drawer expands and the answer + table reveal.
     Reduced motion jumps straight to the finished answer. */
  const [answerPhase, setAnswerPhase] = useState<
    "typing" | "sent" | "thinking" | "answer"
  >(answerSequence && !reduceMotion ? "typing" : "answer");
  const askText = answerSequence && messages[0]?.role === "user" ? messages[0].text : "";
  const [typedCount, setTypedCount] = useState(0);
  useEffect(() => {
    if (!answerSequence) return;
    if (reduceMotion) {
      setAnswerPhase("answer");
      setTypedCount(askText.length);
      return;
    }
    setAnswerPhase("typing");
    setTypedCount(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    let i = 0;
    const typeIv = setInterval(() => {
      i += 1;
      setTypedCount(i);
      if (i >= askText.length) {
        clearInterval(typeIv);
        // Enter → the message sends, then the model processes, then answers.
        timers.push(setTimeout(() => setAnswerPhase("sent"), 450));
        timers.push(setTimeout(() => setAnswerPhase("thinking"), 950));
        timers.push(setTimeout(() => setAnswerPhase("answer"), 2600));
      }
    }, 26);
    return () => {
      clearInterval(typeIv);
      timers.forEach(clearTimeout);
    };
  }, [answerSequence, reduceMotion, askText]);
  const composerTyped =
    answerSequence && answerPhase === "typing"
      ? askText.slice(0, typedCount)
      : null;

  /* Once the answer reveals, follow it down so the category table (the
     payoff) sits fully in view above the composer. */
  useEffect(() => {
    if (!answerSequence || answerPhase !== "answer") return;
    const el = chatScrollRef.current;
    const t = setTimeout(
      () =>
        el?.scrollTo({
          top: el.scrollHeight,
          behavior: reduceMotion ? "auto" : "smooth",
        }),
      reduceMotion ? 0 : 700
    );
    return () => clearTimeout(t);
  }, [answerSequence, answerPhase, reduceMotion]);

  /* The thread the beat renders. For the sequence it grows over the phases:
     just the question, then the question + a Thinking placeholder, then the
     full exchange. Elsewhere it's simply `messages`. */
  const threadMessages: ChatMessage[] = (() => {
    if (!answerSequence) return messages;
    const user = messages[0];
    const answer = messages[1];
    // Typing: the thread is empty (the question is still in the composer).
    if (answerPhase === "typing") return [];
    // Sent: the question has dropped into the thread, entering.
    if (answerPhase === "sent") return user ? [{ ...user, entrance: true }] : [];
    if (answerPhase === "thinking") {
      // A Thinking placeholder — no summary yet; `processing` animates it.
      const thinkingOnly: ChatMessage =
        answer && answer.role === "assistant"
          ? { role: "assistant", thinking: answer.thinking, entrance: true }
          : answer;
      return [user, thinkingOnly];
    }
    // answer: full exchange, the answer message plays its entrance.
    return messages.map((m, i) =>
      i === 1 && m.role === "assistant" ? { ...m, entrance: true } : m
    );
  })();

  /* Sequence drives the reasoning drawer + follow-ups by phase. */
  const seqReasoningExpanded = answerSequence
    ? answerPhase === "answer"
    : reasoningExpanded;
  const answerProcessing = answerSequence && answerPhase === "thinking";
  const effectiveFollowUps =
    answerSequence && answerPhase !== "answer" ? EMPTY_FOLLOW_UPS : followUpItems;

  /* Chips fade in last when the chart beat lands; elsewhere they just swap. */
  const hasChart = messages.some((m) => m.role === "assistant" && !!m.chart);

  return (
    <div
      className={cx("staple-theme", inter.variable)}
      style={{
        position: "relative",
        display: "flex",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        background: "var(--color-bg-secondary)",
        color: "var(--color-text-primary)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* ------------------------------ Sidebar ------------------------------ */}
      <ProductSidebar />

      {/* -------------------------------- Main -------------------------------- */}
      <main className="flex h-full min-w-0 flex-1 flex-col bg-primary">
        <TopBar />

        {/* Working area: chat column + slide-in configure panel */}
        <div className="relative flex min-h-0 flex-1 overflow-hidden">
          {/* Chat column */}
          <section className="flex min-w-0 flex-1 flex-col">
            {/* Chat header - title + primary actions (no divider; the top bar
                already separates chrome from content) */}
            <div className="flex items-center gap-3 px-8 pt-6 pb-4">
              <h1 className="text-display-xs font-semibold text-primary">
                Four Fingers Invoices
              </h1>
              <div className="ml-auto flex items-center gap-2">
                <Button color="secondary" size="sm" iconLeading={Plus}>
                  New Chat
                </Button>
                <Button color="secondary" size="sm" iconLeading={ClockRewind}>
                  History
                </Button>
                <Button
                  color="secondary"
                  size="sm"
                  iconLeading={Settings01}
                  aria-expanded={configureOpen}
                  onPress={() => setConfigureOpen((v) => !v)}
                  className={configureOpen ? "bg-secondary" : undefined}
                >
                  Configure
                </Button>
                <Button color="secondary" size="sm" iconLeading={DotsVertical} aria-label="More" />
              </div>
            </div>

            {/* Content region below the header - chat column + configure panel
                side by side; the chat reflows when the panel opens, and the
                header actions (incl. Configure) stay visible. */}
            <div className="flex min-h-0 flex-1 overflow-hidden">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">

            {/* Scrolling conversation */}
            <div
              ref={chatScrollRef}
              className="scrollbar-subtle min-h-0 flex-1 overflow-y-auto overscroll-contain px-8"
              style={{ position: "relative", scrollbarGutter: "stable" }}
            >
              {blankCanvas ? (
                /* New-chat hero — the blank canvas, designed: brand mark, one
                   line of context, and the input centered as the subject. The
                   chips area reserves height so the resolution doesn't
                   re-center the composition. */
                <div className="flex h-full flex-col items-center justify-center">
                  <div className="w-full max-w-[720px] pb-8">
                    {/* Greeting + readiness line. Deliberately NOT an
                        insight: nothing has been asked yet, so the product
                        shows only what's connected (metadata), never a
                        number it would have had to analyze unprompted. */}
                    <div className="flex flex-col items-center">
                      <h2
                        className={`${playfair.className} text-display-sm text-primary`}
                        style={{ fontWeight: 500, letterSpacing: "-0.01em" }}
                      >
                        Good afternoon, Anand
                      </h2>
                      <p className="mt-2 text-center text-md text-tertiary">
                        <span className="font-medium text-primary">
                          10 sources
                        </span>{" "}
                        connected and ready. Ask anything, in plain language.
                      </p>
                    </div>

                    <div className="mt-8 w-full">
                      <ComposerBox
                        frames={
                          /* The problem frame — the only red in Act III.
                             Fades out as the accent settles on the chips. */
                          <motion.div
                            aria-hidden
                            style={{
                              position: "absolute",
                              inset: -7,
                              borderRadius: 22,
                              border: "2px solid var(--color-red-500)",
                              background:
                                "color-mix(in srgb, var(--color-red-500) 3%, transparent)",
                              boxShadow:
                                "0 0 0 4px color-mix(in srgb, var(--color-red-500) 10%, transparent), 0 0 20px color-mix(in srgb, var(--color-red-500) 14%, transparent)",
                              pointerEvents: "none",
                            }}
                            initial={reduceMotion ? false : { opacity: 0 }}
                            animate={{
                              opacity: canvasPhase === "empty" ? 1 : 0,
                            }}
                            transition={
                              reduceMotion
                                ? { duration: 0 }
                                : {
                                    duration:
                                      canvasPhase === "empty" ? 0.35 : 0.45,
                                    delay: canvasPhase === "empty" ? 0.45 : 0,
                                    ease: "easeOut",
                                  }
                            }
                          />
                        }
                      />
                    </div>

                    {/* Starter chips — the resolution. Reserved height keeps
                        the hero stable when they arrive. */}
                    <div
                      className="mt-5 flex w-full justify-center"
                      style={{ minHeight: 56 }}
                    >
                      {canvasPhase === "chips" && (
                        <div style={{ position: "relative", width: "fit-content" }}>
                          {chipsHighlightOn && (
                            <BeatHighlight inset="-8px -10px" radius={18} fadeIn />
                          )}
                          {/* 2-column grid hugs the wrapped chips exactly —
                              a flex-wrap container would size to all-on-one-
                              line width and leave dead space on the sides. */}
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "auto auto",
                              gap: 8,
                              justifyContent: "center",
                            }}
                          >
                            {starterChips.map((chip, ci) => (
                              <motion.span
                                key={chip}
                                className="shrink-0"
                                initial={
                                  reduceMotion ? false : { opacity: 0, y: 6 }
                                }
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.35,
                                  ease: "easeOut",
                                  delay: reduceMotion ? 0 : ci * 0.06,
                                }}
                              >
                                <Button
                                  color="secondary"
                                  size="sm"
                                  iconLeading={CornerDownRight}
                                  className="text-brand-secondary"
                                >
                                  {chip}
                                </Button>
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="mt-6 text-center text-xs text-tertiary">
                      Always review the accuracy of responses.
                    </p>
                  </div>
                </div>
              ) : (
              <div className="flex w-full flex-col gap-7 py-4">
                {threadMessages.map((m, i) =>
                  m.role === "user" ? (
                    <motion.div
                      key={i}
                      className="flex justify-end"
                      initial={
                        m.entrance && !reduceMotion
                          ? { opacity: 0, y: 8 }
                          : false
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
                    >
                      <UserBubble text={m.text} />
                    </motion.div>
                  ) : (
                    <AssistantMessage
                      key={i}
                      message={m}
                      highlightThinking={thinkingHighlightOn && i === 1}
                      reasoningExpanded={i === 1 ? seqReasoningExpanded : undefined}
                      highlightChart={chartHighlightOn && !!m.chart}
                      processing={answerProcessing && i === 1}
                    />
                  )
                )}
                {/* Voice beat, sub-state B: the spoken question has become a
                    real message; the answer renders normally, on screen. Voice
                    is the INPUT — you asked out loud — but the product does not
                    read the answer back aloud. */}
                {voice && voicePhase === "answer" && (
                  <>
                    <motion.div
                      className="flex justify-end"
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      <UserBubble text={voiceQuestion} />
                    </motion.div>
                    <AssistantMessage
                      message={voiceAnswer as Extract<ChatMessage, { role: "assistant" }>}
                    />
                  </>
                )}
              </div>
              )}
            </div>

            {/* Follow-ups + composer (pinned) — hidden on the blank-canvas
                beat, where the composer lives centered in the hero. */}
            {!blankCanvas && (
            <div className="px-8 pt-1 pb-4">
              <div className="w-full">
                {/* Suggested follow-ups — keyed so a new set cross-fades in;
                    on the chart beat they arrive last, after the bars. */}
                {effectiveFollowUps.length > 0 && (
                <motion.div
                  key={effectiveFollowUps[0] ?? "follow-ups"}
                  className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: hasChart && !reduceMotion ? 0.9 : 0,
                  }}
                >
                  {effectiveFollowUps.map((f) => (
                    <Button
                      key={f}
                      color="secondary"
                      size="sm"
                      iconLeading={CornerDownRight}
                      className="shrink-0 text-brand-secondary"
                    >
                      {f}
                    </Button>
                  ))}
                </motion.div>
                )}

                {/* Composer. The case-study highlight travels here via the
                    shared layoutId when a beat targets the input. In voice
                    mode the same box morphs into the listening state. */}
                {voice ? (
                  <VoiceComposer
                    phase={voicePhase}
                    transcript={voiceWords.slice(0, voiceWordCount).join(" ")}
                    highlight={voicePhase === "listening" && voiceSettledA}
                  />
                ) : (
                  <ComposerBox
                    typedText={composerTyped}
                    frames={
                      composerHighlightOn && (
                        <BeatHighlight inset="-7px" radius={22} />
                      )
                    }
                  />
                )}

                <p className="pt-2.5 text-center text-xs text-tertiary">
                  Always review the accuracy of responses.
                </p>
              </div>
            </div>
            )}

            </div>

            {/* Configure panel - in-flow: animates its width so the chat
                column responsively reflows as it slides in from the right */}
            <aside
            className={cx(
              "min-h-0 shrink-0 overflow-hidden transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[width]",
              configureOpen ? "w-[460px]" : "w-0"
            )}
            aria-hidden={!configureOpen}
          >
            {/* Fixed-width inner box so content doesn't squish mid-animation.
                pr-8 matches the header's px-8 so the panel's right edge sits on
                the same line as the kebab / action buttons above it. The 9px
                left padding gives the d4 highlight frame (-7px inset) room —
                the aside's overflow-hidden would otherwise cut its left edge. */}
            <div className="h-full w-[460px] p-4 pl-0 pr-8" style={{ paddingLeft: 9 }}>
            <div style={{ position: "relative", height: "100%" }}>
              {/* Beat "d4": one frame around the ENTIRE panel — tabs, header,
                  and the uploaded-source list. The whole overlay is the
                  subject. Outside the card so its overflow doesn't clip. */}
              {sourcesHighlightOn && <BeatHighlight inset="-7px" radius={22} />}
            <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-secondary bg-primary shadow-sm">
              {/* Tabs */}
              <div className="relative flex items-end border-b border-secondary px-5 pt-4">
                <Tabs selectedKey={panelTab}>
                  <TabList>
                    <Tab id="data">Data</Tab>
                    <Tab id="instructions">Instructions</Tab>
                    <Tab id="settings">Settings</Tab>
                  </TabList>
                </Tabs>
                {/* The tabs bottom-align (their underline sits on the
                    divider), which would drop a normal flex child down to the
                    underline. The ✕ is absolutely pinned to the panel's
                    top-right corner (extreme right), its center landing on the
                    tab TEXT line. */}
                <span className="absolute right-1.5 top-3">
                  <Button
                    color="tertiary"
                    size="sm"
                    iconLeading={XClose}
                    aria-label="Close panel"
                    onPress={() => setConfigureOpen(false)}
                  />
                </span>
              </div>

              {/* Panel body */}
              <div
                ref={panelBodyRef}
                className="scrollbar-subtle min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5"
              >
                {panelTab === "instructions" ? (
                  /* Instructions tab — one free-text field of general
                     instructions the chat respects on every answer. No list,
                     no per-source rules: you just type how it should behave. */
                  <div className="flex h-full flex-col">
                    <h2 className="text-display-xs font-semibold text-primary">
                      General Instructions
                    </h2>
                    <p className="mt-1 text-sm text-tertiary">
                      Add general instructions on how you want the chat to behave.
                    </p>
                    <textarea
                      readOnly
                      spellCheck={false}
                      placeholder={INSTRUCTIONS_PLACEHOLDER}
                      className="scrollbar-subtle mt-5 min-h-0 w-full flex-1 resize-none rounded-xl border border-secondary bg-secondary p-4 font-mono text-sm leading-relaxed text-secondary outline-hidden placeholder:text-quaternary focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand"
                    />
                    <div className="mt-3 flex shrink-0 justify-end">
                      <Button color="primary" size="sm">
                        Save
                      </Button>
                    </div>
                  </div>
                ) : panelTab === "settings" ? (
                  <>
                    <h2 className="text-display-xs font-semibold text-primary">Settings</h2>
                    <p className="mt-1 text-sm text-tertiary">Workspace preferences.</p>
                    <div className="mt-5 flex flex-col">
                      {[
                        ["Workspace", "Four Fingers · Finance"],
                        ["Default currency", "USD ($)"],
                        ["Answer detail", "Show reasoning"],
                        ["Data refresh", "Live"],
                      ].map(([k, v]) => (
                        <div
                          key={k}
                          className="flex items-center justify-between border-b border-secondary py-3 last:border-0"
                        >
                          <span className="text-md text-secondary">{k}</span>
                          <span className="text-md font-medium text-primary">{v}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : idle ? (
                  /* Data tab, cold start — nothing connected yet (step 1). */
                  <div className="flex h-full flex-col items-center justify-center px-4 py-10 text-center">
                    <div className="flex size-12 items-center justify-center rounded-xl border border-secondary bg-secondary text-fg-quaternary">
                      <Rows02 className="size-6" />
                    </div>
                    <h3 className="mt-4 text-md font-semibold text-primary">No data connected</h3>
                    <p className="mt-1 max-w-[240px] text-sm text-tertiary">
                      Connect files and tables to start asking questions of your data.
                    </p>
                    <span className="mt-5">
                      <Button color="primary" size="sm" iconLeading={Plus}>
                        Connect data
                      </Button>
                    </span>
                  </div>
                ) : (
                  /* Data tab — connected sources (default). */
                  <>
                    <div className="flex items-center justify-between">
                      <h2 className="text-display-xs font-semibold text-primary">Data</h2>
                      <Button color="secondary" size="xs" iconLeading={Plus}>
                        Add
                      </Button>
                    </div>
                    <p className="mt-1 text-sm text-tertiary">
                      Link or upload data to discover insights.
                    </p>

                    <table className="mt-5 w-full table-fixed border-collapse text-left">
                      <thead>
                        <tr className="border-b border-secondary">
                          <th className="pb-3 text-sm font-semibold text-tertiary">Name</th>
                          <th className="w-24 pb-3 text-sm font-semibold text-tertiary">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataSources.map((d, i) => (
                          <motion.tr
                            key={i}
                            className="border-b border-secondary last:border-0"
                            initial={false}
                            animate={{ opacity: configureOpen ? 1 : 0 }}
                            transition={{
                              duration: 0.3,
                              delay:
                                configureOpen && !reduceMotion ? 0.2 + i * 0.06 : 0,
                            }}
                          >
                            <td className="py-3 pr-4">
                              <div className="truncate text-md font-medium text-primary">{d.name}</div>
                              <div className="text-sm text-tertiary">{d.sub}</div>
                            </td>
                            <td className="py-3 align-middle text-md text-secondary">{d.type}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>
            </div>
            </div>
            </aside>
            </div>
          </section>
        </div>
      </main>

      {/* Reveal beat, phase 1: the frame arrives as a moderate box over the
          conversation (not hugging the screen edges), holds a beat, then
          flies onto the composer via the shared layoutId (the unmount here
          + mount there is one spring flight). Centered slightly low, biased
          toward where it will land. */}
      {highlightComposer && !revealFrameOnComposer && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "54%",
            width: 660,
            height: 330,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 40,
          }}
        >
          <BeatHighlight inset="0px" radius={24} fadeIn />
        </div>
      )}

      {/* Connect-data modal (walkthrough step 2) — overlays the whole screen */}
      {connectModal && <ConnectDataModal />}
    </div>
  );
}

/* Source catalogs for the Connect-data picker. Each catalog is a folder of
   documents/tables; the reader browses catalogs on the left and picks
   individual files on the right. Pre-checked docs total the same 10 the
   connected state reports, but the Invoices catalog also holds unchecked
   months so search over "lots of documents" has something to do. */
interface CatalogDoc {
  name: string;
  sub: string;
  type: "Document" | "Table";
  checked?: boolean;
}
interface SourceCatalog {
  id: string;
  name: string;
  docs: CatalogDoc[];
}
const SOURCE_CATALOGS: SourceCatalog[] = [
  {
    id: "invoices",
    name: "Invoices",
    docs: [
      { name: "Invoice_FourFingers_FriedChicken_January2023", sub: "finance.invoices", type: "Document", checked: true },
      /* Extracted structured tables live alongside the source PDFs — a
         catalog holds both documents and tables. */
      { name: "invoice_line_items_2023", sub: "finance.invoices", type: "Table", checked: true },
      { name: "supplier_ledger_q1", sub: "finance.payables", type: "Table" },
      { name: "supplier_invoices_q1", sub: "finance.payables", type: "Document" },
      { name: "Invoice_FourFingers_FriedChicken_February2023", sub: "finance.invoices", type: "Document" },
      { name: "Invoice_FourFingers_FriedChicken_March2023", sub: "finance.invoices", type: "Document" },
      { name: "Invoice_FourFingers_FriedChicken_April2023", sub: "finance.invoices", type: "Document" },
      { name: "Invoice_FourFingers_FriedChicken_May2023", sub: "finance.invoices", type: "Document" },
      { name: "Invoice_FourFingers_FriedChicken_June2023", sub: "finance.invoices", type: "Document" },
      { name: "Invoice_FourFingers_FriedChicken_July2023", sub: "finance.invoices", type: "Document" },
      { name: "Invoice_FourFingers_FriedChicken_August2023", sub: "finance.invoices", type: "Document" },
      { name: "Invoice_FourFingers_FriedChicken_September2023", sub: "finance.invoices", type: "Document" },
    ],
  },
  {
    id: "pos",
    name: "POS Transactions",
    docs: [
      { name: "pos_transactions_singapore", sub: "sales.singapore", type: "Table", checked: true },
      { name: "pos_transactions_malaysia", sub: "sales.malaysia", type: "Table", checked: true },
      { name: "pos_transactions_vietnam", sub: "sales.vietnam", type: "Table", checked: true },
      { name: "pos_transactions_thailand", sub: "sales.thailand", type: "Table", checked: true },
    ],
  },
  {
    id: "reports",
    name: "Reports",
    docs: [
      { name: "monthly_pnl_2023", sub: "finance.reports", type: "Table", checked: true },
      { name: "quarterly_pnl_2023", sub: "finance.reports", type: "Table" },
    ],
  },
  {
    id: "reviews",
    name: "Reviews",
    docs: [{ name: "customer_reviews", sub: "marketing.feedback", type: "Table", checked: true }],
  },
  {
    id: "delivery",
    name: "Delivery",
    docs: [{ name: "delivery_orders_grabfood", sub: "sales.delivery", type: "Table", checked: true }],
  },
  {
    id: "ops",
    name: "Operations",
    docs: [{ name: "outlet_master", sub: "ops.locations", type: "Table", checked: true }],
  },
];

const ALL_DOCS = SOURCE_CATALOGS.flatMap((c) => c.docs);

/** A small square checkbox in the product's accent. */
function CheckBox({ checked }: { checked: boolean }) {
  return (
    <span
      className={cx(
        "flex shrink-0 items-center justify-center rounded-md border transition-colors",
        checked ? "border-transparent bg-brand-solid text-white" : "border-primary bg-primary"
      )}
      style={{ width: 18, height: 18 }}
    >
      {checked && <Check className="size-3" />}
    </span>
  );
}

/**
 * ConnectDataModal — the "Add data" overlay: a simple, single-column DRILL-IN
 * picker. The root lists source folders; clicking one (e.g. Invoices) opens
 * its files, where you tick the ones you want; a breadcrumb steps you back.
 * Search spans every folder. Selections persist across folders and a running
 * count sits in the footer. Shared by the chat screen and the Spaces home.
 */
export function ConnectDataModal() {
  const reduceMotion = useReducedMotion();
  // Opens drilled into Invoices — the case study's scenario — so the picker
  // shows real file selection with the breadcrumb back to all catalogs.
  const [openId, setOpenId] = useState<string | null>("invoices");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(ALL_DOCS.filter((d) => d.checked).map((d) => d.name))
  );

  const q = query.trim().toLowerCase();
  const openFolder = SOURCE_CATALOGS.find((c) => c.id === openId) ?? null;
  // What the list shows: search results (across all), an open folder's files,
  // or — at the root — the folders themselves.
  const results = q ? ALL_DOCS.filter((d) => d.name.toLowerCase().includes(q)) : null;
  const docs = results ?? openFolder?.docs ?? null; // null = show folders

  const toggle = (name: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  const selectedIn = (c: SourceCatalog) =>
    c.docs.reduce((n, d) => n + (selected.has(d.name) ? 1 : 0), 0);
  const total = selected.size;
  const allVisibleChecked = !!docs && docs.length > 0 && docs.every((d) => selected.has(d.name));
  const toggleAllVisible = () =>
    setSelected((prev) => {
      if (!docs) return prev;
      const next = new Set(prev);
      if (allVisibleChecked) docs.forEach((d) => next.delete(d.name));
      else docs.forEach((d) => next.add(d.name));
      return next;
    });
  const goRoot = () => {
    setQuery("");
    setOpenId(null);
  };

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Backdrop fades in / out. */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: "color-mix(in srgb, var(--color-text-primary) 45%, transparent)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeOut" }}
      />
      {/* Card lifts and scales in — the dialog "arrives" over the spaces. */}
      <motion.div
        className="relative flex flex-col overflow-hidden rounded-2xl border border-secondary bg-primary shadow-lg"
        style={{ width: 660, height: 680, maxHeight: "90%" }}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
        transition={{
          duration: reduceMotion ? 0 : 0.34,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-secondary px-6 py-5">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-primary">Connect your data</h3>
            <p className="mt-1 text-sm text-tertiary">
              Pick the documents and tables to analyze. You can add more later.
            </p>
          </div>
          <span className="-mr-2">
            <Button color="tertiary" size="sm" iconLeading={XClose} aria-label="Close" />
          </span>
        </div>

        {/* Search across every folder */}
        <div className="border-b border-secondary px-6 py-3">
          <Input
            icon={SearchLg}
            placeholder="Search files and tables…"
            aria-label="Search files and tables"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Breadcrumb / list header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <div className="flex min-w-0 items-center gap-1.5 text-sm">
            {q ? (
              <span className="font-semibold text-primary">
                Results for “{query.trim()}”
              </span>
            ) : openFolder ? (
              <>
                <button
                  type="button"
                  onClick={goRoot}
                  className="font-medium text-tertiary hover:text-primary"
                >
                  All catalogs
                </button>
                <ChevronRight className="size-4 shrink-0 text-fg-quaternary" />
                <span className="truncate font-semibold text-primary">{openFolder.name}</span>
              </>
            ) : (
              <span className="font-semibold text-primary">All catalogs</span>
            )}
          </div>
          {docs && docs.length > 0 && (
            <button
              type="button"
              onClick={toggleAllVisible}
              className="shrink-0 text-sm font-semibold text-brand-secondary hover:text-brand-secondary_hover"
            >
              {allVisibleChecked ? "Deselect all" : "Select all"}
            </button>
          )}
        </div>

        {/* List */}
        <div className="scrollbar-subtle min-h-0 flex-1 overflow-y-auto px-3 pb-3">
          {docs === null ? (
            /* Root: the folders. Click to drill in. */
            SOURCE_CATALOGS.map((c) => {
              const picked = selectedIn(c);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setOpenId(c.id)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-secondary"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-primary">{c.name}</div>
                    <div className="text-xs text-tertiary">
                      {c.docs.length} {c.docs.length === 1 ? "item" : "items"}
                      {picked > 0 && ` · ${picked} selected`}
                    </div>
                  </div>
                  <ChevronRight className="size-5 shrink-0 text-fg-quaternary" />
                </button>
              );
            })
          ) : docs.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <SearchLg className="size-6 text-fg-quaternary" />
              <p className="mt-2 text-sm text-tertiary">No files match your search.</p>
            </div>
          ) : (
            /* A folder's files (or search results). Tick to select. The
               checkbox is the only glyph up front; the type badge on the
               right says whether it's a Document or a Table. */
            docs.map((d) => {
              const isChecked = selected.has(d.name);
              return (
                <button
                  key={d.name}
                  type="button"
                  onClick={() => toggle(d.name)}
                  className={cx(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors",
                    isChecked ? "bg-brand-primary/60" : "hover:bg-secondary"
                  )}
                >
                  <CheckBox checked={isChecked} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-primary">{d.name}</div>
                    <div className="text-xs text-tertiary">{d.sub}</div>
                  </div>
                  {/* Type is secondary metadata — quiet muted text, not a chip. */}
                  <span className="shrink-0 text-xs text-quaternary">{d.type}</span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-secondary px-6 py-4">
          <span className="text-sm text-tertiary">
            <span className="font-semibold text-primary">{total}</span> selected
          </span>
          <div className="flex items-center gap-2">
            <Button color="secondary" size="sm">
              Cancel
            </Button>
            <Button color="primary" size="sm">
              Connect {total} {total === 1 ? "source" : "sources"}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------- top bar -------------------------------- */

export function TopBar() {
  return (
    <header className="flex h-16 items-center gap-3 border-b border-secondary bg-primary px-8">
      <Input
        icon={SearchLg}
        shortcut="⌘K"
        placeholder="Search…"
        aria-label="Search"
        readOnly
        wrapperClassName="max-w-sm"
      />
      <div className="ml-auto flex shrink-0 items-center gap-3">
        {/* Notifications */}
        <span className="relative">
          <Button color="tertiary" size="sm" iconLeading={Bell01} aria-label="Notifications" />
          <span className="pointer-events-none absolute right-1.5 top-1.5 size-2 rounded-full bg-error-solid ring-2 ring-primary" />
        </span>
        {/* Account */}
        <button
          type="button"
          aria-label="Profile"
          title="Anand Nalanda"
          className="flex items-center rounded-full transition-transform hover:scale-105"
        >
          <Avatar size="sm" src="/avatar.jpeg" alt="Anand Nalanda" className="size-9" />
        </button>
      </div>
    </header>
  );
}

/* ------------------------------ sidebar --------------------------------- */

/**
 * ProductSidebar — the Mercor-style left rail (brand tile + section nav +
 * Help). Shared by every product surface (chat screen, Spaces home) so the
 * navigation is identical everywhere.
 */
export function ProductSidebar({
  /* Which rail item reads as selected — "AI Chat" on the chat surfaces,
     "Extract" on the Staple Tables workspace. Same chrome, one product. */
  active = "AI Chat",
}: {
  active?: string;
} = {}) {
  return (
    <aside className="flex h-full w-[76px] shrink-0 flex-col items-center border-r border-secondary bg-primary pb-5">
      {/* Logo slot — same height as the top bar (py-3.5 + h-9 = 64px) so the
          logo sits on the same line as the search / top-bar controls. */}
      <div className="flex h-16 shrink-0 items-center">
        <div className="flex size-9 items-center justify-center rounded-xl bg-brand-solid shadow-xs">
          <StapleGlyph className="size-5.5 text-utility-sky-400" />
        </div>
      </div>

      <nav className="mt-4 flex flex-col items-center gap-1">
        {railItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.label === active;
          return (
            <Button
              key={item.label}
              color="tertiary"
              noTextPadding
              className="h-auto w-[72px] rounded-2xl px-1 py-1.5 *:data-text:flex *:data-text:flex-col *:data-text:items-center *:data-text:gap-1.5"
            >
              <span
                className={cx(
                  "flex size-9 items-center justify-center rounded-xl transition-colors",
                  isActive && "bg-brand-primary"
                )}
              >
                <Icon
                  className={cx(
                    "size-5 transition-colors",
                    isActive ? "text-fg-brand-primary" : "text-fg-quaternary"
                  )}
                />
              </span>
              <span
                className={cx(
                  "text-xs leading-none whitespace-nowrap",
                  isActive ? "font-semibold text-fg-brand-primary" : "font-medium"
                )}
              >
                {item.label}
              </span>
            </Button>
          );
        })}
      </nav>

      {/* Help pinned at the bottom of the rail (account + notifications now
          live in the top bar, per web convention). */}
      <div className="mt-auto pb-1">
        <Button color="secondary" size="sm" iconLeading={HelpCircle} aria-label="Help" />
      </div>
    </aside>
  );
}

/* ------------------------------- helpers -------------------------------- */

/** The Staple brand glyph (used in the sidebar tile and the new-chat hero). */
function StapleGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1186 1213"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Staple"
    >
      <path d="M1185.38 384.284V765.793C1185.38 783.789 1170.98 798.418 1153.26 798.418C1135.49 798.371 1121.14 783.741 1121.14 765.693V404.713L471.311 84.641V166.01L1064.95 458.809C1076.02 464.215 1083.01 475.617 1083.01 488.115V869.621C1083.01 887.621 1068.72 902.251 1050.9 902.251C1033.17 902.199 1018.78 887.574 1018.78 869.522V508.542L370.09 188.621V270.238L963.673 561.602C974.742 567.004 981.843 578.41 981.843 590.904V973.554C981.843 991.554 967.546 1006.13 949.723 1006.18H949.675C931.952 1006.13 917.655 991.502 917.655 973.554V611.382L267.775 292.502V373.226L861.407 665.629C872.477 671.131 879.478 682.538 879.478 695.032V1076.44C879.478 1094.49 865.081 1109.07 847.357 1109.07C829.638 1109.07 815.241 1094.39 815.241 1076.44V715.362L226.621 425.489L217.09 420.778L165.461 395.341V476.809L759.042 769.558C770.115 774.964 777.212 786.37 777.212 798.864V1180.37C777.212 1198.37 762.915 1212.85 745.096 1212.95H745.044C727.32 1212.9 713.023 1198.37 713.023 1180.32V819.243L165.51 549.303V725.876C165.51 743.924 151.114 758.502 133.391 758.502C115.669 758.502 101.272 743.924 101.272 725.876V517.617L64.1886 499.37V828.713C64.1886 846.765 49.8917 861.343 32.0696 861.343C14.2477 861.343 0.000128889 846.765 0.000128889 828.713V447.307C-0.0495143 429.307 14.2477 414.679 31.9703 414.58C36.885 414.58 41.75 415.72 46.1186 417.952L101.272 445.175V343.277C101.272 325.228 115.669 310.65 133.441 310.65C138.207 310.65 142.972 311.79 147.341 313.922L203.537 341.591V240.487C203.537 229.231 209.246 218.818 218.628 212.818C227.962 206.917 239.677 206.223 249.656 211.083L305.901 238.652V136.556C305.901 118.507 320.348 103.929 338.07 103.929C342.935 103.929 347.701 105.07 352.02 107.202L407.123 134.375V32.6756C407.123 21.4198 412.833 10.9574 422.165 5.00718C431.548 -0.992637 443.363 -1.63724 453.241 3.27168L1167.26 354.88C1178.38 360.384 1185.43 371.788 1185.43 384.284H1185.38Z" />
    </svg>
  );
}

/** A trailing "…" whose three dots pulse in sequence while the model works. */
function ThinkingDots({ reduceMotion }: { reduceMotion: boolean | null }) {
  if (reduceMotion) return <span className="text-quaternary">…</span>;
  return (
    <span className="inline-flex items-baseline">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="text-quaternary"
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.18,
          }}
        >
          .
        </motion.span>
      ))}
    </span>
  );
}

/** The message composer box — shared between the pinned thread footer and
    the centered new-chat hero. Highlight frames are injected via `frames`.
    When `typedText` is set the box shows a question being typed live (with a
    blinking caret), as if the user is at the keyboard. */
function ComposerBox({
  frames,
  typedText,
}: {
  frames?: React.ReactNode;
  typedText?: string | null;
}) {
  const reduceMotion = useReducedMotion();
  const isTyping = typedText != null;
  return (
    <div
      className="rounded-2xl border border-secondary bg-primary px-4 pt-3.5 pb-3 shadow-sm"
      style={{ position: "relative" }}
    >
      {frames}
      <div className="min-h-[46px] text-md">
        {isTyping ? (
          <span className="text-primary">
            {typedText}
            <motion.span
              aria-hidden
              style={{
                display: "inline-block",
                width: 1.5,
                height: 17,
                marginLeft: 1.5,
                verticalAlign: "text-bottom",
                borderRadius: 1,
                background: "var(--color-text-primary)",
              }}
              initial={false}
              animate={reduceMotion ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 1, repeat: Infinity, ease: "linear" }
              }
            />
          </span>
        ) : (
          <span className="text-placeholder">Ask your question…</span>
        )}
      </div>
      <div className="mt-1 flex items-center">
        <Button color="tertiary" size="sm" iconLeading={Paperclip} aria-label="Attach a file" />
        <div className="ml-auto flex items-center gap-1">
          <Button color="tertiary" size="sm" iconLeading={Recording02} aria-label="Voice input" />
          <Button
            color="primary"
            size="sm"
            iconLeading={ArrowUp}
            aria-label="Send"
            className="rounded-full before:rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * VoiceBars — the voice waveform: a clean row of brand-accent bars breathing
 * via gentle scaleY loops. Deterministic per-bar rhythm (sin of the index),
 * subtle amplitude — alive, not frantic. No particles, no glow, no ripples.
 * Reduced motion: static bars at their varied base heights.
 */
function VoiceBars({
  bars = 5,
  height = 12,
  width = 2,
  gap = 2,
}: {
  bars?: number;
  height?: number;
  width?: number;
  gap?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <span
      aria-hidden
      style={{ display: "inline-flex", alignItems: "center", gap, height }}
    >
      {Array.from({ length: bars }, (_, i) => {
        const base = 0.35 + 0.3 * Math.abs(Math.sin(i * 2.1 + 1));
        const peak = 0.65 + 0.35 * Math.abs(Math.sin(i * 1.3 + 0.5));
        return (
          <motion.span
            key={i}
            style={{
              width,
              height,
              borderRadius: 999,
              background: "var(--color-bg-brand-solid)",
              transformOrigin: "center",
            }}
            initial={false}
            animate={
              reduceMotion
                ? { scaleY: base }
                : { scaleY: [base, peak, base * 0.75, peak * 0.9, base] }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 1.15 + (i % 3) * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.07,
                  }
            }
          />
        );
      })}
    </span>
  );
}

/**
 * VoiceComposer — the same composer box in voice mode. The container never
 * changes, so the text input MORPHS into the listening state (inner content
 * cross-fades ~400ms) instead of swapping abruptly: live transcript where
 * the placeholder was, a listening affordance + waveform on the left, and a
 * stop control where send was. After the question is sent ("answer" phase)
 * it settles back to the resting input.
 */
function VoiceComposer({
  phase,
  transcript,
  highlight,
}: {
  phase: "idle" | "listening" | "answer";
  transcript: string;
  highlight: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const listening = phase === "listening";
  const swap = reduceMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: "easeOut" as const };
  return (
    <div
      className="rounded-2xl border border-secondary bg-primary px-4 pt-3.5 pb-3 shadow-sm"
      style={{ position: "relative" }}
    >
      {highlight && <AccentFrame inset="-7px" radius={22} />}

      {/* Text slot: placeholder ↔ live transcript. Same min-height, so the
          box never jumps. */}
      <div className="min-h-[46px] text-md">
        {listening ? (
          transcript ? (
            <span className="text-primary">{transcript}</span>
          ) : (
            <span className="text-placeholder">Listening…</span>
          )
        ) : (
          <span className="text-placeholder">Ask your question…</span>
        )}
      </div>

      <div className="mt-1 flex items-center">
        {/* Left: attach ↔ listening affordance + waveform */}
        <AnimatePresence mode="wait" initial={false}>
          {listening ? (
            <motion.div
              key="listening"
              className="flex items-center gap-2"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={swap}
            >
              <motion.span
                aria-hidden
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: "var(--color-bg-brand-solid)",
                }}
                initial={false}
                animate={reduceMotion ? { opacity: 1 } : { opacity: [1, 0.45, 1] }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                }
              />
              <span className="text-sm text-tertiary">Listening</span>
              <VoiceBars bars={24} height={18} />
            </motion.div>
          ) : (
            <motion.div
              key="attach"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={swap}
            >
              <Button
                color="tertiary"
                size="sm"
                iconLeading={Paperclip}
                aria-label="Attach a file"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right: mic + send ↔ stop */}
        <div className="ml-auto flex items-center gap-1">
          <AnimatePresence mode="wait" initial={false}>
            {listening ? (
              <motion.div
                key="stop"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={swap}
              >
                <Button
                  color="primary"
                  size="sm"
                  iconLeading={Stop}
                  aria-label="Stop listening"
                  className="rounded-full before:rounded-full"
                />
              </motion.div>
            ) : (
              <motion.div
                key="send"
                className="flex items-center gap-1"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={swap}
              >
                <Button
                  color="tertiary"
                  size="sm"
                  iconLeading={Recording02}
                  aria-label="Voice input"
                />
                <Button
                  color="primary"
                  size="sm"
                  iconLeading={ArrowUp}
                  aria-label="Send"
                  className="rounded-full before:rounded-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/** The user message bubble — exported so the case study's detail crops can
    recompose real thread fragments from the exact shipped pieces. */
export function UserBubble({ text }: { text: string }) {
  return (
    <div className="max-w-[78%] rounded-2xl bg-brand-secondary px-4 py-3 text-md leading-relaxed text-primary">
      {text}
    </div>
  );
}

/**
 * InlineChartCard — the in-thread chart artifact. Two variants share the
 * container, download header, muted gridlines, and axis row:
 *  - "bars": categorical comparison (the original inline chart);
 *  - "line": time series — same brand accent, value labels only on the
 *    points that matter (the first, and the two the question compares).
 * The plot is fixed-height so entrances never shift the scroll. `animate`
 * turns the entrance off for static contexts (the case study's crops).
 */
export function InlineChartCard({
  chart,
  variant = "bars",
  animate = true,
  frames,
}: {
  chart: ChartBar[];
  variant?: "bars" | "line";
  animate?: boolean;
  /** Case-study highlight frames, injected so this stays presentation-only. */
  frames?: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const play = animate && !reduceMotion;

  /* Dense mode (many categories): every bar keeps its name via angled axis
     labels, the value sits only on the leader (fourteen values in fourteen
     narrow columns is a collision), and the gridlines carry the scale. */
  const dense = variant === "bars" && chart.length > 6;

  /* Line geometry: points sit at bar-center x positions; the value domain is
     stretched so the trend reads (bars scale from zero; a time series that
     moves 12% would otherwise draw as a flat line at the top). */
  const values = chart.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  /* Y-axis for bars: nice round ticks (1/2/2.5/5 × 10ⁿ) so any bar reads
     against the scale without needing a value label on every column. */
  const isPercent = !!chart[0]?.display.includes("%");
  const rawStep = max / 4;
  const pow10 = Math.pow(10, Math.floor(Math.log10(rawStep || 1)));
  const niceNorm = [1, 2, 2.5, 5, 10].reduce(
    (best, c) =>
      Math.abs(c * pow10 - rawStep) < Math.abs(best * pow10 - rawStep) ? c : best,
    1
  );
  const tickStep = niceNorm * pow10;
  /* Start at 0 so the bar chart's zero baseline is explicit (bars are measured
     from zero, so the axis should say so). */
  const yTicks: number[] = [];
  for (let i = 0; i * tickStep <= max * 1.001; i++) yTicks.push(i * tickStep);
  const fmtTick = (t: number) =>
    isPercent ? `${t}%` : t >= 1000 ? `$${t / 1000}k` : `$${t}`;

  const xFor = (i: number) => ((i + 0.5) / chart.length) * 100;
  const bottomFor = (v: number) => 20 + ((v - min) / (max - min || 1)) * 130;
  const linePath = chart
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${180 - bottomFor(p.value)}`)
    .join(" ");
  const labeledPoints = new Set([0, chart.length - 2, chart.length - 1]);

  return (
    <div
      className="mt-0.5 rounded-2xl border border-secondary"
      /* Sparse (few-bar) charts don't need the full width — cap them narrower
         so the bars sit closer together instead of marooned in a wide plot. */
      style={{ position: "relative", maxWidth: dense ? 640 : 408 }}
    >
      {frames}

      {/* Header row — identical to the table artifact's */}
      <div className="flex justify-end border-b border-secondary px-2 py-1.5">
        <Button
          color="tertiary"
          size="sm"
          iconLeading={Download01}
          aria-label="Download as CSV"
        />
      </div>

      <div className="px-6 pb-4 pt-6">
        {/* Plot area. Bars get a labeled y-axis (round revenue ticks) so the
            gridlines carry the scale; the tallest mark reaches the top of
            the plot, so there's no dead headroom. */}
        <div style={{ position: "relative", height: 180 }}>
          {variant === "bars" ? (
            <div style={{ display: "flex", height: "100%" }}>
              {/* Y-axis tick labels */}
              <div style={{ position: "relative", width: 38, flexShrink: 0 }}>
                {yTicks.map((t) => (
                  <span
                    key={t}
                    className="text-xs text-tertiary"
                    style={{
                      position: "absolute",
                      right: 8,
                      /* Every label — zero included — is centred on its own
                         gridline (line sits at bottom:(t/max)*150; the −7 lifts
                         the label so its middle meets the line). */
                      bottom: (t / max) * 150 - 7,
                      fontVariantNumeric: "tabular-nums",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fmtTick(t)}
                  </span>
                ))}
              </div>
              <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
                {/* A gridline for EVERY tick including zero, all the same
                    length (plot width), so each label — zero included — has a
                    line of equal length to sit centred on. The zero line is the
                    baseline the bars rest on. */}
                {yTicks.map((t) => (
                  <div
                    key={t}
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: (t / max) * 150,
                      borderTop: "1px solid var(--color-border-secondary)",
                    }}
                  />
                ))}
                {/* Bar width ≈ 2:1 bar-to-gap keeps the classic rhythm. */}
                <div
                  className="flex h-full items-end"
                  style={{ position: "relative" }}
                >
              {chart.map((bar, bi) => {
                const barHeight = Math.round((bar.value / max) * 150);
                return (
                  <div
                    key={bar.label}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                    style={{ minWidth: 0 }}
                  >
                    {/* Dense charts label only the leader — fourteen values
                        in fourteen narrow columns is a collision, and the
                        lead sentence names the leader anyway. */}
                    {(!dense || bar.value === max) && (
                      <motion.span
                        className="text-sm font-semibold text-primary"
                        style={{
                          fontVariantNumeric: "tabular-nums",
                          whiteSpace: "nowrap",
                        }}
                        initial={play ? { opacity: 0 } : false}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.55 + bi * (dense ? 0.03 : 0.06),
                        }}
                      >
                        {bar.display}
                      </motion.span>
                    )}
                    <motion.div
                      style={{
                        /* Dense charts keep a fuller column; sparse charts get
                           slimmer bars (capped at 48px) sitting closer together
                           — the high % just pushes each bar to its cap inside a
                           tighter column, shrinking the gaps, not the bars. */
                        width: dense ? "66%" : "62%",
                        maxWidth: dense ? 96 : 48,
                        background: "var(--color-bg-brand-solid)",
                        borderRadius: dense ? "3px 3px 0 0" : "6px 6px 0 0",
                      }}
                      initial={play ? { height: 0 } : false}
                      animate={{ height: barHeight }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                        delay: 0.45 + bi * (dense ? 0.03 : 0.06),
                      }}
                    />
                  </div>
                );
              })}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ position: "absolute", inset: 0 }}>
              {/* Decorative gridlines — the line's key points carry their
                  own value labels. */}
              {[38, 75, 112, 150].map((y) => (
                <div
                  key={y}
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: y,
                    borderTop: "1px solid var(--color-border-secondary)",
                  }}
                />
              ))}
              <svg
                viewBox="0 0 100 180"
                preserveAspectRatio="none"
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  overflow: "visible",
                }}
              >
                <motion.path
                  d={linePath}
                  fill="none"
                  stroke="var(--color-bg-brand-solid)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  initial={play ? { pathLength: 0 } : false}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: 0.35 }}
                />
              </svg>
              {chart.map((p, i) => (
                <span key={p.label}>
                  <motion.span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: `${xFor(i)}%`,
                      bottom: bottomFor(p.value),
                      width: 7,
                      height: 7,
                      marginLeft: -3.5,
                      marginBottom: -3.5,
                      borderRadius: "50%",
                      background: "var(--color-bg-brand-solid)",
                      boxShadow: "0 0 0 2px var(--color-bg-primary)",
                    }}
                    initial={play ? { opacity: 0 } : false}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.25,
                      delay: 0.35 + (i / Math.max(1, chart.length - 1)) * 0.85,
                    }}
                  />
                  {labeledPoints.has(i) && (
                    <motion.span
                      className="text-sm font-semibold text-primary"
                      style={{
                        position: "absolute",
                        left: `${xFor(i)}%`,
                        bottom: bottomFor(p.value) + 10,
                        transform: "translateX(-50%)",
                        whiteSpace: "nowrap",
                        fontVariantNumeric: "tabular-nums",
                      }}
                      initial={play ? { opacity: 0 } : false}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.45 + (i / Math.max(1, chart.length - 1)) * 0.85,
                      }}
                    >
                      {p.display}
                    </motion.span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Axis labels, same type scale as the table header. Dense charts
            angle every label so ALL categories stay named — a categorical axis
            can't be thinned the way a time axis can. (Bars use the zero
            gridline as their baseline; only the line chart needs a full-width
            rule here.) */}
        {variant !== "bars" && <div className="border-t border-secondary" />}
        {dense ? (
          <div
            className="flex"
            style={{ height: 48, paddingTop: 18, paddingLeft: 38 }}
          >
            {chart.map((p) => (
              <div key={p.label} className="flex-1" style={{ position: "relative" }}>
                <span
                  className="text-xs text-tertiary"
                  style={{
                    position: "absolute",
                    top: 0,
                    right: "50%",
                    transform: "rotate(-35deg)",
                    transformOrigin: "top right",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="flex pt-2.5"
            style={variant === "bars" ? { paddingLeft: 38 } : undefined}
          >
            {chart.map((p) => (
              <div
                key={p.label}
                className="flex-1 text-center text-sm text-tertiary"
                style={{ whiteSpace: "nowrap" }}
              >
                {p.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* Single point of truth for the case-study highlight color: the brand
   accent (decision beats land in brand, never red). */
export const HIGHLIGHT_COLOR = "var(--color-brand-500)";

/**
 * BeatHighlight — the case-study highlight as one shared element.
 *
 * Shared `layoutId` means only ONE instance exists at a time; when a beat
 * moves the highlight to a new target (composer → thinking drawer), framer
 * spring-animates the frame across the screen instead of cross-fading.
 * At rest it is still: a 2px brand border, a whisper of fill, a soft glow.
 * Reduced motion: static frame, no travel.
 */
function BeatHighlight({
  inset,
  radius,
  fadeIn = false,
  alive = false,
}: {
  inset: string;
  radius: number;
  /** Fade in on mount (used when the highlight cross-fades rather than
      traveling in from a previous target). */
  fadeIn?: boolean;
  /** A living resting state: a slow, barely-there breath (scale + glow)
      so the frame never reads as a frozen sticker. Off by default and
      under reduced motion. */
  alive?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const breathe = alive && !reduceMotion;
  return (
    <motion.div
      layoutId="beat-highlight"
      aria-hidden
      style={{ position: "absolute", inset, pointerEvents: "none" }}
      initial={fadeIn && !reduceMotion ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              /* One quick flight with a single soft bounce at landing —
                 lively but never oscillating. */
              type: "spring",
              stiffness: 210,
              damping: 22,
              mass: 0.9,
              opacity: { duration: 0.35, ease: "easeOut" },
            }
      }
    >
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          border: `2px solid ${HIGHLIGHT_COLOR}`,
          background: `color-mix(in srgb, ${HIGHLIGHT_COLOR} 3%, transparent)`,
          boxShadow: `0 0 0 4px color-mix(in srgb, ${HIGHLIGHT_COLOR} 10%, transparent), 0 0 20px color-mix(in srgb, ${HIGHLIGHT_COLOR} 14%, transparent)`,
        }}
        animate={
          breathe
            ? {
                scale: [1, 1.015, 1],
                opacity: [1, 0.82, 1],
              }
            : undefined
        }
        transition={
          breathe
            ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      />
    </motion.div>
  );
}

/**
 * AccentFrame — visually identical to BeatHighlight but WITHOUT the shared
 * layoutId, for surfaces that coexist with the mounted product screen (the
 * case study's detail crops). Fades in on mount; static under reduced motion.
 */
export function AccentFrame({
  inset,
  radius,
  style,
}: {
  inset: string;
  radius: number;
  style?: React.CSSProperties;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      style={{ position: "absolute", inset, pointerEvents: "none", ...style }}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          border: `2px solid ${HIGHLIGHT_COLOR}`,
          background: `color-mix(in srgb, ${HIGHLIGHT_COLOR} 3%, transparent)`,
          boxShadow: `0 0 0 4px color-mix(in srgb, ${HIGHLIGHT_COLOR} 10%, transparent), 0 0 20px color-mix(in srgb, ${HIGHLIGHT_COLOR} 14%, transparent)`,
        }}
      />
    </motion.div>
  );
}

export function AssistantMessage({
  message: m,
  highlightThinking = false,
  reasoningExpanded,
  highlightChart = false,
  highlightConfirm = false,
  speaking = false,
  highlightSpeaking = false,
  processing = false,
}: {
  message: Extract<import("./data").ChatMessage, { role: "assistant" }>;
  highlightThinking?: boolean;
  /** Drives the reasoning drawer open/closed; the header stays clickable. */
  reasoningExpanded?: boolean;
  /** Accent frame around this message's inline chart (beat "d3"). */
  highlightChart?: boolean;
  /** Accent frame around the "Is this correct?" control (details crop 3). */
  highlightConfirm?: boolean;
  /** This response is being read aloud (voice beat): a quiet playback row —
      voice accompanies the visual answer, it doesn't replace it. */
  speaking?: boolean;
  /** Accent frame around the playback row (voice beat, sub-state B). */
  highlightSpeaking?: boolean;
  /** Live "processing" state (the answer sequence): the loader spins and an
      animated ellipsis trails "Thinking" while the model works. */
  processing?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  /* Collapsible reasoning drawer: collapsed by default (quiet summary line);
     the case-study beat can drive it open via prop, and it stays clickable. */
  const [open, setOpen] = useState(reasoningExpanded ?? false);
  useEffect(() => {
    if (reasoningExpanded !== undefined) setOpen(reasoningExpanded);
  }, [reasoningExpanded]);

  return (
    <motion.div
      className="flex flex-col gap-3.5"
      initial={m.entrance && !reduceMotion ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.25 }}
    >
      {/* Thinking drawer — wrapped so the case-study accent frame can hug the
          whole block (header + steps) without changing its layout. The data
          attribute is the scroll anchor for the reasoning beat. */}
      <div data-thinking-drawer style={{ position: "relative" }}>
        {highlightThinking && <BeatHighlight inset="-10px -14px" radius={16} />}

        {/* Header row: label · summary, chevron. Click to expand/collapse. */}
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full cursor-pointer items-center gap-2 bg-transparent text-sm text-tertiary"
        >
          {/* The loader spins while processing. */}
          <motion.span
            className="flex shrink-0"
            animate={processing && !reduceMotion ? { rotate: 360 } : { rotate: 0 }}
            transition={
              processing && !reduceMotion
                ? { duration: 0.9, repeat: Infinity, ease: "linear" }
                : { duration: 0 }
            }
          >
            <Loading02 className="size-4 text-fg-quaternary" />
          </motion.span>
          Thinking
          {processing ? (
            <ThinkingDots reduceMotion={reduceMotion} />
          ) : (
            m.thinkingSummary && (
              <span className="text-quaternary">· {m.thinkingSummary}</span>
            )
          )}
          {!processing && (
            <motion.span
              className="flex items-center"
              initial={false}
              animate={{ rotate: open ? 180 : 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
              }
            >
              <ChevronDown className="size-4 shrink-0 text-fg-quaternary" />
            </motion.span>
          )}
        </button>

        {/* Drawer body: discrete steps on a light left rail (falls back to
            the prose paragraph for messages without step data). */}
        <motion.div
          initial={false}
          animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
          }
          style={{ overflow: "hidden" }}
        >
          {/* Expanded body: no fill — it reads as part of the response, not
              a separate module. The light left rail + step numbers carry
              the sequence. */}
          {m.thinkingSteps ? (
            <div className="mt-3 ml-2 flex flex-col gap-2 border-l border-secondary pl-4">
              {m.thinkingSteps.map((step, si) => (
                <div key={si} className="flex items-baseline gap-2.5">
                  <span className="w-3 shrink-0 text-right text-xs font-medium text-quaternary">
                    {si + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-secondary">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-md leading-relaxed text-secondary">
              {m.thinking}
            </p>
          )}
        </motion.div>
      </div>

      {/* Playback row — styled like the Thinking line: quiet, part of the
          response, not a separate module. The spoken text is the prose
          right below it. */}
      {speaking && (
        <div
          className="flex items-center gap-2 text-sm text-tertiary"
          style={{ position: "relative", width: "fit-content" }}
        >
          {highlightSpeaking && <AccentFrame inset="-6px -10px" radius={12} />}
          <VoiceBars bars={5} height={12} />
          <span>Speaking</span>
          <span className="text-quaternary">· reading the summary aloud</span>
        </div>
      )}

      {m.file && (
        <BadgeWithIcon type="modern" size="lg" color="brand" iconLeading={BookOpen01} className="w-fit">
          {m.file}
        </BadgeWithIcon>
      )}

      {m.lead && <p className="text-md leading-relaxed text-secondary">{m.lead}</p>}

      {/* Inline chart — same artifact language as the table: identical
          rounded hairline container and download header, so table and chart
          read as siblings in the thread. */}
      {m.chart && (
        <InlineChartCard
          chart={m.chart}
          frames={highlightChart && <BeatHighlight inset="-7px" radius={22} />}
        />
      )}

      {m.table && (
        <div className="mt-0.5 overflow-hidden rounded-2xl border border-secondary">
          {m.table.download && (
            <div className="flex justify-end border-b border-secondary px-2 py-1.5">
              <Button
                color="tertiary"
                size="sm"
                iconLeading={Download01}
                aria-label={`Download as ${m.table.download}`}
              />
            </div>
          )}
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-secondary">
                {m.table.columns.map((c) => (
                  <th key={c} className="px-4 py-2.5 text-sm font-semibold text-tertiary">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {m.table.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-secondary last:border-0">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 text-md text-primary">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {m.trailing && <p className="text-md leading-relaxed text-secondary">{m.trailing}</p>}

      {m.confirm && (
        <div
          className="mt-0.5 flex items-center gap-3"
          style={{ position: "relative", width: "fit-content" }}
        >
          {highlightConfirm && <AccentFrame inset="-8px -12px" radius={14} />}
          <span className="text-md text-secondary">Is this correct?</span>
          <div className="flex items-center gap-2">
            <Button color="secondary" size="xs" iconLeading={Check}>
              Yes
            </Button>
            <Button color="secondary" size="xs" iconLeading={XClose}>
              Fix It
            </Button>
          </div>
        </div>
      )}

      {m.answer && (
        <p className="text-md leading-relaxed text-secondary">
          <RichText text={m.answer} />
        </p>
      )}
    </motion.div>
  );
}

/** Renders `**bold**` spans within otherwise plain text. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-primary">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
