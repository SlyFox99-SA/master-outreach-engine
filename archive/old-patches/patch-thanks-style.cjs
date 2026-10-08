const fs = require('fs');
const p = 'clients/zaheera-fragrances/src/checkout.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// Tighter button styling, better spacing on thanks page
if (!t.includes('.thanks-cta {\n    width: 100%;')) {
  const oldCss = `.thanks-cta { width: 100%; background: var(--ink); color: var(--paper); border: none; padding: 17px; font: inherit; font-size: 11px; letter-spacing: 0.26em; text-transform: uppercase; cursor: pointer; margin-bottom: 18px; display: block; }`;
  const newCss = `.thanks-cta { display: inline-block; background: var(--ink); color: var(--paper); border: none; padding: 15px 28px; font: inherit; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; cursor: pointer; margin: 0 auto 22px; white-space: nowrap; }
  .thanks-cta:hover { opacity: 0.9; }`;
  if (t.includes(oldCss)) { t = t.replace(oldCss, newCss); h++; console.log('  button style: inline, single-line'); }
  else console.log('  MISS button css');
}

// Reminder tighter + centered
if (!t.includes('.reminder { background: var(--bone); border: 1px solid var(--rule); padding: 20px 22px; text-align: left; margin-bottom: 22px; }')) {
  // already there — skip
}
// Actually add text-align center on thanks-inner bottom buttons container — already centered

fs.writeFileSync(p, t, 'utf8');
console.log('total: ' + h + ' changes. size: ' + t.length);