"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ScaledCanvas — lays its children out at a fixed desktop design width and
 * scales the whole thing down to fill whatever box it sits in (nothing is
 * cropped). The same fit-to-container trick ScaledStapleChat uses internally,
 * extracted so screens other than the chat (e.g. the Spaces home) can share
 * the exact same choreography inside the case study's sticky panel.
 *
 * Drop it into any `position: relative` container — it fills it absolutely.
 */
export default function ScaledCanvas({
  designWidth = 1440,
  children,
}: {
  designWidth?: number;
  children: React.ReactNode;
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
          {children}
        </div>
      )}
    </div>
  );
}
