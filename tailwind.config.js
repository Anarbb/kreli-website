/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kreli-green': '#05DC7F',
        'kreli-dark-green': '#00674E',
        'kreli-teal': '#142D2B',
        'kreli-light': '#F2F2F2',
        'kreli-dark': '#1F1F1F',
        'kreli-black': '#000000',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
