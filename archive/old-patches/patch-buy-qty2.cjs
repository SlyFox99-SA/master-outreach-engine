const fs = require('fs');
const p = 'clients/zaheera-fragrances/src/index.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// ---- 1. Card: insert Buy button after the Add button ----
const addBtn = `>Add</button>`;
const buyBtn = `>Add</button>
              <button @click.stop="$store.cart.buyNow(p, $store.config.pickVariant(p))" :disabled="!$store.config.inStock(p)" class="text-[10px] tight uppercase bg-brand-ink text-brand-surface px-2.5 py-1.5 hover:opacity-90 transition disabled:opacity-30">Buy</button>`;

if (t.includes(addBtn) && !t.includes('cart.buyNow(p')) {
  t = t.replace(addBtn, buyBtn);
  // also wrap the two buttons in a flex container by tweaking the parent
  t = t.replace(
    `<p class="text-sm serif-num" x-text="$store.config.formatZAR(p.price)"></p>
            <button @click.stop="$store.cart.add(p, $store.config.pickVariant(p))"`,
    `<p class="text-sm serif-num" x-text="$store.config.formatZAR(p.price)"></p>
            <div class="flex gap-1.5 items-center">
            <button @click.stop="$store.cart.add(p, $store.config.pickVariant(p))"`
  );
  // close the div before the parent's closing </div>
  t = t.replace(
    `>Buy</button>
          </div>`,
    `>Buy</button>
            </div>
          </div>`
  );
  h++;
  console.log('  card: Add + Buy');
} else {
  console.log('  card SKIP (already has Buy or anchor missing)');
}

// ---- 2. Cart: replace Qty text with - / + controls ----
const qtyMarker = "'Qty ' + i.qty";
const qtyIdx = t.indexOf(qtyMarker);
if (qtyIdx !== -1) {
  // find the enclosing <p ...>...</p> line
  const before = t.lastIndexOf('<p', qtyIdx);
  const after = t.indexOf('</p>', qtyIdx);
  if (before !== -1 && after !== -1) {
    const oldLine = t.slice(before, after + 4);
    const newBlock = `<p class="text-[11px] opacity-55 mt-0.5" x-show="i.variantName" x-text="i.variantName"></p>
          <div class="flex items-center gap-2 mt-1.5">
            <button @click="$store.cart.setQty(i.id, i.variantId, i.qty - 1)" class="w-6 h-6 grid place-items-center border border-black/15 hover:border-black/40 text-sm leading-none">\u2212</button>
            <span class="text-xs min-w-[16px] text-center" x-text="i.qty"></span>
            <button @click="$store.cart.setQty(i.id, i.variantId, i.qty + 1)" :disabled="i.stock !== Infinity && i.qty >= i.stock" class="w-6 h-6 grid place-items-center border border-black/15 hover:border-black/40 text-sm leading-none disabled:opacity-30">+</button>
          </div>`;
    t = t.slice(0, before) + newBlock + t.slice(after + 4);
    h++;
    console.log('  cart: qty - / + controls');
  } else {
    console.log('  cart MISS wrapper');
  }
} else {
  console.log('  cart SKIP (already patched or marker missing)');
}

fs.writeFileSync(p, t, 'utf8');
console.log('total: ' + h + ' / 2 changes. size: ' + t.length);