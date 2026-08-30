/* Placeholder, currentColor-friendly logo marks.
   Swap these for the real per-case-study SVGs later — LogoTile renders
   whatever component you pass in `caseStudies[].logo`, so nothing else
   in the menu has to change. Keep `fill="none"` + `currentColor` so the
   tile can tint the glyph with the brand colour. */

type LogoProps = { className?: string };

export function StapleLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <rect x="2.4" y="3" width="11.2" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2.4 6.4h11.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6 6.4V13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function OfmLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <rect x="2.3" y="5" width="11.4" height="8.4" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5.8 5V4.2c0-.77.63-1.4 1.4-1.4h1.6c.77 0 1.4.63 1.4 1.4V5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
