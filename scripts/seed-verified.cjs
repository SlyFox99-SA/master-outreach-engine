const fs = require('fs');

// ONLY verified-working Unsplash IDs — cycling them means no broken tiles
const P = {
  iphones: [
    'photo-1632661674596-df8be070a5c5','photo-1678652197831-2d180705cd2c',
    'photo-1592286927505-1def25115558','photo-1580910051074-3eb694886505',
    'photo-1603898037225-5b892dd4f1c0','photo-1511707171634-5f897ff02aa9'
  ],
  android: [
    'photo-1610945265064-0e34e5519bbf','photo-1678911820864-e2c567c655d7',
    'photo-1598327105666-5b89351aff97','photo-1567581935884-3349723552ca'
  ],
  accessories: [
    'photo-1601593346740-925612772716','photo-1606841837239-c5a1a4a07af7',
    'photo-1583863788434-e58a36330cf0','photo-1572569511254-d8f925fe2cbb',
    'photo-1606220945770-b5b6c2c55bf1'
  ],
  sneakers: [
    'photo-1552346154-21d32810aba3','photo-1595950653106-6c9ebd614d3a',
    'photo-1600185365483-26d7a4cc7519','photo-1584735175315-9d5df23860e6',
    'photo-1600269452121-4f2416e55c28','photo-1551107696-a4b0c5a0d9a2'
  ],
  running: [
    'photo-1542291026-7eec264c27ff','photo-1608231387042-66d1773070a5',
    'photo-1606107557195-0e29a4b5b4aa','photo-1460353581641-37baddab0fa2'
  ],
  lifestyle: [
    'photo-1525966222134-fcfa99b8ae77','photo-1560769629-975ec94e6a86',
    'photo-1491553895911-0055eca6402d','photo-1520639888713-7851133b1ed0'
  ],
  fragrance: [
    'photo-1541643600914-78b084683601','photo-1592945403244-b3fbafd7f539',
    'photo-1587017539504-67cfbddac569','photo-1615634260167-c8cdede054de',
    'photo-1608528577891-eb055944f2e7','photo-1595425970377-c9703cf48b6d'
  ],
  skincare: [
    'photo-1620916566398-39f1143ab7be','photo-1612817288484-6f916006741a',
    'photo-1556228720-195a672e8a03','photo-1556228578-8c89e6adf883',
    'photo-1611930022073-b7a4ba5fcccd'
  ]
};

const catPool = c => c === 'Fragrances' || c === 'Gift Sets' || c === 'Home' ? 'fragrance'
                   : c === 'Serums' || c === 'Moisturisers' || c === 'Cleansers' || c === 'Treatments' ? 'skincare'
                   : c === 'iPhones' ? 'iphones' : c === 'Android' ? 'android' : c === 'Accessories' ? 'accessories'
                   : c === 'Sneakers' ? 'sneakers' : c === 'Running' ? 'running' : 'lifestyle';

// Vary quality/size per product so each URL is unique — same source, no broken link
const url = (id, k) => 'https://images.unsplash.com/' + id + '?w=' + (900 + (k % 3)) + '&q=' + (80 + (k % 2));

const clientMap = { techhub:'techhub-phones', monetech:'monetech-sneakers', zaheera:'zaheera-fragrances', lumo:'lumo-skincare' };

for (const [brand, client] of Object.entries(clientMap)) {
  const p = 'clients/' + client + '/src/config.json';
  if (!fs.existsSync(p)) continue;
  const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));

  const used = {};
  cfg.products.forEach((prod, i) => {
    const key = catPool(prod.category);
    used[key] = (used[key] || 0) + 1;
    const pool = P[key] || P.lifestyle;
    const pick = pool[(used[key] - 1) % pool.length];
    prod.image = url(pick, i);
    prod.images = [prod.image];
  });

  fs.writeFileSync(p, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
  console.log('  ' + client + ': ' + cfg.products.length + ' products seeded');

  const rp = 'data/config-' + brand + '.json';
  if (fs.existsSync(rp)) {
    const root = JSON.parse(fs.readFileSync(rp, 'utf8'));
    root.products = cfg.products;
    fs.writeFileSync(rp, JSON.stringify(root, null, 2) + '\n', 'utf8');
  }
}

// Regenerate configs.js
const all = {};
for (const b of ['techhub','monetech','zaheera','lumo']) {
  const cp = 'data/config-' + b + '.json';
  if (fs.existsSync(cp)) all[b] = JSON.parse(fs.readFileSync(cp, 'utf8'));
}
all.active = all.techhub;
fs.writeFileSync('configs.js', 'window.__CONFIGS = ' + JSON.stringify(all) + ';\n', 'utf8');
console.log('  configs.js: ' + fs.statSync('configs.js').size);

// Rebuild all 4
const { execSync } = require('child_process');
for (const c of ['zaheera-fragrances','techhub-phones','monetech-sneakers','lumo-skincare']) {
  try { fs.rmSync('dist-' + c, { recursive: true, force: true }); } catch(e){}
  try { execSync('powershell -File scripts/Build-Client.ps1 -Client ' + c, { stdio: 'inherit' }); } catch(e){ console.log('build failed: ' + c); }
}
console.log('DONE.');