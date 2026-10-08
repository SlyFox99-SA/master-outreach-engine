const fs = require('fs');

// ---- checkout.html ----
{
  const p = 'clients/zaheera-fragrances/src/checkout.html';
  let t = fs.readFileSync(p, 'utf8');
  let h = 0;

  const oldBlock = `<label class="fld" :class="{ err: $store.cart.error && $store.cart.shippingId === 'courier' && !$store.cart.buyerAddress }">
      <span>Delivery address <em x-show="$store.cart.shippingId === 'courier'">*</em></span>
      <textarea x-model="$store.cart.buyerAddress" placeholder="Street, suburb, city, postal code" @input="$store.cart.error = ''"></textarea>
      <p class="field-error" x-show="$store.cart.error && $store.cart.shippingId === 'courier' && !$store.cart.buyerAddress">Required for courier delivery</p>
    </label>`;

  const newBlock = `<label class="fld" x-show="$store.cart.shippingId !== 'collect'" :class="{ err: $store.cart.error && $store.cart.shippingId !== 'collect' && !$store.cart.buyerAddress }">
      <span x-show="$store.cart.shippingId === 'paxi'">Your nearest PEP store <em>*</em></span>
      <span x-show="$store.cart.shippingId === 'courier'">Delivery address <em>*</em></span>
      <textarea x-model="$store.cart.buyerAddress" :placeholder="$store.cart.shippingId === 'paxi' ? 'e.g. PEP Sandton City · store code 1023' : 'Street, suburb, city, postal code'" @input="$store.cart.error = ''"></textarea>
      <p class="field-error" x-show="$store.cart.error && $store.cart.shippingId !== 'collect' && !$store.cart.buyerAddress" x-text="$store.cart.shippingId === 'paxi' ? 'Please tell us which PEP store' : 'Required for courier delivery'"></p>
    </label>`;

  if (t.includes(oldBlock)) { t = t.replace(oldBlock, newBlock); h++; console.log('  address block: paxi/courier dynamic'); }
  else { console.log('  MISS address block — trying loose match'); }

  // step-2 validation — require address for paxi OR courier
  const oldVal = `else if ($store.cart.shippingId === 'courier' && !$store.cart.buyerAddress) { $store.cart.error = 'Required for courier delivery'; }`;
  const newVal = `else if ($store.cart.shippingId !== 'collect' && !$store.cart.buyerAddress) { $store.cart.error = $store.cart.shippingId === 'paxi' ? 'Please tell us which PEP store' : 'Required for courier delivery'; }`;
  if (t.includes(oldVal)) { t = t.replace(oldVal, newVal); h++; console.log('  step-2 validation: paxi OR courier'); }
  else console.log('  MISS step-2 validation');

  fs.writeFileSync(p, t, 'utf8');
  console.log('checkout.html: ' + h + ' changes. size: ' + t.length);
}

// ---- main.js ----
{
  const p = 'clients/zaheera-fragrances/src/main.js';
  let t = fs.readFileSync(p, 'utf8');
  let h = 0;
  const oldV = `if (ship.id === "courier" && (!this.buyerAddress || !this.buyerAddress.trim())) { this.error = "Please enter a delivery address."; return; }`;
  const newV = `if (ship.id !== "collect" && (!this.buyerAddress || !this.buyerAddress.trim())) { this.error = ship.id === "paxi" ? "Please tell us which PEP store" : "Please enter a delivery address."; return; }`;
  if (t.includes(oldV)) { t = t.replace(oldV, newV); h++; console.log('  main.js: paxi OR courier requires field'); }
  else console.log('  MISS main.js validation');

  fs.writeFileSync(p, t, 'utf8');
  console.log('main.js: ' + h + ' changes. size: ' + t.length);
}