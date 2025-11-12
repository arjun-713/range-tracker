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
        primary: '#007AFF',
        'background-light': '#ffffff',
        'background-dark': '#101922',
        'text-light': '#1C1C1E',
        'text-dark': '#f6f7f8',
        'border-light': '#E5E5EA',
        'border-dark': '#3a444d',
        warning: '#f59e0b',
        danger: '#ef4444',
        success: '#10b981',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0rem',
        lg: '0rem',
        xl: '0rem',
        '2xl': '0rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
