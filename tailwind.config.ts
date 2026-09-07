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
        brand: {
          50: "#f4f6f7",
          100: "#e4e9ec",
          200: "#c9d2d9",
          300: "#a3b2bd",
          400: "#778a99",
          500: "#55697a",
          600: "#445261",
          700: "#333e49",
          800: "#2a3440",
          900: "#222b36",
          950: "#151c24",
        },
        accent: {
          DEFAULT: "#f7931f",
          dark: "#dd8112",
        },
        mist: {
          50: "#fafaf9",
          100: "#f5f5f4",
        },
      },
      fontFamily: {
        sans: ["var(--font-figtree)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
