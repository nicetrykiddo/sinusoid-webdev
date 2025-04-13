/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 15s ease infinite',
        'glitch': 'glitch 0.2s ease-in-out infinite',
        'fade-in': 'fade-in 1s ease-out forwards',
      },
    },
  },
  plugins: [],
};