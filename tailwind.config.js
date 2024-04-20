/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,css}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'background': '#010517',
        'primary': '#242044',
        'secondary': {
          100: '#CE8459',
          200: '#F1C6B9',
        },
        'green': '#CCFF90',
        'gradient': {
          100: 'linear-gradient(to right,#110561, #FB7E65)'
        }
      }
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwind-scrollbar')({ preferredStrategy: 'pseudoelements' }),
  ],
}

