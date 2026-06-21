import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        surface: {
          DEFAULT: "#ffffff",
          muted: "#fafafa",
          border: "rgba(0, 0, 0, 0.02)",
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
  plugins: [],
};
export default config;
