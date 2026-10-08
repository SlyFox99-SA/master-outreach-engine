const fs = require('fs');

// ---- 1. tailwind.config.js — wrap CSS vars in rgb() ----
const tc = `/** @type {import('tailwindcss').Config} */
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
`;
fs.writeFileSync('tailwind.config.js', tc, 'utf8');
console.log('  tailwind.config.js: rgb() syntax');

// ---- 2. ensure every config has RGB-triplet theme values ----
const hexToRgb = h => {
  if (/^\d+\s+\d+\s+\d+$/.test(h)) return h; // already triplet
  const m = h.replace('#','').match(/.{2}/g);
  return m ? m.map(x => parseInt(x,16)).join(' ') : h;
};
for (const c of ['zaheera','techhub','monetech','lumo']) {
  const p = 'data/config-' + c + '.json';
  if (!fs.existsSync(p)) continue;
  const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
  cfg.theme = cfg.theme || {};
  for (const k of ['primary','accent','ink','surface']) {
    if (cfg.theme[k]) cfg.theme[k] = hexToRgb(cfg.theme[k]);
  }
  fs.writeFileSync(p, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
  console.log('  ' + c + ' theme: ' + JSON.stringify(cfg.theme));
}

// ---- 3. techhub main.js — add document-level image click handler if missing ----
const mPath = 'clients/techhub-phones/src/main.js';
if (fs.existsSync(mPath)) {
  let m = fs.readFileSync(mPath, 'utf8');
  if (!m.includes('detail[opened]') && !m.includes('closest("li, article")')) {
    m += '\n\n// Detail modal from image click\ndocument.addEventListener("click", function(e){\n  if (e.target.closest("button, a, input, select, textarea")) return;\n  var img = e.target.closest("img");\n  if (!img) return;\n  var card = img.closest("li, article");\n  if (!card) return;\n  var cfg = window.Alpine && window.Alpine.store("config");\n  if (!cfg || !cfg.products) return;\n  var src = img.getAttribute("src") || "";\n  var p = cfg.products.filter(function(x){ return x.image === src || (x.images && x.images.indexOf(src) !== -1); })[0];\n  if (!p) return;\n  cfg.openDetail(p);\n});\n';
    fs.writeFileSync(mPath, m, 'utf8');
    console.log('  techhub main.js: click handler added');
  } else {
    console.log('  techhub main.js: handler already present');
  }
}

// ---- 4. zaheera modal: cap height + clip ----
const zPath = 'clients/zaheera-fragrances/src/index.html';
if (fs.existsSync(zPath)) {
  let z = fs.readFileSync(zPath, 'utf8');
  const before = z.length;
  // ensure outer modal is capped and clipping
  z = z.replace(
    'class="fixed inset-0 z-50 bg-black/70 p-0 md:p-8"',
    'class="fixed inset-0 z-50 bg-black/70 p-0 md:p-8 overflow-hidden"'
  );
  z = z.replace(
    'class="mx-auto h-full max-w-4xl bg-brand-surface flex flex-col md:flex-row overflow-hidden md:rounded-2xl"',
    'class="mx-auto h-full md:h-auto md:max-h-[90vh] max-w-4xl bg-brand-surface flex flex-col md:flex-row overflow-hidden md:rounded-2xl"'
  );
  if (z.length !== before) { fs.writeFileSync(zPath, z, 'utf8'); console.log('  zaheera modal: capped at 90vh'); }
  else console.log('  zaheera modal: no change');
}