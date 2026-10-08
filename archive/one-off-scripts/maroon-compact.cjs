const fs = require('fs');

// ============ ZAHEERA — maroon theme + tighter hero ============
{
  // 1. Theme: swap accent from terracotta → maroon
  for (const p of ['data/config-zaheera.json', 'clients/zaheera-fragrances/src/config.json']) {
    if (!fs.existsSync(p)) continue;
    const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
    cfg.theme = cfg.theme || {};
    cfg.theme.accent = '107 24 36';   // deep maroon
    cfg.theme.primary = '107 24 36';  // use maroon as primary too
    fs.writeFileSync(p, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
    console.log('  ' + p + ': theme maroon');
  }

  // 2. Tighter intro
  const p = 'clients/zaheera-fragrances/src/index.html';
  let t = fs.readFileSync(p, 'utf8');
  const oldIntro = /<!-- magazine intro -->[\s\S]*?<section id="shop"/;
  const newIntro = `<!-- magazine intro (tight) -->
<section class="border-b border-black/5">
  <div class="max-w-6xl mx-auto px-5 py-6 md:py-9">
    <div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-3 md:gap-8">
      <div>
        <p class="tight text-[10px] uppercase opacity-50 mb-2" x-text="$store.config.brand?.tagline"></p>
        <h1 class="disp text-[2rem] md:text-[3.4rem] leading-[1]" x-text="$store.config.brand?.name"></h1>
      </div>
      <p class="text-xs md:text-sm opacity-60 max-w-xs md:text-right md:pb-1" x-text="$store.config.brand?.blurb"></p>
    </div>
  </div>
</section>

<section id="shop"`;
  if (oldIntro.test(t)) { t = t.replace(oldIntro, newIntro); console.log('  zaheera intro compacted'); }

  // 3. ADD/BUY buttons use maroon
  t = t.split('class="text-[10px] tight uppercase border border-current px-3 py-1.5 hover:bg-brand-ink hover:text-brand-surface transition disabled:opacity-30">Add</button>')
       .join('class="text-[10px] tight uppercase bg-brand-primary text-white px-3 py-1.5 hover:opacity-90 transition disabled:opacity-30">Add</button>');
  t = t.split('class="text-[10px] tight uppercase bg-brand-ink text-brand-surface px-3 py-1.5 hover:opacity-90 transition disabled:opacity-30">Buy</button>')
       .join('class="text-[10px] tight uppercase border border-brand-primary text-brand-primary px-3 py-1.5 hover:bg-brand-primary hover:text-white transition disabled:opacity-30">Buy</button>');

  fs.writeFileSync(p, t, 'utf8');
  console.log('  zaheera: ' + t.length + ' bytes');
}

// ============ LUMO — tighter intro too ============
{
  const p = 'clients/lumo-skincare/src/index.html';
  let t = fs.readFileSync(p, 'utf8');
  const oldIntro = /<!-- lab intro -->[\s\S]*?<section id="shop"/;
  const newIntro = `<!-- lab intro (tight) -->
<section class="border-b border-black/5">
  <div class="max-w-6xl mx-auto px-5 py-6 md:py-9">
    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-10">
      <div>
        <p style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;opacity:0.5;margin-bottom:8px;" x-text="$store.config.brand?.tagline"></p>
        <h1 class="disp" style="font-family:'Space Grotesk',system-ui,sans-serif;font-size:clamp(1.8rem,3vw,2.6rem);font-weight:700;letter-spacing:-0.03em;line-height:1;" x-text="$store.config.brand?.name"></h1>
        <p class="mt-3 text-xs md:text-sm opacity-60 max-w-lg" x-text="$store.config.brand?.blurb"></p>
      </div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.55;" class="flex flex-wrap gap-x-4 gap-y-1 md:text-right md:flex-col md:gap-1">
        <span>pH 5.5</span><span>Fragrance-free</span><span>Dermatologist</span><span>Vegan</span>
      </div>
    </div>
  </div>
</section>

<section id="shop"`;
  if (oldIntro.test(t)) { t = t.replace(oldIntro, newIntro); console.log('  lumo intro compacted'); }
  fs.writeFileSync(p, t, 'utf8');
  console.log('  lumo: ' + t.length + ' bytes');
}

// Regen configs.js
const all = {};
for (const b of ['techhub','monetech','zaheera','lumo']) {
  const p = 'data/config-' + b + '.json';
  if (fs.existsSync(p)) all[b] = JSON.parse(fs.readFileSync(p, 'utf8'));
}
all.active = all.techhub;
fs.writeFileSync('configs.js', 'window.__CONFIGS = ' + JSON.stringify(all) + ';\n', 'utf8');
console.log('  configs.js: ' + fs.statSync('configs.js').size + ' bytes');