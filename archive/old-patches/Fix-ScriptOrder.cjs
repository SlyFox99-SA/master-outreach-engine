const fs = require('fs');
const files = [
  'templates\\_shells\\editorial\\index.html',
  'templates\\_shells\\spec-first\\index.html',
  'templates\\_shells\\lookbook\\index.html',
  'templates\\brands\\zaheera\\index.html',
  'templates\\brands\\techhub\\index.html',
  'templates\\brands\\monetech\\index.html',
  'templates\\brands\\lumo\\index.html'
];
let total = 0;
for (const f of files) {
  const p = process.cwd() + '\\' + f;
  if (!fs.existsSync(p)) { console.log('SKIP: ' + f); continue; }
  let t = fs.readFileSync(p, 'utf8');
  // broken order
  const broken = '<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js"></script>\n<script src="/main.js" defer></script>';
  const brokenCRLF = broken.replace(/\n/g, '\r\n');
  // correct order
  const fixed = '<script src="/main.js"></script>\n<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js"></script>';
  let h = 0;
  if (t.includes(broken)) { t = t.replace(broken, fixed); h++; }
  else if (t.includes(brokenCRLF)) { t = t.replace(brokenCRLF, fixed); h++; }
  else if (t.includes('/main.js" defer')) {
    // manual fix: swap line by line
    const lines = t.split(/\r?\n/);
    const out = [];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('cdn.jsdelivr.net/npm/alpinejs') && lines[i].includes('defer')) {
        // if the next line is main.js with defer, reorder
        if (i + 1 < lines.length && lines[i + 1].includes('/main.js')) {
          out.push('<script src="/main.js"></script>');
          out.push('<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js"></script>');
          i++;
          h++;
          continue;
        }
      }
      out.push(lines[i]);
    }
    t = out.join('\n');
  }
  fs.writeFileSync(p, t, 'utf8');
  console.log(f + ' -> ' + h + ' fix');
  total += h;
}
console.log('total: ' + total + ' / 7');