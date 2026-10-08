const fs = require('fs');
const p = 'clients/zaheera-fragrances/src/index.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// 1. CUT the modal entirely
const mStart = t.indexOf('<!-- detail modal -->');
const mEnd = t.indexOf('<!-- cart -->');
if (mStart !== -1 && mEnd !== -1) {
  t = t.slice(0, mStart) + '<!-- modal rebuilt next session as dedicated page -->\n\n' + t.slice(mEnd);
  h++;
  console.log('  modal cut');
}

// 2. Remove the giant hero image block — replace with compact text intro
const heroStart = t.indexOf('<!-- compact hero strip -->');
const heroAlt = t.indexOf('<!-- magazine hero');
const useHero = heroStart !== -1 ? heroStart : heroAlt;
const shopStart = t.indexOf('<section id="shop"');
if (useHero !== -1 && shopStart !== -1) {
  const newIntro = `<!-- compact intro -->
<section class="border-b border-black/5">
  <div class="max-w-6xl mx-auto px-5 py-8 md:py-12">
    <p class="tight text-[10px] uppercase opacity-50 mb-3" x-text="$store.config.brand?.tagline"></p>
    <h1 class="disp text-[2.2rem] md:text-[3.6rem] leading-[0.98]" x-text="$store.config.brand?.name"></h1>
    <p class="mt-4 text-sm md:text-base opacity-65 max-w-xl leading-relaxed" x-text="$store.config.brand?.blurb"></p>
  </div>
</section>

`;
  t = t.slice(0, useHero) + newIntro + t.slice(shopStart);
  h++;
  console.log('  hero replaced with text-only intro');
}

// 3. Hard-force maroon + cream palette
if (!t.includes('/* zaheera-clean-palette */')) {
  t = t.replace('</style>', `
/* zaheera-clean-palette */
:root {
  --brand-surface: 222 208 186;
  --brand-ink:     42 24 20;
  --brand-primary: 107 24 36;
  --brand-accent:  176 98 70;
}
html, body { background-color: #DED0BA !important; color: #2A1814 !important; }
header { background-color: #E8DCC8 !important; border-bottom-color: rgba(42,24,20,0.10) !important; }
footer { background-color: #3C241E !important; color: #E2D4BE !important; }
footer a, footer span { color: #E2D4BE !important; }
</style>`);
  h++;
  console.log('  maroon palette forced');
}

fs.writeFileSync(p, t, 'utf8');
console.log('total: ' + h + ' fixes. size: ' + t.length);