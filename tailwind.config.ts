import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-jost)", "sans-serif"],
      },
      colors: {
        background: "var(--bg-primary)",
        foreground: "var(--cream)",
        navy: {
          DEFAULT: "#120f0f",
          dark: "#0a0808",
          light: "#1c1714",
        },
        gold: {
          DEFAULT: "#b8924a",
          light: "#d4af70",
          shimmer: "#f0d080",
          dark: "#a37f3b",
        },
      },
    },
  },
  plugins: [],
};
export default config;
