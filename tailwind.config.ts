import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#009B3A",  /* Brazilian flag green — primary CTA */
          700: "#007A2F",
          800: "#005E24",
          900: "#004319",
        },
        gov: {
          blue:  "#002776",  /* Brazilian flag blue */
          green: "#009B3A",  /* Brazilian flag green */
          gold:  "#FEDF00",  /* Brazilian flag gold */
        },
        success: "#059669",
        warning: "#d97706",
        danger:  "#dc2626",
      },
      boxShadow: {
        soft: "0 8px 40px rgba(0, 39, 118, 0.07)",
        card: "0 4px 20px rgba(0, 0, 0, 0.06)",
        "green-glow": "0 4px 20px rgba(0, 155, 58, 0.25)",
      },
      borderRadius: {
        xl:   "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
