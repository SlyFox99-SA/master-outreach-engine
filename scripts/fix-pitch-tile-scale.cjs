const fs = require('fs');
const p = 'pitch/index.html';
let t = fs.readFileSync(p, 'utf8');

const oldRule = '.card .tile iframe { position: absolute; top: 0; left: 0; width: 1280px; height: 1070px; border: 0; transform-origin: top left; pointer-events: none; }';
const newRule = '.card .tile iframe { position: absolute; top: -32px; left: 0; width: 1280px; height: 1800px; border: 0; transform: scale(0.28); transform-origin: top left; pointer-events: none; }';

if (t.includes(oldRule)) {
  t = t.replace(oldRule, newRule);
  fs.writeFileSync(p, t, 'utf8');
  console.log('tile iframe rule fixed');
} else {
  console.log('MISS rule — current rule:');
  const m = t.match(/\.card \.tile iframe \{[^}]*\}/);
  if (m) console.log(m[0]);
}