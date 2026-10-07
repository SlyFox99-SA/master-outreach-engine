const fs = require('fs');
const p = 'data/config-zaheera.json';
const c = JSON.parse(fs.readFileSync(p, 'utf8'));
const oud = c.products.find(x => x.name === 'Oud Noir');
if (!oud) { console.log('MISS Oud Noir'); process.exit(1); }
oud.images = [
  'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1000&q=80',
  'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1000&q=80',
  'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=1000&q=80'
];
oud.image = oud.images[0];
oud.story = 'Oud Noir opens with a smoked rose — not sweet, not floral, but the flower after the fire. Behind it, the oud comes in slow, resinous and dry, and stays for hours. Wears best in the evening, or in winter when everything else feels too light. Hand-blended in Cape Town. Fifty millilitres.';
fs.writeFileSync(p, JSON.stringify(c, null, 2) + '\n', 'utf8');
console.log('Oud Noir: ' + oud.images.length + ' images + story added');