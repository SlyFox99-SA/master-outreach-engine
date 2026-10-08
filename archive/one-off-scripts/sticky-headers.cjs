const fs = require('fs');

const files = [
  'clients/zaheera-fragrances/src/checkout.html',
  'clients/techhub-phones/src/checkout.html',
  'clients/monetech-sneakers/src/checkout.html',
  'clients/lumo-skincare/src/checkout.html'
];

for (const p of files) {
  if (!fs.existsSync(p)) { console.log('  skip ' + p); continue; }
  let t = fs.readFileSync(p, 'utf8');
  let h = 0;

  // Match any header { ... } rule and ensure it has position:sticky + top:0 + background + z-index
  t = t.replace(/header\s*\{([^}]*)\}/g, function(match, inner) {
    let rule = inner;
    if (!/position\s*:\s*sticky/.test(rule)) {
      rule = ' position: sticky; top: 0; z-index: 40; background: var(--paper);' + rule;
      h++;
    }
    // ensure background if missing
    if (!/background\s*:/.test(rule)) {
      rule = ' background: var(--paper);' + rule;
      h++;
    }
    return 'header {' + rule + '}';
  });

  if (h > 0) { fs.writeFileSync(p, t, 'utf8'); console.log('  ' + p.split('/')[1] + ': sticky header (' + h + ')'); }
  else console.log('  ' + p.split('/')[1] + ': already sticky');
}