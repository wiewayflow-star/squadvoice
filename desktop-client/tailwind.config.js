/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5865F2',
        secondary: '#3BA55D',
        danger: '#ED4245',
        dark: {
          100: '#2C2F33',
          200: '#23272A',
          300: '#1a1a1a',
        }
      }
    },
  },
  plugins: [],
}
