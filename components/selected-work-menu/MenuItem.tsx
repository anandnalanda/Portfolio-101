"use client";

import Link from "next/link";
import { forwardRef, type CSSProperties } from "react";
import type { CaseStudy } from "@/data/case-studies";
import LogoTile from "./LogoTile";

type Props = {
  item: CaseStudy;
  active: boolean; // roving-focus target (tabIndex 0)
  onSelect?: (item: CaseStudy) => void;
};

/* Shared row skeleton. `group/item` drives the tile + label + wash so a single
   hover/focus-visible state lights the whole row. `transition-colors` covers
   the row wash and its own text; the label span transitions its own colour.
   Label text uses a darkened brand (`--brand` 85% + black) so it clears WCAG AA
   on the 10% wash for every palette entry — see note in SelectedWorkMenu. */
const ROW_BASE =
  "group/item flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium outline-none";

const MenuItem = forwardRef<HTMLAnchorElement | HTMLDivElement, Props>(function MenuItem(
  { item, active, onSelect },
  ref,
) {
  const isComing = item.status === "coming-soon";
  const style = { "--brand": item.brand } as CSSProperties;

  const label = (
    <span className="flex min-w-0 flex-col">
      <span
        className={
          isComing
            ? "leading-none text-neutral-400 transition-colors duration-150 ease-out group-hover/item:text-neutral-600"
            : "leading-none text-neutral-700 transition-colors duration-150 ease-out group-hover/item:text-[color-mix(in_oklab,var(--brand)_85%,black)] group-focus-visible/item:text-[color-mix(in_oklab,var(--brand)_85%,black)]"
        }
      >
        {item.name}
      </span>

      {isComing && item.caption ? (
        // CSS grid-rows 0fr -> 1fr reveal: grows the row by the caption height
        // with a small fade + 2px slide-down. No JS and no layout jump. (Only
        // the panel drops its motion under prefers-reduced-motion; this cheap
        // reveal is left intact.)
        <span className="grid grid-rows-[0fr] -translate-y-0.5 opacity-0 transition-[grid-template-rows,opacity,transform] duration-[120ms] ease-out group-hover/item:grid-rows-[1fr] group-hover/item:translate-y-0 group-hover/item:opacity-100">
          <span className="min-h-0 overflow-hidden">
            <span className="mt-0.5 block text-[11px] leading-none text-neutral-400">{item.caption}</span>
          </span>
        </span>
      ) : null}
    </span>
  );

  if (isComing) {
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        role="menuitem"
        aria-disabled="true"
        tabIndex={-1}
        style={style}
        className={ROW_BASE + " cursor-default transition-colors duration-150 ease-out hover:bg-neutral-100"}
      >
        <LogoTile name={item.name} logo={item.logo} comingSoon />
        {label}
      </div>
    );
  }

  return (
    <Link
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={item.href}
      role="menuitem"
      tabIndex={active ? 0 : -1}
      style={style}
      onClick={() => onSelect?.(item)}
      className={
        ROW_BASE +
        " transition-colors duration-150 ease-out hover:bg-[color-mix(in_oklab,var(--brand)_10%,white)] focus-visible:bg-[color-mix(in_oklab,var(--brand)_10%,white)]"
      }
    >
      <LogoTile name={item.name} logo={item.logo} />
      {label}
    </Link>
  );
});

export default MenuItem;
