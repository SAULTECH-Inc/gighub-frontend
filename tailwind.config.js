// Use ESModule imports instead of require()
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import aspectRatio from "@tailwindcss/aspect-ratio";
import tailwindScrollbarHide from "tailwind-scrollbar-hide";
import defaultTheme from 'tailwindcss/defaultTheme';
import colors from "tailwindcss/colors";
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // Enable dark mode with class toggle
  theme: {
    extend: {
      colors: {
        ...colors,
        primary: "#6A0DAD",
        secondary: "#FFFFFF",
        tertiary: "#6438c2",
        orange: "#FE691E",
        charcoal: "#222222",
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
        xxs: "320px",
        xs: "480px",
        sm: "640px",
        md: "768px",
        mdl: "960px",
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
  safelist: [
    'bg-primary', 'text-primary',
    'bg-secondary', 'text-secondary',
    'bg-tertiary', 'text-tertiary',
    'bg-orange', 'text-orange',
    'bg-charcoal', 'text-charcoal',
  ],
  plugins: [
    forms,
    typography,
    aspectRatio,
    tailwindScrollbarHide,
  ],
};
