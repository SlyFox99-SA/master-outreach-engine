const fs = require('fs');
const map = {
  'templates\\brands\\zaheera\\index.html': 'zaheera',
  'templates\\brands\\techhub\\index.html': 'techhub',
  'templates\\brands\\monetech\\index.html': 'monetech',
  'templates\\brands\\lumo\\index.html': 'lumo'
};
for (const [rel, brand] of Object.entries(map)) {
  const p = process.cwd() + '\\' + rel;
  if (!fs.existsSync(p)) { console.log('SKIP ' + rel); continue; }
  let t = fs.readFileSync(p, 'utf8');
  if (t.includes('data-brand-default')) { console.log('already set: ' + rel); continue; }
  const inject = '<script data-brand-default="' + brand + '">if(!new URLSearchParams(location.search).get("brand")){var u=new URL(location.href);u.searchParams.set("brand","' + brand + '");history.replaceState(null,"",u);}</script>\n</head>';
  t = t.replace('</head>', inject);
  fs.writeFileSync(p, t, 'utf8');
  console.log('injected ' + brand + ' into ' + rel);
}