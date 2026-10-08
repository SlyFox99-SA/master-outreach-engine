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
          primary: 'var(--brand-primary, #0a0a0a)',
          accent: 'var(--brand-accent, #c96442)',
          ink: 'var(--brand-ink, #1a1a1a)',
          surface: 'var(--brand-surface, #faf7f1)'
        }
      }
    }
  },
  plugins: []
};
