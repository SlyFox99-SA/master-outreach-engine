const fs = require('fs');
const p = process.cwd() + '\\checkout.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// Fix broken encodeURIComponent quote
const broken1 = '" + DQ + "?text=" + DQ + " + encodeURIComponent("Hi! I want to add online paymentsto my store.") + " + DQ + " target="';
const fixed1  = '" + DQ + "?text=" + encodeURIComponent("Hi! I want to add online payments to my store.") + DQ + " target="';
if (t.includes(broken1)) { t = t.split(broken1).join(fixed1); h++; console.log('  fixed encodeURIComponent'); }

// Fix missing space
if (t.includes('bg-brand-primary/5border')) { t = t.split('bg-brand-primary/5border').join('bg-brand-primary/5 border'); h++; console.log('  fixed missing space'); }

// Strip anything after </html>
const idx = t.indexOf('</html>');
if (idx !== -1) {
  const after = t.slice(idx + 7);
  if (after.trim().length > 0) { t = t.slice(0, idx + 7) + '\n'; h++; console.log('  stripped trailing bytes'); }
}

// Add Alpine CDN
if (!t.includes('cdn.jsdelivr.net/npm/alpinejs')) {
  const alpine = '<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js"></script>\n</body>';
  t = t.replace('</body>', alpine);
  h++;
  console.log('  added Alpine CDN');
}

fs.writeFileSync(p, t, 'utf8');
console.log('checkout.html -> ' + h + ' fixes. size: ' + t.length);