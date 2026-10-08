const fs = require('fs');
for (const c of ['techhub-phones','lumo-skincare','monetech-sneakers']) {
  const p = 'clients/' + c + '/src/index.html';
  let t = fs.readFileSync(p, 'utf8');
  const before = t;
  // absolute root → relative
  t = t.replace(/href="\/checkout\.html[^"]*"/g, function(m){
    const id = c.replace('-phones','').replace('-skincare','').replace('-sneakers','');
    return 'href="./checkout.html?brand=' + id + '"';
  });
  if (t !== before) { fs.writeFileSync(p, t, 'utf8'); console.log('  ' + c + ': link fixed'); }
  else console.log('  ' + c + ': no absolute link found');
}