/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cloudflare-orange': '#F38020',
        'cloudflare-dark': '#1F2937',
        'cloudflare-light': '#F9FAFB',
      },
    },
  },
  plugins: [],
}
