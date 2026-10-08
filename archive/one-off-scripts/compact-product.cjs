const fs = require('fs');
const p = 'clients/techhub-phones/src/product.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

const repl = [
  // header padding
  ['header { position:sticky; top:0; z-index:40; background:var(--paper); border-bottom:1px solid var(--rule); padding:16px 0; }',
   'header { position:sticky; top:0; z-index:40; background:var(--paper); border-bottom:1px solid var(--rule); padding:10px 0; }'],

  // crumbs padding
  ['.crumbs { padding:22px 0 14px; font-size:13px; color:var(--muted); }',
   '.crumbs { padding:12px 0 10px; font-size:12px; color:var(--muted); }'],

  // layout tighter
  ['.layout { display:grid; grid-template-columns:1fr; gap:32px; padding-bottom:60px; }',
   '.layout { display:grid; grid-template-columns:1fr; gap:20px; padding-bottom:36px; }'],
  ['@media (min-width:900px){ .layout{ grid-template-columns:1.05fr 1fr; gap:56px; align-items:start; } }',
   '@media (min-width:900px){ .layout{ grid-template-columns:1fr 1fr; gap:36px; align-items:start; } }'],

  // image: cap height
  ['.gallery .main { aspect-ratio:1/1; background:var(--surface); border-radius:12px; overflow:hidden; }',
   '.gallery .main { aspect-ratio:4/3; max-height:420px; background:var(--surface); border-radius:12px; overflow:hidden; }'],
  ['.gallery .main img { width:100%; height:100%; object-fit:cover; }',
   '.gallery .main img { width:100%; height:100%; object-fit:cover; display:block; }'],

  // title tighter
  ['.info h1 { font-size:clamp(28px,3.2vw,40px); margin:0 0 8px; font-weight:700; letter-spacing:-0.03em; line-height:1.05; }',
   '.info h1 { font-size:clamp(24px,2.6vw,32px); margin:0 0 6px; font-weight:700; letter-spacing:-0.03em; line-height:1.1; }'],
  ['.info .blurb { color:var(--muted); font-size:15px; margin:0 0 22px; }',
   '.info .blurb { color:var(--muted); font-size:14px; margin:0 0 16px; }'],
  ['.info .price { font-size:34px; font-weight:700; letter-spacing:-0.03em; margin:0 0 16px; }',
   '.info .price { font-size:26px; font-weight:700; letter-spacing:-0.03em; margin:0 0 12px; }'],

  // stock margin
  ['.stock { display:inline-flex; align-items:center; gap:8px; font-size:12px; font-family:var(--mono); padding:5px 12px; border-radius:100px; background:#e8f5ec; color:#1a8b5f; margin-bottom:26px; text-transform:uppercase; letter-spacing:0.08em; }',
   '.stock { display:inline-flex; align-items:center; gap:8px; font-size:11px; font-family:var(--mono); padding:4px 10px; border-radius:100px; background:#e8f5ec; color:#1a8b5f; margin-bottom:16px; text-transform:uppercase; letter-spacing:0.08em; }'],

  // specs tighter
  ['.specs { border-top:1px solid var(--rule); padding-top:22px; margin-top:22px; }',
   '.specs { border-top:1px solid var(--rule); padding-top:14px; margin-top:14px; }'],
  ['.specs h3 { font-size:11px; font-family:var(--mono); text-transform:uppercase; letter-spacing:0.16em; color:var(--muted); margin:0 0 14px; font-weight:500; }',
   '.specs h3 { font-size:11px; font-family:var(--mono); text-transform:uppercase; letter-spacing:0.16em; color:var(--muted); margin:0 0 8px; font-weight:500; }'],
  ['.specs li { padding:10px 0; border-bottom:1px solid var(--rule); font-size:14px; display:flex; gap:14px; align-items:baseline; }',
   '.specs li { padding:5px 0; border-bottom:1px solid var(--rule); font-size:13px; display:flex; gap:12px; align-items:baseline; }'],

  // fix the \2192 arrow render bug
  ['content:"\\\\2192";', 'content:"\\2192";'],

  // qty tighter
  ['.qty { display:flex; align-items:center; gap:14px; margin:26px 0 12px; }',
   '.qty { display:flex; align-items:center; gap:12px; margin:14px 0 10px; }'],
  ['.qty button { width:42px; height:42px; background:transparent; border:0; font-size:20px; cursor:pointer; color:var(--ink); font-family:inherit; }',
   '.qty button { width:36px; height:36px; background:transparent; border:0; font-size:18px; cursor:pointer; color:var(--ink); font-family:inherit; }'],

  // actions padding
  ['.actions button { padding:17px 22px; font:inherit; font-size:15px; font-weight:700; cursor:pointer; border-radius:10px; border:0; transition:opacity .15s; }',
   '.actions button { padding:13px 20px; font:inherit; font-size:14px; font-weight:700; cursor:pointer; border-radius:8px; border:0; transition:opacity .15s; }'],

  // similar tighter
  ['.similar { padding:60px 0 60px; border-top:1px solid var(--rule); }',
   '.similar { padding:36px 0 40px; border-top:1px solid var(--rule); }']
];

for (const [from, to] of repl) {
  if (t.includes(from)) { t = t.split(from).join(to); h++; }
  else console.log('  MISS: ' + from.slice(0, 60));
}

// also fix double-escaped arrow if still present
t = t.replace(/content:"\\\\2192"/g, 'content:"\\2192"');

fs.writeFileSync(p, t, 'utf8');
console.log('total: ' + h + '/' + repl.length + ' patches. size: ' + t.length);