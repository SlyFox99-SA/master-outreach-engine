const fs = require('fs');
const p = 'clients/zaheera-fragrances/src/index.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// Anchor: the price <p> + Add <button> + Buy <button> in a justify-between flex row
const oldBlock = `<p class="text-sm serif-num" x-text="$store.config.formatZAR(p.price)"></p>
            <button @click.stop="$store.cart.add(p, $store.config.pickVariant(p))" :disabled="!$store.config.inStock(p)" class="text-[10px] tight uppercase border border-current px-3 py-1.5 hover:bg-brand-ink hover:text-brand-surface transition disabled:opacity-30">Add</button>
              <button @click.stop="$store.cart.buyNow(p, $store.config.pickVariant(p))" :disabled="!$store.config.inStock(p)" class="text-[10px] tight uppercase bg-brand-ink text-brand-surface px-2.5 py-1.5 hover:opacity-90 transition disabled:opacity-30">Buy</button>`;

const newBlock = `<p class="text-sm serif-num" x-text="$store.config.formatZAR(p.price)"></p>
            <div class="flex items-center gap-1.5 shrink-0">
              <button @click.stop="$store.cart.add(p, $store.config.pickVariant(p))" :disabled="!$store.config.inStock(p)" class="text-[10px] tight uppercase border border-current px-3 py-1.5 hover:bg-brand-ink hover:text-brand-surface transition disabled:opacity-30">Add</button>
              <button @click.stop="$store.cart.buyNow(p, $store.config.pickVariant(p))" :disabled="!$store.config.inStock(p)" class="text-[10px] tight uppercase bg-brand-ink text-brand-surface px-3 py-1.5 hover:opacity-90 transition disabled:opacity-30">Buy</button>
            </div>`;

if (t.includes(oldBlock)) { t = t.replace(oldBlock, newBlock); h++; console.log('  buttons wrapped in group'); }
else console.log('  MISS: dump the exact block to check whitespace');

fs.writeFileSync(p, t, 'utf8');
console.log('total: ' + h + ' changes. size: ' + t.length);