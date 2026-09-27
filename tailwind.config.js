/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bat: {
          bg: '#08090b',
          panel: '#15161b',
          border: '#292b32',
          text: '#e2e3e7',
          muted: '#777981',
          gold: '#d0a545',
          green: '#639e7e',
          ink: '#111216',
        },
      },
    },
  },
  plugins: [],
};
