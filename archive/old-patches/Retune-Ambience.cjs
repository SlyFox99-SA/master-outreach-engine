const fs = require('fs');
const p = process.cwd() + '\\pitch\\index.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// 1. Replace the page atmosphere rule — split for light vs dark
const oldAtmo = /body::before \{[^}]*\}\s*html\.dark body::before \{[^}]*\}/s;
const newAtmo = `body::before {
  content: '';
  position: fixed; inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(720px circle at 8% 6%, rgba(201,100,66,0.10), transparent 65%),
    radial-gradient(680px circle at 92% 14%, rgba(140,100,80,0.05), transparent 65%);
}
html.dark body::before {
  background:
    radial-gradient(720px circle at 12% 8%, rgba(201,100,66,0.16), transparent 60%),
    radial-gradient(820px circle at 88% 22%, rgba(120,80,200,0.12), transparent 60%);
}`;
if (oldAtmo.test(t)) { t = t.replace(oldAtmo, newAtmo); h++; console.log('  page atmosphere split for light/dark'); }
else console.log('  MISS page atmosphere');

// 2. Replace hero blobs — lighter touch in light mode
const oldHero = /#hero::before, #hero::after \{[\s\S]*?html\.dark #hero::after \{ background: radial-gradient\(circle, rgba\(120,80,200,0\.26\), transparent 70%\); \}/;
const newHero = `#hero::before, #hero::after {
  content: '';
  position: absolute; border-radius: 999px;
  filter: blur(80px);
  pointer-events: none;
  z-index: -1;
}
#hero::before {
  width: 420px; height: 420px;
  top: -140px; left: -80px;
  background: radial-gradient(circle, rgba(201,100,66,0.22), transparent 72%);
  animation: drift 34s ease-in-out infinite;
}
#hero::after {
  width: 480px; height: 480px;
  top: -100px; right: -120px;
  background: radial-gradient(circle, rgba(180,120,90,0.10), transparent 72%);
  animation: drift2 42s ease-in-out infinite;
}
html.dark #hero::before { background: radial-gradient(circle, rgba(201,100,66,0.32), transparent 70%); }
html.dark #hero::after { background: radial-gradient(circle, rgba(120,80,200,0.28), transparent 70%); }`;
if (oldHero.test(t)) { t = t.replace(oldHero, newHero); h++; console.log('  hero blobs retuned for light/dark'); }
else console.log('  MISS hero blobs');

// 3. Light-mode stars: ink-coloured, not white
if (!t.includes('/* light-mode star palette */')) {
  const starFix = `
/* light-mode star palette — ink instead of white */
html:not(.dark) .stars .layer.l1::before {
  box-shadow:
    42px 118px 0 rgba(201,100,66,0.70),
    186px 62px 0 rgba(140,100,80,0.55),
    312px 224px 0 rgba(201,100,66,0.62),
    458px 138px 0 rgba(140,100,80,0.50),
    604px 342px 0 rgba(201,100,66,0.66),
    742px 158px 0 rgba(140,100,80,0.56),
    890px 88px 0 rgba(201,100,66,0.54),
    1042px 268px 0 rgba(140,100,80,0.64),
    1188px 128px 0 rgba(201,100,66,0.60),
    1332px 342px 0 rgba(140,100,80,0.52),
    148px 418px 0 rgba(201,100,66,0.58),
    396px 518px 0 rgba(140,100,80,0.62),
    682px 618px 0 rgba(201,100,66,0.52),
    986px 478px 0 rgba(140,100,80,0.64),
    1248px 538px 0 rgba(201,100,66,0.58),
    82px 762px 0 rgba(140,100,80,0.56),
    348px 838px 0 rgba(201,100,66,0.52),
    578px 918px 0 rgba(140,100,80,0.60),
    828px 782px 0 rgba(201,100,66,0.64),
    1092px 862px 0 rgba(140,100,80,0.54),
    218px 1048px 0 rgba(201,100,66,0.58),
    508px 1128px 0 rgba(140,100,80,0.50),
    768px 1182px 0 rgba(201,100,66,0.62),
    1048px 1062px 0 rgba(140,100,80,0.56),
    1298px 1198px 0 rgba(201,100,66,0.60);
}
html:not(.dark) .stars .layer.l2::before {
  box-shadow:
    108px 208px 0 rgba(20,15,10,0.55),
    398px 158px 0 rgba(20,15,10,0.42),
    638px 388px 0 rgba(20,15,10,0.50),
    918px 218px 0 rgba(20,15,10,0.46),
    1148px 408px 0 rgba(20,15,10,0.52),
    228px 618px 0 rgba(20,15,10,0.44),
    548px 748px 0 rgba(20,15,10,0.48),
    888px 658px 0 rgba(20,15,10,0.44),
    1208px 758px 0 rgba(20,15,10,0.54),
    328px 958px 0 rgba(20,15,10,0.46),
    708px 1008px 0 rgba(20,15,10,0.42),
    1028px 968px 0 rgba(20,15,10,0.50),
    148px 1288px 0 rgba(20,15,10,0.44),
    588px 1338px 0 rgba(20,15,10,0.52),
    988px 1288px 0 rgba(20,15,10,0.44);
}
html:not(.dark) .stars .layer.l3::before {
  box-shadow:
    268px 68px 0 rgba(201,100,66,0.85),
    528px 128px 0 rgba(140,100,80,0.78),
    838px 88px 0 rgba(201,100,66,0.82),
    1088px 188px 0 rgba(140,100,80,0.76),
    308px 348px 0 rgba(201,100,66,0.80),
    658px 428px 0 rgba(140,100,80,0.84),
    998px 388px 0 rgba(201,100,66,0.78),
    1218px 348px 0 rgba(140,100,80,0.82),
    158px 588px 0 rgba(201,100,66,0.80),
    418px 678px 0 rgba(140,100,80,0.76),
    788px 578px 0 rgba(201,100,66,0.84),
    1158px 668px 0 rgba(140,100,80,0.78),
    268px 878px 0 rgba(201,100,66,0.82),
    618px 938px 0 rgba(140,100,80,0.80),
    968px 848px 0 rgba(201,100,66,0.76),
    1268px 918px 0 rgba(140,100,80,0.84),
    118px 1088px 0 rgba(201,100,66,0.78),
    458px 1178px 0 rgba(140,100,80,0.82),
    818px 1088px 0 rgba(201,100,66,0.80),
    1108px 1198px 0 rgba(140,100,80,0.76);
}
`;
  t = t.replace('</style>', starFix + '</style>');
  if (t.includes('/* light-mode star palette */')) { h++; console.log('  light-mode star palette injected'); }
}
else console.log('  light-mode star palette already present');

// 4. tone down the lighter-wash right-side blush — remove the old extra rule
t = t.replace(/html:not\(\.dark\) \.stars \.layer\.l2::before \{[\s\S]*?rgba\(201,100,66,0\.78\);\n\}/, '');

fs.writeFileSync(p, t, 'utf8');
console.log('total: ' + h + ' changes. size: ' + t.length);