/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: '#5A1E2B',
        'maroon-dark': '#3D1420',
        ivory: '#FAF7F0',
        'gold-antique': '#C6A15B',
        'gold-light': '#E8D5A3',
        dark: '#211B19',
        admin: {
          bg: '#F7F7F5',
          card: '#FFFFFF',
          border: '#E8E5E2',
          'text-primary': '#211B19',
          'text-secondary': '#6B6B6B',
          'text-muted': '#9B9B9B',
          maroon: '#5A1E2B',
          'maroon-dark': '#42151F',
          'maroon-light': '#F5E8ED',
          gold: '#C6A15B',
          'gold-light': '#FDF8EE',
          success: '#16A34A',
          'success-light': '#F0FDF4',
          warning: '#D97706',
          'warning-light': '#FFFBEB',
          danger: '#DC2626',
          'danger-light': '#FEF2F2',
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
