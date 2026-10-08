/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './clients/**/*.html',
    './templates/**/*.html',
    './seller/**/*.html',
    './track/**/*.html',
    './pitch/**/*.html'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'rgb(var(--brand-primary, 10 10 10) / <alpha-value>)',
          accent:  'rgb(var(--brand-accent, 201 100 66) / <alpha-value>)',
          ink:     'rgb(var(--brand-ink, 26 26 26) / <alpha-value>)',
          surface: 'rgb(var(--brand-surface, 250 247 241) / <alpha-value>)'
        }
      }
    }
  },
  plugins: []
};
