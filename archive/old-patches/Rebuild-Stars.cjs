const fs = require('fs');
const p = process.cwd() + '\\pitch\\index.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// 1. remove every existing star CSS block
const blocks = [
  /\/\* starlights \*\/[\s\S]*?(?=\/\* light-mode star palette|\/\* button sheen)/,
  /\/\* light-mode star palette[\s\S]*?(?=\/\* light-mode: dark star version|\/\* button sheen)/,
  /\/\* light-mode: dark star version for contrast on cream \*\/[\s\S]*?(?=\/\* button sheen)/
];
blocks.forEach(function(rx, i){
  if (rx.test(t)) { t = t.replace(rx, ''); h++; console.log('  removed block ' + i); }
});

// 2. remove the old markup
if (t.includes('class="stars"')) {
  t = t.replace(/<div class="stars"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*/, '');
  h++;
  console.log('  removed old markup');
}

// 3. inject fresh, decisive star layer
const fresh = `
/* ==== stars (rebuilt) ==== */
.stars { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.stars .layer { position: absolute; inset: 0; width: 100%; height: 100%; }
.stars .layer::before { content: ''; position: absolute; top: 0; left: 0; width: 3px; height: 3px; border-radius: 100px; background: transparent; }

/* light mode: ink + rust, HIGH contrast on cream */
html:not(.dark) .l1::before {
  box-shadow:
    48px 128px 0 rgba(20,15,10,0.90),
    218px 88px 0 rgba(160,60,30,0.88),
    398px 248px 0 rgba(20,15,10,0.85),
    558px 168px 0 rgba(160,60,30,0.82),
    738px 328px 0 rgba(20,15,10,0.88),
    908px 218px 0 rgba(160,60,30,0.85),
    1088px 108px 0 rgba(20,15,10,0.82),
    1268px 288px 0 rgba(160,60,30,0.88),
    152px 468px 0 rgba(20,15,10,0.85),
    428px 538px 0 rgba(160,60,30,0.82),
    698px 618px 0 rgba(20,15,10,0.88),
    988px 488px 0 rgba(160,60,30,0.85),
    1258px 568px 0 rgba(20,15,10,0.82),
    118px 788px 0 rgba(160,60,30,0.88),
    388px 858px 0 rgba(20,15,10,0.85),
    618px 918px 0 rgba(160,60,30,0.82),
    858px 818px 0 rgba(20,15,10,0.88),
    1128px 888px 0 rgba(160,60,30,0.85),
    268px 1068px 0 rgba(20,15,10,0.82),
    548px 1148px 0 rgba(160,60,30,0.88),
    818px 1108px 0 rgba(20,15,10,0.85),
    1098px 1168px 0 rgba(160,60,30,0.82),
    258px 1288px 0 rgba(20,15,10,0.85),
    578px 1328px 0 rgba(160,60,30,0.88),
    948px 1298px 0 rgba(20,15,10,0.82);
  animation: tw1 5.4s ease-in-out infinite;
}
html:not(.dark) .l2::before {
  box-shadow:
    128px 228px 0 rgba(160,60,30,0.92),
    398px 168px 0 rgba(20,15,10,0.88),
    648px 398px 0 rgba(160,60,30,0.90),
    918px 248px 0 rgba(20,15,10,0.86),
    1148px 418px 0 rgba(160,60,30,0.92),
    238px 638px 0 rgba(20,15,10,0.88),
    558px 758px 0 rgba(160,60,30,0.90),
    898px 668px 0 rgba(20,15,10,0.86),
    1208px 778px 0 rgba(160,60,30,0.92),
    338px 968px 0 rgba(20,15,10,0.88),
    718px 1018px 0 rgba(160,60,30,0.90),
    1038px 978px 0 rgba(20,15,10,0.86),
    158px 1298px 0 rgba(160,60,30,0.92),
    598px 1348px 0 rgba(20,15,10,0.88),
    998px 1298px 0 rgba(160,60,30,0.90);
  animation: tw2 7.2s ease-in-out infinite;
}
html:not(.dark) .l3::before {
  box-shadow:
    288px 78px 0 rgba(160,60,30,0.98),
    548px 148px 0 rgba(20,15,10,0.95),
    858px 98px 0 rgba(160,60,30,0.98),
    1108px 198px 0 rgba(20,15,10,0.95),
    318px 368px 0 rgba(160,60,30,0.98),
    668px 438px 0 rgba(20,15,10,0.95),
    1008px 398px 0 rgba(160,60,30,0.98),
    1228px 358px 0 rgba(20,15,10,0.95),
    168px 598px 0 rgba(160,60,30,0.98),
    428px 688px 0 rgba(20,15,10,0.95),
    798px 588px 0 rgba(160,60,30,0.98),
    1168px 678px 0 rgba(20,15,10,0.95),
    278px 888px 0 rgba(160,60,30,0.98),
    628px 948px 0 rgba(20,15,10,0.95),
    978px 858px 0 rgba(160,60,30,0.98),
    1278px 928px 0 rgba(20,15,10,0.95),
    128px 1098px 0 rgba(160,60,30,0.98),
    468px 1188px 0 rgba(20,15,10,0.95),
    828px 1098px 0 rgba(160,60,30,0.98),
    1118px 1208px 0 rgba(20,15,10,0.95);
  animation: tw3 4.1s ease-in-out infinite;
}

/* dark mode: warm + white sparkle */
html.dark .l1::before {
  box-shadow:
    48px 128px 0 rgba(255,200,160,0.80),
    218px 88px 0 rgba(180,150,255,0.70),
    398px 248px 0 rgba(255,200,160,0.75),
    558px 168px 0 rgba(180,150,255,0.65),
    738px 328px 0 rgba(255,200,160,0.78),
    908px 218px 0 rgba(180,150,255,0.72),
    1088px 108px 0 rgba(255,200,160,0.68),
    1268px 288px 0 rgba(180,150,255,0.80),
    152px 468px 0 rgba(255,200,160,0.72),
    428px 538px 0 rgba(180,150,255,0.68),
    698px 618px 0 rgba(255,200,160,0.78),
    988px 488px 0 rgba(180,150,255,0.72),
    1258px 568px 0 rgba(255,200,160,0.70),
    118px 788px 0 rgba(180,150,255,0.76),
    388px 858px 0 rgba(255,200,160,0.74),
    618px 918px 0 rgba(180,150,255,0.68),
    858px 818px 0 rgba(255,200,160,0.78),
    1128px 888px 0 rgba(180,150,255,0.72),
    268px 1068px 0 rgba(255,200,160,0.70),
    548px 1148px 0 rgba(180,150,255,0.74),
    818px 1108px 0 rgba(255,200,160,0.72),
    1098px 1168px 0 rgba(180,150,255,0.68),
    258px 1288px 0 rgba(255,200,160,0.76),
    578px 1328px 0 rgba(180,150,255,0.78),
    948px 1298px 0 rgba(255,200,160,0.72);
  animation: tw1 5.4s ease-in-out infinite;
}
html.dark .l2::before {
  box-shadow:
    128px 228px 0 rgba(255,255,255,0.95),
    398px 168px 0 rgba(255,220,180,0.85),
    648px 398px 0 rgba(255,255,255,0.90),
    918px 248px 0 rgba(255,220,180,0.88),
    1148px 418px 0 rgba(255,255,255,0.92),
    238px 638px 0 rgba(255,220,180,0.85),
    558px 758px 0 rgba(255,255,255,0.90),
    898px 668px 0 rgba(255,220,180,0.88),
    1208px 778px 0 rgba(255,255,255,0.94),
    338px 968px 0 rgba(255,220,180,0.86),
    718px 1018px 0 rgba(255,255,255,0.90),
    1038px 978px 0 rgba(255,220,180,0.88),
    158px 1298px 0 rgba(255,255,255,0.94),
    598px 1348px 0 rgba(255,220,180,0.86),
    998px 1298px 0 rgba(255,255,255,0.90);
  animation: tw2 7.2s ease-in-out infinite;
}
html.dark .l3::before {
  box-shadow:
    288px 78px 0 rgba(255,240,210,1),
    548px 148px 0 rgba(255,255,255,1),
    858px 98px 0 rgba(255,240,210,1),
    1108px 198px 0 rgba(255,255,255,1),
    318px 368px 0 rgba(255,240,210,1),
    668px 438px 0 rgba(255,255,255,1),
    1008px 398px 0 rgba(255,240,210,1),
    1228px 358px 0 rgba(255,255,255,1),
    168px 598px 0 rgba(255,240,210,1),
    428px 688px 0 rgba(255,255,255,1),
    798px 588px 0 rgba(255,240,210,1),
    1168px 678px 0 rgba(255,255,255,1),
    278px 888px 0 rgba(255,240,210,1),
    628px 948px 0 rgba(255,255,255,1),
    978px 858px 0 rgba(255,240,210,1),
    1278px 928px 0 rgba(255,255,255,1),
    128px 1098px 0 rgba(255,240,210,1),
    468px 1188px 0 rgba(255,255,255,1),
    828px 1098px 0 rgba(255,240,210,1),
    1118px 1208px 0 rgba(255,255,255,1);
  animation: tw3 4.1s ease-in-out infinite;
}

@keyframes tw1 {
  0%, 100% { opacity: 0.45; transform: translate3d(0,0,0); }
  50% { opacity: 1; transform: translate3d(0,-6px,0); }
}
@keyframes tw2 {
  0%, 100% { opacity: 0.35; transform: translate3d(0,0,0); }
  33% { opacity: 1; transform: translate3d(3px,-4px,0); }
  66% { opacity: 0.6; transform: translate3d(-2px,0,0); }
}
@keyframes tw3 {
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.8); }
}
@media (prefers-reduced-motion: reduce) {
  .stars .layer::before { animation: none !important; }
}
`;
t = t.replace('</style>', fresh + '</style>');
h++;
console.log('  fresh star CSS injected');

// 4. fresh markup
const mk = '<div class="stars" aria-hidden="true"><div class="layer l1"></div><div class="layer l2"></div><div class="layer l3"></div></div>';
t = t.replace(/<body([^>]*)>/, '<body$1>' + mk);
h++;
console.log('  fresh markup injected');

// 5. verify: print a snippet
const has = t.includes('html:not(.dark) .l1::before') && t.includes('html.dark .l1::before');
console.log('  verification: ' + (has ? 'PASS — both palettes present' : 'FAIL'));

fs.writeFileSync(p, t, 'utf8');
console.log('total: ' + h + ' changes. size: ' + t.length);