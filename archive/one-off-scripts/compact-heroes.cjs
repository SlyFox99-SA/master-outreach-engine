const fs = require('fs');

const introStrip = (brand, tagline, titleCls, blurbCls) => `<!-- compact intro -->
<section class="border-b border-black/5">
  <div class="max-w-6xl mx-auto px-5 py-8 md:py-12">
    <p class="tight text-[10px] uppercase opacity-50 mb-3" x-text="$store.config.brand?.tagline"></p>
    <h1 class="disp ${titleCls}" x-text="$store.config.brand?.name"></h1>
    <p class="mt-4 ${blurbCls} max-w-xl" x-text="$store.config.brand?.blurb"></p>
  </div>
</section>

`;

// ============ ZAHEERA — compact strip ============
{
  const p = 'clients/zaheera-fragrances/src/index.html';
  let t = fs.readFileSync(p, 'utf8');
  const starts = ['<!-- zaheera: dark magazine cover -->', '<!-- magazine hero (text only) -->', '<!-- magazine hero -->'];
  const start = starts.map(m => t.indexOf(m)).filter(i => i !== -1)[0];
  const end = t.indexOf('<section id="shop"');
  if (start === undefined || start === -1 || end === -1) { console.log('  zaheera MISS', start, end); }
  else {
    const newIntro = introStrip('zaheera', '', 'text-[2.2rem] md:text-[3.6rem] leading-[0.98]', 'text-sm md:text-base opacity-65 leading-relaxed');
    t = t.slice(0, start) + newIntro + t.slice(end);
    fs.writeFileSync(p, t, 'utf8');
    console.log('  zaheera: compact strip. size: ' + t.length);
  }
}

// ============ LUMO — compact strip, no standards table ============
{
  const p = 'clients/lumo-skincare/src/index.html';
  let t = fs.readFileSync(p, 'utf8');
  const starts = ['<!-- lumo: clinical light grid -->', '<!-- clinical hero -->'];
  const start = starts.map(m => t.indexOf(m)).filter(i => i !== -1)[0];
  const end = t.indexOf('<section id="shop"');
  if (start === undefined || start === -1 || end === -1) { console.log('  lumo MISS', start, end); }
  else {
    const newIntro = introStrip('lumo', '', 'text-[2.2rem] md:text-[3.6rem] leading-[0.98]', 'text-sm md:text-base opacity-65 leading-relaxed');
    t = t.slice(0, start) + newIntro + t.slice(end);
    fs.writeFileSync(p, t, 'utf8');
    console.log('  lumo: compact strip. size: ' + t.length);
  }
}