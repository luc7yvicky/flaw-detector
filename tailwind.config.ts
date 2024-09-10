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
        pretendard: ["var(--font-pretendard)"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: {
          500: "#6100FF",
          400: "#883EFF",
          300: "#A66FFF",
          200: "#C9A8FF",
          100: "#E0CEFF",
          50: "#F2EBFF",
        },
        accent: {
          red: "#FF6D6D",
          blue: "#6DB0FF",
          orange: "#FFD542",
          green: "#00C308",
        },
        purple: {
          light: "#FAF8FF",
          dark: "#E3E1E7",
        },
        red: {
          light: "#FFEFEF",
        },
        gray: {
          default: "#969696",
          dark: "#3F3F3F",
          light: "#D6D6D6",
        },
        bggray: {
          light: "#F1F1F1",
          dark: "#C2C2C2",
        },
        neutral: {
          100: "#030303",
          90: "#1A1A1A",
          80: "#333333",
          70: "#4D4D4D",
          60: "#4D4D4D",
          50: "#808080",
          40: "#999999",
          30: "#B3B3B3",
          20: "#CCCCCC",
          10: "#E6E6E6",
          5: "#F3F3F3",
        },
        line: {
          default: "#C3C3C3",
          light: "#E6E6E6",
          dark: "#ADADAD",
        },
      },
      screens: {
        "1150": "71.875rem",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
export default config;
