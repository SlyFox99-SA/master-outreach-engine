const fs = require('fs');
for (const c of ['zaheera-fragrances','techhub-phones','monetech-sneakers','lumo-skincare']) {
  const p = 'clients/' + c + '/src/main.js';
  if (!fs.existsSync(p)) continue;
  let m = fs.readFileSync(p, 'utf8');
  if (m.includes('detailImageIdx:')) { console.log('  ' + c + ': already has gallery methods'); continue; }

  // Insert image methods right before the closing of the config store object
  // Find "detailOpen:false," marker — inject our methods before it
  const marker = 'detailOpen:false,';
  const methods = `productImages: function(p){ if(!p) return []; var a = Array.isArray(p.images) ? p.images.filter(Boolean) : []; if(a.length === 0 && p.image) a.push(p.image); return a; },
    detailImages: function(){ return this.productImages(this.detailProduct); },
    detailImageIdx: 0,
    detailSetImage: function(i){ this.detailImageIdx = i; },
    detailImage: function(){ var imgs = this.productImages(this.detailProduct); return imgs[this.detailImageIdx || 0] || ''; },
    detailOpen:false,`;

  if (m.includes(marker)) {
    m = m.replace(marker, methods);
    fs.writeFileSync(p, m, 'utf8');
    console.log('  ' + c + ': gallery methods added');
  } else {
    console.log('  ' + c + ': MISS marker');
  }
}