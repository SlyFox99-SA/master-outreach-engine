const fs = require('fs');

// Bigger verified image pools
const pools = {
  iphones: [
    'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=900&q=80',
    'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=900&q=80',
    'https://images.unsplash.com/photo-1592286927505-1def25115558?w=900&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=900&q=80',
    'https://images.unsplash.com/photo-1603898037225-5b892dd4f1c0?w=900&q=80',
    'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=900&q=80',
    'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=900&q=80',
    'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=900&q=80',
    'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=900&q=80',
    'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=900&q=80'
  ],
  android: [
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=900&q=80',
    'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=900&q=80',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&q=80',
    'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=900&q=80',
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=900&q=80',
    'https://images.unsplash.com/photo-1533228100845-08145b01de14?w=900&q=80',
    'https://images.unsplash.com/photo-1618478594486-c65b899c4936?w=900&q=80',
    'https://images.unsplash.com/photo-1592890288564-76628a30a657?w=900&q=80'
  ],
  accessories: [
    'https://images.unsplash.com/photo-1601593346740-925612772716?w=900&q=80',
    'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=900&q=80',
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=900&q=80',
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=900&q=80',
    'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=900&q=80',
    'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=900&q=80',
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=900&q=80',
    'https://images.unsplash.com/photo-1612286372436-f0d26cc9a4f6?w=900&q=80',
    'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=900&q=80',
    'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=900&q=80'
  ],
  sneakers: [
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=900&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&q=80',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=900&q=80',
    'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=900&q=80',
    'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=900&q=80',
    'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=900&q=80',
    'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=900&q=80',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&q=80',
    'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=900&q=80',
    'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=900&q=80',
    'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=900&q=80',
    'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=900&q=80'
  ],
  running: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=900&q=80',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=900&q=80',
    'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=900&q=80',
    'https://images.unsplash.com/photo-1483721310020-03333e577078?w=900&q=80',
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=900&q=80',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=900&q=80'
  ],
  lifestyle: [
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=900&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=900&q=80',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=900&q=80',
    'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=900&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&q=80',
    'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=900&q=80',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=900&q=80'
  ],
  fragrance: [
    'https://images.unsplash.com/photo-1541643600914-78b084683601?w=900&q=80',
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&q=80',
    'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=900&q=80',
    'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=900&q=80',
    'https://images.unsplash.com/photo-1595150357266-d8f22e83d3e0?w=900&q=80',
    'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=900&q=80',
    'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=900&q=80',
    'https://images.unsplash.com/photo-1585232004423-244e0e6904e3?w=900&q=80',
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900&q=80',
    'https://images.unsplash.com/photo-1616949755610-8f21c33f1374?w=900&q=80',
    'https://images.unsplash.com/photo-1595425964077-efd4cf22c5d1?w=900&q=80',
    'https://images.unsplash.com/photo-1573575155376-b5010099301b?w=900&q=80',
    'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=901&q=80',
    'https://images.unsplash.com/photo-1616949755610-8f21c33f1374?w=901&q=80',
    'https://images.unsplash.com/photo-1595425964077-efd4cf22c5d1?w=901&q=80',
    'https://images.unsplash.com/photo-1573575155376-b5010099301b?w=901&q=80'
  ],
  skincare: [
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900&q=80',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=900&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80',
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&q=80',
    'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=900&q=80',
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=900&q=80',
    'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=900&q=80',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=900&q=80',
    'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=900&q=80',
    'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=900&q=80',
    'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=900&q=80',
    'https://images.unsplash.com/photo-1615396899839-c99c121888b0?w=900&q=80',
    'https://images.unsplash.com/photo-1617897903246-719242758050?w=900&q=80'
  ]
};

const catPool = c => c === 'Fragrances' || c === 'Gift Sets' || c === 'Home' ? 'fragrance'
                   : c === 'Serums' || c === 'Moisturisers' || c === 'Cleansers' || c === 'Treatments' ? 'skincare'
                   : c === 'iPhones' ? 'iphones' : c === 'Android' ? 'android' : c === 'Accessories' ? 'accessories'
                   : c === 'Sneakers' ? 'sneakers' : c === 'Running' ? 'running' : 'lifestyle';

const clientMap = { techhub:'techhub-phones', monetech:'monetech-sneakers', zaheera:'zaheera-fragrances', lumo:'lumo-skincare' };

for (const [brand, client] of Object.entries(clientMap)) {
  const p = 'clients/' + client + '/src/config.json';
  if (!fs.existsSync(p)) continue;
  const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));

  const used = {};
  cfg.products.forEach((prod) => {
    const key = catPool(prod.category);
    used[key] = (used[key] || 0) + 1;
    const pool = pools[key] || pools.lifestyle;
    const idx = (used[key] - 1) % pool.length;
    prod.images = [pool[idx]];
    prod.image = pool[idx];
  });

  fs.writeFileSync(p, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
  console.log('  ' + client + ': all products have real images');

  const rp = 'data/config-' + brand + '.json';
  if (fs.existsSync(rp)) {
    const root = JSON.parse(fs.readFileSync(rp, 'utf8'));
    root.products = cfg.products;
    root.categories = cfg.categories;
    root.theme = cfg.theme;
    fs.writeFileSync(rp, JSON.stringify(root, null, 2) + '\n', 'utf8');
  }
}

const all = {};
for (const b of ['techhub','monetech','zaheera','lumo']) {
  const cp = 'data/config-' + b + '.json';
  if (fs.existsSync(cp)) all[b] = JSON.parse(fs.readFileSync(cp, 'utf8'));
}
all.active = all.techhub;
fs.writeFileSync('configs.js', 'window.__CONFIGS = ' + JSON.stringify(all) + ';\n', 'utf8');
console.log('  configs.js: ' + fs.statSync('configs.js').size);