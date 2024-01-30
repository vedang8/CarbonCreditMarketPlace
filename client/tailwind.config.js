const { lightGreen } = require('@mui/material/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: '#4d7c0f'
      }
    },
  },
  plugins: [],
  corePlugins:{
    preflight: false,
  }
}

