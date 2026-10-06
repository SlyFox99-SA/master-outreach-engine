/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './main.js', './checkout.html'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'rgb(var(--brand-primary) / <alpha-value>)',
          accent:  'rgb(var(--brand-accent)  / <alpha-value>)',
          ink:     'rgb(var(--brand-ink)     / <alpha-value>)',
          surface: 'rgb(var(--brand-surface) / <alpha-value>)'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        frame: '0 25px 60px -12px rgb(0 0 0 / 0.55)'
      }
    }
  },
  plugins: []
};
