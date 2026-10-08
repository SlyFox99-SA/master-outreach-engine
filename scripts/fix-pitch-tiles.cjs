const fs = require('fs');
const p = 'pitch/index.html';
let t = fs.readFileSync(p, 'utf8');

// Find the iframe rule that governs tile previews
const iframeRule = /\.card\s+\.tile\s+iframe\s*\{[^}]*\}/;
const m = t.match(iframeRule);
if (m) {
  console.log('FOUND rule: ' + m[0]);
  let rule = m[0];
  // Skip top ~110px of each demo (announcement bar + header) so products show
  rule = rule.replace(/top:\s*-?\d+px/, 'top: -110px');
  rule = rule.replace(/height:\s*\d+px/, 'height: 1070px');
  t = t.replace(iframeRule, rule);
  fs.writeFileSync(p, t, 'utf8');
  console.log('PATCHED to: ' + rule);
} else {
  console.log('NO .card .tile iframe rule found.');
  // Dump the surrounding context so we can see what's there
  const i = t.indexOf('iframe');
  if (i > 0) {
    console.log('Context around first iframe:');
    console.log(t.substring(Math.max(0, i - 300), i + 300));
  }
}