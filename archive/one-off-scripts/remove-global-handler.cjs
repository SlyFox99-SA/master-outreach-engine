const fs = require('fs');
for (const c of ['zaheera-fragrances','techhub-phones','monetech-sneakers','lumo-skincare']) {
  const p = 'clients/' + c + '/src/main.js';
  if (!fs.existsSync(p)) continue;
  let m = fs.readFileSync(p, 'utf8');
  const before = m.length;

  // Remove the entire global click handler that mis-matches image src
  m = m.replace(/\s*document\.addEventListener\("click", function\(e\)\{ if \(e\.target\.closest\("button, a, input, select, textarea"\)\) return;[\s\S]*?openDetail\(p\); console\.log\("\[detail\] opened", p\.name\); \}\);/, '');

  if (m.length !== before) {
    fs.writeFileSync(p, m, 'utf8');
    console.log('  ' + c + ': global handler removed (-' + (before - m.length) + ' bytes)');
  } else {
    console.log('  ' + c + ': no global handler found');
  }
}