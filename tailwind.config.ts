import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          // 950 near-black for headings + gold CTA text
          950: "#0c1222",
          // 900–600 remapped to light surfaces for premium light UI
          900: "#f4f6fa",
          800: "#ffffff",
          700: "#e8ecf3",
          600: "#d5dbe8",
        },
        gold: {
          200: "#fde68a",
          300: "#f59e0b",
          400: "#fbbf24",
          500: "#d97706",
        },
        cyan: {
          300: "#0891b2",
          400: "#06b6d4",
          500: "#0e7490",
        },
        mist: "#5a6478",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 36px rgba(245, 158, 11, 0.22)",
        "glow-cyan": "0 0 28px rgba(8, 145, 178, 0.18)",
      },
    },
  },
  plugins: [],
};
export default config;
