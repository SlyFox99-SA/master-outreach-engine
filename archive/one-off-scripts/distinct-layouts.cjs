const fs = require('fs');

// ================= ZAHEERA — magazine layout =================
{
  const p = 'clients/zaheera-fragrances/src/index.html';
  let t = fs.readFileSync(p, 'utf8');
  let h = 0;

  // 1. Magazine header: nav split left/right, logo centered
  const oldHeader = /<header[^>]*>[\s\S]*?<\/header>/;
  const newHeader = `<header class="sticky top-0 z-30 bg-brand-surface/95 backdrop-blur border-b border-black/5">
  <div class="max-w-6xl mx-auto px-5 grid grid-cols-3 items-center" style="height:64px;">
    <nav class="hidden md:flex items-center gap-7 text-[10px] tight uppercase opacity-70">
      <a href="#shop" class="hover:opacity-100">Shop</a>
      <a href="#story" class="hover:opacity-100">Atelier</a>
    </nav>
    <div class="text-center">
      <a href="/" class="disp text-2xl md:text-3xl" x-text="$store.config.brand?.name"></a>
    </div>
    <div class="flex items-center justify-end gap-5">
      <a href="#contact" class="hidden md:inline text-[10px] tight uppercase opacity-70 hover:opacity-100">Contact</a>
      <button @click="$store.cart.open = true" class="relative flex items-center gap-1.5 text-[10px] tight uppercase">
        <svg viewBox="0 0 24 24" class="h-4 w-4 fill-none stroke-current" stroke-width="1.4"><path d="M6 7h12l-1 12H7L6 7zM9 7a3 3 0 0 1 6 0"/></svg>
        <span x-text="$store.cart && $store.cart.count ? $store.cart.count() : 0"></span>
      </button>
    </div>
  </div>
</header>`;
  if (oldHeader.test(t)) { t = t.replace(oldHeader, newHeader); h++; }

  // 2. Magazine intro: bigger serif, tagline above, blurb below in 2 cols
  const oldIntro = /<!-- compact intro -->[\s\S]*?<section id="shop"/;
  const newIntro = `<!-- magazine intro -->
<section class="border-b border-black/5">
  <div class="max-w-6xl mx-auto px-5 py-12 md:py-20">
    <p class="tight text-[10px] uppercase opacity-50 mb-6" x-text="$store.config.brand?.tagline"></p>
    <h1 class="disp text-[3.2rem] md:text-[6.4rem] leading-[0.9] max-w-4xl" x-text="$store.config.brand?.name"></h1>
    <div class="mt-8 md:mt-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <p class="text-sm md:text-base opacity-65 leading-relaxed max-w-md" x-text="$store.config.brand?.blurb"></p>
      <div class="md:text-right">
        <p class="text-[10px] tight uppercase opacity-40">Est. Cape Town</p>
        <p class="text-[10px] tight uppercase opacity-40 mt-1">Nº 01 — 2026</p>
      </div>
    </div>
  </div>
</section>

<section id="shop"`;
  if (oldIntro.test(t)) { t = t.replace(oldIntro, newIntro); h++; }

  // 3. Magazine grid: 3 col, portrait 4:5
  t = t.replace(/class="p-grid[^"]*"/, 'class="p-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:28px 14px;"');
  t = t.replace(/<div class="relative aspect-square overflow-hidden[^"]*"/, '<div class="relative" style="aspect-ratio:4/5;overflow:hidden;background:rgba(0,0,0,0.05);"');
  // Responsive grid via style block
  if (!t.includes('zaheera-grid-rules')) {
    t = t.replace('</style>', '\n/* zaheera-grid-rules */\n@media (min-width: 768px) { .p-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 40px 20px !important; } }\n</style>');
  }

  fs.writeFileSync(p, t, 'utf8');
  console.log('  zaheera magazine: ' + h + ' changes. size: ' + t.length);
}

// ================= LUMO — lab layout =================
{
  const p = 'clients/lumo-skincare/src/index.html';
  let t = fs.readFileSync(p, 'utf8');
  let h = 0;

  // 1. Swap display font to Space Grotesk
  if (!t.includes('Space+Grotesk')) {
    t = t.replace('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">');
    t = t.replace(':root{', ':root{--f-display:"Space Grotesk",system-ui,sans-serif;--f-mono:"JetBrains Mono",monospace;');
    h++;
  }
  // Ensure .disp uses Space Grotesk
  t = t.replace(/\.disp\{[^}]*\}/, '.disp{font-family:"Space Grotesk",system-ui,sans-serif;font-weight:600;letter-spacing:-0.03em;line-height:1.02;}');
  t = t.replace(/\.disp \{[^}]*\}/, '.disp { font-family:"Space Grotesk",system-ui,sans-serif; font-weight:600; letter-spacing:-0.03em; line-height:1.02; }');

  // 2. Lab header: brand left, mono nav right, thin rule
  const oldHeader = /<header[^>]*>[\s\S]*?<\/header>/;
  const newHeader = `<header class="sticky top-0 z-30 bg-brand-surface/95 backdrop-blur border-b border-black/5">
  <div class="max-w-6xl mx-auto px-5 flex items-center justify-between" style="height:56px;">
    <a href="/" class="disp text-lg md:text-xl font-semibold" x-text="$store.config.brand?.name" style="font-family:'Space Grotesk',system-ui,sans-serif;"></a>
    <nav class="flex items-center gap-6" style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;opacity:0.7;">
      <a href="#shop" class="hidden md:inline hover:opacity-100">[ Shop ]</a>
      <a href="#story" class="hidden md:inline hover:opacity-100">[ About ]</a>
      <a href="#contact" class="hidden md:inline hover:opacity-100">[ Contact ]</a>
      <button @click="$store.cart.open = true" class="flex items-center gap-1.5 hover:opacity-100">
        <svg viewBox="0 0 24 24" class="h-4 w-4 fill-none stroke-current" stroke-width="1.6"><path d="M6 7h12l-1 12H7L6 7zM9 7a3 3 0 0 1 6 0"/></svg>
        <span x-text="$store.cart && $store.cart.count ? $store.cart.count() : 0"></span>
      </button>
    </nav>
  </div>
</header>`;
  if (oldHeader.test(t)) { t = t.replace(oldHeader, newHeader); h++; }

  // 3. Lab intro: small brand label + uppercase sans headline + spec chips inline
  const oldIntro = /<!-- compact intro -->[\s\S]*?<section id="shop"/;
  const newIntro = `<!-- lab intro -->
<section class="border-b border-black/5">
  <div class="max-w-6xl mx-auto px-5 py-10 md:py-14">
    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div>
        <p style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;opacity:0.5;margin-bottom:10px;" x-text="$store.config.brand?.tagline"></p>
        <h1 class="disp" style="font-family:'Space Grotesk',system-ui,sans-serif;font-size:clamp(2rem,3.6vw,3.2rem);font-weight:700;letter-spacing:-0.03em;line-height:1;" x-text="$store.config.brand?.name"></h1>
        <p class="mt-4 text-sm md:text-base opacity-65 max-w-xl" x-text="$store.config.brand?.blurb"></p>
      </div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.55;" class="md:text-right space-y-1">
        <p>pH 5.5</p>
        <p>Fragrance-free</p>
        <p>Dermatologist tested</p>
        <p>Vegan</p>
      </div>
    </div>
  </div>
</section>

<section id="shop"`;
  if (oldIntro.test(t)) { t = t.replace(oldIntro, newIntro); h++; }

  // 4. Lab grid: 4 col desktop, 1:1
  t = t.replace(/class="p-grid[^"]*"/, 'class="p-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px 12px;"');
  t = t.replace(/<div class="relative aspect-square overflow-hidden[^"]*"/, '<div class="relative" style="aspect-ratio:1/1;overflow:hidden;background:rgba(0,0,0,0.05);"');
  if (!t.includes('lumo-grid-rules')) {
    t = t.replace('</style>', '\n/* lumo-grid-rules */\n@media (min-width: 768px) { .p-grid { grid-template-columns: repeat(4, 1fr) !important; gap: 28px 16px !important; } }\n</style>');
  }

  fs.writeFileSync(p, t, 'utf8');
  console.log('  lumo lab: ' + h + ' changes. size: ' + t.length);
}