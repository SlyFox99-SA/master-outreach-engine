const fs = require('fs');

// ============ Set warm palette in config ============
for (const p of ['data/config-zaheera.json', 'clients/zaheera-fragrances/src/config.json']) {
  if (!fs.existsSync(p)) continue;
  const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
  cfg.theme = cfg.theme || {};
  cfg.theme.surface = '247 243 237';   // warm bone
  cfg.theme.ink     = '42 20 24';      // deep maroon-black
  cfg.theme.primary = '107 24 36';     // maroon (buttons)
  cfg.theme.accent  = '156 60 47';     // rich terracotta
  fs.writeFileSync(p, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
  console.log('  ' + p + ' warm palette set');
}

// ============ Patch index.html ============
const p = 'clients/zaheera-fragrances/src/index.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// 1. Announcement banner -> maroon
const oldBanner = /<div class="bg-brand-ink text-brand-surface[^"]*"[^>]*>[\s\S]*?<\/div>/;
const newBanner = `<div class="bg-brand-primary text-white text-[10px] tracking-[0.28em] uppercase text-center py-2.5" style="background-color: rgb(107 24 36); color: #f7f3ed;">Complimentary delivery over R800 · South Africa</div>`;
if (oldBanner.test(t)) { t = t.replace(oldBanner, newBanner); h++; console.log('  banner maroon'); }

// 2. Add/Action buttons -> already maroon. But Buy button outline -> maroon already set.

// 3. Add a subtle serif accent line under intro heading (modern touch)
if (!t.includes('zaheera-rule')) {
  t = t.replace('</style>',
    '\n/* zaheera-rule */\n.section-rule { height:1px; background: rgba(107,24,36,0.15); margin: 0 0 4px; }\n</style>');
}

// 4. Ensure page background uses warm cream (already via surface)
// 5. Give the shop section heading a warm tone (maroon text instead of black)
t = t.replace(
  /<h2 class="disp text-[^"]*">Every piece, considered\.<\/h2>/,
  '<h2 class="disp text-[1.8rem] md:text-[2.6rem]" style="color: rgb(42 20 24);">Every piece, considered.</h2>'
);

// 6. Product names in maroon (subtle)
t = t.replace(
  /<h3 class="disp text[^"]*" x-text="p\.name"><\/h3>/,
  '<h3 class="disp text-[1rem] md:text-[1.15rem]" style="color: rgb(42 20 24);" x-text="p.name"></h3>'
);

// 7. Price in maroon
t = t.replace(
  /<p class="text-sm serif-num" x-text="\$store\.config\.formatZAR\(p\.price\)"><\/p>/,
  '<p class="text-sm serif-num" style="color: rgb(107 24 36); font-weight: 500;" x-text="$store.config.formatZAR(p.price)"></p>'
);

fs.writeFileSync(p, t, 'utf8');
console.log('  zaheera index.html: ' + h + ' patches. size: ' + t.length);

// Regen configs.js
const all = {};
for (const b of ['techhub','monetech','zaheera','lumo']) {
  const cp = 'data/config-' + b + '.json';
  if (fs.existsSync(cp)) all[b] = JSON.parse(fs.readFileSync(cp, 'utf8'));
}
all.active = all.techhub;
fs.writeFileSync('configs.js', 'window.__CONFIGS = ' + JSON.stringify(all) + ';\n', 'utf8');
console.log('  configs.js: ' + fs.statSync('configs.js').size + ' bytes');