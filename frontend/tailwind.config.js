/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f5fa',
          100: '#e9ebf5',
          200: '#ccd1ea',
          300: '#9fa8db',
          400: '#6f7cc8',
          500: '#4f5db5',
          600: '#3e4999',
          700: '#323a7c',
          800: '#252b5c',
          900: '#151833',
        },
        dark: {
          bg: '#0f111a',
          card: '#181a26',
          border: '#2b2d3d',
        }
      }
    },
  },
  plugins: [],
}
