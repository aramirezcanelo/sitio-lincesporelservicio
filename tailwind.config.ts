import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './static/**/*.html', './static/**/*.js', './src/**/*.ts'],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#F7F5EC', light: '#FCFBF7', dark: '#EFECE1' },
        forest: { DEFAULT: '#14332A', light: '#224B3E', dark: '#0A1D18' },
        coral: { DEFAULT: '#E05A36', hover: '#C44927', soft: '#F47D5C', blush: '#FCECE8' },
        mustard: { DEFAULT: '#E8B13B', light: '#F4CE75' }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cursive: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif']
      }
    }
  },
  plugins: []
} satisfies Config;
