const fs = require('fs');
const p = 'clients/zaheera-fragrances/src/main.js';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// Remove the auto window.open that fires on submit
const oldLine = `this.lastWhatsAppUrl = "https://wa.me/" + digits + "?text=" + encodeURIComponent(lines.join("\\n")); window.open(this.lastWhatsAppUrl, "_blank");`;
const newLine = `this.lastWhatsAppUrl = "https://wa.me/" + digits + "?text=" + encodeURIComponent(lines.join("\\n"));`;
if (t.includes(oldLine)) { t = t.replace(oldLine, newLine); h++; console.log('  submitOrder: no auto-open'); }
else console.log('  MISS window.open line');

fs.writeFileSync(p, t, 'utf8');
console.log('total: ' + h + ' changes. size: ' + t.length);