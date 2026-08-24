"use client";

/**
 * Untitled UI `Tabs` (underline type) — vendored from the Untitled UI React
 * library, built on React Aria's Tabs exactly like the original. Trimmed to
 * the "underline" style this screen uses.
 */
import type { ReactNode } from "react";
import {
    Tab as AriaTab,
    TabList as AriaTabList,
    Tabs as AriaTabs,
    type TabsProps as AriaTabsProps,
} from "react-aria-components";
import { cx } from "./utils/cx";

export const Tabs = (props: AriaTabsProps) => <AriaTabs {...props} />;

export const TabList = ({ className, children }: { className?: string; children: ReactNode }) => (
    <AriaTabList className={cx("flex items-center gap-4", className)}>{children}</AriaTabList>
);

export const Tab = ({ id, children }: { id: string; children: ReactNode }) => (
    <AriaTab
        id={id}
        className={cx(
            "-mb-px cursor-pointer border-b-2 border-transparent pb-3 text-md font-semibold whitespace-nowrap text-quaternary outline-focus-ring transition duration-100 ease-linear",
            "hover:border-fg-brand-primary_alt hover:text-brand-secondary",
            "focus-visible:outline-2 focus-visible:outline-offset-2",
            "selected:border-fg-brand-primary_alt selected:text-brand-secondary",
        )}
    >
        {children}
    </AriaTab>
);
