const fs = require('fs');
const p = 'clients/zaheera-fragrances/src/index.html';
let t = fs.readFileSync(p, 'utf8');
const start = t.indexOf('<!-- detail modal -->');
const end = t.indexOf('<!-- cart -->');
if (start === -1 || end === -1) { console.log('MISS'); process.exit(1); }
t = t.slice(0, start) + '<!-- detail modal: rebuild next session -->\n\n' + t.slice(end);
fs.writeFileSync(p, t, 'utf8');
console.log('modal removed. size: ' + t.length);