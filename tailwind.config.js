/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        alabaster: '#FAF9F5',
        oatmeal: '#F3F1EC',
        charcoal: '#141413',
        slateInk: '#52514E',
        stoneMuted: '#8A8884',
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          900: '#312E81',
        },
        spark: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
        }
      },
      boxShadow: {
        'editorial': '0 1px 3px rgba(20, 20, 19, 0.04), 0 1px 2px rgba(20, 20, 19, 0.02)',
        'editorial-md': '0 10px 25px -5px rgba(20, 20, 19, 0.06), 0 8px 10px -6px rgba(20, 20, 19, 0.03)',
        'editorial-lg': '0 20px 40px -12px rgba(20, 20, 19, 0.10)',
      }
    },
  },
  plugins: [],
};
