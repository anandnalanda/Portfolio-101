import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      /* ── OFM Jobs type scale ─────────────────────────────────────
         Named size tokens (size + line-height) for the OFM UI, so text
         sizing is consistent and tuned in one place. Weight stays an
         explicit class (font-normal/medium/semibold/bold) per use. */
      fontSize: {
        /* hero: the scale's single deliberate peak above display. Two
           sanctioned uses: reading-page titles (job post) + hero stats. */
        "ofm-hero": ["28px", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "ofm-display": ["20px", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "ofm-title": ["16px", { lineHeight: "1.35" }],
        "ofm-body": ["15px", { lineHeight: "1.45" }],
        "ofm-label": ["13px", { lineHeight: "1.4" }],
        "ofm-caption": ["12px", { lineHeight: "1.4" }],
        "ofm-micro": ["11px", { lineHeight: "1.3" }],
      },
      colors: {
        surface: {
          DEFAULT: "#ffffff",
          muted: "#fafafa",
          border: "rgba(0, 0, 0, 0.04)",
        },
        txt: {
          heading: "rgb(37, 36, 41)",
          primary: "rgba(37, 36, 41, 0.8)",
          secondary: "rgba(37, 36, 41, 0.4)",
        },
        accent: {
          DEFAULT: "#6366f1",
          light: "#818cf8",
        },
        /* ── OFM Jobs brand green ────────────────────────────────────
           Single source of truth for the OFM UI green. Anchored on the
           logo's dark green (#006E42 = ofm-600). Every OFM component uses
           `ofm-*` (not Tailwind `emerald-*`), so changing the brand green
           here updates the whole dashboard/board at once. */
        ofm: {
          50: "#ECF6F1",
          100: "#CFEADD",
          200: "#A0D7BE",
          300: "#67BF9B",
          400: "#2FA278",
          500: "#0B885A",
          600: "#006E42",
          700: "#005B37",
          800: "#00492C",
          900: "#043C26",
        },
        /* ── Kibo UI (OFM Jobs) tokens ───────────────────────────────
           var-based shadcn tokens. They resolve only inside `.kibo`
           (see globals.css), so they cannot restyle anything outside
           that subtree. Names are all new — no collision with the
           portfolio's own tokens above. `accent` is intentionally left
           untouched; no Kibo component in use references it yet. */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success) / <alpha-value>)",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
      },
      borderRadius: {
        card: "28px",
      },
      gridTemplateColumns: {
        bento: "repeat(4, 258px)",
      },
      gridAutoRows: {
        bento: "258px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
