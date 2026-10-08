const fs = require('fs');
const p = 'clients/zaheera-fragrances/src/index.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// 1. Add @click + cursor to the product photo div
const old = '<div class="relative" style="aspect-ratio:4/5;overflow:hidden;background:rgba(0,0,0,0.05);">';
const nw  = '<div class="relative" style="aspect-ratio:4/5;overflow:hidden;background:rgba(0,0,0,0.05);cursor:pointer;" @click="$store.cart.open = false; $store.config.openDetail(p)">';
if (t.includes(old)) { t = t.replace(old, nw); h++; console.log('  photo click added'); }

// 2. Ensure the close button inside modal works
// (already there)

fs.writeFileSync(p, t, 'utf8');
console.log('patched: ' + h + ' changes. size: ' + t.length);