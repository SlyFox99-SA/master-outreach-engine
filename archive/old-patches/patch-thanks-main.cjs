const fs = require('fs');
const p = 'clients/zaheera-fragrances/src/main.js';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

const oldOpen = `window.open("https://wa.me/" + digits + "?text=" + encodeURIComponent(lines.join("\\n")), "_blank");`;
const newOpen = `this.lastWhatsAppUrl = "https://wa.me/" + digits + "?text=" + encodeURIComponent(lines.join("\\n")); window.open(this.lastWhatsAppUrl, "_blank");`;
if (t.includes(oldOpen)) { t = t.replace(oldOpen, newOpen); h++; console.log('  save WhatsApp URL'); }
else console.log('  MISS open');

const oldReset = `reset: function(){ this.clear(); this.open=false; },`;
const newReset = `resendWhatsApp: function(){ if (this.lastWhatsAppUrl) window.open(this.lastWhatsAppUrl, "_blank"); }, reset: function(){ this.clear(); this.open=false; },`;
if (t.includes(oldReset)) { t = t.replace(oldReset, newReset); h++; console.log('  add resendWhatsApp'); }
else console.log('  MISS reset');

fs.writeFileSync(p, t, 'utf8');
console.log('main.js: ' + h + ' changes, ' + t.length + ' bytes');