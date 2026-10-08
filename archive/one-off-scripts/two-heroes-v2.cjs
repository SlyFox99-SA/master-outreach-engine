const fs = require('fs');

// ============ ZAHEERA — DARK magazine cover ============
{
  const p = 'clients/zaheera-fragrances/src/index.html';
  let t = fs.readFileSync(p, 'utf8');
  const marker = '<!-- magazine hero (text only) -->';
  const alt = '<!-- magazine hero -->';
  const useMarker = t.includes(marker) ? marker : alt;
  const start = t.indexOf(useMarker);
  const end = t.indexOf('<section id="shop"');
  if (start === -1 || end === -1) { console.log('  zaheera MISS'); }

  const newHero = `<!-- zaheera: dark magazine cover -->
<section class="bg-brand-ink text-brand-surface">
  <div class="max-w-6xl mx-auto px-5 py-20 md:py-32">
    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
      <div>
        <p class="tight text-[10px] uppercase opacity-60 mb-6" x-text="$store.config.brand?.tagline"></p>
        <h1 class="disp text-[4rem] md:text-[9rem] leading-[0.86] max-w-3xl" x-text="$store.config.brand?.name"></h1>
      </div>
      <div class="md:text-right md:pb-4">
        <p class="text-[10px] tight uppercase opacity-50 mb-3">Est. Cape Town</p>
        <p class="text-[10px] tight uppercase opacity-50">Nº 01 — 2026</p>
      </div>
    </div>
    <div class="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 border-t border-white/15 pt-8">
      <p class="text-sm md:text-base leading-relaxed opacity-80 md:col-span-2 max-w-lg" x-text="$store.config.brand?.blurb"></p>
      <div class="md:text-right md:self-end">
        <a href="#shop" class="inline-flex items-center gap-2 text-[11px] tight uppercase border-b border-white/50 pb-0.5 hover:border-white">Enter the atelier</a>
      </div>
    </div>
  </div>
</section>

`;
  t = t.slice(0, start) + newHero + t.slice(end);
  fs.writeFileSync(p, t, 'utf8');
  console.log('  zaheera: dark magazine cover. size: ' + t.length);
}

// ============ LUMO — LIGHT clinical grid ============
{
  const p = 'clients/lumo-skincare/src/index.html';
  let t = fs.readFileSync(p, 'utf8');
  const marker = '<!-- clinical hero -->';
  const start = t.indexOf(marker);
  const end = t.indexOf('<section id="shop"');
  if (start === -1 || end === -1) { console.log('  lumo MISS'); }

  const newHero = `<!-- lumo: clinical light grid -->
<section class="border-b border-black/5">
  <div class="max-w-6xl mx-auto px-5 py-12 md:py-20">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
      <div class="md:col-span-7">
        <p class="tight text-[10px] uppercase opacity-50 mb-4" x-text="$store.config.brand?.tagline"></p>
        <h1 class="disp text-[2.4rem] md:text-[4.6rem] leading-[0.96] max-w-xl" x-text="$store.config.brand?.name"></h1>
        <p class="mt-6 text-sm md:text-base opacity-65 leading-relaxed max-w-md" x-text="$store.config.brand?.blurb"></p>
        <a href="#shop" class="mt-8 inline-flex items-center gap-2 text-[11px] tight uppercase border-b border-current pb-0.5 hover:opacity-70">Shop the range</a>
      </div>
      <div class="md:col-span-5 md:border-l md:border-black/10 md:pl-10">
        <p class="tight text-[10px] uppercase opacity-50 mb-6">Formulation standards</p>
        <dl class="space-y-4">
          <div class="flex items-baseline justify-between border-b border-black/5 pb-3">
            <dt class="text-[11px] tight uppercase opacity-60">pH</dt>
            <dd class="text-sm font-medium">5.5 — balanced</dd>
          </div>
          <div class="flex items-baseline justify-between border-b border-black/5 pb-3">
            <dt class="text-[11px] tight uppercase opacity-60">Fragrance</dt>
            <dd class="text-sm font-medium">Free</dd>
          </div>
          <div class="flex items-baseline justify-between border-b border-black/5 pb-3">
            <dt class="text-[11px] tight uppercase opacity-60">Testing</dt>
            <dd class="text-sm font-medium">Dermatologist</dd>
          </div>
          <div class="flex items-baseline justify-between border-b border-black/5 pb-3">
            <dt class="text-[11px] tight uppercase opacity-60">Origin</dt>
            <dd class="text-sm font-medium">Vegan</dd>
          </div>
          <div class="flex items-baseline justify-between">
            <dt class="text-[11px] tight uppercase opacity-60">Batch</dt>
            <dd class="text-sm font-medium">Small</dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</section>

`;
  t = t.slice(0, start) + newHero + t.slice(end);
  fs.writeFileSync(p, t, 'utf8');
  console.log('  lumo: clinical light grid. size: ' + t.length);
}