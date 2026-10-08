const fs = require('fs');

// Image pools — reuse across products of same category so it feels cohesive
const img = {
  iphones: [
    'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=900&q=80',
    'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=900&q=80',
    'https://images.unsplash.com/photo-1592286927505-1def25115558?w=900&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=900&q=80',
    'https://images.unsplash.com/photo-1603898037225-5b892dd4f1c0?w=900&q=80'
  ],
  android: [
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=900&q=80',
    'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=900&q=80',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&q=80'
  ],
  accessories: [
    'https://images.unsplash.com/photo-1601593346740-925612772716?w=900&q=80',
    'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=900&q=80',
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=900&q=80'
  ],
  sneakers: [
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=900&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&q=80',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=900&q=80',
    'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=900&q=80',
    'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=900&q=80'
  ],
  running: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=900&q=80'
  ],
  lifestyle: [
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=900&q=80',
    'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=900&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=900&q=80'
  ],
  fragrance: [
    'https://images.unsplash.com/photo-1541643600914-78b084683601?w=900&q=80',
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&q=80',
    'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=900&q=80',
    'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=900&q=80',
    'https://images.unsplash.com/photo-1595150357266-d8f22e83d3e0?w=900&q=80',
    'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=900&q=80'
  ],
  skincare: [
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900&q=80',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=900&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80',
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&q=80',
    'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=900&q=80',
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=900&q=80'
  ]
};

const mkImages = (pool, seed) => {
  const a = pool[seed % pool.length];
  const b = pool[(seed + 1) % pool.length];
  const c = pool[(seed + 2) % pool.length];
  return [a, b, c];
};

const catalogs = {
  techhub: {
    theme: { primary: '15 23 42', accent: '16 185 129', ink: '15 23 42', surface: '248 250 252' },
    categories: ['iPhones', 'Android', 'Accessories'],
    products: [
      { id:'ip15pm', name:'iPhone 15 Pro Max', category:'iPhones', blurb:'Titanium, USB-C', price:22999, stock:2 },
      { id:'ip15',   name:'iPhone 15',         category:'iPhones', blurb:'Latest, USB-C',   price:17999, stock:3 },
      { id:'ip14p',  name:'iPhone 14 Pro',     category:'iPhones', blurb:'Pro-grade, Dynamic Island', price:15499, stock:5 },
      { id:'ip14',   name:'iPhone 14',         category:'iPhones', blurb:'Reliable daily',   price:12499, stock:4 },
      { id:'ip13pm', name:'iPhone 13 Pro Max', category:'iPhones', blurb:'Big screen, big battery', price:13999, stock:3 },
      { id:'ip13',   name:'iPhone 13',         category:'iPhones', blurb:'Certified pre-owned', price:8999, stock:6 },
      { id:'ip12',   name:'iPhone 12',         category:'iPhones', blurb:'Compact classic',  price:6299, stock:0 },
      { id:'ip11',   name:'iPhone 11',         category:'iPhones', blurb:'Entry-level, great value', price:4299, stock:7 },
      { id:'iphx',   name:'iPhone XR',         category:'iPhones', blurb:'Budget-friendly',  price:2999, stock:5 },
      { id:'sg23',   name:'Samsung Galaxy S23', category:'Android', blurb:'Latest flagship',  price:13999, stock:2 },
      { id:'sg22',   name:'Samsung Galaxy S22', category:'Android', blurb:'Compact flagship', price:9499, stock:4 },
      { id:'sg21',   name:'Samsung Galaxy S21', category:'Android', blurb:'Flagship, clean',  price:6999, stock:3 },
      { id:'a54',    name:'Galaxy A54',         category:'Android', blurb:'Mid-range sweet spot', price:4999, stock:6 },
      { id:'a34',    name:'Galaxy A34',         category:'Android', blurb:'Solid everyday',   price:3799, stock:5 },
      { id:'pxl7',   name:'Google Pixel 7',     category:'Android', blurb:'Best camera in class', price:8499, stock:3 },
      { id:'pxl6a',  name:'Google Pixel 6a',    category:'Android', blurb:'Compact, clean Android', price:5299, stock:4 },
      { id:'case1',  name:'Silicone Case',      category:'Accessories', blurb:'MagSafe compatible', price:350, stock:25 },
      { id:'case2',  name:'Clear Case',         category:'Accessories', blurb:'Anti-yellow TPU', price:280, stock:30 },
      { id:'airp',   name:'AirPods Pro 2',      category:'Accessories', blurb:'ANC, USB-C',  price:3299, stock:6 },
      { id:'airp3',  name:'AirPods 3rd Gen',    category:'Accessories', blurb:'Spatial audio', price:2199, stock:8 },
      { id:'chg20',  name:'20W USB-C Charger',  category:'Accessories', blurb:'Fast charge', price:450, stock:40 },
      { id:'chg65',  name:'65W GaN Charger',    category:'Accessories', blurb:'Charges everything', price:899, stock:15 },
      { id:'cbl',    name:'USB-C to Lightning', category:'Accessories', blurb:'1m braided',   price:220, stock:50 },
      { id:'pow',    name:'10,000mAh Power Bank', category:'Accessories', blurb:'Fast charge both ways', price:699, stock:12 }
    ]
  },
  monetech: {
    theme: { primary: '15 23 42', accent: '212 255 0', ink: '245 241 233', surface: '14 13 11' },
    categories: ['Sneakers', 'Running', 'Lifestyle'],
    products: [
      { id:'aj1',    name:'Air Jordan 1 Retro High', category:'Sneakers', blurb:'Chicago colourway', price:4899, stock:2 },
      { id:'aj1low', name:'Air Jordan 1 Low',        category:'Sneakers', blurb:'White/black',       price:2699, stock:4 },
      { id:'aj4',    name:'Air Jordan 4 Retro',      category:'Sneakers', blurb:'Military black',     price:5499, stock:2 },
      { id:'af1',    name:'Air Force 1 Low',         category:'Sneakers', blurb:'White/white classic', price:2299, stock:8 },
      { id:'dunkp',  name:'Nike Dunk Low Panda',     category:'Sneakers', blurb:'Panda colourway',    price:2799, stock:5 },
      { id:'dunkr',  name:'Nike Dunk Low Retro',     category:'Sneakers', blurb:'Grey fog',           price:2499, stock:3 },
      { id:'yzy35',  name:'Yeezy Boost 350 V2',      category:'Sneakers', blurb:'Onyx',               price:5299, stock:1 },
      { id:'yzy50',  name:'Yeezy Slide',             category:'Sneakers', blurb:'Bone',               price:1899, stock:6 },
      { id:'nb550',  name:'New Balance 550',         category:'Sneakers', blurb:'White/green',        price:2499, stock:4 },
      { id:'nb9060', name:'New Balance 9060',        category:'Sneakers', blurb:'Sea salt',           price:3399, stock:3 },
      { id:'samb',   name:'Adidas Samba OG',         category:'Sneakers', blurb:'Black/white',        price:1999, stock:7 },
      { id:'gaz',    name:'Adidas Gazelle',          category:'Sneakers', blurb:'Black suede',        price:1799, stock:8 },
      { id:'peg40',  name:'Pegasus 40',              category:'Running',  blurb:'Daily trainer',      price:2899, stock:5 },
      { id:'ub22',   name:'Ultraboost 22',           category:'Running',  blurb:'Boost cushioning',   price:3499, stock:4 },
      { id:'vom',    name:'Vomero 17',               category:'Running',  blurb:'Cushioned daily',    price:3199, stock:3 },
      { id:'nb1080', name:'New Balance 1080v13',     category:'Running',  blurb:'Premium cushion',    price:3699, stock:2 },
      { id:'nb880',  name:'New Balance 880v13',      category:'Running',  blurb:'Reliable trainer',   price:2599, stock:5 },
      { id:'hoka',   name:'Hoka Clifton 9',          category:'Running',  blurb:'Light and plush',    price:2899, stock:4 },
      { id:'am90',   name:'Nike Air Max 90',         category:'Lifestyle', blurb:'Infrared',          price:2599, stock:5 },
      { id:'am97',   name:'Nike Air Max 97',         category:'Lifestyle', blurb:'Silver bullet',     price:2999, stock:3 },
      { id:'vans',   name:'Vans Old Skool',          category:'Lifestyle', blurb:'Black/white',       price:1299, stock:10 },
      { id:'cvs',    name:'Converse Chuck 70',       category:'Lifestyle', blurb:'High top, black',   price:1599, stock:8 },
      { id:'nb530',  name:'New Balance 530',         category:'Lifestyle', blurb:'Silver/white',      price:2199, stock:6 },
      { id:'forum',  name:'Adidas Forum Low',        category:'Lifestyle', blurb:'White/blue',        price:1899, stock:5 }
    ]
  },
  zaheera: {
    theme: { primary: '26 26 26', accent: '201 100 66', ink: '26 26 26', surface: '251 249 245' },
    categories: ['Fragrances', 'Gift Sets', 'Home'],
    products: [
      { id:'oud-noir',  name:'Oud Noir',          category:'Fragrances', blurb:'Smoky rose, oud, amber',   price:450, stock:6 },
      { id:'white-musk',name:'White Musk',        category:'Fragrances', blurb:'Cotton, vanilla, white musk', price:320, stock:9 },
      { id:'rose-taif', name:'Rose Taif',         category:'Fragrances', blurb:'Bulgarian rose, saffron',  price:620, stock:3 },
      { id:'amber-n',   name:'Amber Nights',      category:'Fragrances', blurb:'Amber, tonka, sandalwood', price:395, stock:7 },
      { id:'citrus',    name:'Cape Citrus',       category:'Fragrances', blurb:'Bergamot, neroli, cedar',  price:380, stock:8 },
      { id:'jasmine',   name:'Jasmine Noir',      category:'Fragrances', blurb:'Night-blooming jasmine',   price:420, stock:5 },
      { id:'saffron',   name:'Saffron Rose',      category:'Fragrances', blurb:'Saffron, rose, oud',       price:550, stock:4 },
      { id:'vetiver',   name:'Vetiver Woods',     category:'Fragrances', blurb:'Vetiver, cedar, tobacco',  price:490, stock:6 },
      { id:'fig',       name:'Fig & Cassis',      category:'Fragrances', blurb:'Green fig, blackcurrant',  price:410, stock:7 },
      { id:'salt',      name:'Sea Salt',          category:'Fragrances', blurb:'Salt, driftwood, sage',    price:390, stock:9 },
      { id:'vanilla',   name:'Vanilla Bourbon',   category:'Fragrances', blurb:'Vanilla, bourbon, caramel', price:440, stock:5 },
      { id:'neroli',    name:'Neroli Bloom',      category:'Fragrances', blurb:'Neroli, orange blossom',   price:470, stock:6 },
      { id:'gift-1',    name:'Discovery Set',     category:'Gift Sets',  blurb:'4 × 10ml travel',          price:520, stock:8 },
      { id:'gift-2',    name:'Atelier Duo',       category:'Gift Sets',  blurb:'Oud Noir + Rose Taif',     price:920, stock:4 },
      { id:'gift-3',    name:'Trio Sampler',      category:'Gift Sets',  blurb:'3 × 30ml',                 price:890, stock:5 },
      { id:'gift-4',    name:'Bridal Gift Box',   category:'Gift Sets',  blurb:'Jasmine + Rose + Musk',    price:1290, stock:2 },
      { id:'gift-5',    name:'Signature Box',     category:'Gift Sets',  blurb:'Full 50ml + travel spray', price:1490, stock:3 },
      { id:'cndl-1',    name:'Oud Candle',        category:'Home',       blurb:'220g, soy wax',            price:380, stock:10 },
      { id:'cndl-2',    name:'Amber Candle',      category:'Home',       blurb:'220g, soy wax',            price:380, stock:11 },
      { id:'cndl-3',    name:'Rose Candle',       category:'Home',       blurb:'220g, soy wax',            price:380, stock:9 },
      { id:'dif1',      name:'Reed Diffuser',     category:'Home',       blurb:'Fig & Cassis',             price:460, stock:7 },
      { id:'dif2',      name:'Reed Diffuser',     category:'Home',       blurb:'White Musk',               price:460, stock:6 },
      { id:'sachet',    name:'Drawer Sachets',    category:'Home',       blurb:'Set of 3, linen scented',  price:180, stock:15 }
    ]
  },
  lumo: {
    theme: { primary: '26 26 26', accent: '60 80 60', ink: '26 26 26', surface: '251 249 245' },
    categories: ['Serums', 'Moisturisers', 'Cleansers', 'Treatments'],
    products: [
      { id:'vitc',    name:'Vitamin C Serum 15%',    category:'Serums',       blurb:'Brightening, antioxidant',   price:320, stock:9 },
      { id:'vitc20',  name:'Vitamin C Serum 20%',    category:'Serums',       blurb:'Advanced brightening',       price:420, stock:5 },
      { id:'niacin',  name:'Niacinamide 10%',        category:'Serums',       blurb:'Pore refining, oil control', price:240, stock:12 },
      { id:'ret5',    name:'Retinol 0.5%',           category:'Serums',       blurb:'Overnight renewal',          price:380, stock:6 },
      { id:'ret10',   name:'Retinol 1.0%',           category:'Serums',       blurb:'Advanced renewal',           price:480, stock:3 },
      { id:'ha5',     name:'Hyaluronic Acid 2%',     category:'Serums',       blurb:'Deep hydration',             price:280, stock:10 },
      { id:'peel',    name:'AHA/BHA Peeling',        category:'Serums',       blurb:'Weekly exfoliation',         price:340, stock:7 },
      { id:'vitb5',   name:'Vitamin B5 Serum',       category:'Serums',       blurb:'Soothing, barrier repair',   price:260, stock:8 },
      { id:'hyal',    name:'Hyaluronic Moisturiser', category:'Moisturisers', blurb:'48hr hydration',             price:280, stock:11 },
      { id:'spf50',   name:'SPF 50 Sunscreen',       category:'Moisturisers', blurb:'Weightless, no white cast',  price:260, stock:15 },
      { id:'spf50t',  name:'SPF 50 Tinted',          category:'Moisturisers', blurb:'Light tint, all skin',       price:290, stock:8 },
      { id:'night',   name:'Night Cream',            category:'Moisturisers', blurb:'Rich, restorative',          price:380, stock:6 },
      { id:'gel',     name:'Oil-Free Gel Cream',     category:'Moisturisers', blurb:'Lightweight, oily skin',     price:300, stock:9 },
      { id:'cer',     name:'Ceramide Cream',         category:'Moisturisers', blurb:'Barrier repair',             price:340, stock:7 },
      { id:'cleans',  name:'Gentle Gel Cleanser',    category:'Cleansers',    blurb:'pH 5.5, fragrance-free',     price:180, stock:20 },
      { id:'foam',    name:'Foaming Cleanser',       category:'Cleansers',    blurb:'Deep clean, oily skin',      price:200, stock:14 },
      { id:'oil',     name:'Cleansing Oil',          category:'Cleansers',    blurb:'Removes makeup + SPF',       price:260, stock:10 },
      { id:'balm',    name:'Cleansing Balm',         category:'Cleansers',    blurb:'Melts makeup away',          price:320, stock:8 },
      { id:'clay',    name:'Kaolin Clay Mask',       category:'Treatments',   blurb:'Weekly detox',               price:220, stock:9 },
      { id:'eye',     name:'Eye Cream',              category:'Treatments',   blurb:'De-puffs, brightens',        price:340, stock:6 },
      { id:'lip',     name:'Lip Treatment',          category:'Treatments',   blurb:'Repairs dry lips',           price:140, stock:18 },
      { id:'spot',    name:'Spot Treatment',         category:'Treatments',   blurb:'Overnight blemish fix',      price:180, stock:12 },
      { id:'mask',    name:'Sheet Mask Set',         category:'Treatments',   blurb:'5-pack, assorted',           price:200, stock:10 }
    ]
  }
};

const catFor = c => c === 'Fragrances' || c === 'Gift Sets' || c === 'Home' ? 'fragrance'
                  : c === 'Serums' || c === 'Moisturisers' || c === 'Cleansers' || c === 'Treatments' ? 'skincare'
                  : c === 'iPhones' ? 'iphones' : c === 'Android' ? 'android' : c === 'Accessories' ? 'accessories'
                  : c === 'Sneakers' ? 'sneakers' : c === 'Running' ? 'running' : 'lifestyle';

for (const [brand, data] of Object.entries(catalogs)) {
  const client = brand === 'techhub' ? 'techhub-phones'
               : brand === 'monetech' ? 'monetech-sneakers'
               : brand === 'zaheera' ? 'zaheera-fragrances'
               : 'lumo-skincare';

  // Build products with images array
  const products = data.products.map((p, i) => {
    const pool = img[catFor(p.category)];
    return Object.assign({}, p, { images: mkImages(pool, i), image: mkImages(pool, i)[0] });
  });

  const payload = { categories: data.categories, products: products, theme: data.theme };

  const p = 'clients/' + client + '/src/config.json';
  if (!fs.existsSync(p)) { console.log('  skip ' + client); continue; }
  const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
  Object.assign(cfg, payload);
  fs.writeFileSync(p, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
  console.log('  ' + client + ': ' + products.length + ' products');

  const rootP = 'data/config-' + brand + '.json';
  if (fs.existsSync(rootP)) {
    const root = JSON.parse(fs.readFileSync(rootP, 'utf8'));
    Object.assign(root, payload);
    fs.writeFileSync(rootP, JSON.stringify(root, null, 2) + '\n', 'utf8');
  }
}

// Regenerate configs.js — combines all 4 clients + active
const all = {};
for (const b of ['techhub','monetech','zaheera','lumo']) {
  const p = 'data/config-' + b + '.json';
  if (fs.existsSync(p)) all[b] = JSON.parse(fs.readFileSync(p, 'utf8'));
}
all.active = all.techhub;
fs.writeFileSync('configs.js', 'window.__CONFIGS = ' + JSON.stringify(all) + ';\n', 'utf8');
console.log('  configs.js regenerated (' + fs.statSync('configs.js').size + ' bytes)');
console.log('done.');