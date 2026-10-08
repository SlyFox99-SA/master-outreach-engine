const fs = require('fs');
const p = 'clients/zaheera-fragrances/src/main.js';
let m = fs.readFileSync(p, 'utf8');

// Remove any old version first
m = m.replace(/productImages: function[\s\S]*?detailImage: function\(\)\{[^}]*\},/, '');
m = m.replace(/productImages: function[^\n]*\n    detailImages:[^\n]*\n    detailImageIdx:[^\n]*\n    detailSetImage:[^\n]*\n    detailImage:[^\n]*\n/, '');

// Force-inject right before detailOpen
const anchor = m.indexOf('detailOpen:false,');
if (anchor === -1) { console.log('MISS anchor'); process.exit(1); }

const methods = `productImages: function(p){ if(!p) return []; var a = Array.isArray(p.images) ? p.images.filter(Boolean) : []; if(a.length === 0 && p.image) a.push(p.image); return a; },
    detailImages: function(){ return this.productImages(this.detailProduct); },
    detailImageIdx: 0,
    detailSetImage: function(i){ this.detailImageIdx = i; },
    detailImage: function(){ var imgs = this.productImages(this.detailProduct); return imgs[this.detailImageIdx || 0] || ''; },
    `;

m = m.slice(0, anchor) + methods + m.slice(anchor);
fs.writeFileSync(p, m, 'utf8');
console.log('methods force-injected. size: ' + m.length);