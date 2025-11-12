/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007EA7',
          dark: '#003249',
          light: '#80CED7',
        },
        secondary: {
          DEFAULT: '#9AD1D4',
          light: '#CCDBDC',
        },
        ocean: {
          darkest: '#003249',
          dark: '#007EA7',
          DEFAULT: '#80CED7',
          light: '#9AD1D4',
          lightest: '#CCDBDC',
        },
        warning: '#f59e0b',
        danger: '#ef4444',
        success: '#10b981',
      }
    },
  },
  plugins: [],
}
