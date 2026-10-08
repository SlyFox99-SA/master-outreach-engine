const fs = require('fs');
const p = 'clients/zaheera-fragrances/src/checkout.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// 1. Step-3 button: "Send proof" → "Confirm order"
const oldBtn = `x-text="$store.cart.sending ? 'Sending\\u2026' : 'Send proof &rarr;'"`;
const newBtn = `x-text="$store.cart.sending ? 'Placing order\\u2026' : 'Confirm order &rarr;'"`;
if (t.includes(oldBtn)) { t = t.replace(oldBtn, newBtn); h++; console.log('  step-3 button: Confirm order'); }
else console.log('  MISS step-3 button');

// 2. Step-3 hint text: "click below to send proof" → "click below to place your order"
const oldHint = `Pay the total into the account above. Then click below to send proof of payment via WhatsApp.`;
const newHint = `Click below to place your order. You'll then be able to send us your proof of payment.`;
if (t.includes(oldHint)) { t = t.replace(oldHint, newHint); h++; console.log('  step-3 hint rewritten'); }
else console.log('  MISS step-3 hint');

// 3. Remove the "Track this order" link from thanks
const trackRegex = /\s*<div style="text-align:center;">\s*<a class="track"[^>]*>Track this order[^<]*<\/a>\s*<\/div>/;
if (trackRegex.test(t)) { t = t.replace(trackRegex, ''); h++; console.log('  track link removed from thanks'); }
else console.log('  MISS track link');

// 4. Cleaner button copy on thanks page
const oldThanks = `>Send proof via WhatsApp</button>`;
const newThanks = `>Send proof of payment via WhatsApp</button>`;
if (t.includes(oldThanks)) { t = t.replace(oldThanks, newThanks); h++; console.log('  thanks button label'); }
else console.log('  MISS thanks button label');

fs.writeFileSync(p, t, 'utf8');
console.log('total: ' + h + ' / 4 changes. size: ' + t.length);