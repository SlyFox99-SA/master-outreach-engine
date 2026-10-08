const fs = require('fs');
const p = 'clients/techhub-phones/src/product.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// CSS for arrows
if (!t.includes('.gallery-nav')) {
  const css = `
.gallery { position:relative; }
.gallery-nav { position:absolute; top:50%; transform:translateY(-50%); width:44px; height:44px; border-radius:50%; background:rgba(255,255,255,0.95); border:1px solid var(--rule); cursor:pointer; display:grid; place-items:center; z-index:10; box-shadow:0 4px 12px rgba(0,0,0,0.08); transition:opacity .15s; }
.gallery-nav:hover { opacity:0.85; }
.gallery-nav.prev { left:12px; }
.gallery-nav.next { right:12px; }
.gallery-nav svg { width:18px; height:18px; fill:none; stroke:var(--ink); stroke-width:2; }
.gallery-dots { display:flex; gap:6px; justify-content:center; margin-top:12px; }
.gallery-dots button { width:8px; height:8px; border-radius:50%; background:var(--rule); border:0; padding:0; cursor:pointer; transition:background .15s; }
.gallery-dots button.on { background:var(--ink); }
`;
  t = t.replace('</style>', css + '\n</style>');
  h++;
}

// Add prev/next buttons + dots
const oldGallery = '<div class="main"><img :src="currentImage()" :alt="product?.name"></div>';
const newGallery = `<div class="main">
        <img :src="currentImage()" :alt="product?.name">
        <template x-if="images().length > 1">
          <div>
            <button class="gallery-nav prev" @click="prev()" aria-label="Previous image">
              <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button class="gallery-nav next" @click="next()" aria-label="Next image">
              <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
            </button>
          </div>
        </template>
      </div>`;
if (t.includes(oldGallery)) { t = t.replace(oldGallery, newGallery); h++; }
else console.log('MISS gallery');

// Add dots below thumbs
const oldThumbs = '<div class="thumbs" x-show="images().length > 1">';
const newThumbs = '<div class="gallery-dots" x-show="images().length > 1"><template x-for="(url, i) in images()" :key="\'d\'+i"><button :class="{ on: imageIdx === i }" @click="imageIdx = i" :aria-label="\'Image \'+(i+1)"></button></template></div>\n      <div class="thumbs" x-show="images().length > 1">';
if (t.includes(oldThumbs)) { t = t.replace(oldThumbs, newThumbs); h++; }
else console.log('MISS thumbs');

// Add prev/next methods to Alpine component
const oldMethods = 'currentImage() { const arr = this.images(); return arr[this.imageIdx] || ""; },';
const newMethods = `currentImage() { const arr = this.images(); return arr[this.imageIdx] || ""; },
    next() { const n = this.images().length; if (n > 0) this.imageIdx = (this.imageIdx + 1) % n; },
    prev() { const n = this.images().length; if (n > 0) this.imageIdx = (this.imageIdx - 1 + n) % n; },`;
if (t.includes(oldMethods)) { t = t.replace(oldMethods, newMethods); h++; }
else console.log('MISS methods');

fs.writeFileSync(p, t, 'utf8');
console.log('product.html: ' + h + ' changes. size: ' + t.length);