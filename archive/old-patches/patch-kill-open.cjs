const fs = require('fs');
const p = 'clients/zaheera-fragrances/src/main.js';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// Remove any window.open inside submitOrder (any variant)
const submitIdx = t.indexOf('submitOrder: async function');
if (submitIdx === -1) { console.log('MISS submitOrder'); process.exit(1); }
const nextMethod = t.indexOf('\n    reset:', submitIdx) || t.indexOf('\n    resendWhatsApp:', submitIdx);
const endIdx = t.indexOf('\n    }', submitIdx);
const body = t.slice(submitIdx, endIdx);

let newBody = body.replace(/\s*window\.open\([^)]*\);\s*/g, '\n        ');
newBody = newBody.replace(/\s*window\.location\.href\s*=\s*[^;]*;\s*/g, '\n        ');

if (newBody !== body) {
  t = t.slice(0, submitIdx) + newBody + t.slice(endIdx);
  h++;
  console.log('  removed window.open from submitOrder');
} else {
  console.log('  no window.open found in submitOrder (already clean)');
}

fs.writeFileSync(p, t, 'utf8');
console.log('total: ' + h + ' changes. size: ' + t.length);