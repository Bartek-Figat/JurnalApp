/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        blob: "blob 7s infinite",
      },
      colors: {
        "theme-color-primary": "#0052cc",
        "theme-color-primary-foreground": "#b0c9ef",
        "theme-color-text": "#6b7591",
        "theme-color-background": "#f5f5f5",
        "theme-color-background-foreground": "white",
        "theme-color-destructive": "#fe4543",
        "theme-color-success": "#38c975",
        "theme-color-border": "#e5e7eb",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "scale(1) translate(0px,0px)",
          },
          "33%": {
            transform: "scale(1.2) translate(20px,-40px)",
          },
          "66%": {
            transform: "scale(0.8) translate(-20px,20px)",
          },
          "100%": {
            transform: "scale(1) translate(0px,0px)",
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
