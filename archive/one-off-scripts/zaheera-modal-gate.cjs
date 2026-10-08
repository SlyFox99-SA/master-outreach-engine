const fs = require('fs');
const p = 'clients/zaheera-fragrances/src/index.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// 1. Modal only shows when product is set
const oldModal = '<div x-show="$store.config.detailOpen" x-cloak class="fixed inset-0 z-50 bg-black/70 p-0 md:p-8 overflow-hidden"';
const newModal = '<div x-show="$store.config.detailOpen && $store.config.detailProduct" x-cloak class="fixed inset-0 z-50 bg-black/70 p-0 md:p-8 overflow-hidden"';
if (t.includes(oldModal)) { t = t.replace(oldModal, newModal); h++; console.log('  modal gated on detailProduct'); }

// 2. Add explicit @click on the img inside the product card
// Find the img inside the aspect-ratio div
const imgRe = /(<img class="p-img w-full h-full object-cover" :src="[^"]*")/;
if (imgRe.test(t)) {
  t = t.replace(imgRe, '$1 @click.stop="$store.config.openDetail(p)" style="cursor:pointer;"');
  h++;
  console.log('  img click added');
} else {
  console.log('  MISS img');
}

// 3. Remove the @click from the outer div to avoid duplicate firing
t = t.replace(' @click="$store.config.openDetail(p)"', '');

fs.writeFileSync(p, t, 'utf8');
console.log('patched: ' + h + ' / 2. size: ' + t.length);