const fs = require('fs');
const p = process.cwd() + '\\checkout.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// 1. Fix the broken "Hi! I want to add online payments to my store." quote
const broken1 = '" + DQ + "?text=" + DQ + " + encodeURIComponent("Hi! I want to add online paymentsto my store.") + " + DQ + " target="';
const fixed1  = '" + DQ + "?text=" + encodeURIComponent("Hi! I want to add online payments to my store.") + DQ + " target="';
if (t.includes(broken1)) { t = t.split(broken1).join(fixed1); h++; console.log('  fixed encodeURIComponent'); }
else console.log('  MISS encodeURIComponent');

// 2. Fix missing space in class name
if (t.includes('bg-brand-primary/5border')) {
  t = t.split('bg-brand-primary/5border').join('bg-brand-primary/5 border');
  h++;
  console.log('  fixed missing space in class');
}

// 3. Strip anything after the first </html>
const idx = t.indexOf('</html>');
if (idx !== -1) {
  const after = t.slice(idx + 7);
  if (after.trim().length > 0) {
    t = t.slice(0, idx + 7) + '\n';
    h++;
    console.log('  stripped ' + after.trim().length + ' bytes after </html>');
  }
}

// 4. Add Alpine CDN before closing </body> (fixes the demo banner visibility)
if (!t.includes('cdn.jsdelivr.net/npm/alpinejs')) {
  const alpine = '<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js"></script>\n</body>';
  t = t.replace('</body>', alpine);
  h++;
  console.log('  added Alpine CDN');
}

// 5. Add brand theming — reads cfg.theme and applies CSS variables + body font
// Insert right after the existing `var cfg = all[brand] || all.active || {};` line
const cfgAnchor = 'var cfg = all[brand] || all.active || {};';
const themeInject = cfgAnchor + `
var applyTheme = function(cfg) {
  var r = document.documentElement;
  if (cfg.theme) {
    ["primary","accent","ink","surface"].forEach(function(k) {
      if (cfg.theme[k]) r.style.setProperty("--brand-" + k, cfg.theme[k]);
    });
  }
  // brand-aware body class — serif for luxury, sans for tech
  if (cfg.brand && cfg.brand.font) {
    r.style.setProperty("--f-display", cfg.brand.font);
    r.style.setProperty("--f-body", cfg.brand.fontBody || cfg.brand.font);
  }
  // per-brand background tint override — reads storefront shell identity
  if (cfg.brand && cfg.brand.shell === "spec-first") {
    document.body.classList.add("shell-spec");
  } else if (cfg.brand && cfg.brand.shell === "editorial") {
    document.body.classList.add("shell-editorial");
  }
  // page title
  document.title = "Checkout · " + ((cfg.brand && cfg.brand.name) || "Store");
};
applyTheme(cfg);`;

if (t.includes(cfgAnchor) && !t.includes('applyTheme(cfg)')) {
  t = t.replace(cfgAnchor, themeInject);
  h++;
  console.log('  injected brand theming');
} else if (t.includes('applyTheme(cfg)')) {
  console.log('  theming already present');
} else {
  console.log('  MISS cfg anchor');
}

fs.writeFileSync(p, t, 'utf8');
console.log('total: ' + h + ' fixes. size: ' + t.length);