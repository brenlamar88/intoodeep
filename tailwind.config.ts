import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        abyss: "#091e28",
        deep: "#0f2c3a",
        "deep-2": "#15394a",
        "deep-3": "#1d4658",
        surface: "#5fc9c9",
        "surface-soft": "#8fdede",
        coral: "#ff7f63",
        "coral-soft": "#ff9d86",
        foam: "#eaf4f3",
        "foam-soft": "#9fbdc0",
      },
      fontFamily: {
        display: ['var(--font-fraunces)', "Georgia", "serif"],
        body: ['var(--font-inter)', "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
