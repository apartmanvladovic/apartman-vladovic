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
        forest: {
          50: "#f2f7f4",
          100: "#dcebe2",
          200: "#b7d6c5",
          300: "#8db9a3",
          400: "#40916c",
          500: "#2d6a4f",
          600: "#245641",
          700: "#1b4332",
          800: "#153528",
          900: "#102a20",
          950: "#081711",
        },
        mist: {
          50: "#fbfbfa",
          100: "#f3f4f1",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
