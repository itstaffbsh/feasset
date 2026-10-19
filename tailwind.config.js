/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#2d3e50',
        'brand-darker': '#1a242f',
        'brand-light': '#3c5168',
        'brand-accent': '#10b981', // Keep emerald accent for success/highlights
        'brand-bg': '#f8fafc',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
