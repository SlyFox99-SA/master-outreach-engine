const fs = require('fs');
const hp = 'clients/zaheera-fragrances/src/index.html';
let html = fs.readFileSync(hp, 'utf8');

// Remove prior forced blocks
html = html.replace(/\n\/\* zaheera-forced-bg \*\/[\s\S]*?(?=<\/style>)/, '');
html = html.replace(/\n\/\* zaheera-force-hard \*\/[\s\S]*?(?=<\/style>)/, '');
html = html.replace(/\n\/\* zaheera-earth \*\/[\s\S]*?(?=<\/style>)/, '');

// Palette
const earth = `
/* zaheera-earth */
:root {
  --brand-surface: 222 208 186;
  --brand-ink:     42 24 20;
  --brand-primary: 107 24 36;
  --brand-accent:  176 98 70;
}
html, body {
  background-color: rgb(222 208 186) !important;
  color: rgb(42 24 20) !important;
}
body {
  background-image:
    radial-gradient(1200px 600px at 20% -10%, rgba(176,98,70,0.10), transparent 60%),
    radial-gradient(900px 500px at 100% 20%, rgba(107,24,36,0.06), transparent 60%);
  background-attachment: fixed;
}
header {
  background-color: rgb(232 220 200) !important;
  border-bottom-color: rgba(42,24,20,0.10) !important;
}
footer {
  background-color: rgb(60 36 30);
  color: rgb(226 212 190);
}
footer a, footer span { color: rgb(226 212 190) !important; }
section.card, .p-card, aside {
  background-color: rgb(241 233 218);
}
`;
html = html.replace('</style>', earth + '\n</style>');

// Body inline tiebreak
html = html.replace(
  /<body class="bg-brand-surface text-brand-ink antialiased"[^>]*>/,
  '<body class="bg-brand-surface text-brand-ink antialiased" style="background-color:#DED0BA;color:#2A1814;">'
);

fs.writeFileSync(hp, html, 'utf8');
console.log('zaheera earthy palette. size: ' + html.length);

// Config theme sync
for (const p of ['data/config-zaheera.json', 'clients/zaheera-fragrances/src/config.json']) {
  if (!fs.existsSync(p)) continue;
  const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
  cfg.theme = {
    surface: '222 208 186',
    ink:     '42 24 20',
    primary: '107 24 36',
    accent:  '176 98 70'
  };
  fs.writeFileSync(p, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
}

// Regen configs.js
const all = {};
for (const b of ['techhub','monetech','zaheera','lumo']) {
  const cp = 'data/config-' + b + '.json';
  if (fs.existsSync(cp)) all[b] = JSON.parse(fs.readFileSync(cp, 'utf8'));
}
all.active = all.techhub;
fs.writeFileSync('configs.js', 'window.__CONFIGS = ' + JSON.stringify(all) + ';\n', 'utf8');
console.log('configs.js: ' + fs.statSync('configs.js').size);