const fs = require('fs');
const p = 'clients/zaheera-fragrances/src/checkout.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

if (!t.includes('/configs.js')) {
  t = t.replace('<script src="/main.js"></script>', '<script src="/configs.js"></script>\n<script src="/main.js"></script>');
  h++;
  console.log('  added configs.js loader');
}

if (!t.includes('field-error')) {
  const css = '\n  .field-error { font-size: 11px; color: var(--err); margin: 5px 0 0; letter-spacing: 0.02em; }';
  t = t.replace('</style>', css + '\n</style>');
  h++;
  console.log('  added .field-error css');
}

const nameOld = '<input type="text" x-model="$store.cart.buyerName" placeholder="e.g. Thandi Mkhize">';
const nameNew = nameOld + '\n          <p class="field-error" x-show="$store.cart.error && !$store.cart.buyerName">Required</p>';
if (t.includes(nameOld)) { t = t.replace(nameOld, nameNew); h++; console.log('  name error added'); }

const phoneOld = '<input type="tel" x-model="$store.cart.buyerPhone" placeholder="+27 82 123 4567">';
const phoneNew = phoneOld + '\n          <p class="field-error" x-show="$store.cart.error && !$store.cart.buyerPhone">Required</p>';
if (t.includes(phoneOld)) { t = t.replace(phoneOld, phoneNew); h++; console.log('  phone error added'); }

const addrOld = '<textarea x-model="$store.cart.buyerAddress" placeholder="Street, suburb, city, postal code"></textarea>';
const addrNew = addrOld + '\n          <p class="field-error" x-show="$store.cart.error && $store.cart.shippingId !== \'collect\' && !$store.cart.buyerAddress">Required for delivery</p>';
if (t.includes(addrOld)) { t = t.replace(addrOld, addrNew); h++; console.log('  address error added'); }

fs.writeFileSync(p, t, 'utf8');
console.log('total: ' + h + ' patches. size: ' + t.length);