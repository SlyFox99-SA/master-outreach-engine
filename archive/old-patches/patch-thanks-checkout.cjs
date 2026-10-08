const fs = require('fs');
const p = 'clients/zaheera-fragrances/src/checkout.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

if (!t.includes('.thanks-inner')) {
  const css = `
  .thanks { text-align: left; }
  .thanks-inner { max-width: 560px; margin: 0 auto; text-align: center; }
  .thanks h2 { font-family: var(--display); font-size: 36px; margin: 4px 0 0; font-weight: 400; }
  .thanks .ref-label { font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--faded); margin: 22px 0 6px; }
  .thanks .ref { font-size: 20px; font-family: var(--display); margin: 0 0 30px; }
  .reminder { background: var(--bone); border: 1px solid var(--rule); padding: 20px 22px; text-align: left; margin-bottom: 22px; }
  .reminder-title { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--err); font-weight: 600; margin: 0 0 8px; }
  .reminder p { font-size: 13px; line-height: 1.6; margin: 0; color: var(--ink); }
  .thanks-cta { width: 100%; background: var(--ink); color: var(--paper); border: none; padding: 17px; font: inherit; font-size: 11px; letter-spacing: 0.26em; text-transform: uppercase; cursor: pointer; margin-bottom: 18px; display: block; }
  .side-col section.card { max-height: calc(100vh - 120px); overflow-y: auto; }
`;
  t = t.replace('</style>', css + '</style>');
  h++;
  console.log('  CSS added');
}

const regex = /<main class="wrap thanks"[\s\S]*?<\/main>/;
const newThanks = `<main class="wrap thanks" x-show="$store.cart.sent" x-cloak>
  <div class="thanks-inner">
    <p class="eyebrow">Order placed</p>
    <h2>Thank you.</h2>
    <p class="ref-label">Order reference</p>
    <div class="ref" x-text="$store.cart.orderRef"></div>

    <div class="reminder">
      <p class="reminder-title">One more step &mdash; send us your proof of payment</p>
      <p>Your order is <strong>not yet confirmed</strong>. Save a screenshot of your payment and send it to us on WhatsApp so we can confirm and ship your order.</p>
    </div>

    <button class="thanks-cta" @click="$store.cart.resendWhatsApp()">Send proof of payment via WhatsApp &rarr;</button>

    <a class="track" :href="'/track/?brand=' + ($store.config.id || '') + '&ref=' + encodeURIComponent($store.cart.orderRef)" target="_blank">Track this order &rarr;</a>
  </div>
</main>`;

if (regex.test(t)) { t = t.replace(regex, newThanks); h++; console.log('  thanks block replaced'); }
else console.log('  MISS thanks block');

fs.writeFileSync(p, t, 'utf8');
console.log('checkout.html: ' + h + ' changes, ' + t.length + ' bytes');