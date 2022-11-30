/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./public/**/*.html"],
    theme: {
      extend: {},
    },
    plugins: [require("tailwind-gradient-mask-image")],
    mode: 'jit',
  }