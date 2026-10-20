import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lime: { DEFAULT: "#C6FF3B", dark: "#A9E01F" },
        navy: { DEFAULT: "#0B1F3B", soft: "#13294B" },
        cream: "#FFF9ED",
        slate: { DEFAULT: "#64748B" },
        coral: "#FF6B4A",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        hand: ["var(--font-hand)", "cursive"],
      },
      borderRadius: { bubble: "1.25rem" },
    },
  },
  plugins: [],
};

export default config;
