// Use ESModule imports instead of require()
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import aspectRatio from "@tailwindcss/aspect-ratio";
import tailwindScrollbarHide from "tailwind-scrollbar-hide";
import defaultTheme from 'tailwindcss/defaultTheme';
import flowbite from "flowbite-react/tailwind";
/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  darkMode: "class", // Enable dark mode with class toggle
  theme: {
    extend: {
      colors: {
        primary: "#6A0DAD",
        secondary: "#FFFFFF",
        tertiary: "#6438c2",
        orange: "#FE691E",
        yellow: "#F5BD25",
        "light-yellow": "#FFA203",
        "light-orange": "#FF8A05",
        white: "#FFFFFF",
        green: "#0b5d0b",
        gray: "#9E9E9E",
        charcoal: "rgba(34, 34, 34, 1)",
      },
      boxShadow: {
        card: "0px 4px 30px 0px rgba(238, 238, 238, 1)",
      },
      spacing: {
        128: "32rem",
      },
      fontFamily: {
        lato: ["Lato", "sans-serif"],
        sans: ['InterVariable', ...defaultTheme.fontFamily.sans],
      },
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1920px",
      },
      animation: {
        bounceSlow: "bounce 4s infinite",
        bounceFast: "bounce 2s infinite",
        fadeIn: "fadeIn 0.3s ease-out",
        zoomIn: "zoomIn 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        zoomIn: {
          "0%": { transform: "scale(0.8)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
      },
      backgroundImage: {
        testimonial: "url('./src/assets/images/testimonial.png')",
      },
    },
  },
  plugins: [forms, typography, aspectRatio, tailwindScrollbarHide, flowbite.plugin(),],
};
