const fs = require('fs');
const p = 'clients/zaheera-fragrances/src/checkout.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// 1. Label + asterisk — only when courier
const oldAst = `<span>Delivery address or nearest PEP store <em x-show="$store.cart.shippingId !== 'collect'">*</em></span>`;
const newAst = `<span>Delivery address <em x-show="$store.cart.shippingId === 'courier'">*</em></span>`;
if (t.includes(oldAst)) { t = t.replace(oldAst, newAst); h++; console.log('  label + asterisk'); }
else console.log('  MISS label');

// 2. Field-error — only when courier
const oldErr = `<p class="field-error" x-show="$store.cart.error && $store.cart.shippingId !== 'collect' && !$store.cart.buyerAddress">Required for delivery</p>`;
const newErr = `<p class="field-error" x-show="$store.cart.error && $store.cart.shippingId === 'courier' && !$store.cart.buyerAddress">Required for courier delivery</p>`;
if (t.includes(oldErr)) { t = t.replace(oldErr, newErr); h++; console.log('  field-error'); }
else console.log('  MISS field-error');

// 3. err class on label — only when courier
const oldErrCls = `:class="{ err: $store.cart.error && $store.cart.shippingId !== 'collect' && !$store.cart.buyerAddress }"`;
const newErrCls = `:class="{ err: $store.cart.error && $store.cart.shippingId === 'courier' && !$store.cart.buyerAddress }"`;
if (t.includes(oldErrCls)) { t = t.replace(oldErrCls, newErrCls); h++; console.log('  err class'); }
else console.log('  MISS err class');

// 4. Step-2 validation — only require address for courier
const oldVal = `else if ($store.cart.shippingId !== 'collect' && !$store.cart.buyerAddress) { $store.cart.error = 'Required for delivery'; }`;
const newVal = `else if ($store.cart.shippingId === 'courier' && !$store.cart.buyerAddress) { $store.cart.error = 'Required for courier delivery'; }`;
if (t.includes(oldVal)) { t = t.replace(oldVal, newVal); h++; console.log('  step-2 validation'); }
else console.log('  MISS step-2 validation');

fs.writeFileSync(p, t, 'utf8');
console.log('total: ' + h + ' / 4 changes. size: ' + t.length);