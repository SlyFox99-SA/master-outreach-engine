const fs = require('fs');
const p = 'clients/lumo-skincare/src/index.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// Wrap the Add and Buy buttons in a flex group
const addBtn = '<button @click.stop="$store.cart.add(p, $store.config.pickVariant(p))" :disabled="!$store.config.inStock(p)" class="text-[10px] tight uppercase border border-current px-3 py-1.5 hover:bg-brand-ink hover:text-brand-surface transition disabled:opacity-30">Add</button>';
const buyBtn = '<button @click.stop="$store.cart.buyNow(p, $store.config.pickVariant(p))" :disabled="!$store.config.inStock(p)" class="text-[10px] tight uppercase border border-current px-2.5 py-1.5 hover:bg-brand-ink hover:text-brand-surface transition disabled:opacity-30">Buy</button>';

const oldPair = addBtn + '\n            ' + buyBtn;
const newPair = `<div class="flex items-center gap-1.5 shrink-0">
              ${addBtn}
              ${buyBtn}
            </div>`;

if (t.includes(oldPair)) { t = t.replace(oldPair, newPair); h++; console.log('  lumo: buttons grouped'); }
else console.log('  lumo MISS exact pair');

fs.writeFileSync(p, t, 'utf8');
console.log('total: ' + h + ' changes. size: ' + t.length);