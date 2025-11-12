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
        primary: '#137fec',
        accent: '#007AFF',
        'accent-green': '#34C759',
        'background-light': '#f6f7f8',
        'background-dark': '#101922',
        'text-primary-light': '#1C1C1E',
        'text-primary-dark': '#E5E5E7',
        'text-secondary-light': '#8E8E93',
        'text-secondary-dark': '#8D8D92',
        'border-light': '#E5E5E7',
        'border-dark': '#3A3A3C',
        warning: '#f59e0b',
        danger: '#ef4444',
        success: '#34C759',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        '2xl': '0.75rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
