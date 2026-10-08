const fs = require('fs');
const p = 'pitch/index.html';
let t = fs.readFileSync(p, 'utf8');
const lines = t.split('\n');
let h = 0;
for (let i = 0; i < lines.length; i++) {
  const L = lines[i];
  if (L.indexOf('<div class="tile">') === -1) continue;
  let newUrl = null;
  // Match on the price-tag text which is unique per tile
  if (L.indexOf('price-tag">R3,500') !== -1) newUrl = 'sfox-personal.pages.dev';
  else if (L.indexOf('price-tag">R5,000') !== -1) newUrl = 'sfox-starter.pages.dev';
  else if (L.indexOf('price-tag">R6,500') !== -1 && L.indexOf('sfox-personal') !== -1) newUrl = 'monetech-outreach.pages.dev';
  else if (L.indexOf('price-tag">R7,500') !== -1) newUrl = 'lumo-mockup.pages.dev';
  else if (L.indexOf('price-tag">R8,500') !== -1) newUrl = 'techseller-mockup.pages.dev';
  if (newUrl) {
    lines[i] = L.replace(/src="[^"]*"/, 'src="https://' + newUrl + '/"');
    h++;
    console.log('  R' + L.match(/price-tag">R([\d,]+)/)[1] + ' → ' + newUrl);
  }
}
fs.writeFileSync(p, lines.join('\n'), 'utf8');
console.log('total: ' + h + ' tiles rewired');