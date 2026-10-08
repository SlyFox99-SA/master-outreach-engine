const fs = require('fs');

const catalogs = {
  techhub: {
    theme: { primary: '15 23 42', accent: '16 185 129', ink: '15 23 42', surface: '248 250 252' },
    categories: ['iPhones', 'Android', 'Accessories'],
    products: [
      { id:'ip13',   name:'iPhone 13',       category:'iPhones', blurb:'Certified pre-owned',       price:8999,  stock:3, image:'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=900&q=80', specs:['128GB storage','Battery health 92%','12 month warranty','Face ID tested'] },
      { id:'ip14p',  name:'iPhone 14 Pro',   category:'iPhones', blurb:'Pro-grade, Dynamic Island', price:15499, stock:5, image:'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=900&q=80', specs:['256GB storage','Dynamic Island','ProMotion 120Hz','A16 Bionic chip','30-day warranty'] },
      { id:'ip12',   name:'iPhone 12',       category:'iPhones', blurb:'Compact classic',           price:6299,  stock:0, image:'https://images.unsplash.com/photo-1607936854279-55e8a4c64888?w=900&q=80', specs:['64GB storage','Battery health 88%','12 month warranty'] },
      { id:'ip15',   name:'iPhone 15',       category:'iPhones', blurb:'Latest, USB-C',             price:17999, stock:2, image:'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&q=80', specs:['128GB storage','USB-C','Dynamic Island','A16 Bionic'] },
      { id:'ip11',   name:'iPhone 11',       category:'iPhones', blurb:'Great entry-level',         price:4299,  stock:4, image:'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=900&q=80', specs:['64GB','Battery 85%','Face ID'] },
      { id:'sg21',   name:'Samsung Galaxy S21', category:'Android', blurb:'Flagship, clean condition', price:6999, stock:3, image:'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=900&q=80', specs:['128GB','Exynos 2100','120Hz AMOLED','Triple camera'] },
      { id:'sg22',   name:'Samsung Galaxy S22', category:'Android', blurb:'Compact flagship',        price:9499, stock:2, image:'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=900&q=80', specs:['256GB','Snapdragon 8 Gen 1','50MP main'] },
      { id:'case1',  name:'Silicone Case',   category:'Accessories', blurb:'MagSafe compatible',     price:350,   stock:15, image:'https://images.unsplash.com/photo-1601593346740-925612772716?w=900&q=80', specs:['MagSafe','Silicone','Various colours'] },
      { id:'airp',   name:'AirPods Pro 2',   category:'Accessories', blurb:'ANC, USB-C',             price:3299,  stock:4, image:'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=900&q=80', specs:['Active noise cancellation','USB-C charging','6hr battery'] },
      { id:'chg',    name:'20W Fast Charger', category:'Accessories', blurb:'USB-C, original',       price:450,   stock:20, image:'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=900&q=80', specs:['20W USB-C','Fast charge','1m cable included'] }
    ]
  },
  monetech: {
    theme: { primary: '15 23 42', accent: '212 255 0', ink: '245 241 233', surface: '14 13 11' },
    categories: ['Sneakers', 'Running', 'Lifestyle'],
    products: [
      { id:'aj1',    name:'Air Jordan 1 Retro', category:'Sneakers', blurb:'Chicago colourway',     price:4899, stock:2, image:'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=900&q=80', specs:['US 8-12','Leather upper','Original box'] },
      { id:'af1',    name:'Air Force 1 Low',    category:'Sneakers', blurb:'White/white classic',   price:2299, stock:6, image:'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&q=80', specs:['US 7-12','Leather','Air cushioning'] },
      { id:'dunk',   name:'Nike Dunk Low',      category:'Sneakers', blurb:'Panda colourway',       price:2799, stock:4, image:'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=900&q=80', specs:['US 8-11','Leather upper','Panda white/black'] },
      { id:'yzy',    name:'Yeezy Boost 350',    category:'Sneakers', blurb:'Onyx',                  price:5299, stock:1, image:'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=900&q=80', specs:['US 9-11','Primeknit','Boost midsole'] },
      { id:'nb550',  name:'New Balance 550',    category:'Sneakers', blurb:'White/green',           price:2499, stock:3, image:'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=900&q=80', specs:['US 7-12','Leather','Retro basketball'] },
      { id:'run1',   name:'Pegasus 40',         category:'Running',  blurb:'Daily trainer',         price:2899, stock:5, image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80', specs:['US 7-12','React foam','Breathable mesh'] },
      { id:'run2',   name:'Ultraboost 22',      category:'Running',  blurb:'Boost cushioning',      price:3499, stock:3, image:'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900&q=80', specs:['US 8-12','Primeknit+','Continental outsole'] },
      { id:'ls1',    name:'Adidas Gazelle',     category:'Lifestyle', blurb:'Black suede',          price:1799, stock:7, image:'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=900&q=80', specs:['US 6-11','Suede upper','Gum sole'] },
      { id:'ls2',    name:'Vans Old Skool',     category:'Lifestyle', blurb:'Black/white',          price:1299, stock:8, image:'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=900&q=80', specs:['US 6-12','Canvas + suede','Waffle sole'] },
      { id:'ls3',    name:'Nike Air Max 90',    category:'Lifestyle', blurb:'Infrared',             price:2599, stock:4, image:'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=900&q=80', specs:['US 7-12','Leather/mesh','Air unit'] }
    ]
  },
  zaheera: {
    theme: { primary: '26 26 26', accent: '201 100 66', ink: '26 26 26', surface: '251 249 245' },
    categories: ['Fragrances', 'Gift Sets'],
    products: [
      { id:'oud-noir', name:'Oud Noir',       category:'Fragrances', blurb:'Smoky rose, oud, amber',   price:450, stock:6, image:'https://images.unsplash.com/photo-1541643600914-78b084683601?w=900&q=80', specs:['50ml Eau de Parfum','Smoky rose, oud, amber','Lasts 8-12 hours','Unisex'] },
      { id:'white-musk', name:'White Musk',   category:'Fragrances', blurb:'Cotton, vanilla, white musk', price:320, stock:8, image:'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&q=80', specs:['50ml Eau de Parfum','Cotton, vanilla, musk','Subtle everyday wear','Unisex'] },
      { id:'rose-taif', name:'Rose Taif',     category:'Fragrances', blurb:'Bulgarian rose, saffron', price:620, stock:2, image:'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=900&q=80', specs:['50ml EDP','Bulgarian rose','Saffron top note','Evening wear'] },
      { id:'amber-nights', name:'Amber Nights', category:'Fragrances', blurb:'Amber, tonka, sandalwood', price:395, stock:5, image:'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=900&q=80', specs:['50ml EDP','Amber, tonka','Sandalwood base'] },
      { id:'citrus',  name:'Cape Citrus',     category:'Fragrances', blurb:'Bergamot, neroli, cedar', price:380, stock:7, image:'https://images.unsplash.com/photo-1595150357266-d8f22e83d3e0?w=900&q=80', specs:['50ml EDP','Bergamot, neroli','Cedar base','Daytime'] },
      { id:'gift-1', name:'Discovery Set',    category:'Gift Sets',  blurb:'4 × 10ml travel',         price:520, stock:4, image:'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=900&q=80', specs:['4 × 10ml','Oud, Musk, Rose, Amber','Gift boxed'] },
      { id:'gift-2', name:'Atelier Duo',      category:'Gift Sets',  blurb:'Oud Noir + Rose Taif',    price:920, stock:3, image:'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=900&q=80', specs:['2 × 50ml','Oud Noir + Rose Taif','Gift wrapped'] }
    ]
  },
  lumo: {
    theme: { primary: '26 26 26', accent: '60 80 60', ink: '26 26 26', surface: '251 249 245' },
    categories: ['Serums', 'Moisturisers', 'Cleansers'],
    products: [
      { id:'vitc',    name:'Vitamin C Serum',       category:'Serums',      blurb:'15% L-ascorbic, brightening', price:320, stock:6, image:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900&q=80', specs:['30ml glass bottle','15% L-ascorbic acid','Brightens + evens tone','Use AM before SPF'] },
      { id:'niacin',  name:'Niacinamide 10%',      category:'Serums',      blurb:'Pore refining, oil control',   price:240, stock:9, image:'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=900&q=80', specs:['30ml glass bottle','10% Niacinamide','Refines pores, controls oil','AM + PM'] },
      { id:'hyal',    name:'Hyaluronic Moisturiser', category:'Moisturisers', blurb:'Deep hydration',             price:280, stock:5, image:'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80', specs:['50ml','Hyaluronic acid','Non-greasy','All skin types'] },
      { id:'spf',     name:'SPF 50 Sunscreen',     category:'Moisturisers', blurb:'Weightless, no white cast',   price:260, stock:7, image:'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&q=80', specs:['50ml','SPF 50 PA++++','No white cast','Reef-safe'] },
      { id:'ret',     name:'Retinol 0.5%',         category:'Serums',      blurb:'Overnight renewal',            price:380, stock:3, image:'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=900&q=80', specs:['30ml','0.5% encapsulated retinol','PM only','Start 2×/week'] },
      { id:'cleans',  name:'Gentle Gel Cleanser',  category:'Cleansers',   blurb:'pH-balanced, fragrance-free',  price:180, stock:12, image:'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&q=80', specs:['150ml','pH 5.5','Fragrance-free','Sensitive skin'] },
      { id:'clay',    name:'Kaolin Clay Mask',     category:'Cleansers',   blurb:'Detox, weekly treatment',      price:220, stock:6, image:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900&q=80', specs:['75ml','Kaolin + bentonite','Weekly use','Deep clean pores'] }
    ]
  }
};

const brandMap = { techhub: 'techhub', monetech: 'monetech', zaheera: 'zaheera', lumo: 'lumo' };

for (const [brand, data] of Object.entries(catalogs)) {
  const client = brand === 'techhub' ? 'techhub-phones'
               : brand === 'monetech' ? 'monetech-sneakers'
               : brand === 'zaheera' ? 'zaheera-fragrances'
               : 'lumo-skincare';

  const p = 'clients/' + client + '/src/config.json';
  if (!fs.existsSync(p)) { console.log('  skip ' + client); continue; }

  const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
  cfg.categories = data.categories;
  cfg.products = data.products;
  if (data.theme) cfg.theme = data.theme;

  fs.writeFileSync(p, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
  console.log('  ' + client + ': ' + data.products.length + ' products');

  // mirror to root data/config-<brand>.json
  const rootP = 'data/config-' + brand + '.json';
  if (fs.existsSync(rootP)) {
    const root = JSON.parse(fs.readFileSync(rootP, 'utf8'));
    root.categories = data.categories;
    root.products = data.products;
    if (data.theme) root.theme = data.theme;
    fs.writeFileSync(rootP, JSON.stringify(root, null, 2) + '\n', 'utf8');
    console.log('  → mirrored to ' + rootP);
  }
}
console.log('done.');