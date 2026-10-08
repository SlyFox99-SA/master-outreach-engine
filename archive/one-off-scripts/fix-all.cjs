const fs = require('fs');
let h = 0;

// ============ 1. MONETECH SHELL — sneaker copy ============
const mp = 'clients/monetech-sneakers/src/index.html';
let m = fs.readFileSync(mp, 'utf8');
const sneakerRepl = [
  ['FREE COURIER OVER R1000', 'FREE COURIER OVER R1500'],
  ['12 MONTH WARRANTY',       'AUTHENTICITY GUARANTEED'],
  ['IMEI VERIFIED',           '100% ORIGINAL'],
  ['TRUSTED SINCE 2021',      'TRUSTED SINCE 2019'],
  ['// LIVE INVENTORY',       '// FRESH HEAT'],
  ['<span class="stroke">UPGRADE</span> <span class="hot">SMART.</span>',
   '<span class="stroke">STEP</span> <span class="hot">CORRECT.</span>'],
  ['<h3>UPGRADE<br>SMART. NOT<br>EXPENSIVE.</h3>',
   '<h3>STEP<br>CORRECT. NOT<br>EXPENSIVE.</h3>'],
  ['Battery, screen, camera, speakers, cellular, IMEI \u2014 every device logged and attached to your invoice.',
   'Every pair verified by hand. Stitching, sole, tags, box. Authenticity card attached to every order.'],
  ['Free repair or replace within 12 months if it\'s not physical damage. No small print.',
   'Wrong fit? 30-day exchange. No questions, no restocking fee. Courier both ways on us.'],
  ['<p class="num">12 MO</p>', '<p class="num">30 DAY</p>'],
  ['<p class="lbl">WARRANTY</p>', '<p class="lbl">EXCHANGE</p>'],
  ['<p class="num">40</p>', '<p class="num">100%</p>'],
  ['<p class="lbl">PT CHECK</p>', '<p class="lbl">AUTHENTIC</p>'],
  ['<div class="stat"><b>40</b>PT CHECK</div>', '<div class="stat"><b>100%</b>AUTHENTIC</div>'],
  ['<div class="stat"><b>12<span style="font-size: 14px;">MO</span></b>WARRANTY</div>',
   '<div class="stat"><b>30<span style="font-size: 14px;">D</span></b>EXCHANGE</div>'],
  ['<button>IPHONES</button>',  '<button>SNEAKERS</button>'],
  ['<button>ACCESSORIES</button>', '<button>RUNNING</button>'],
  ['<button>UNDER R5K</button>', '<button>LIFESTYLE</button>'],
  ['<button>NEW IN</button>',    '<button>NEW DROP</button>'],
  ['FREE COURIER OVER R1800',    'FREE COURIER OVER R1500']
];
for (const [from, to] of sneakerRepl) {
  if (m.includes(from)) { m = m.split(from).join(to); h++; }
}
fs.writeFileSync(mp, m, 'utf8');
console.log('  monetech: ' + sneakerRepl.filter(([f]) => false).length + ' considered, ' + h + ' replaced');

// ============ 2. EDITORIAL/ZAHEERA — remove Chanel hero fallback ============
for (const c of ['zaheera-fragrances','lumo-skincare']) {
  const p = 'clients/' + c + '/src/index.html';
  if (!fs.existsSync(p)) continue;
  let t = fs.readFileSync(p, 'utf8');
  const before = t;
  // Remove the chanel bottle fallback URL
  t = t.replace(/https:\/\/images\.unsplash\.com\/photo-1541643600914-78b084683601[^\s'"]*/g, '');
  // Ensure hero shows text-only if no image (remove img if src empty)
  if (t !== before) { fs.writeFileSync(p, t, 'utf8'); console.log('  ' + c + ': Chanel fallback removed'); }
  else console.log('  ' + c + ': no fallback');
}

// ============ 3. RESEED — unique images (SVG fallback for overflow) ============
function svgCard(name, bg, fg) {
  const esc = name.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/#/g,'%23');
  const lines = name.length > 20 ? name.match(/.{1,20}/g) : [name];
  const tspan = lines.map((l, i) => `<tspan x="450" dy="${i === 0 ? 0 : 60}">${l}</tspan>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900"><rect width="900" height="900" fill="${bg}"/><text x="450" y="450" text-anchor="middle" font-family="system-ui,sans-serif" font-size="56" font-weight="700" fill="${fg}">${tspan}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

const pools = {
  iphones: [
    'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=900&q=80',
    'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=900&q=80',
    'https://images.unsplash.com/photo-1592286927505-1def25115558?w=900&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=900&q=80',
    'https://images.unsplash.com/photo-1603898037225-5b892dd4f1c0?w=900&q=80',
    'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=900&q=80',
    'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=900&q=80',
    'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=900&q=80'
  ],
  android: [
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=900&q=80',
    'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=900&q=80',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&q=80',
    'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=900&q=80',
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=900&q=80',
    'https://images.unsplash.com/photo-1533228100845-08145b01de14?w=900&q=80'
  ],
  accessories: [
    'https://images.unsplash.com/photo-1601593346740-925612772716?w=900&q=80',
    'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=900&q=80',
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=900&q=80',
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=900&q=80',
    'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=900&q=80',
    'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=900&q=80'
  ],
  sneakers: [
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=900&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&q=80',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=900&q=80',
    'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=900&q=80',
    'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=900&q=80',
    'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=900&q=80',
    'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=900&q=80',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&q=80'
  ],
  running: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=900&q=80',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=900&q=80',
    'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=900&q=80'
  ],
  lifestyle: [
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=900&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=900&q=80',
    'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=900&q=80',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=900&q=80',
    'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=900&q=80'
  ],
  fragrance: [
    'https://images.unsplash.com/photo-1541643600914-78b084683601?w=900&q=80',
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&q=80',
    'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=900&q=80',
    'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=900&q=80',
    'https://images.unsplash.com/photo-1595150357266-d8f22e83d3e0?w=900&q=80',
    'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=900&q=80',
    'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=900&q=80',
    'https://images.unsplash.com/photo-1585232004423-244e0e6904e3?w=900&q=80'
  ],
  skincare: [
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900&q=80',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=900&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80',
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&q=80',
    'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=900&q=80',
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=900&q=80',
    'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=900&q=80',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=900&q=80'
  ]
};

const brandThemes = {
  techhub:  { primary: '15 23 42',  accent: '16 185 129', bg: '#f1f5f9', fg: '#0f172a' },
  monetech: { primary: '15 23 42',  accent: '212 255 0',  bg: '#0e0d0b', fg: '#d4ff00' },
  zaheera:  { primary: '26 26 26',  accent: '201 100 66', bg: '#f5f1ea', fg: '#1a1a1a' },
  lumo:     { primary: '26 26 26',  accent: '60 80 60',   bg: '#f5f1ea', fg: '#1a1a1a' }
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
  const th = brandThemes[brand];

  // Track usage per pool per brand
  const used = {};
  cfg.products.forEach((prod) => {
    const key = catPool(prod.category);
    used[key] = (used[key] || 0) + 1;
    const pool = pools[key] || pools.lifestyle;
    const idx = used[key] - 1;
    if (idx < pool.length) {
      prod.images = [pool[idx]];
    } else {
      prod.images = [svgCard(prod.name, th.bg, th.fg)];
    }
    prod.image = prod.images[0];
  });
  fs.writeFileSync(p, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
  console.log('  ' + client + ': unique images assigned');

  // Mirror to root data config
  const rp = 'data/config-' + brand + '.json';
  if (fs.existsSync(rp)) {
    const root = JSON.parse(fs.readFileSync(rp, 'utf8'));
    root.products = cfg.products;
    root.categories = cfg.categories;
    root.theme = cfg.theme;
    fs.writeFileSync(rp, JSON.stringify(root, null, 2) + '\n', 'utf8');
  }
}

// Regenerate configs.js
const all = {};
for (const b of ['techhub','monetech','zaheera','lumo']) {
  const p = 'data/config-' + b + '.json';
  if (fs.existsSync(p)) all[b] = JSON.parse(fs.readFileSync(p, 'utf8'));
}
all.active = all.techhub;
fs.writeFileSync('configs.js', 'window.__CONFIGS = ' + JSON.stringify(all) + ';\n', 'utf8');
console.log('  configs.js regenerated: ' + fs.statSync('configs.js').size + ' bytes');
console.log('DONE.');