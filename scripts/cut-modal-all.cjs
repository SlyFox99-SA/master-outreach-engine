const fs = require('fs');
for (const c of ['techhub-phones','monetech-sneakers','lumo-skincare']) {
  const p = 'clients/' + c + '/src/index.html';
  if (!fs.existsSync(p)) continue;
  let t = fs.readFileSync(p, 'utf8');
  const start = t.indexOf('<!-- detail modal -->');
  const end = t.indexOf('<!-- cart -->');
  if (start === -1 || end === -1) { console.log('  ' + c + ': no modal to remove or cart marker missing'); continue; }
  t = t.slice(0, start) + '<!-- detail modal: rebuild next session -->\n\n' + t.slice(end);
  fs.writeFileSync(p, t, 'utf8');
  console.log('  ' + c + ': modal cut');
}