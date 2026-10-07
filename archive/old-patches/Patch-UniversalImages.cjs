const fs = require('fs');
const root = process.cwd();
let hits = 0;

// ========== 1. seller/index.html — make commit() surface errors + add saveToast state ==========
{
  const p = root + '\\seller\\index.html';
  let t = fs.readFileSync(p, 'utf8');
  const oldCommit = /async commit\(msg\) \{[\s\S]*?\n    \},/;
  const newCommit = `async commit(msg) {
      this.saveToast = { text: 'Saving...', type: 'info' };
      try {
        var res = await fetch('https://outreach-save-api.gifttsima16.workers.dev/api/save', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (window.__SELLER_TOKEN || '') }, body: JSON.stringify({ brand: this.brandId, data: this.store, message: msg }) });
        var j = await res.json().catch(function() { return {}; });
        if (!res.ok || !j.ok) {
          this.saveToast = { text: 'Save FAILED: ' + (j.error || res.status), type: 'error' };
          console.error('[save] failed', { status: res.status, body: j, token: window.__SELLER_TOKEN ? 'set' : 'MISSING' });
        } else {
          this.saveToast = { text: '\u2713 ' + msg, type: 'success' };
          var self3 = this; setTimeout(function() { if (self3.saveToast && self3.saveToast.type === 'success') self3.saveToast = null; }, 2500);
        }
      } catch(e) {
        this.saveToast = { text: 'Network error: ' + e.message, type: 'error' };
        console.error('[save] network', e);
      }
      try { localStorage.setItem('orders.' + this.brandId, JSON.stringify(this.orders)); } catch(e) {}
    },`;
  if (oldCommit.test(t)) { t = t.replace(oldCommit, newCommit); hits++; } else console.log('MISS commit');
  // add saveToast to state
  if (!t.includes('saveToast:')) {
    t = t.replace('loading: true,', 'loading: true, saveToast: null,');
    hits++;
  } else console.log('MISS saveToast state');
  // add toast UI right after <body>
  if (!t.includes('save-toast')) {
    const toast = `<div x-show="saveToast" x-cloak class="fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-lg text-sm font-semibold" :class="saveToast && saveToast.type === 'error' ? 'bg-red-600 text-white' : (saveToast && saveToast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-gray-900 text-white')" x-text="saveToast && saveToast.text"></div>`;
    t = t.replace(/<body([^>]*)>/, '<body$1>' + toast);
    hits++;
  } else console.log('MISS toast inject');
  fs.writeFileSync(p, t, 'utf8');
  console.log('seller/index.html -> ' + hits + ' hits (of 3 expected)');
}

// ========== 2. main.js — universal multi-image helpers ==========
{
  const p = root + '\\main.js';
  let t = fs.readFileSync(p, 'utf8');
  let mh = 0;
  // add helpers before detailImage
  if (!t.includes('productImages: function')) {
    const helpers = `productImages: function(p){ if(!p) return []; var a = Array.isArray(p.images) ? p.images.filter(Boolean) : []; if(a.length === 0 && p.image) a.push(p.image); return a; }, detailImages: function(){ return this.productImages(this.detailProduct); }, detailImageIdx: 0, detailSetImage: function(i){ this.detailImageIdx = i; },`;
    const anchor = 'detailImage: function(){';
    if (t.includes(anchor)) { t = t.replace(anchor, helpers + ' ' + anchor); mh++; } else console.log('MISS detailImage anchor');
  }
  // replace detailImage body
  const oldDI = /detailImage: function\(\)\{[\s\S]*?return this\.detailProduct\.image \|\| this\.makeMock\([^}]+\}\s*\},/;
  const newDI = `detailImage: function(){ if(!this.detailProduct) return ""; var imgs = this.productImages(this.detailProduct); if(imgs.length) return imgs[Math.min(this.detailImageIdx||0, imgs.length-1)]; var v=null; if(this.detailProduct.variants && this.detailProduct.variants.length){ var self=this; v=this.detailProduct.variants.filter(function(x){ return x.id===self.detailVariantId; })[0]; } return this.makeMock(this.detailProduct.mockType, v && v.color, this.detailProduct.name); },`;
  if (oldDI.test(t)) { t = t.replace(oldDI, newDI); mh++; } else console.log('MISS detailImage body');
  // reset idx on openDetail
  if (t.includes('this.detailQty=1; this.detailOptions={};')) {
    t = t.replace('this.detailQty=1; this.detailOptions={};', 'this.detailQty=1; this.detailImageIdx=0; this.detailOptions={};');
    mh++;
  } else console.log('MISS detailImageIdx reset');
  // cart uses p.image — keep primary as images[0]
  if (t.includes('image:p.image,')) {
    t = t.replace(/image:p\.image,/g, 'image:(p.image || (Array.isArray(p.images) && p.images[0]) || ""),');
    mh++;
  }
  fs.writeFileSync(p, t, 'utf8');
  console.log('main.js -> ' + mh + ' hits (of 4 expected)');
}

// ========== 3. index.html — detail modal uses detailImage() + thumbnail strip ==========
{
  const p = root + '\\index.html';
  let t = fs.readFileSync(p, 'utf8');
  let ih = 0;
  const oldImg = `<img :src="$store.config.detailProduct ? $store.config.detailProduct.image : ''" class="w-full h-full object-cover" />`;
  const newImg = `<img :src="$store.config.detailImage()" class="w-full h-full object-cover" /><div x-show="$store.config.detailImages().length > 1" x-cloak class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 backdrop-blur-sm rounded-full p-1.5"><template x-for="(url, i) in $store.config.detailImages()" :key="i"><button @click.stop="$store.config.detailSetImage(i)" :class="$store.config.detailImageIdx === i ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'" class="w-10 h-10 rounded-full overflow-hidden bg-white/20"><img :src="url" class="w-full h-full object-cover" /></button></template></div>`;
  if (t.includes(oldImg)) { t = t.replace(oldImg, newImg); ih++; } else console.log('MISS detail img');
  fs.writeFileSync(p, t, 'utf8');
  console.log('index.html -> ' + ih + ' hits (of 1 expected)');
}

console.log('done');