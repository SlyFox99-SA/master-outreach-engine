const fs = require('fs');
const p = 'clients/zaheera-fragrances/src/index.html';
let t = fs.readFileSync(p, 'utf8');

const marker = '<!-- magazine hero -->';
const nextSection = '<section id="shop"';
const start = t.indexOf(marker);
const end = t.indexOf(nextSection);
if (start === -1 || end === -1) { console.log('MISS'); process.exit(1); }

const newHero = `<!-- magazine hero (text only) -->
<section class="border-b border-black/5">
  <div class="max-w-4xl mx-auto px-5 py-16 md:py-24">
    <p class="tight text-[10px] uppercase opacity-50 mb-6" x-text="$store.config.brand?.tagline"></p>
    <h1 class="disp text-[3rem] md:text-[7rem] leading-[0.92] max-w-3xl" x-text="$store.config.brand?.name"></h1>
    <div class="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-end">
      <p class="text-sm md:text-base opacity-65 leading-relaxed max-w-md" x-text="$store.config.brand?.blurb"></p>
      <div class="md:text-right">
        <a href="#shop" class="inline-flex items-center gap-2 text-[11px] tight uppercase border-b border-current pb-0.5 hover:opacity-70">Explore collection</a>
      </div>
    </div>
  </div>
</section>

`;
t = t.slice(0, start) + newHero + t.slice(end);
fs.writeFileSync(p, t, 'utf8');
console.log('zaheera: text-only magazine hero. size: ' + t.length);