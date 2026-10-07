const fs = require('fs');
const p = process.cwd() + '\\seller\\index.html';
let t = fs.readFileSync(p, 'utf8');
const WORKER = 'https://outreach-save-api.gifttsima16.workers.dev';
let hits = 0;

// 1. bootstrap token from URL into window.__SELLER_TOKEN (before any other script runs)
if (!t.includes('window.__SELLER_TOKEN=')) {
  const boot = '<script>window.__SELLER_TOKEN=(function(){var t=new URLSearchParams(location.search).get("t");if(t){localStorage.setItem("seller.token",t);return t;}return localStorage.getItem("seller.token")||"";})();</script>\n</head>';
  t = t.replace('</head>', boot);
  hits++;
}

// 2. add Authorization to /api/orders
const a2 = "fetch('" + WORKER + "/api/orders?brand=' + encodeURIComponent(this.brandId))";
const b2 = "fetch('" + WORKER + "/api/orders?brand=' + encodeURIComponent(this.brandId), { headers: { Authorization: 'Bearer ' + (window.__SELLER_TOKEN || '') } })";
if (t.includes(a2)) { t = t.split(a2).join(b2); hits++; } else console.log('MISS orders fetch');

// 3. add Authorization to /api/save
const a3 = "fetch('" + WORKER + "/api/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }";
const b3 = "fetch('" + WORKER + "/api/save', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (window.__SELLER_TOKEN || '') }";
if (t.includes(a3)) { t = t.split(a3).join(b3); hits++; } else console.log('MISS save fetch');

fs.writeFileSync(p, t, 'utf8');
console.log('seller/index.html patched, ' + hits + '/3 hits');