import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        surface: {
          DEFAULT: "#ffffff",
          muted: "#fafafa",
          border: "rgba(0, 0, 0, 0.06)",
        },
        txt: {
          heading: "rgb(37, 36, 41)",
          primary: "rgba(37, 36, 41, 0.8)",
          secondary: "rgba(37, 36, 41, 0.4)",
        },
        accent: {
          teal: "#0d9488",
          coral: "#e8553d",
          orange: "#d97c1f",
          blue: "#3b82f6",
          purple: "#8b5cf6",
        },
      },
      borderRadius: {
        card: "24px",
      },
      gridTemplateColumns: {
        bento: "repeat(4, 258px)",
      },
      gridAutoRows: {
        bento: "258px",
      },
    },
  },
  plugins: [],
};
export default config;
