"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CaseStudy } from "@/data/case-studies";
import MenuItem from "./MenuItem";
import Trigger from "./Trigger";

type Props = {
  items: CaseStudy[];
  label: string;
  icon: { mono: ReactNode; color: ReactNode };
  align?: "left" | "right";
  onSelect?: (item: CaseStudy) => void;
};

const CLOSE_DELAY = 100; // ms grace period so a diagonal pill->panel path doesn't flicker

export default function SelectedWorkMenu({ items, label, icon, align = "left", onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1); // index into `items` of the roving-focus row
  const [reducedMotion, setReducedMotion] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressFocusOpen = useRef(false); // set on Escape so the returned focus doesn't reopen

  const menuId = useId();

  // Indices of keyboard-navigable rows (coming-soon rows are skipped).
  const navigable = useMemo(
    () => items.map((it, i) => (it.status === "coming-soon" ? -1 : i)).filter((i) => i >= 0),
    [items],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = useCallback(
    (focusFirst = false) => {
      clearCloseTimer();
      setOpen(true);
      if (focusFirst) setActiveIndex(navigable[0] ?? -1);
    },
    [navigable],
  );

  const closeMenu = useCallback((returnFocus = false) => {
    clearCloseTimer();
    setOpen(false);
    setActiveIndex(-1);
    if (returnFocus) {
      suppressFocusOpen.current = true;
      triggerRef.current?.focus();
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => {
      // Keep the menu open if a keyboard user's focus is still inside it.
      if (wrapperRef.current?.contains(document.activeElement)) return;
      setOpen(false);
      setActiveIndex(-1);
    }, CLOSE_DELAY);
  }, []);

  // Move roving focus to the active row whenever it changes while open.
  useEffect(() => {
    if (open && activeIndex >= 0) itemRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  // Escape + outside-click close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu(true);
    };
    const onDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) closeMenu();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open, closeMenu]);

  useEffect(() => clearCloseTimer, []);

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const pos = navigable.indexOf(activeIndex);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(navigable[pos < 0 ? 0 : Math.min(pos + 1, navigable.length - 1)]);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(navigable[pos < 0 ? navigable.length - 1 : Math.max(pos - 1, 0)]);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(navigable[0]);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(navigable[navigable.length - 1]);
    }
  };

  // Panel + rows animate as a parent/child pair. The panel snaps in on a crisp
  // spring; rows cascade on a tight stagger so the first options are visible
  // almost immediately instead of the whole block fading in as one slow unit.
  const panel = reducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.1 } },
        exit: { opacity: 0, transition: { duration: 0.08 } },
      }
    : {
        hidden: { opacity: 0, y: -6, scale: 0.96 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 560,
            damping: 34,
            mass: 0.7,
            staggerChildren: 0.02,
            delayChildren: 0.015,
          },
        },
        exit: { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.09, ease: "easeIn" } },
      };

  const row = reducedMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: -5 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.12, ease: [0.22, 1, 0.36, 1] } },
      };

  return (
    <div
      ref={wrapperRef}
      className="relative inline-block"
      onMouseEnter={() => openMenu()}
      onMouseLeave={scheduleClose}
    >
      <Trigger
        ref={triggerRef}
        label={label}
        icon={icon}
        open={open}
        menuId={menuId}
        onClick={() => (open ? closeMenu() : openMenu())}
        onFocus={() => {
          if (suppressFocusOpen.current) {
            suppressFocusOpen.current = false;
            return;
          }
          openMenu();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            openMenu(true);
          }
        }}
      />

      {/* Bridges the 8px gap between pill and panel so the hover region is
          continuous; the panel itself is absolute and never shifts layout. */}
      <div className="absolute left-0 right-0 top-full h-2" aria-hidden="true" />

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            aria-label={label}
            onKeyDown={onMenuKeyDown}
            variants={panel}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ transformOrigin: align === "right" ? "top right" : "top left" }}
            className={
              "absolute top-full z-50 mt-2 min-w-[180px] rounded-xl border border-neutral-200/80 bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,.08),0_2px_6px_rgba(0,0,0,.04)] " +
              (align === "right" ? "right-0" : "left-0")
            }
          >
            {items.map((item, i) => (
              <motion.div key={item.slug} variants={row}>
                <MenuItem
                  ref={(el: HTMLElement | null) => {
                    itemRefs.current[i] = el;
                  }}
                  item={item}
                  active={i === activeIndex}
                  onSelect={(it) => {
                    onSelect?.(it);
                    closeMenu();
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
