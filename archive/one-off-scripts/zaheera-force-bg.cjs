const fs = require('fs');

// 1. Deeper cream — not white
for (const p of ['data/config-zaheera.json', 'clients/zaheera-fragrances/src/config.json']) {
  if (!fs.existsSync(p)) continue;
  const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
  cfg.theme = cfg.theme || {};
  cfg.theme.surface = '243 237 228';   // clearly cream, no ambiguity
  cfg.theme.ink     = '44 22 24';      // deep maroon-black
  cfg.theme.primary = '107 24 36';     // maroon
  cfg.theme.accent  = '156 60 47';     // terracotta
  fs.writeFileSync(p, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
  console.log('  ' + p + ' cream set');
}

// 2. Force body background via inline style in the HTML
const hp = 'clients/zaheera-fragrances/src/index.html';
let html = fs.readFileSync(hp, 'utf8');
let h = 0;
if (!html.includes('/* zaheera-forced-bg */')) {
  const forced = `
/* zaheera-forced-bg */
html, body { background-color: #f3ede4 !important; }
body { color: #2c1618; }
`;
  html = html.replace('</style>', forced + '</style>');
  h++;
}
fs.writeFileSync(hp, html, 'utf8');
console.log('  zaheera html: ' + h + ' patches, ' + html.length + ' bytes');

// 3. Regenerate configs.js
const all = {};
for (const b of ['techhub','monetech','zaheera','lumo']) {
  const cp = 'data/config-' + b + '.json';
  if (fs.existsSync(cp)) all[b] = JSON.parse(fs.readFileSync(cp, 'utf8'));
}
all.active = all.techhub;
fs.writeFileSync('configs.js', 'window.__CONFIGS = ' + JSON.stringify(all) + ';\n', 'utf8');
console.log('  configs.js: ' + fs.statSync('configs.js').size);