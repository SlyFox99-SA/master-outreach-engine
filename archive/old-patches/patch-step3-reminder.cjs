const fs = require('fs');
const p = 'clients/zaheera-fragrances/src/checkout.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// step-3 hint becomes a proper reminder to keep proof
const oldHint = `Click below to place your order. You'll then be able to send us your proof of payment.`;
const newHint = `Pay the total above. <strong>Save a screenshot of your payment</strong> &mdash; you'll send it to us on the next page so we can confirm and ship your order.`;
if (t.includes(oldHint)) { t = t.replace(oldHint, newHint); h++; console.log('  step-3 reminder copy'); }
else console.log('  MISS step-3 hint');

// step-3 button text: Confirm order →  Place order →
const oldBtn = `x-text="$store.cart.sending ? 'Placing order\\u2026' : 'Confirm order &rarr;'"`;
const newBtn = `x-text="$store.cart.sending ? 'Placing order\\u2026' : 'Place order &rarr;'"`;
if (t.includes(oldBtn)) { t = t.replace(oldBtn, newBtn); h++; console.log('  step-3 button: Place order'); }
else console.log('  MISS step-3 button');

// thanks page: make the WhatsApp button bigger, standalone, obvious
const oldCta = `<button class="thanks-cta" @click="$store.cart.resendWhatsApp()">Send proof of payment via WhatsApp</button>`;
const newCta = `<button class="thanks-cta" @click="$store.cart.resendWhatsApp()" style="display:block; width:100%; max-width:320px; margin:0 auto; padding:18px 24px;">Send proof of payment via WhatsApp</button>`;
if (t.includes(oldCta)) { t = t.replace(oldCta, newCta); h++; console.log('  thanks CTA centered + full width'); }
else console.log('  MISS thanks CTA');

fs.writeFileSync(p, t, 'utf8');
console.log('total: ' + h + ' / 3 changes. size: ' + t.length);