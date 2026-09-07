import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pine: {
          50: "#f0f7f3",
          100: "#dcebe4",
          200: "#b7d6c9",
          300: "#86b8a5",
          400: "#54967f",
          500: "#357a64",
          600: "#256150",
          700: "#0f3d2e",
          800: "#0d3327",
          900: "#0a2a20",
          950: "#051a13",
        },
        navy: {
          50: "#f0f6fa",
          200: "#b9d3e4",
          300: "#8db4cf",
          400: "#5d8fae",
          500: "#3d7294",
          600: "#2c5b7c",
          700: "#14324f",
          800: "#122b43",
          900: "#0f2437",
          950: "#0a1826",
        },
        gold: {
          light: "#e9d27a",
          DEFAULT: "#c9a227",
          dark: "#a8842a",
        },
        cream: {
          50: "#fbf9f4",
          100: "#f4efe3",
        },
      },
      fontFamily: {
        sans: ["var(--font-figtree)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
