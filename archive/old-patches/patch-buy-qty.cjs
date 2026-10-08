const fs = require('fs');
const p = 'clients/zaheera-fragrances/src/index.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// ---- 1. Product card: add Buy button next to Add ----
const oldCardBtn = `<div class="mt-auto pt-2.5 flex items-center justify-between gap-2">
            <p class="text-sm serif-num" x-text="$store.config.formatZAR(p.price)"></p>
            <button @click.stop="$store.cart.add(p, $store.config.pickVariant(p))" :disabled="!$store.config.inStock(p)" class="text-[10px] tight uppercase border border-current px-3 py-1.5 hover:bg-brand-ink hover:text-brand-surface transition disabled:opacity-30">Add</button>
          </div>`;

const newCardBtn = `<div class="mt-auto pt-2.5 flex items-center justify-between gap-2">
            <p class="text-sm serif-num" x-text="$store.config.formatZAR(p.price)"></p>
            <div class="flex gap-1.5">
              <button @click.stop="$store.cart.add(p, $store.config.pickVariant(p))" :disabled="!$store.config.inStock(p)" class="text-[10px] tight uppercase border border-current px-2.5 py-1.5 hover:bg-brand-ink hover:text-brand-surface transition disabled:opacity-30">Add</button>
              <button @click.stop="$store.cart.buyNow(p, $store.config.pickVariant(p))" :disabled="!$store.config.inStock(p)" class="text-[10px] tight uppercase bg-brand-ink text-brand-surface px-2.5 py-1.5 hover:opacity-90 transition disabled:opacity-30">Buy</button>
            </div>
          </div>`;

if (t.includes(oldCardBtn)) { t = t.replace(oldCardBtn, newCardBtn); h++; console.log('  card: Add + Buy buttons'); }
else console.log('  MISS card button block');

// ---- 2. Cart drawer: add qty -/+ controls ----
const oldQty = `<p class="text-[11px] opacity-55 mt-0.5" x-text="(i.variantName ? i.variantName + ' \u00b7 ' : '') + 'Qty ' + i.qty"></p>`;
const newQty = `<p class="text-[11px] opacity-55 mt-0.5" x-show="i.variantName" x-text="i.variantName"></p>
          <div class="flex items-center gap-2 mt-1.5">
            <button @click="$store.cart.setQty(i.id, i.variantId, i.qty - 1)" class="w-6 h-6 grid place-items-center border border-black/15 hover:border-black/40 text-sm leading-none" aria-label="Decrease">\u2212</button>
            <span class="text-xs min-w-[16px] text-center" x-text="i.qty"></span>
            <button @click="$store.cart.setQty(i.id, i.variantId, i.qty + 1)" :disabled="i.stock !== Infinity && i.qty >= i.stock" class="w-6 h-6 grid place-items-center border border-black/15 hover:border-black/40 text-sm leading-none disabled:opacity-30" aria-label="Increase">+</button>
          </div>`;

if (t.includes(oldQty)) { t = t.replace(oldQty, newQty); h++; console.log('  cart: qty - / + controls'); }
else console.log('  MISS cart qty line');

// ---- 3. Sidebar cart card: also add qty controls in the drawer's footer? No, already in drawer ----

fs.writeFileSync(p, t, 'utf8');
console.log('total: ' + h + ' / 2 changes. size: ' + t.length);