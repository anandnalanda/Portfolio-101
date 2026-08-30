import type { ComponentType } from "react";

type Props = {
  name: string;
  logo?: ComponentType<{ className?: string }>;
  comingSoon?: boolean;
};

/* 20x20 rounded tile. Reads the `--brand` custom property set on the row, so
   the wash + glyph tint come straight from the case study's brand colour.
   At rest the tile is muted (saturate .6 / slightly transparent); it snaps to
   full saturation when the parent row (group/item) is hovered or focus-visible.
   Coming-soon rows pass `comingSoon` and get a neutral, brand-free tile.
   Falls back to the name's first letter when no `logo` component is supplied. */
export default function LogoTile({ name, logo: Logo, comingSoon }: Props) {
  return (
    <span
      className={
        comingSoon
          ? "grid h-5 w-5 flex-none place-items-center rounded-md bg-neutral-100 text-[11px] font-semibold leading-none text-neutral-400"
          : "grid h-5 w-5 flex-none place-items-center rounded-md text-[11px] font-semibold leading-none opacity-90 saturate-[.6] transition-[filter,opacity] duration-150 ease-out bg-[color-mix(in_oklab,var(--brand)_10%,white)] text-[var(--brand)] group-hover/item:opacity-100 group-hover/item:saturate-100 group-focus-visible/item:opacity-100 group-focus-visible/item:saturate-100"
      }
    >
      {Logo ? <Logo className="h-3.5 w-3.5" /> : name.charAt(0)}
    </span>
  );
}
