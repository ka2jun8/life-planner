module.exports = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      sans: [
        "Helvetica Neue",
        "Arial",
        "Hiragino Kaku Gothic ProN",
        "Hiragino Sans",
        "Graphik",
        "Meiryo",
        "sans-serif",
      ],
    },
    extend: {
      spacing: {
        "8xl": "96rem",
        "9xl": "128rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
