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
        'admin': '#FFD700',      // Gold
        'moderator': '#3b82f6', // Blue-500
        'user': '#6b7280',      // Gray-500
        'admin-dark': '#FBBF24', // Amber-400
        'moderator-dark': '#60A5FA', // Blue-400
        'user-dark': '#D1D5DB', // Gray-300
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in-bottom': 'slideInBottom 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideInBottom: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      }
    },
  },
  plugins: [],
}