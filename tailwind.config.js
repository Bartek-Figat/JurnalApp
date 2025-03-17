/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        blob: "blob 7s infinite",
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
