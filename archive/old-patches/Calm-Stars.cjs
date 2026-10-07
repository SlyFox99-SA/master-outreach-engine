const fs = require('fs');
const p = process.cwd() + '\\pitch\\index.html';
let t = fs.readFileSync(p, 'utf8');

// Replace the twinkle keyframes — opacity only, no transform
const oldKeys = /@keyframes tw1 \{[\s\S]*?@keyframes tw3 \{[\s\S]*?\}\s*@media \(prefers-reduced-motion: reduce\) \{\s*\.stars \.layer::before \{ animation: none !important; \}\s*\}/;
const newKeys = `@keyframes tw1 {
  0%   { opacity: 0.35; }
  15%  { opacity: 0.85; }
  30%  { opacity: 0.45; }
  55%  { opacity: 1;    }
  75%  { opacity: 0.5;  }
  100% { opacity: 0.35; }
}
@keyframes tw2 {
  0%   { opacity: 0.55; }
  20%  { opacity: 0.95; }
  45%  { opacity: 0.35; }
  70%  { opacity: 0.85; }
  90%  { opacity: 0.5;  }
  100% { opacity: 0.55; }
}
@keyframes tw3 {
  0%   { opacity: 0.75; }
  10%  { opacity: 0.15; }
  35%  { opacity: 1;    }
  60%  { opacity: 0.45; }
  85%  { opacity: 0.85; }
  100% { opacity: 0.75; }
}
@media (prefers-reduced-motion: reduce) {
  .stars .layer::before { animation: none !important; }
}`;

if (oldKeys.test(t)) {
  t = t.replace(oldKeys, newKeys);
  console.log('  keyframes replaced — opacity only, no transform');
} else {
  console.log('  MISS keyframes block');
}

// Different timing per layer so they desync
t = t.replace(/(\.l1::before \{[\s\S]*?)animation: tw1 5\.4s ease-in-out infinite;/g, '$1animation: tw1 11s linear infinite;');
t = t.replace(/(\.l2::before \{[\s\S]*?)animation: tw2 7\.2s ease-in-out infinite;/g, '$1animation: tw2 14s linear infinite -4s;');
t = t.replace(/(\.l3::before \{[\s\S]*?)animation: tw3 4\.1s ease-in-out infinite;/g, '$1animation: tw3 8s linear infinite -2s;');
console.log('  layer timings desynced (11s / 14s -4s / 8s -2s, linear)');

fs.writeFileSync(p, t, 'utf8');
console.log('size: ' + t.length);