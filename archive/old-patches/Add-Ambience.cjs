const fs = require('fs');
const p = process.cwd() + '\\pitch\\index.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// 1. give the hero section an id so ambient blobs can be targeted
if (!t.includes('id="hero"')) {
  t = t.replace(/<section class="(px-4 md:px-8 pt-14[^"]*)"/, '<section id="hero" class="$1"');
  if (t.includes('id="hero"')) { h++; console.log('  hero id added'); }
  else console.log('  MISS hero section');
} else console.log('  hero id already present');

// 2. tag the bespoke CTA so it gets the lift + glow treatment
if (!t.includes('btn-cta')) {
  t = t.replace(/class="inline-block px-5 py-3 mono/g, 'class="btn-cta inline-block px-5 py-3 mono');
  if (t.includes('btn-cta')) { h++; console.log('  bespoke CTA tagged'); }
  else console.log('  MISS bespoke CTA');
} else console.log('  btn-cta already present');

// 3. inject the ambient CSS block
if (!t.includes('/* ambient */')) {
  const css = `
/* ambient */
@keyframes drift { 0% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(2%,-3%,0) scale(1.08); } 100% { transform: translate3d(0,0,0) scale(1); } }
@keyframes drift2 { 0% { transform: translate3d(0,0,0) scale(1.1); } 50% { transform: translate3d(-3%,2%,0) scale(1); } 100% { transform: translate3d(0,0,0) scale(1.1); } }
@keyframes sheen { 0% { transform: translateX(-120%); } 100% { transform: translateX(220%); } }

/* page atmosphere */
body::before {
  content: '';
  position: fixed; inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(620px circle at 12% 8%, rgba(201,100,66,0.055), transparent 60%),
    radial-gradient(720px circle at 88% 22%, rgba(120,80,200,0.045), transparent 60%);
}
html.dark body::before {
  background:
    radial-gradient(620px circle at 12% 8%, rgba(201,100,66,0.11), transparent 60%),
    radial-gradient(720px circle at 88% 22%, rgba(120,80,200,0.10), transparent 60%);
}

/* hero ambient blobs (slow drift) */
#hero { position: relative; overflow: hidden; }
#hero::before, #hero::after {
  content: '';
  position: absolute; border-radius: 999px;
  filter: blur(60px);
  pointer-events: none;
  z-index: -1;
}
#hero::before {
  width: 380px; height: 380px;
  top: -120px; left: -60px;
  background: radial-gradient(circle, rgba(201,100,66,0.16), transparent 70%);
  animation: drift 32s ease-in-out infinite;
}
#hero::after {
  width: 460px; height: 460px;
  top: -80px; right: -100px;
  background: radial-gradient(circle, rgba(120,80,200,0.13), transparent 70%);
  animation: drift2 40s ease-in-out infinite;
}
html.dark #hero::before { background: radial-gradient(circle, rgba(201,100,66,0.30), transparent 70%); }
html.dark #hero::after { background: radial-gradient(circle, rgba(120,80,200,0.26), transparent 70%); }

/* card sheen on hover */
.card .tile::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.30) 50%, transparent 70%);
  transform: translateX(-120%);
  pointer-events: none;
  z-index: 2;
}
.card:hover .tile::after { animation: sheen 1.05s cubic-bezier(.2,.8,.2,1) forwards; }

/* chip + theme button lift */
.chip, .theme-btn { transition: transform .25s cubic-bezier(.2,.8,.2,1), border-color .25s, background .25s, color .25s; }
.chip:hover, .theme-btn:hover { transform: translateY(-1px); }
.chip:active, .theme-btn:active { transform: translateY(0); }

/* CTA glow + sheen */
.btn-cta { position: relative; overflow: hidden; transition: transform .25s cubic-bezier(.2,.8,.2,1), box-shadow .3s; }
.btn-cta::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.22) 50%, transparent 80%);
  transform: translateX(-120%);
  pointer-events: none;
}
.btn-cta:hover::before { animation: sheen 1s cubic-bezier(.2,.8,.2,1) forwards; }
.btn-cta:hover { transform: translateY(-2px); box-shadow: 0 18px 40px -18px rgba(0,0,0,0.35); }
.btn-cta:active { transform: translateY(0); }
html.dark .btn-cta:hover { box-shadow: 0 18px 40px -18px rgba(0,0,0,0.6); }

@media (prefers-reduced-motion: reduce) {
  #hero::before, #hero::after, .card:hover .tile::after, .btn-cta:hover::before { animation: none; }
  .btn-cta:hover, .chip:hover, .theme-btn:hover { transform: none; }
}
`;
  t = t.replace('</style>', css + '</style>');
  if (t.includes('/* ambient */')) { h++; console.log('  ambient CSS injected'); }
  else console.log('  MISS style anchor');
} else console.log('  ambient CSS already present');

fs.writeFileSync(p, t, 'utf8');
console.log('total: ' + h + ' changes. size: ' + t.length);