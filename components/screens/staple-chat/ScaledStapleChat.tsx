"use client";

import { useEffect, useRef, useState } from "react";
import StapleChatScreen from "./StapleChatScreen";
import type { ChatMessage } from "./data";

/**
 * ScaledStapleChat — renders the full Staple Chat UI at a fixed desktop width
 * (so every column stays visible) and scales it down to fill whatever box it
 * sits in. Nothing is cropped or hidden: the design width is scaled to the
 * container width, and the design height is derived from the container height,
 * so the screen fills the panel exactly at any size.
 *
 * Drop it into any `position: relative` container — it fills it absolutely.
 */
export default function ScaledStapleChat({
  // Virtual canvas width. The screen is laid out at this width and scaled to
  // fit the container — larger = smaller apparent UI ("less zoomed").
  designWidth = 1440,
  // Case-study affordances — passed straight through to StapleChatScreen.
  highlightComposer = false,
  messages,
  followUpItems,
  configurePanel,
  highlightThinking,
  reasoningExpanded,
  highlightChart,
  highlightSources,
  blankCanvas,
  restScroll,
  panelTab,
  idle,
  connectModal,
  voice,
  answerSequence,
  panelReveal,
}: {
  designWidth?: number;
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
}) {
  const fitRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ scale: number; height: number } | null>(null);

  useEffect(() => {
    const el = fitRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      const scale = w / designWidth;
      // Height in design space that, once scaled, exactly fills the container.
      setBox({ scale, height: h / scale });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [designWidth]);

  return (
    <div
      ref={fitRef}
      style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#f9fafb" }}
    >
      {box && (
        <div
          style={{
            width: designWidth,
            height: box.height,
            transform: `scale(${box.scale})`,
            transformOrigin: "top left",
          }}
        >
          <StapleChatScreen
            highlightComposer={highlightComposer}
            messages={messages}
            followUpItems={followUpItems}
            configurePanel={configurePanel}
            highlightThinking={highlightThinking}
            reasoningExpanded={reasoningExpanded}
            highlightChart={highlightChart}
            highlightSources={highlightSources}
            blankCanvas={blankCanvas}
            restScroll={restScroll}
            panelTab={panelTab}
            idle={idle}
            connectModal={connectModal}
            voice={voice}
            answerSequence={answerSequence}
            panelReveal={panelReveal}
          />
        </div>
      )}
    </div>
  );
}
