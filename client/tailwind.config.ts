import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        secondary: "#666666",
        background: "#FFFFFF",
        "dark-bg": "#121212",
        "dark-primary": "#FFFFFF",
        "dark-secondary": "#9ca3af",
      },
      backdropBlur: {
        glass: "20px",
      },
    },
  },
  plugins: [],
};

export default config;
