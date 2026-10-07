const fs = require('fs');
const files = [
  'templates\\_shells\\editorial\\index.html',
  'templates\\_shells\\spec-first\\index.html',
  'templates\\_shells\\lookbook\\index.html',
  'templates\\brands\\zaheera\\index.html',
  'templates\\brands\\techhub\\index.html',
  'templates\\brands\\monetech\\index.html',
  'templates\\brands\\lumo\\index.html'
];
const editorialHero = 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1600&q=80';
const specHero = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600&q=80';
const lookHero = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80';
let total = 0;
for (const f of files) {
  const p = process.cwd() + '\\' + f;
  if (!fs.existsSync(p)) { console.log('SKIP (not found): ' + f); continue; }
  let t = fs.readFileSync(p, 'utf8');
  const isEditorial = f.indexOf('editorial') !== -1 || f.indexOf('zaheera') !== -1 || f.indexOf('lumo') !== -1;
  const isLook = f.indexOf('lookbook') !== -1;
  const isSpec = f.indexOf('spec-first') !== -1 || f.indexOf('techhub') !== -1 || f.indexOf('monetech') !== -1;
  const fallback = isEditorial ? editorialHero : (isSpec ? specHero : lookHero);
  let h = 0;
  // 1. store name
  const before1 = t.split('$store.config.name').length - 1;
  t = t.split('$store.config.name').join('$store.config.brand?.name');
  h += before1;
  // 2. hero image fallback
  const before2 = t.split("$store.config.heroImage || '/hero.jpg'").length - 1;
  t = t.split("$store.config.heroImage || '/hero.jpg'").join("$store.config.heroImage || ($store.config.brand && $store.config.brand.heroImage) || '" + fallback + "'");
  h += before2;
  fs.writeFileSync(p, t, 'utf8');
  console.log(f + ' -> ' + h + ' replacements');
  total += h;
}
console.log('total: ' + total);