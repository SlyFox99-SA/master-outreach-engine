const fs = require('fs');
const p = 'clients/techhub-phones/src/product.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

const oldCrumbs = '.crumbs { padding:12px 0 10px; font-size:12px; color:var(--muted); }';
const newCrumbs = '.crumbs { position:sticky; top:56px; z-index:30; background:var(--paper); padding:12px 0 10px; font-size:12px; color:var(--muted); border-bottom:1px solid var(--rule); }';
if (t.includes(oldCrumbs)) { t = t.replace(oldCrumbs, newCrumbs); h++; console.log('  crumbs sticky'); }
else console.log('  MISS crumbs rule');

// reduce layout top padding since crumbs has its own now
t = t.replace('.layout { display:grid; grid-template-columns:1fr; gap:20px; padding-bottom:36px; }',
              '.layout { display:grid; grid-template-columns:1fr; gap:20px; padding-top:24px; padding-bottom:36px; }');

fs.writeFileSync(p, t, 'utf8');
console.log('total: ' + h + ' changes. size: ' + t.length);