const fs = require('fs');
const p = process.cwd() + '\\checkout.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// 1. Check if Fix-Checkout.cjs ever ran
if (!t.includes('applyTheme(cfg)')) { console.log('  WARNING: Fix-Checkout.cjs not run yet'); }
else console.log('  Fix-Checkout already applied');

// 2. "Back to store" — make it brand-aware
// Find the back link and replace href="/" with brand-aware href
const oldBack = 'href="/" class="text-sm opacity-60 hover:opacity-100">&#8592; Back to store</a>';
const newBack = ':href="\'/?brand=\' + brand" class="text-sm opacity-60 hover:opacity-100">&#8592; Back to store</a>';
if (t.includes(oldBack)) { t = t.replace(oldBack, newBack); h++; console.log('  back link made brand-aware (path 1)'); }
else {
  // try alternate form — the actual markup may differ slightly
  if (t.includes('&#8592; Back to store')) {
    t = t.replace(/<a href="\/"([^>]*?)>&#8592; Back to store<\/a>/g, '<a :href="\'/?brand=\' + brand"$1>&#8592; Back to store</a>');
    h++;
    console.log('  back link made brand-aware (regex path)');
  } else {
    console.log('  MISS back link');
  }
}

// 3. Track link — same treatment (it points to track.html which also needs brand)
const oldTrack = 'var trackUrl = location.origin + "/track.html?ref=" + encodeURIComponent(ref) + "&brand=" + brand;';
if (t.includes(oldTrack)) { t = t.replace(oldTrack, 'var trackUrl = location.origin + "/track/?ref=" + encodeURIComponent(ref) + "&brand=" + brand;'); h++; console.log('  track URL fixed to /track/'); }
else {
  const oldTrack2 = 'var trackUrl = location.origin + "/track/?ref=" + encodeURIComponent(ref) + "&brand=" + brand;';
  if (t.includes(oldTrack2)) console.log('  track URL already /track/');
  else console.log('  MISS track URL');
}

// 4. Ensure checkout redir includes brand if it somehow got dropped — patch the buyNow in main.js
const mp = process.cwd() + '\\main.js';
let m = fs.readFileSync(mp, 'utf8');
const oldBuy = 'window.location.href="/checkout.html?brand="+cfg.id;';
if (m.includes(oldBuy)) console.log('  main.js buyNow already appends brand');
else console.log('  WARNING: main.js buyNow may not append brand');

fs.writeFileSync(p, t, 'utf8');
console.log('checkout.html -> ' + h + ' changes');