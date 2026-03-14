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
        primary: {
          DEFAULT: "#1B4F72",
          light: "#2E86C1",
          dark: "#154360",
        },
        accent: {
          DEFAULT: "#F39C12",
        },
        success: {
          DEFAULT: "#27AE60",
        },
        danger: {
          DEFAULT: "#E74C3C",
        },
        warmWhite: "#FDF6EC",
        textDark: "#2C3E50",
        textMuted: "#7F8C8D",
      },
    },
  },
  plugins: [],
};

export default config;
