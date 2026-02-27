import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0f1729",
          card: "#1a2235",
          border: "#2a3548",
          hover: "#243049",
        },
        purple: {
          primary: "#8b5cf6",
          hover: "#7c3aed",
          light: "#a78bfa",
        },
      },
    },
  },
  plugins: [],
};
export default config;
