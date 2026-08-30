"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type Props = {
  label: string;
  icon: { mono: ReactNode; color: ReactNode }; // TriggerIcon slot: two variants
  open: boolean;
  menuId: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/* The pill. Two icons are stacked in a 16x16 relative box and cross-fade:
   the grey mono variant fades out, the full-colour variant fades in. The
   colour icon stays visible the whole time the menu is `open`, not just on
   pointer hover of the pill. */
const Trigger = forwardRef<HTMLButtonElement, Props>(function Trigger(
  { label, icon, open, menuId, className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={menuId}
      data-open={open || undefined}
      className={
        "group inline-flex items-center gap-2 rounded-full border bg-white px-3.5 py-1.5 text-sm font-medium text-neutral-700 outline-none transition-[color,border-color,box-shadow] duration-200 ease-out data-[open]:border-neutral-300 data-[open]:shadow-[0_1px_2px_rgba(0,0,0,.06),0_4px_12px_rgba(0,0,0,.06)] hover:border-neutral-300 hover:shadow-[0_1px_2px_rgba(0,0,0,.06),0_4px_12px_rgba(0,0,0,.06)] focus-visible:border-neutral-300 focus-visible:shadow-[0_1px_2px_rgba(0,0,0,.06),0_4px_12px_rgba(0,0,0,.06)]" +
        (className ? ` ${className}` : "")
      }
      {...rest}
    >
      <span className="relative block h-4 w-4">
        <span
          className={
            "absolute inset-0 grid place-items-center text-neutral-400 transition-opacity duration-[180ms] ease-out " +
            (open ? "opacity-0" : "opacity-100 group-hover:opacity-0")
          }
        >
          {icon.mono}
        </span>
        <span
          className={
            "absolute inset-0 grid place-items-center transition-opacity duration-[180ms] ease-out " +
            (open ? "opacity-100" : "opacity-0 group-hover:opacity-100")
          }
        >
          {icon.color}
        </span>
      </span>
      {label}
    </button>
  );
});

export default Trigger;
