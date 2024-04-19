/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,css}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#010517',
        'primary': '#CE8459',
        'secondary': {
          100: '#242044',
          200: '#F1C6B9',
        }
      },
    },
  },
  plugins: [],
}

