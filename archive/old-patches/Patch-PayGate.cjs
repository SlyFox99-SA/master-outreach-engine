const fs = require('fs');
const p = process.cwd() + '\\checkout.html';
let t = fs.readFileSync(p, 'utf8');

const anchor1 = 'var hasGw = !!(cfg.payment && cfg.payment.provider);';
if (!t.includes(anchor1)) { console.log('MISS anchor1'); process.exit(1); }
const repl1 = [
  anchor1,
  'var payEnabled = !!(cfg.payment && cfg.payment.enabled);',
  'var payUpsell = "<div class=" + DQ + "rounded-xl bg-brand-primary/5 border border-brand-primary/20 p-4 mb-4" + DQ + "><div class=" + DQ + "flex items-start gap-3" + DQ + "><div class=" + DQ + "text-2xl" + DQ + ">&#128179;</div><div class=" + DQ + "flex-1" + DQ + "><p class=" + DQ + "text-sm font-semibold mb-1" + DQ + ">Want instant card &amp; EFT payments?</p><p class=" + DQ + "text-xs opacity-70 mb-3" + DQ + ">Skip the proof-of-payment step. Card, Apple Pay &amp; instant EFT &mdash; available as an optional add-on.</p><a href=" + DQ + "https://wa.me/" + String(cfg.whatsapp||"").replace(/\\D/g,"") + "?text=" + DQ + " + encodeURIComponent("Hi! I want to add online payments to my store.") + " + DQ + " target=" + DQ + "_blank" + DQ + " class=" + DQ + "inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:underline" + DQ + ">Ask about online payments &#8594;</a></div></div></div>";'
].join('\n');
t = t.replace(anchor1, repl1);

const anchor2 = 'if (hasGw) { var gwUrl';
if (!t.includes(anchor2)) { console.log('MISS anchor2'); process.exit(1); }
t = t.replace(anchor2, 'if (payEnabled && hasGw) { var gwUrl');

const anchor3 = 'or pay via EFT &#8212;</p>"; }';
if (!t.includes(anchor3)) { console.log('MISS anchor3'); process.exit(1); }
t = t.replace(anchor3, 'or pay via EFT &#8212;</p>"; } else { payHtml += payUpsell; }');

fs.writeFileSync(p, t, 'utf8');
console.log('checkout.html patched OK');