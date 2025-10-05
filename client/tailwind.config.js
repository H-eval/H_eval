 /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        float: "float 6s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%": { transform: "translate(0px, 0px) rotate(0deg)" },
          "50%": { transform: "translate(15px, -15px) rotate(3deg)" },
          "100%": { transform: "translate(-10px, 10px) rotate(-3deg)" },
        },
      },
    },
  },
  plugins: [],
}
