"use client";

/**
 * Untitled UI `Input` — vendored from the Untitled UI React library, trimmed to
 * the props this screen uses (leading icon + keyboard shortcut). Faithful to
 * the original class recipes and tokens.
 */
import type { FC, InputHTMLAttributes } from "react";
import { cx } from "./utils/cx";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    /** Icon component to show at the start of the input */
    icon?: FC<{ className?: string }>;
    /** Keyboard shortcut hint shown at the end of the input (e.g. "⌘K") */
    shortcut?: string;
    /** Size variant */
    size?: "sm" | "md";
    wrapperClassName?: string;
}

export const Input = ({ icon: Icon, shortcut, size = "sm", className, wrapperClassName, ...props }: InputProps) => {
    return (
        <div
            className={cx(
                // Same recipe as Untitled UI's InputBase wrapper
                "group relative flex w-full flex-row place-content-center place-items-center rounded-lg bg-primary shadow-xs ring-1 ring-primary transition-shadow duration-100 ease-linear ring-inset",
                "focus-within:ring-2 focus-within:ring-brand",
                wrapperClassName,
            )}
        >
            {Icon && <Icon className="pointer-events-none absolute left-3 size-5 shrink-0 text-fg-quaternary" />}
            <input
                {...props}
                className={cx(
                    "m-0 w-full bg-transparent text-primary caret-alpha-black/90 outline-hidden placeholder:text-placeholder",
                    size === "sm" ? "px-3 py-2 text-sm" : "px-3.5 py-2.5 text-md",
                    Icon && (size === "sm" ? "pl-10" : "pl-10.5"),
                    shortcut && (size === "sm" ? "pr-11" : "pr-12"),
                    className,
                )}
            />
            {shortcut && (
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <kbd className="flex rounded px-1 py-px font-body text-xs font-medium text-quaternary ring-1 ring-secondary ring-inset">
                        {shortcut}
                    </kbd>
                </div>
            )}
        </div>
    );
};
