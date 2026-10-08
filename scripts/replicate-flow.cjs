const fs = require('fs');

const clients = {
  'techhub-phones':    { id: 'techhub',  theme: 'clean' },
  'monetech-sneakers': { id: 'monetech', theme: 'hype' },
  'lumo-skincare':     { id: 'lumo',     theme: 'editorial' }
};

const srcDir = 'clients/zaheera-fragrances/src';

// ---------- Per-theme CSS var blocks for checkout ----------
const themes = {
  clean: `
    :root { --display: 'Space Grotesk', system-ui, sans-serif; --body: 'Space Grotesk', system-ui, sans-serif;
      --bone: #fafafa; --paper: #ffffff; --ink: #0a0a0a; --faded: #6b6b6b; --rule: rgba(10,10,10,0.10); --err: #c53030; }
  `,
  hype: `
    :root { --display: 'Archivo Black', system-ui, sans-serif; --body: 'Archivo', system-ui, sans-serif;
      --bone: #171613; --paper: #0e0d0b; --ink: #f5f1e9; --faded: #9a8f80; --rule: rgba(255,255,255,0.12); --err: #ff3b30; }
    body { color: var(--ink); }
    header { background: #0e0d0b !important; }
    section.card { background: #171613 !important; }
    label.fld input, label.fld textarea { background: #0e0d0b !important; color: var(--ink) !important; }
    .wizard-nav .next { background: #d4ff00 !important; color: #0a0a0a !important; }
    .wizard-nav .back { border-color: rgba(255,255,255,0.15) !important; color: var(--ink) !important; }
    .ship-opt.on { background: rgba(212,255,0,0.06) !important; border-color: #d4ff00 !important; }
    .thanks-cta { background: #d4ff00 !important; color: #0a0a0a !important; }
  `,
  editorial: `
    :root { --display: 'Instrument Serif', Georgia, serif; --body: 'Inter', system-ui, sans-serif;
      --bone: #f5f1ea; --paper: #fbf9f5; --ink: #1a1a1a; --faded: #6b6560; --rule: rgba(26,26,26,0.10); --err: #c53030; }
  `
};

for (const [client, cfg] of Object.entries(clients)) {
  const dst = 'clients/' + client + '/src';

  // 1. copy main.js from zaheera
  fs.copyFileSync(srcDir + '/main.js', dst + '/main.js');
  console.log('  ' + client + ': main.js copied');

  // 2. copy checkout.html and inject theme block
  let co = fs.readFileSync(srcDir + '/checkout.html', 'utf8');
  const themeCss = themes[cfg.theme];
  co = co.replace('</head>', '<style>' + themeCss + '</style>\n</head>');
  // fix href in brand link + script paths (relative)
  co = co.replace(/href="\.\/"/g, 'href="./index.html?brand=' + cfg.id + '"');
  fs.writeFileSync(dst + '/checkout.html', co, 'utf8');
  console.log('  ' + client + ': checkout.html (theme: ' + cfg.theme + ')');

  // 3. patch index.html: add Buy button + qty controls + fix main.js path
  let idx = fs.readFileSync(dst + '/index.html', 'utf8');
  const before = idx.length;

  // relative main.js
  idx = idx.replace(/src="\/main\.js"/g, 'src="main.js"');

  // Buy button next to Add (anchor on >Add</button>)
  if (idx.includes('>Add</button>') && !idx.includes('cart.buyNow(p')) {
    const addStart = idx.indexOf('>Add</button>');
    const buyMarkup = `>Add</button>\n              <button @click.stop="$store.cart.buyNow(p, $store.config.pickVariant(p))" :disabled="!$store.config.inStock(p)" class="text-[10px] tight uppercase border border-current px-2.5 py-1.5 hover:bg-brand-ink hover:text-brand-surface transition disabled:opacity-30">Buy</button>`;
    idx = idx.slice(0, addStart) + buyMarkup + idx.slice(addStart + '>Add</button>'.length);
    console.log('  ' + client + ': Buy button added');
  }

  // qty +/- in cart drawer
  if (idx.includes("'Qty ' + i.qty") && !idx.includes('setQty(i.id, i.variantId')) {
    const qtyMarker = "'Qty ' + i.qty";
    const qtyIdx = idx.indexOf(qtyMarker);
    const before2 = idx.lastIndexOf('<p', qtyIdx);
    const after2 = idx.indexOf('</p>', qtyIdx);
    if (before2 !== -1 && after2 !== -1) {
      const newQtyBlock = `<p class="text-[11px] opacity-55 mt-0.5" x-show="i.variantName" x-text="i.variantName"></p>
          <div class="flex items-center gap-2 mt-1.5">
            <button @click="$store.cart.setQty(i.id, i.variantId, i.qty - 1)" class="w-6 h-6 grid place-items-center border border-black/15 hover:border-black/40 text-sm leading-none">\u2212</button>
            <span class="text-xs min-w-[16px] text-center" x-text="i.qty"></span>
            <button @click="$store.cart.setQty(i.id, i.variantId, i.qty + 1)" :disabled="i.stock !== Infinity && i.qty >= i.stock" class="w-6 h-6 grid place-items-center border border-black/15 hover:border-black/40 text-sm leading-none disabled:opacity-30">+</button>
          </div>`;
      idx = idx.slice(0, before2) + newQtyBlock + idx.slice(after2 + 4);
      console.log('  ' + client + ': qty controls added');
    }
  }

  // storefront checkout link carries brand
  idx = idx.replace(/href="\.\/checkout\.html[^"]*"/g, 'href="./checkout.html?brand=' + cfg.id + '"');

  fs.writeFileSync(dst + '/index.html', idx, 'utf8');
  console.log('  ' + client + ': index.html patched (' + before + ' -> ' + idx.length + ')');
}

console.log('\nDONE. All 3 clients updated.');