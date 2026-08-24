"use client";

/**
 * Untitled UI `Avatar` — vendored from the Untitled UI React library, trimmed
 * to the initials + status-indicator usage on this screen. Faithful to the
 * original class recipes and tokens.
 */
import { cx } from "./utils/cx";

const styles = {
    xs: { root: "size-6 text-xs" },
    sm: { root: "size-8 text-sm" },
    md: { root: "size-10 text-md" },
};

interface AvatarProps {
    size?: keyof typeof styles;
    /** Image source; falls back to initials when absent */
    src?: string;
    alt?: string;
    /** Initials fallback */
    initials?: string;
    /** Renders the contrast ring like the original `contrastBorder` prop */
    contrastBorder?: boolean;
    className?: string;
    /** Inline overrides (e.g. a per-instance initials tint). */
    style?: React.CSSProperties;
}

export const Avatar = ({ size = "md", src, alt, initials, contrastBorder = true, className, style }: AvatarProps) => (
    <span
        style={style}
        className={cx(
            // `bg-avatar-bg` / `outline-avatar-contrast-border` aren't defined in this
            // vendored theme; mapped to its equivalent semantic tokens.
            "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-tertiary font-semibold text-quaternary",
            contrastBorder && "outline-1 -outline-offset-1 outline-alpha-black/10",
            styles[size].root,
            className,
        )}
    >
        {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt} className="size-full object-cover" />
        ) : (
            initials
        )}
    </span>
);
