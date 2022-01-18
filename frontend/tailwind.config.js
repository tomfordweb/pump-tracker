const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#17252A",
      dark: "#2B7A7B",
      light: "#3AAFA9",
      gray: "#DEF2F1",
      white: "#FEFFFF",
      error: "#FF0000",
    },
    extend: {},
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".btn": {
          padding: ".5rem 1rem !important",
          borderRadius: ".25rem !important",
          fontWeight: "600 !important",
        },
      });
    }),
    require("@tailwindcss/forms"),
  ],
};
