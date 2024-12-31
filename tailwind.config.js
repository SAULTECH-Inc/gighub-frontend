/** @type {import('tailwindcss').Config} */
import form from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import aspectRatio from "@tailwindcss/aspect-ratio";

export default {
  content: [
      "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  purge: ['./src/**/*.{js,ts,jsx,tsx}', './public/index.html'  ],
  darkMode: false,
  important: true,
  variants: {
    extend: {
      opacity: ['responsive', 'hover', 'focus'],
      scale: ['responsive', 'hover', 'focus'],
      visibility: ['responsive', 'hover', 'focus'],
      backgroundColor: ['responsive', 'hover', 'focus'],
      borderColor: ['responsive', 'hover', 'focus'],
      textColor: ['responsive', 'hover', 'focus'],
      cursor: ['responsive', 'hover', 'focus'],
      fill: ['responsive', 'hover', 'focus'],
      stroke: ['responsive', 'hover', 'focus'],
      flexGrow: ['responsive', 'hover', 'focus'],
      flexShrink: ['responsive', 'hover', 'focus'],
      flexBasis: ['responsive', 'hover', 'focus'],
      flex: ['responsive', 'hover', 'focus'],
      order: ['responsive', 'hover', 'focus'],
      gridColumnStart: ['responsive', 'hover', 'focus'],
      gridColumnEnd: ['responsive', 'hover', 'focus'],
    },
  },
  theme: {
    extend: {
      colors: {
        'primary': '#4433FF',
        'gray': '#9E9E9E',
        'light-gray': '#F2F2F2',
      },
    },
  },
  plugins: [
      form,
      typography,
      aspectRatio,
  ],
}

