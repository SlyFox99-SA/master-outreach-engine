const fs = require('fs');
const p = 'clients/zaheera-fragrances/src/checkout.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// Sticky header
const oldH = 'header { border-bottom: 1px solid var(--rule); padding: 14px 0; }';
const newH = 'header { position: sticky; top: 0; z-index: 40; background: var(--paper); border-bottom: 1px solid var(--rule); padding: 12px 0; }';
if (t.includes(oldH)) { t = t.replace(oldH, newH); h++; console.log('  sticky header'); }

// Step indicator css
if (!t.includes('.steps {')) {
  const css = '\n  .steps { display: flex; align-items: center; gap: 8px; padding: 12px 0 10px; border-bottom: 1px solid var(--rule); }\n  .steps .step { font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--faded); }\n  .steps .step.active { color: var(--ink); font-weight: 500; }\n  .steps .step.done { color: var(--ink); }\n  .steps .sep { color: var(--rule); font-size: 12px; margin: 0 2px; }';
  t = t.replace('</style>', css + '\n</style>');
  h++;
  console.log('  steps css');
}

// Steps markup above the main checkout block
if (!t.includes('class="steps"')) {
  const marker = '<main class="wrap" x-show="!$store.cart.sent" x-cloak>';
  const steps = '<div class="wrap"><div class="steps"><span class="step done">Bag</span><span class="sep">/</span><span class="step active">Details &amp; Payment</span><span class="sep">/</span><span class="step">Confirm</span></div></div>\n<main class="wrap" x-show="!$store.cart.sent" x-cloak>';
  if (t.includes(marker)) { t = t.replace(marker, steps); h++; console.log('  steps markup'); }
  else console.log('  MISS main marker');
}

// Tighten page-head spacing since we added steps above
t = t.replace('.page-head { padding: 22px 0 18px; }', '.page-head { padding: 16px 0 14px; }');

fs.writeFileSync(p, t, 'utf8');
console.log('total: ' + h + ' changes. size: ' + t.length);