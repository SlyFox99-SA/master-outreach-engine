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
let total = 0;
for (const f of files) {
  const p = process.cwd() + '\\' + f;
  if (!fs.existsSync(p)) { console.log('SKIP: ' + f); continue; }
  let t = fs.readFileSync(p, 'utf8');
  let h = 0;
  // function calls with safety
  const before1 = t.split('$store.cart.count || 0').length - 1;
  t = t.split('$store.cart.count || 0').join('($store.cart && $store.cart.count ? $store.cart.count() : 0)');
  h += before1;
  const before2 = t.split('$store.cart.count > 0').length - 1;
  t = t.split('$store.cart.count > 0').join('($store.cart && $store.cart.count ? $store.cart.count() : 0) > 0');
  h += before2;
  const before3 = t.split('$store.cart.subtotal').length - 1;
  t = t.split('$store.cart.subtotal').join('($store.cart && $store.cart.subtotal ? $store.cart.subtotal() : 0)');
  h += before3;
  // guard items loop with empty array fallback
  const before4 = t.split('x-for="i in $store.cart.items"').length - 1;
  t = t.split('x-for="i in $store.cart.items"').join('x-for="i in ($store.cart?.items || [])"');
  h += before4;
  fs.writeFileSync(p, t, 'utf8');
  console.log(f + ' -> ' + h + ' fixes');
  total += h;
}
console.log('total: ' + total);