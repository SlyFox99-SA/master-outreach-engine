const fs = require('fs');
const map = {
  'data/config-zaheera.json': 'editorial',
  'data/config-lumo.json': 'editorial',
  'data/config-techhub.json': 'spec-first',
  'data/config-monetech.json': 'spec-first'
};
for (const [file, shell] of Object.entries(map)) {
  const p = process.cwd() + '\\' + file;
  if (!fs.existsSync(p)) { console.log('SKIP ' + file); continue; }
  const c = JSON.parse(fs.readFileSync(p, 'utf8'));
  c.brand = c.brand || {};
  c.brand.shell = shell;
  fs.writeFileSync(p, JSON.stringify(c, null, 2) + '\n', 'utf8');
  console.log(file + ' -> shell=' + shell);
}