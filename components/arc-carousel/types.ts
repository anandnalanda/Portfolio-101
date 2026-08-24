import type React from "react";
import type { ArcConfig } from "./config";

export type ArcSlide = {
  id: string;
  content: React.ReactNode;
  label: string;
};

export type ArcCarouselProps = {
  slides: ArcSlide[];
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  onExpand?: () => void;
  /** ms between auto-advances; undefined = off. Pauses on hover/focus. */
  autoplayMs?: number;
  /** Direction/size of each autoplay step. +1 (default) = upward; -1 = top-to-bottom. */
  autoplayStep?: number;
  className?: string;
  /** Renders a scrubber bound to `position` so the arc constants can be tuned by eye. */
  debug?: boolean;
  /** Strip the mint device frame — the slide content fills the (white) card itself. */
  bare?: boolean;
  /** Show the built-in bottom-left expand button. Default true; set false to supply
   *  your own expand affordance as an overlay. */
  showExpand?: boolean;
  /** Hijack vertical wheel/trackpad for navigation. Default true; set false when
   *  embedded in a scrollable page so the page keeps scrolling. */
  wheelNav?: boolean;
  /** Override the card size (defaults to ARC.cardW/H). Use a square size for `bare`. */
  cardWidth?: number;
  cardHeight?: number;
  /** Override arc geometry (bulgeX, stepY, rotStep, fade, window) — merged over ARC. */
  arc?: Partial<ArcConfig>;
  /** Static layer rendered inside the panel, behind the cards (e.g. a textured bg). */
  background?: React.ReactNode;
};
