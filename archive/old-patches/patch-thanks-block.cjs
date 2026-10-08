const fs = require('fs');
const p = 'clients/zaheera-fragrances/src/checkout.html';
let t = fs.readFileSync(p, 'utf8');

const startMarker = '<main class="wrap thanks"';
const endMarker = '</main>';
const startIdx = t.indexOf(startMarker);
if (startIdx === -1) { console.log('MISS start'); process.exit(1); }
const endIdx = t.indexOf(endMarker, startIdx);
if (endIdx === -1) { console.log('MISS end'); process.exit(1); }

const newThanks = `<main class="wrap thanks" x-show="$store.cart.sent" x-cloak>
  <div class="thanks-inner">
    <p class="eyebrow" style="text-align:center;">Order placed</p>
    <h2 style="text-align:center;">Thank you.</h2>
    <p class="ref-label" style="text-align:center;">Order reference</p>
    <div class="ref" style="text-align:center;" x-text="$store.cart.orderRef"></div>

    <div class="reminder">
      <p class="reminder-title">One more step &mdash; send us your proof of payment</p>
      <p>Your order is <strong>not yet confirmed</strong>. Save a screenshot of your payment and send it to us on WhatsApp so we can confirm and ship your order.</p>
    </div>

    <div style="text-align:center;">
      <button class="thanks-cta" @click="$store.cart.resendWhatsApp()">Send proof via WhatsApp</button>
    </div>

    <div style="text-align:center;">
      <a class="track" :href="'/track/?brand=' + ($store.config.id || '') + '&ref=' + encodeURIComponent($store.cart.orderRef)" target="_blank">Track this order &rarr;</a>
    </div>
  </div>
</main>`;

t = t.slice(0, startIdx) + newThanks + t.slice(endIdx + endMarker.length);
fs.writeFileSync(p, t, 'utf8');
console.log('thanks block rewritten. size: ' + t.length);