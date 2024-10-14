/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    screens: {
      mobile: { raw: "(min-width: 0px)  and (max-width: 1024px)" },
      desk1: { raw: "(min-width: 1024px)  and (max-width: 1280px)" },
      desk2: { raw: "(min-width: 1280px) and (max-width: 1440px)" },
      desk3: { raw: "(min-width: 1440px) and (max-width: 1600px)" },
      desk4: { raw: "(min-width: 1600px) and (max-width: 1920px)" },
    },
    colors: {
      light: {
        background: "#ffffff",
        text: "#333333",
        // ... other light mode colors
      },
      dark: {
        background: "#151515",
        text: "#ffffff",
        // ... other dark mode colors
      },
      primary: "#00B152",
    },
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans], // Add Inter to the sans-serif font stack
        // You can also add specific weights if needed:
        // 'inter-thin': ['Inter Thin', 'sans-serif'],
        // 'inter-light': ['Inter Light', 'sans-serif'],
        // etc.
      },

      height: {
        custom: "calc(100vh - 119px)",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
