const fs = require('fs');
const p = process.cwd() + '\\data';
const map = {
  'config-techhub.json':        'Phones & Tech',
  'config-monetech.json':       'Sneakers & Shoes',
  'config-zaheera.json':        'Fragrances',
  'config-lumo.json':           'Skincare',
  'config-glow-salon.json':     'Hair & Beauty',
  'config-naledi.json':         'Career Coach',
  'config-nova-studio.json':    'Creative Studio',
  'config-mama-thandi.json':    'Home Kitchen',
  'config-thabo-handyman.json': 'Handyman Services'
};
let h = 0;
for (const [file, newName] of Object.entries(map)) {
  const full = p + '\\' + file;
  if (!fs.existsSync(full)) { console.log('  SKIP ' + file); continue; }
  const c = JSON.parse(fs.readFileSync(full, 'utf8'));
  const old = (c.brand && c.brand.name) || '(none)';
  c.brand = c.brand || {};
  c.brand.name = newName;
  fs.writeFileSync(full, JSON.stringify(c, null, 2) + '\n', 'utf8');
  console.log('  ' + old + '  ->  ' + newName);
  h++;
}
console.log('total: ' + h + ' files updated');