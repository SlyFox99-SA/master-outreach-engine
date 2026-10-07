const fs = require('fs');
const p = process.cwd() + '\\pitch\\index.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// 1. real WhatsApp number — 0604143793 in international is +27 60 414 3793 = 27604143793
const before = (t.match(/27XXXXXXXXX/g) || []).length;
t = t.split('27XXXXXXXXX').join('27604143793');
if (before) { h++; console.log('  WhatsApp number replaced (' + before + ' spots)'); }

// 2. nav link text: WhatsApp → Chat with us
t = t.replace(/>WhatsApp</g, '>Chat with us<');
t = t.replace(/>WhatsApp →</g, '>Chat with us →<');

// 3. ambient CSS block — stronger in light mode, stars added
if (!t.includes('/* starlights */')) {
  const css = `

/* starlights */
.stars {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}
.stars .layer {
  position: absolute;
  inset: 0;
}
.stars .layer::before,
.stars .layer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: 2px;
  border-radius: 100px;
  background: transparent;
}
/* Layer 1 — small dots, drift slow */
.stars .layer.l1::before {
  box-shadow:
    42px 118px 0 rgba(201,100,66,0.55),
    186px 62px 0 rgba(120,80,200,0.42),
    312px 224px 0 rgba(201,100,66,0.48),
    458px 138px 0 rgba(120,80,200,0.36),
    604px 342px 0 rgba(201,100,66,0.50),
    742px 158px 0 rgba(120,80,200,0.44),
    890px 88px 0 rgba(201,100,66,0.40),
    1042px 268px 0 rgba(120,80,200,0.52),
    1188px 128px 0 rgba(201,100,66,0.46),
    1332px 342px 0 rgba(120,80,200,0.38),
    148px 418px 0 rgba(201,100,66,0.42),
    396px 518px 0 rgba(120,80,200,0.48),
    682px 618px 0 rgba(201,100,66,0.36),
    986px 478px 0 rgba(120,80,200,0.50),
    1248px 538px 0 rgba(201,100,66,0.44),
    82px 762px 0 rgba(120,80,200,0.42),
    348px 838px 0 rgba(201,100,66,0.38),
    578px 918px 0 rgba(120,80,200,0.46),
    828px 782px 0 rgba(201,100,66,0.50),
    1092px 862px 0 rgba(120,80,200,0.40),
    218px 1048px 0 rgba(201,100,66,0.44),
    508px 1128px 0 rgba(120,80,200,0.36),
    768px 1182px 0 rgba(201,100,66,0.48),
    1048px 1062px 0 rgba(120,80,200,0.42),
    1298px 1198px 0 rgba(201,100,66,0.46);
  animation: twinkleA 5.2s ease-in-out infinite;
}
/* Layer 2 — brighter accents, different rhythm */
.stars .layer.l2::before {
  box-shadow:
    108px 208px 0 rgba(255,255,255,0.85),
    398px 158px 0 rgba(255,255,255,0.62),
    638px 388px 0 rgba(255,255,255,0.78),
    918px 218px 0 rgba(255,255,255,0.70),
    1148px 408px 0 rgba(255,255,255,0.80),
    228px 618px 0 rgba(255,255,255,0.66),
    548px 748px 0 rgba(255,255,255,0.74),
    888px 658px 0 rgba(255,255,255,0.68),
    1208px 758px 0 rgba(255,255,255,0.82),
    328px 958px 0 rgba(255,255,255,0.70),
    708px 1008px 0 rgba(255,255,255,0.64),
    1028px 968px 0 rgba(255,255,255,0.76),
    148px 1288px 0 rgba(255,255,255,0.68),
    588px 1338px 0 rgba(255,255,255,0.80),
    988px 1288px 0 rgba(255,255,255,0.66);
  animation: twinkleB 6.8s ease-in-out infinite;
}
/* Layer 3 — tiny sparkles, fastest */
.stars .layer.l3::before {
  box-shadow:
    268px 68px 0 rgba(201,100,66,0.72),
    528px 128px 0 rgba(120,80,200,0.66),
    838px 88px 0 rgba(201,100,66,0.70),
    1088px 188px 0 rgba(120,80,200,0.68),
    308px 348px 0 rgba(201,100,66,0.64),
    658px 428px 0 rgba(120,80,200,0.72),
    998px 388px 0 rgba(201,100,66,0.66),
    1218px 348px 0 rgba(120,80,200,0.70),
    158px 588px 0 rgba(201,100,66,0.68),
    418px 678px 0 rgba(120,80,200,0.64),
    788px 578px 0 rgba(201,100,66,0.72),
    1158px 668px 0 rgba(120,80,200,0.66),
    268px 878px 0 rgba(201,100,66,0.70),
    618px 938px 0 rgba(120,80,200,0.68),
    968px 848px 0 rgba(201,100,66,0.64),
    1268px 918px 0 rgba(120,80,200,0.72),
    118px 1088px 0 rgba(201,100,66,0.66),
    458px 1178px 0 rgba(120,80,200,0.70),
    818px 1088px 0 rgba(201,100,66,0.68),
    1108px 1198px 0 rgba(120,80,200,0.64);
  animation: twinkleC 3.9s ease-in-out infinite;
}

@keyframes twinkleA {
  0%, 100% { opacity: 0.35; transform: translate3d(0, 0, 0); }
  50% { opacity: 0.85; transform: translate3d(0, -8px, 0); }
}
@keyframes twinkleB {
  0%, 100% { opacity: 0.25; transform: translate3d(0, 0, 0); }
  33% { opacity: 0.90; transform: translate3d(2px, -4px, 0); }
  66% { opacity: 0.55; transform: translate3d(-2px, 0, 0); }
}
@keyframes twinkleC {
  0%, 100% { opacity: 0.40; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.6); }
}

/* light-mode: dark star version for contrast on cream */
html:not(.dark) .stars .layer.l2::before {
  box-shadow:
    108px 208px 0 rgba(201,100,66,0.85),
    398px 158px 0 rgba(120,80,200,0.72),
    638px 388px 0 rgba(201,100,66,0.80),
    918px 218px 0 rgba(120,80,200,0.74),
    1148px 408px 0 rgba(201,100,66,0.82),
    228px 618px 0 rgba(120,80,200,0.76),
    548px 748px 0 rgba(201,100,66,0.78),
    888px 658px 0 rgba(120,80,200,0.80),
    1208px 758px 0 rgba(201,100,66,0.84),
    328px 958px 0 rgba(120,80,200,0.78),
    708px 1008px 0 rgba(201,100,66,0.76),
    1028px 968px 0 rgba(120,80,200,0.82),
    148px 1288px 0 rgba(201,100,66,0.80),
    588px 1338px 0 rgba(120,80,200,0.86),
    988px 1288px 0 rgba(201,100,66,0.78);
}

/* button sheen + lift — stronger */
.btn-cta { position: relative; overflow: hidden; isolation: isolate; }
.btn-cta::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%);
  transform: translateX(-130%);
  pointer-events: none;
  z-index: 1;
}
.btn-cta:hover::after { animation: sheen 0.9s cubic-bezier(.2,.8,.2,1) forwards; }

/* stronger card sheen */
.card .tile::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(108deg, transparent 25%, rgba(255,255,255,0.42) 50%, transparent 75%);
  transform: translateX(-125%);
  pointer-events: none;
  z-index: 2;
}
.card:hover .tile::after { animation: sheen 1.1s cubic-bezier(.2,.8,.2,1) forwards; }

/* chip + theme lift stronger */
.chip:active, .theme-btn:active { transform: translateY(1px) scale(0.97); }

@media (prefers-reduced-motion: reduce) {
  .stars .layer::before,
  .card:hover .tile::after,
  .btn-cta:hover::after { animation: none !important; }
}
`;
  t = t.replace('</style>', css + '</style>');
  if (t.includes('/* starlights */')) { h++; console.log('  starlights + stronger ambient CSS injected'); }
  else console.log('  MISS style anchor');
}

// 4. boost ambient glow — light mode was too subtle
t = t.replace(
  'background:\n    radial-gradient(620px circle at 12% 8%, rgba(201,100,66,0.055), transparent 60%),\n    radial-gradient(720px circle at 88% 22%, rgba(120,80,200,0.045), transparent 60%);',
  'background:\n    radial-gradient(720px circle at 12% 8%, rgba(201,100,66,0.14), transparent 60%),\n    radial-gradient(820px circle at 88% 22%, rgba(120,80,200,0.11), transparent 60%);'
);

// 5. inject stars markup right after <body>
if (!t.includes('class="stars"')) {
  const stars = `
<div class="stars" aria-hidden="true">
  <div class="layer l1"></div>
  <div class="layer l2"></div>
  <div class="layer l3"></div>
</div>
`;
  t = t.replace(/<body([^>]*)>/, '<body$1>' + stars);
  if (t.includes('class="stars"')) { h++; console.log('  stars markup injected'); }
}

// 6. content needs to sit above the stars
if (!t.includes('body > *:not(.stars)')) {
  const stackFix = `
body > *:not(.stars) { position: relative; z-index: 1; }
`;
  t = t.replace('</style>', stackFix + '</style>');
  h++;
  console.log('  z-index stack fixed (content above stars)');
}

fs.writeFileSync(p, t, 'utf8');
console.log('total: ' + h + ' changes. size: ' + t.length);