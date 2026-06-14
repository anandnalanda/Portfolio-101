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
          muted: "#f8f8f9",
          border: "rgba(0, 0, 0, 0.06)",
        },
        txt: {
          heading: "rgb(37, 36, 41)",
          primary: "rgba(37, 36, 41, 0.8)",
          secondary: "rgba(37, 36, 41, 0.4)",
        },
        accent: {
          DEFAULT: "#6366f1",
          light: "#818cf8",
          subtle: "rgba(99, 102, 241, 0.08)",
        },
      },
      borderRadius: {
        card: "20px",
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
