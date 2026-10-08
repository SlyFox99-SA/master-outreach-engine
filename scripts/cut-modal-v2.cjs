const fs = require('fs');
const p = 'clients/zaheera-fragrances/src/index.html';
let t = fs.readFileSync(p, 'utf8');
const start = t.indexOf('<!-- detail modal -->');
const end = t.indexOf('<!-- cart -->');
if (start === -1 || end === -1) { console.log('MISS: modal or cart marker not found'); process.exit(0); }
t = t.slice(0, start) + '<!-- detail modal: rebuild next session as dedicated product.html -->\n\n' + t.slice(end);
fs.writeFileSync(p, t, 'utf8');
console.log('zaheera modal cut. size: ' + t.length);