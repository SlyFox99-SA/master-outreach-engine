const fs = require('fs');

// ---- 1. tailwind.config.js — ensure templates/ is scanned ----
const tp = process.cwd() + '\\tailwind.config.js';
let tt = fs.readFileSync(tp, 'utf8');
if (!tt.includes('templates')) {
  if (/content\s*:\s*\[/.test(tt)) {
    tt = tt.replace(/(content\s*:\s*\[)([\s\S]*?)(\])/, function(m, a, b, c) {
      var hasTrail = /,\s*$/.test(b.trim());
      var sep = hasTrail ? ' ' : ', ';
      return a + b + sep + "'./templates/**/*.html'" + c;
    });
    fs.writeFileSync(tp, tt, 'utf8');
    console.log('tailwind.config.js -> templates/** added');
  } else {
    console.log('tailwind.config.js -> NO content array, manual fix needed');
  }
} else {
  console.log('tailwind.config.js -> already includes templates');
}

// ---- 2. every shell — kill the last bad $store.cart.count ----
const shells = [
  'templates\\_shells\\editorial\\index.html',
  'templates\\_shells\\spec-first\\index.html',
  'templates\\_shells\\lookbook\\index.html',
  'templates\\brands\\zaheera\\index.html',
  'templates\\brands\\techhub\\index.html',
  'templates\\brands\\monetech\\index.html',
  'templates\\brands\\lumo\\index.html'
];
var total = 0;
for (const f of shells) {
  const p = process.cwd() + '\\' + f;
  if (!fs.existsSync(p)) { console.log('SKIP ' + f); continue; }
  let t = fs.readFileSync(p, 'utf8');
  let h = 0;
  // exact x-text="$store.cart.count" (bare, no conditional)
  var before = t.split('x-text="$store.cart.count"').length - 1;
  t = t.split('x-text="$store.cart.count"').join('x-text="$store.cart && $store.cart.count ? $store.cart.count() : 0"');
  h += before;
  // also any x-show with bare $store.cart.count (without trailing > 0 or || 0 which are handled)
  var before2 = t.split('$store.cart.count > 0').length - 1;
  t = t.split('$store.cart.count > 0').join('($store.cart && $store.cart.count ? $store.cart.count() : 0) > 0');
  h += before2;
  fs.writeFileSync(p, t, 'utf8');
  console.log(f + ' -> ' + h + ' fixes');
  total += h;
}
console.log('total cart fixes: ' + total);