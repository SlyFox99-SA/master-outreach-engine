const fs = require('fs');
const root = process.cwd();

// ========== A. All shells: cart-drawer checkout link → carry brand ==========
const shells = [
  'templates\\_preview\\zaheera-v2\\index.html',
  'templates\\brands\\zaheera\\index.html',
  'templates\\brands\\techhub\\index.html',
  'templates\\brands\\monetech\\index.html',
  'templates\\brands\\lumo\\index.html',
  'templates\\_shells\\editorial\\index.html',
  'templates\\_shells\\spec-first\\index.html',
  'templates\\_shells\\lookbook\\index.html'
];
let shellHits = 0;
for (const rel of shells) {
  const p = root + '\\' + rel;
  if (!fs.existsSync(p)) { console.log('SKIP ' + rel); continue; }
  let t = fs.readFileSync(p, 'utf8');
  let h = 0;

  // Replace any plain href="/checkout.html" with brand-aware Alpine-bound href
  const pattern = /href="\/checkout\.html"/g;
  const before = (t.match(pattern) || []).length;
  if (before > 0) {
    t = t.replace(pattern, ':href="\'/checkout.html?brand=\' + ($store.config.id || window.__BRAND__ || \'active\')"');
    h += before;
  }

  // Also handle href="/checkout.html?brand=..." — already has brand, leave alone
  if (h > 0) fs.writeFileSync(p, t, 'utf8');
  console.log(rel + ' -> ' + h + ' checkout links fixed');
  shellHits += h;
}
console.log('shells total: ' + shellHits);

// ========== B. checkout.html: bulletproof brand resolution + back link ==========
const cp = root + '\\checkout.html';
let c = fs.readFileSync(cp, 'utf8');
let ch = 0;

// B1 — Replace the fragile brand resolution block with strict resolution + friendly error
const oldResolve = 'var brand = P.get("brand") || localStorage.getItem("brand") || "active";';
const newResolve = `var brand = P.get("brand");
if (!brand) {
  try { brand = localStorage.getItem("lastBrand"); } catch(e) {}
}
if (!brand || !(window.__CONFIGS && window.__CONFIGS[brand])) {
  document.body.innerHTML = '<div style="max-width:520px;margin:80px auto;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;text-align:center;color:#1a1a1a"><h2 style="font-size:22px;margin:0 0 12px">No store selected</h2><p style="font-size:14px;color:#6b6560;margin:0 0 24px">To check out, please start from a store.</p><a href="/pitch/" style="display:inline-block;padding:14px 28px;background:#1a1a1a;color:#fff;text-decoration:none;font-size:11px;letter-spacing:0.24em;text-transform:uppercase">Browse stores</a></div>';
  throw new Error("No brand");
}
try { localStorage.setItem("lastBrand", brand); } catch(e) {}`;
if (c.includes(oldResolve)) { c = c.replace(oldResolve, newResolve); ch++; console.log('checkout: strict brand resolution'); }
else console.log('checkout: MISS brand resolution');

// B2 — Fix "Back to store" link — give it an id and set it in JS
if (c.includes('&#8592; Back to store') && !c.includes('id="backToStore"')) {
  c = c.replace(/(<a\s+)href="\/"([^>]*?)(>&#8592; Back to store<\/a>)/, '$1id="backToStore" href="/"$2$3');
  ch++;
  console.log('checkout: back-to-store id added');
}

// B3 — After brand resolves, set the back link href
const backAnchor = 'try { localStorage.setItem("lastBrand", brand); } catch(e) {}';
const backFix = backAnchor + `
var bt = document.getElementById("backToStore");
if (bt) bt.href = "/?brand=" + encodeURIComponent(brand);
var brandName = (cfg && cfg.brand && cfg.brand.name) || brand;
document.title = "Checkout · " + brandName;`;
if (c.includes(backAnchor) && !c.includes('backToStore").href')) {
  c = c.replace(backAnchor, backFix);
  ch++;
  console.log('checkout: back link brand-bound');
}

// B4 — Ensure Alpine CDN present (demo banner needs it)
if (!c.includes('cdn.jsdelivr.net/npm/alpinejs')) {
  const alpine = '<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js"></script>\n</body>';
  c = c.replace('</body>', alpine);
  ch++;
  console.log('checkout: alpine CDN added');
}

// B5 — ensure demo banner only shows with ?demo=1 (already has that x-show, but strip the earlier mis-patch if any)
if (c.includes('x-show="demo"') && !c.includes('P.get(\'demo\')')) {
  console.log('checkout: demo x-show already scoped (no change)');
}

fs.writeFileSync(cp, c, 'utf8');
console.log('checkout.html -> ' + ch + ' changes');
console.log('TOTAL: ' + (shellHits + ch));