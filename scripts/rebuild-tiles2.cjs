const fs = require('fs');
const p = 'pitch/index.html';
const lines = fs.readFileSync(p, 'utf8').split('\n');

// Keep 1-543 (index 0-542)
const head = lines.slice(0, 543);
// Keep 592 onwards (index 591+)
const tail = lines.slice(591);

const grid = [
'  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-4 lg:gap-5 stagger" data-card-grid>',
'',
'    <a href="https://sfox-personal.pages.dev/" target="_blank" rel="noopener" class="card" data-cat="personal">',
'      <div class="tile"><span class="price-tag">R3,500</span><iframe src="https://sfox-personal.pages.dev/" loading="lazy" scrolling="no" tabindex="-1"></iframe><div class="scrim"></div></div>',
'      <div class="meta"><span class="audience">Creators</span><h3>Linklist</h3><p class="desc">One page. Every link.</p></div>',
'    </a>',
'',
'    <a href="https://sfox-starter.pages.dev/" target="_blank" rel="noopener" class="card" data-cat="personal">',
'      <div class="tile"><span class="price-tag">R5,000</span><iframe src="https://sfox-starter.pages.dev/" loading="lazy" scrolling="no" tabindex="-1"></iframe><div class="scrim"></div></div>',
'      <div class="meta"><span class="audience">Artisans</span><h3>One-pager</h3><p class="desc">Brand, gallery, WhatsApp.</p></div>',
'    </a>',
'',
'    <a href="https://sfox-salon.pages.dev/" target="_blank" rel="noopener" class="card" data-cat="service">',
'      <div class="tile"><span class="price-tag">R6,500</span><iframe src="https://sfox-salon.pages.dev/" loading="lazy" scrolling="no" tabindex="-1"></iframe><div class="scrim"></div></div>',
'      <div class="meta"><span class="audience">Salons · beauty</span><h3>Warm Service</h3><p class="desc">Menu, staff, WhatsApp booking.</p></div>',
'    </a>',
'',
'    <a href="https://monetech-outreach.pages.dev/" target="_blank" rel="noopener" class="card" data-cat="shop">',
'      <div class="tile"><span class="price-tag">R6,500</span><iframe src="https://monetech-outreach.pages.dev/" loading="lazy" scrolling="no" tabindex="-1"></iframe><div class="scrim"></div></div>',
'      <div class="meta"><span class="audience">Sneakers · streetwear</span><h3>Hype</h3><p class="desc">Black, loud, fast.</p></div>',
'    </a>',
'',
'    <a href="https://lumo-mockup.pages.dev/" target="_blank" rel="noopener" class="card" data-cat="service">',
'      <div class="tile"><span class="price-tag">R7,500</span><iframe src="https://lumo-mockup.pages.dev/" loading="lazy" scrolling="no" tabindex="-1"></iframe><div class="scrim"></div></div>',
'      <div class="meta"><span class="audience">Skincare · clinical</span><h3>Clinical</h3><p class="desc">Calm, structured, trust-first.</p></div>',
'    </a>',
'',
'    <a href="https://techseller-mockup.pages.dev/" target="_blank" rel="noopener" class="card" data-cat="shop">',
'      <div class="tile"><span class="price-tag">R8,500</span><iframe src="https://techseller-mockup.pages.dev/" loading="lazy" scrolling="no" tabindex="-1"></iframe><div class="scrim"></div></div>',
'      <div class="meta"><span class="audience">Phones · tech</span><h3>Clean</h3><p class="desc">Cart, checkout, orders.</p></div>',
'    </a>',
'',
'    <a href="https://fragrance-seller-mockup.pages.dev/" target="_blank" rel="noopener" class="card" data-cat="shop">',
'      <div class="tile"><span class="price-tag">R9,500</span><iframe src="https://fragrance-seller-mockup.pages.dev/" loading="lazy" scrolling="no" tabindex="-1"></iframe><div class="scrim"></div></div>',
'      <div class="meta"><span class="audience">Fragrance · luxury</span><h3>Editorial</h3><p class="desc">Cream, serif, considered.</p></div>',
'    </a>',
'',
'    <a href="https://sfox-services.pages.dev/" target="_blank" rel="noopener" class="card" data-cat="service">',
'      <div class="tile"><span class="price-tag">R12,000</span><iframe src="https://sfox-services.pages.dev/" loading="lazy" scrolling="no" tabindex="-1"></iframe><div class="scrim"></div></div>',
'      <div class="meta"><span class="audience">Trades · services</span><h3>Service Pro</h3><p class="desc">Portfolio, quote form, WhatsApp.</p></div>',
'    </a>',
'',
'  </div>'
];

const out = head.concat(grid).concat(tail);
fs.writeFileSync(p, out.join('\n'), 'utf8');
console.log('tiles rebuilt. lines: ' + out.length);