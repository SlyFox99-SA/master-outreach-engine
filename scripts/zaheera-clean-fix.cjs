const fs = require('fs');
const p = 'clients/zaheera-fragrances/src/index.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// 1. Fix the missing space before :disabled on the Add button
const bad = 'pickVariant(p))":disabled';
const good = 'pickVariant(p))" :disabled';
if (t.includes(bad)) { t = t.split(bad).join(good); h++; console.log('  L115 space fix'); }

// 2. Move click handler from <img> to the whole <li>
//    Remove from img
t = t.replace(' @click.stop="$store.config.openDetail(p)" style="cursor:pointer;"', '');
t = t.replace(' @click.stop="$store.config.openDetail(p)"', '');
//    Add to <li>
const oldLi = '<li class="p-card flex flex-col">';
const newLi = '<li class="p-card flex flex-col" style="cursor:pointer;" @click="$store.config.openDetail(p)">';
if (t.includes(oldLi)) { t = t.replace(oldLi, newLi); h++; console.log('  click moved to <li>'); }

// 3. Guard the buttons so they don't bubble up to the card click
const oldBtnWrap = '<div class="flex items-center gap-1.5 shrink-0">';
const newBtnWrap = '<div class="flex items-center gap-1.5 shrink-0" @click.stop>';
if (t.includes(oldBtnWrap)) { t = t.replace(oldBtnWrap, newBtnWrap); h++; console.log('  buttons stop propagation'); }

// 4. In the modal, guard the image binding too
t = t.replace(
  '<img :src="$store.config.detailImage()" class="w-full h-full object-cover" alt="">',
  '<img :src="$store.config.detailProduct && ($store.config.detailProduct.image || ($store.config.detailProduct.images && $store.config.detailProduct.images[0]))" class="w-full h-full object-cover" alt="">'
);

// 5. Only render the modal body if detailProduct has a name
t = t.replace(
  '<div x-show="$store.config.detailOpen && $store.config.detailProduct"',
  '<div x-show="$store.config.detailOpen && $store.config.detailProduct && $store.config.detailProduct.name"'
);

fs.writeFileSync(p, t, 'utf8');
console.log('total: ' + h + ' fixes. size: ' + t.length);