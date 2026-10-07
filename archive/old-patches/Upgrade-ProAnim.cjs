const fs = require('fs');
const p = process.cwd() + '\\templates\\_tiers\\pro-zaheera\\index.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// Add animation CSS before </style>
const animCss = `
/* ==== Pro tier: animations ==== */
.reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.9s cubic-bezier(.2,.8,.2,1), transform 0.9s cubic-bezier(.2,.8,.2,1); }
.reveal.in { opacity: 1; transform: none; }
.reveal-stagger > * { opacity: 0; transform: translateY(22px); transition: opacity 0.8s cubic-bezier(.2,.8,.2,1), transform 0.8s cubic-bezier(.2,.8,.2,1); }
.reveal-stagger.in > * { opacity: 1; transform: none; }
.reveal-stagger.in > *:nth-child(1) { transition-delay: 0.05s; }
.reveal-stagger.in > *:nth-child(2) { transition-delay: 0.13s; }
.reveal-stagger.in > *:nth-child(3) { transition-delay: 0.21s; }
.reveal-stagger.in > *:nth-child(4) { transition-delay: 0.29s; }
.reveal-stagger.in > *:nth-child(5) { transition-delay: 0.37s; }
.reveal-stagger.in > *:nth-child(6) { transition-delay: 0.45s; }
.parallax-img { will-change: transform; }
@media (prefers-reduced-motion: reduce) {
  .reveal, .reveal-stagger > * { opacity: 1 !important; transform: none !important; transition: none !important; }
}
`;
if (!t.includes('.reveal-stagger')) {
  t = t.replace('</style>', animCss + '</style>');
  h++;
  console.log('animations CSS injected');
}

// Add data-anim class to section headings + product grid
if (!t.includes('data-reveal')) {
  t = t.replace(/<div class="p-grid">/, '<div class="p-grid reveal-stagger" data-reveal>');
  t = t.replace(/<div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 22px;/, '<div class="reveal" data-reveal style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 22px;');
  t = t.replace(/<section id="atelier"/, '<section id="atelier" class="reveal" data-reveal');
  h++;
  console.log('reveal hooks added to grid + headers');
}

// Inject animation JS before </body> (after main.js)
const animJs = `<script>
(function(){
  var els = document.querySelectorAll('[data-reveal], .reveal, .reveal-stagger');
  if (!els.length || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  els.forEach(function(el){ io.observe(el); });
})();
</script>`;
if (!t.includes('IntersectionObserver')) {
  t = t.replace(/<script src="\/main\.js"><\/script>/, '<script src="/main.js"></script>\n' + animJs);
  h++;
  console.log('animation observer injected');
}

fs.writeFileSync(p, t, 'utf8');
console.log('pro-zaheera: ' + h + ' changes. size: ' + t.length);