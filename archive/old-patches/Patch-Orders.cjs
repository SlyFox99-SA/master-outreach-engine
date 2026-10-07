const fs = require('fs');
const WORKER = 'https://outreach-save-api.gifttsima16.workers.dev';
function editLines(rel, opts) {
  const path = process.cwd() + '\\' + rel;
  const lines = fs.readFileSync(path, 'utf8').split(/\r?\n/);
  const out = [];
  let hits = 0;
  for (const line of lines) {
    if (opts.anchor && line.includes(opts.anchor)) {
      hits++;
      if (opts.before) out.push(...opts.before.split('\n'));
      out.push(line);
      if (opts.after) out.push(...opts.after.split('\n'));
    } else out.push(line);
  }
  fs.writeFileSync(path, out.join('\n'), 'utf8');
  console.log(rel + ' -> ' + hits + ' anchor hit(s)');
}
// 1. checkout.html — insert static buyer fields section before Payment section
const buyerSection = '<section class="rounded-2xl bg-white ring-1 ring-black/5 p-5"><h2 class="text-xs uppercase tracking-widest opacity-60 mb-4">Your details</h2><input id="buyerName" type="text" placeholder="Your name" class="w-full rounded-xl border border-black/10 px-4 py-3 text-sm mb-3" /><input id="buyerPhone" type="tel" placeholder="WhatsApp number" class="w-full rounded-xl border border-black/10 px-4 py-3 text-sm" /></section>';
editLines('checkout.html', {
  anchor: '<h2 class="text-xs uppercase tracking-widest opacity-60 mb-4">Payment</h2>',
  before: buyerSection
});
// 2. seller/index.html — fetch orders from worker after local load
editLines('seller/index.html', {
  anchor: "this.orders = JSON.parse(localStorage.getItem('orders.'",
  after: "      try { var oRes = await fetch('" + WORKER + "/api/orders?brand=' + encodeURIComponent(this.brandId)); var oData = await oRes.json(); if (oData.ok && Array.isArray(oData.orders) && oData.orders.length > 0) { this.orders = oData.orders; try { localStorage.setItem('orders.' + this.brandId, JSON.stringify(this.orders)); } catch(e) {} } } catch(e) { console.log('[orders] worker fetch failed:', e); }"
});
// 3. track/index.html — fetch from worker before setting loading=false
editLines('track/index.html', {
  anchor: 'this.loading = false;',
  before: "  try { var r2 = await fetch('" + WORKER + "/api/orders?brand=' + encodeURIComponent(brand)); var d2 = await r2.json(); if (d2.ok && Array.isArray(d2.orders)) { var found = d2.orders.filter(function(o){ return o.ref === ref; })[0] || null; if (found) this.order = found; } } catch(e) { console.log('[track] worker fetch failed:', e); }"
});
console.log('done');