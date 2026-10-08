const fs = require('fs');

// ---- techhub & lumo: fix Alpine :href to relative ----
for (const c of ['techhub-phones','lumo-skincare']) {
  const p = 'clients/' + c + '/src/index.html';
  let t = fs.readFileSync(p, 'utf8');
  const before = t;
  // :href="'/checkout.html"  →  :href="./checkout.html"
  t = t.replace(/:href="'\/checkout\.html/g, ':href="\'./checkout.html');
  if (t !== before) { fs.writeFileSync(p, t, 'utf8'); console.log('  ' + c + ': :href fixed'); }
  else console.log('  ' + c + ': no :href change');
}

// ---- monetech: add Buy button + qty controls ----
{
  const p = 'clients/monetech-sneakers/src/index.html';
  let t = fs.readFileSync(p, 'utf8');
  let h = 0;

  // 1. Buy button right after the p-add button
  if (!t.includes('cart.buyNow(p')) {
    const addAnchor = 'class="p-add"';
    const addIdx = t.indexOf(addAnchor);
    if (addIdx !== -1) {
      const btnEnd = t.indexOf('</button>', addIdx);
      if (btnEnd !== -1) {
        const buyBtn = '\n            <button class="p-add" style="background:#0a0a0a;color:#d4ff00;margin-top:6px;" @click.stop="$store.cart.buyNow(p, $store.config.pickVariant(p))" :disabled="!$store.config.inStock(p)">BUY NOW</button>';
        t = t.slice(0, btnEnd + 9) + buyBtn + t.slice(btnEnd + 9);
        h++;
        console.log('  monetech: Buy button added');
      }
    }
  }

  // 2. Qty controls — replace "QTY ' + i.qty" line with -/+ controls
  if (!t.includes('setQty(i.id, i.variantId')) {
    const qtyMarker = "'QTY ' + i.qty";
    const qtyIdx = t.indexOf(qtyMarker);
    if (qtyIdx !== -1) {
      const before = t.lastIndexOf('<p', qtyIdx);
      const after = t.indexOf('</p>', qtyIdx);
      if (before !== -1 && after !== -1) {
        const newBlock = `<p class="cart-line-meta" x-show="i.variantName" x-text="i.variantName"></p>
      <div style="display:flex;align-items:center;gap:8px;margin:6px 0;">
        <button @click="$store.cart.setQty(i.id, i.variantId, i.qty - 1)" style="width:24px;height:24px;border:1px solid rgba(255,255,255,0.15);background:transparent;color:inherit;cursor:pointer;font-size:14px;line-height:1;">−</button>
        <span style="font-family:var(--f-mono);font-size:12px;min-width:18px;text-align:center;" x-text="i.qty"></span>
        <button @click="$store.cart.setQty(i.id, i.variantId, i.qty + 1)" :disabled="i.stock !== Infinity && i.qty >= i.stock" style="width:24px;height:24px;border:1px solid rgba(255,255,255,0.15);background:transparent;color:inherit;cursor:pointer;font-size:14px;line-height:1;opacity:0.85;">+</button>
      </div>`;
        t = t.slice(0, before) + newBlock + t.slice(after + 4);
        h++;
        console.log('  monetech: qty controls added');
      }
    }
  }

  fs.writeFileSync(p, t, 'utf8');
  console.log('  monetech: ' + h + ' / 2 patches. size: ' + t.length);
}