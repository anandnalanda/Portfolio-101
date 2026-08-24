/* OFM Jobs logo mark - vector paths pulled directly from Figma
   (file e2Qivvgi6nEAeWTtbPKBcE, node 40006218:20518).

   Two overlapping "candidate" figures. Draw order matters: the LIGHT-green
   figure sits BEHIND the DARK-green figure. `variant`:
   - "brand" -> true two-tone green (for light backgrounds)
   - "light" -> all-white monochrome (for the dark emerald landing); pass
     `gap` (the background color) so a thin knockout line keeps the two
     overlapping figures distinct instead of merging. */

type Props = {
  className?: string;
  variant?: "brand" | "light";
  gap?: string;
};

export default function OfmLogo({ className, variant = "brand", gap }: Props) {
  const backColor = variant === "light" ? "#FFFFFF" : "#9AC984"; // light figure, behind
  const frontColor = variant === "light" ? "#FFFFFF" : "#006E42"; // dark figure, in front
  const stroke = variant === "light" && gap ? gap : "none";
  return (
    <svg
      viewBox="4.325 0 15.956 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="OFM Jobs"
    >
      {/* back figure - light green */}
      <path
        d="M20.2814 28.0011H8.32471C8.32471 21.2519 13.6817 15.7734 20.2814 15.7734V28.0011Z"
        fill={backColor}
      />
      <path
        d="M14.7283 14.8209C17.7948 14.8209 20.2807 12.2788 20.2807 9.14293C20.2807 6.00701 17.7948 3.46484 14.7283 3.46484C11.6619 3.46484 9.17603 6.00701 9.17603 9.14293C9.17603 12.2788 11.6619 14.8209 14.7283 14.8209Z"
        fill={backColor}
      />
      {/* front figure - dark green (knockout stroke in mono keeps it distinct) */}
      <path
        d="M4.32544 12.3047C10.9252 12.3047 16.2822 17.7831 16.2822 24.5323H4.32544V12.3047Z"
        fill={frontColor}
        stroke={stroke}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <path
        d="M9.87776 11.3562C12.9442 11.3562 15.4301 8.81399 15.4301 5.67808C15.4301 2.54216 12.9442 0 9.87776 0C6.8113 0 4.32544 2.54216 4.32544 5.67808C4.32544 8.81399 6.8113 11.3562 9.87776 11.3562Z"
        fill={frontColor}
        stroke={stroke}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}
