const fs = require('fs');

// ============ ZAHEERA — magazine spread hero ============
{
  const p = 'clients/zaheera-fragrances/src/index.html';
  let t = fs.readFileSync(p, 'utf8');

  const marker = '<!-- compact hero strip -->';
  const nextSection = '<section id="shop"';
  const start = t.indexOf(marker);
  const end = t.indexOf(nextSection);
  if (start === -1 || end === -1) { console.log('  zaheera MISS'); process.exit(1); }

  const newHero = `<!-- magazine hero -->
<section class="border-b border-black/5">
  <div class="max-w-6xl mx-auto px-5 py-10 md:py-20 grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-14 items-center">
    <div class="md:col-span-3">
      <p class="tight text-[10px] uppercase opacity-50 mb-4" x-text="$store.config.brand?.tagline"></p>
      <h1 class="disp text-[2.6rem] md:text-[5.2rem] leading-[0.94]" x-text="$store.config.brand?.name"></h1>
      <div class="mt-6 md:mt-8 max-w-md">
        <p class="text-sm md:text-base opacity-65 leading-relaxed" x-text="$store.config.brand?.blurb"></p>
      </div>
      <a href="#shop" class="mt-7 md:mt-10 inline-flex items-center gap-2 text-[11px] tight uppercase border-b border-current pb-0.5 hover:opacity-70">Explore collection</a>
    </div>
    <div class="md:col-span-2 order-first md:order-last">
      <div class="aspect-[4/5] max-w-xs mx-auto md:max-w-none bg-black/5 overflow-hidden">
        <img :src="$store.config.heroImage || $store.config.brand?.heroImage" class="w-full h-full object-cover" alt="">
      </div>
      <p class="mt-3 text-[10px] tight uppercase opacity-40 text-right hidden md:block">Signature · 2026</p>
    </div>
  </div>
</section>

`;
  t = t.slice(0, start) + newHero + t.slice(end);
  fs.writeFileSync(p, t, 'utf8');
  console.log('  zaheera: magazine hero (' + t.length + ' bytes)');
}

// ============ LUMO — clinical ingredient-first hero ============
{
  const p = 'clients/lumo-skincare/src/index.html';
  let t = fs.readFileSync(p, 'utf8');

  const marker = '<!-- compact hero strip -->';
  const nextSection = '<section id="shop"';
  const start = t.indexOf(marker);
  const end = t.indexOf(nextSection);
  if (start === -1 || end === -1) { console.log('  lumo MISS'); process.exit(1); }

  const newHero = `<!-- clinical hero -->
<section class="border-b border-black/5">
  <div class="max-w-3xl mx-auto px-5 py-14 md:py-24 text-center">
    <p class="tight text-[10px] uppercase opacity-50 mb-5" x-text="$store.config.brand?.tagline"></p>
    <h1 class="disp text-[3rem] md:text-[6rem] leading-[0.9]" x-text="$store.config.brand?.name"></h1>
    <p class="mt-7 text-sm md:text-base opacity-65 leading-relaxed max-w-md mx-auto" x-text="$store.config.brand?.blurb"></p>
    <div class="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] tight uppercase opacity-55">
      <span>pH balanced</span>
      <span class="opacity-30">·</span>
      <span>Fragrance-free</span>
      <span class="opacity-30">·</span>
      <span>Dermatologist tested</span>
      <span class="opacity-30">·</span>
      <span>Vegan</span>
    </div>
    <a href="#shop" class="mt-10 inline-flex items-center gap-2 text-[11px] tight uppercase border-b border-current pb-0.5 hover:opacity-70">Shop the range</a>
  </div>
</section>

`;
  t = t.slice(0, start) + newHero + t.slice(end);
  fs.writeFileSync(p, t, 'utf8');
  console.log('  lumo: clinical hero (' + t.length + ' bytes)');
}