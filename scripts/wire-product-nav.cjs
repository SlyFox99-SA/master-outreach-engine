const fs = require('fs');

// 1. Copy techhub product.html to other 3 with per-client header tweak
const srcHtml = fs.readFileSync('clients/techhub-phones/src/product.html', 'utf8');

const brandMap = {
  zaheera:  { client: 'zaheera-fragrances',  brandAttr: 'zaheera',  bg: '#DED0BA', fg: '#2A1814', accent: '#6B1824', paper: '#E8DCC8' },
  monetech: { client: 'monetech-sneakers',   brandAttr: 'monetech', bg: '#0b0b0d', fg: '#f5f1e9', accent: '#d4ff00', paper: '#131316' },
  lumo:     { client: 'lumo-skincare',       brandAttr: 'lumo',     bg: '#f5f1ea', fg: '#1a1a1a', accent: '#3c503c', paper: '#faf7f1' }
};

for (const [brand, cfg] of Object.entries(brandMap)) {
  let h = srcHtml.replace('window.__BRAND__="techhub"', 'window.__BRAND__="' + cfg.brandAttr + '"');
  // swap palette vars
  h = h.replace('--paper:#fff;', '--paper:' + cfg.paper + ';');
  h = h.replace('--ink:#0a0a0a;', '--ink:' + cfg.fg + ';');
  h = h.replace('--accent:#1a8b5f;', '--accent:' + cfg.accent + ';');
  h = h.replace('--surface:#fafafa;', '--surface:' + cfg.bg + ';');
  // body bg
  h = h.replace('background:var(--paper);', 'background:' + cfg.bg + ';');
  fs.writeFileSync('clients/' + cfg.client + '/src/product.html', h, 'utf8');
  console.log('  ' + cfg.client + ': product.html created');
}

// 2. Add @click to each product card across all 4 clients
for (const [brand, cfg] of Object.entries(brandMap)) {
  const p = 'clients/' + cfg.client + '/src/index.html';
  let t = fs.readFileSync(p, 'utf8');
  // find the <li> that opens each product card and give it a click → product.html
  const oldLi = /<li class="p-card flex flex-col">/;
  const newLi = '<li class="p-card flex flex-col" style="cursor:pointer;" @click="location.href=\'./product.html?brand=' + cfg.brandAttr + '&id=\'+p.id">';
  if (oldLi.test(t)) { t = t.replace(oldLi, newLi); console.log('  ' + cfg.client + ': card click wired'); }
  // also try grid variant used by zaheera
  const oldLi2 = /<li class="grid grid-cols-\[80px_1fr\][^"]*"/;
  if (oldLi2.test(t)) { t = t.replace(oldLi2, '<li style="cursor:pointer;" @click="location.href=\'./product.html?brand=' + cfg.brandAttr + '&id=\'+p.id" class="grid grid-cols-[80px_1fr]'); console.log('  ' + cfg.client + ': grid-variant click wired'); }
  // make sure buttons stop propagation
  t = t.split('@click.stop="$store.cart.add(p').join('@click.stop="$store.cart.add(p');
  fs.writeFileSync(p, t, 'utf8');
}

// 3. techhub — add its own card click (uses different card wrapper)
{
  const p = 'clients/techhub-phones/src/index.html';
  let t = fs.readFileSync(p, 'utf8');
  if (!t.includes("product.html?brand=techhub")) {
    // wrap existing product grid li with click
    t = t.replace(
      /<li class="flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-black\/5 hover:shadow-md transition-shadow">/,
      '<li class="flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-black/5 hover:shadow-md transition-shadow" style="cursor:pointer;" @click="location.href=\'./product.html?brand=techhub&id=\'+p.id">'
    );
    fs.writeFileSync(p, t, 'utf8');
    console.log('  techhub-phones: card click wired');
  }
}
console.log('DONE.');