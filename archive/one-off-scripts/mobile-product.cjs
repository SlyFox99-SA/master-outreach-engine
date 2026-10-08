const fs = require('fs');
const p = 'clients/techhub-phones/src/product.html';
let t = fs.readFileSync(p, 'utf8');

const mobileCSS = `
/* ==== mobile-first overrides ==== */
.layout { padding-top:16px; }
@media (max-width:899px){
  .gallery .main { aspect-ratio:1/1; max-height:none; }
  .thumbs button { width:56px; height:56px; }
  .info h1 { font-size:26px; }
  .info .price { font-size:24px; margin-bottom:10px; }
  .specs { padding-top:12px; margin-top:12px; }
  .specs li { padding:6px 0; font-size:13px; }
  .qty { margin:14px 0 8px; }
  .actions { margin-top:0; }
  .actions button { padding:15px 20px; font-size:15px; }
  .similar { padding-top:32px; }
  .similar h2 { font-size:19px; margin-bottom:18px; }
  .similar .grid { gap:12px; }
  .tile .name { font-size:13px; margin-top:10px; }
  .crumbs { font-size:11px; padding:10px 0 8px; }
}
/* Make CTA sticky on mobile so it's always reachable */
@media (max-width:899px){
  .actions .add { position:sticky; bottom:12px; box-shadow:0 8px 24px -8px rgba(0,0,0,0.25); z-index:20; }
}
`;

t = t.replace('</style>', mobileCSS + '\n</style>');
fs.writeFileSync(p, t, 'utf8');
console.log('mobile CSS injected. size: ' + t.length);