// Use ESModule imports instead of require()
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import aspectRatio from "@tailwindcss/aspect-ratio";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
        green: "#90EE90", // Light green (you can replace with specific shade if needed)
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
        sans: ["Inter", "Arial", "sans-serif"],
        serif: ["Merriweather", "Georgia", "serif"],
        lato: ["Lato", "sans-serif"],
      },
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "960px",
        xl: "1200px",
        "2xl": "1440px",
        "3xl": "1920px",
      },
      animation: {
        "bounce-slow": "bounce 4s infinite",
        "bounce-fast": "bounce 2s infinite",
        "flash-slow": "flash 1s infinite",
        "flash-fast": "flash 0.5s infinite",
        "pulse-slow": "pulse 2s infinite",
        "pulse-fast": "pulse 0.5s infinite",
      },
      keyframes: {
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "25%": { transform: "translateY(-50%)" },
          "50%": { transform: "translateY(-25%)" },
          "75%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        testimonial: "url('./src/assets/images/testimonial.png')",
      },
    },
  },
  plugins: [forms, typography, aspectRatio],
};
