import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        accentPink: "#FF7EB6",
        accentMint: "#7CFFCB",
        accentLilac: "#B9B3FF",
        accentSky: "#A7D8FF",
        ink: "#1F2330",
        "ink-soft": "rgba(31, 35, 48, 0.75)",
        lavender: {
          50: "#fbf8ff",
          100: "#f3ecff",
          200: "#e3d6ff",
          300: "#d1bcff",
          400: "#c3a7ff",
          DEFAULT: "#c3a7ff",
        },
        "baby-pink": {
          50: "#fff5f7",
          100: "#ffe6ee",
          200: "#ffcddd",
          300: "#ffb1ca",
          400: "#ff9ab8",
          DEFAULT: "#ff9ab8",
        },
        mint: {
          50: "#f2fffb",
          100: "#dcfff2",
          200: "#c1ffe8",
          300: "#a0ffd9",
          400: "#7ef2c8",
          DEFAULT: "#7ef2c8",
        },
        sky: {
          50: "#f2f9ff",
          100: "#deefff",
          200: "#c2e3ff",
          300: "#9ad2ff",
          400: "#78c2ff",
          DEFAULT: "#78c2ff",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "cursive"],
        title: ["var(--font-title)", "serif"],
        hero: ["var(--font-hero)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        card: "24px",
        pill: "999px",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 12px 40px rgba(0, 0, 0, 0.12)",
        glow: "0 0 40px rgba(255, 126, 182, 0.25)",
      },
      backgroundImage: {
        "bg-night": "linear-gradient(135deg, #B9B3FF 0%, #A7D8FF 100%)",
        "bg-dusk": "linear-gradient(135deg, #FFB7D5 0%, #B9B3FF 100%)",
        "bg-sunrise": "linear-gradient(135deg, #FFD6A5 0%, #A7D8FF 100%)",
      },
      keyframes: {
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "slow-pulse": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        drift: {
          "0%": { transform: "translate3d(0, 0, 0)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translate3d(0, -40px, 0)", opacity: "0" },
        },
      },
      animation: {
        fade: "fade 0.6s ease-out both",
        float: "float 6s ease-in-out infinite",
        "slow-pulse": "slow-pulse 8s ease-in-out infinite",
        drift: "drift var(--duration, 12s) ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
