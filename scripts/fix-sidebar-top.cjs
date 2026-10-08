const fs = require('fs');
const files = [
  'clients/zaheera-fragrances/src/checkout.html',
  'clients/techhub-phones/src/checkout.html',
  'clients/monetech-sneakers/src/checkout.html',
  'clients/lumo-skincare/src/checkout.html'
];
for (const p of files) {
  if (!fs.existsSync(p)) continue;
  let t = fs.readFileSync(p, 'utf8');
  let h = 0;
  // fix all sticky-sidebar top values to clear the header
  t = t.replace(/position:\s*sticky;\s*top:\s*\d+px;/g, 'position: sticky; top: 88px;');
  if (t !== fs.readFileSync(p, 'utf8')) { fs.writeFileSync(p, t, 'utf8'); console.log('  ' + p.split('/')[1] + ': sidebar top -> 88px'); h++; }
  else console.log('  ' + p.split('/')[1] + ': no change');
}