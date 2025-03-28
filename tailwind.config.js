/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'oxford-blue': '#0E1428',
        'jasper': '#CE5534',
        'hunyadi-yellow': '#ECA72C',
        'powder-blue': '#AFC2D5',
        'air-superiority-blue': '#6EA4BF',
      }
    },
  },
  plugins: [],
}
