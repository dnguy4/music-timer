/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        zentropa: ["ZENTROPA", "sans-serif"],
        ironman: ["IRONMAN", "sans-serif"]
      }
    },
  },
  plugins: [require("daisyui")],
};
