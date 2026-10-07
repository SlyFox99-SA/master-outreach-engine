const fs = require('fs');
const files = [
  'templates\\brands\\zaheera\\index.html',
  'templates\\_preview\\zaheera-v2\\index.html'
];
for (const rel of files) {
  const p = process.cwd() + '\\' + rel;
  if (!fs.existsSync(p)) { console.log('SKIP ' + rel); continue; }
  let t = fs.readFileSync(p, 'utf8');
  // Replace any checkout href with self folder
  t = t.replace(/href="\/checkout\.html[^"]*"/g, 'href="./checkout.html"');
  t = t.replace(/:href="'\/checkout\.html\?brand=' \+ [^"]*"/g, 'href="./checkout.html"');
  t = t.replace(/href="\/checkout\.html"/g, 'href="./checkout.html"');
  fs.writeFileSync(p, t, 'utf8');
  console.log(rel + ' → checkout link self-referenced');
}