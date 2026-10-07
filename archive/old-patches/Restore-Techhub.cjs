const fs = require('fs');
const p = process.cwd() + '\\templates\\brands\\techhub\\index.html';
let t = fs.readFileSync(p, 'utf8');
t = t.replace(/<script data-brand-default="[^"]*">[\s\S]*?<\/script>\s*/g, '');
t = t.replace('</head>', '<script data-brand-default="techhub">if(!new URLSearchParams(location.search).get("brand")){var u=new URL(location.href);u.searchParams.set("brand","techhub");history.replaceState(null,"",u);}</script>\n</head>');
fs.writeFileSync(p, t, 'utf8');
console.log('techhub brand flag re-injected');