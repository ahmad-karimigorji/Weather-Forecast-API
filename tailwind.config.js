/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./public/**/*.html"],
    theme: {
      extend: {
        fontFamily: {
          'poppins': ['Poppins', 'sans-serif']
        },
      },
    },
    plugins: [require("tailwind-gradient-mask-image")],
    mode: 'jit',
  }