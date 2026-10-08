const fs = require('fs');
const dir = 'clients/zaheera-fragrances/src';
for (const f of ['checkout.html', 'index.html']) {
  const p = dir + '/' + f;
  if (!fs.existsSync(p)) { console.log('  skip ' + f); continue; }
  let t = fs.readFileSync(p, 'utf8');
  const before = t;
  // only change main.js, not configs.js
  t = t.replace(/src="\/main\.js"/g, 'src="main.js"');
  if (t !== before) {
    fs.writeFileSync(p, t, 'utf8');
    console.log('  ' + f + ': /main.js -> main.js');
  } else {
    console.log('  ' + f + ': no change');
  }
}