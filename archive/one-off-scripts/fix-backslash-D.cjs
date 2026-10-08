const fs = require('fs');
for (const c of ['zaheera-fragrances','techhub-phones','monetech-sneakers','lumo-skincare']) {
  const p = 'clients/' + c + '/src/main.js';
  if (!fs.existsSync(p)) continue;
  let m = fs.readFileSync(p, 'utf8');
  const before = m;
  // fix the mangled \D regex — replace /D/g with /\D/g where it's stripping non-digits from whatsapp
  m = m.split('replace(/D/g, "")').join('replace(/\\D/g, "")');
  if (m !== before) { fs.writeFileSync(p, m, 'utf8'); console.log('  ' + c + ': \\D fixed'); }
  else console.log('  ' + c + ': no \\D issue');
}