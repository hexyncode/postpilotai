/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          50:  '#23272e',
          100: '#282c34',
          200: '#353b45',
          300: '#3e4451',
          400: '#4b5263',
          500: '#5c6370',
          600: '#abb2bf',
          700: '#c678dd',
          800: '#61afef',
          900: '#98c379',
        },
      },
    },
  },
  plugins: [],
} 