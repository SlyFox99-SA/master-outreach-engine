const fs = require('fs');
const hp = 'clients/zaheera-fragrances/src/index.html';
let html = fs.readFileSync(hp, 'utf8');

// Remove any previous forced-bg block
html = html.replace(/\n\/\* zaheera-forced-bg \*\/[\s\S]*?(?=<\/style>)/, '');
html = html.replace(/\n\/\* zaheera-force-hard \*\/[\s\S]*?(?=<\/style>)/, '');

// Insert a hard, unmissable cream + maroon text on the ROOT
const hard = `
/* zaheera-force-hard */
:root {
  --brand-surface: 232 218 194;
  --brand-ink: 44 22 24;
  --brand-primary: 107 24 36;
  --brand-accent: 156 60 47;
}
html, body {
  background-color: rgb(232 218 194) !important;
  color: rgb(44 22 24) !important;
}
`;
html = html.replace('</style>', hard + '\n</style>');

// Also stamp the body with an inline style as a tiebreaker
html = html.replace(
  /<body class="bg-brand-surface text-brand-ink antialiased"/,
  '<body class="bg-brand-surface text-brand-ink antialiased" style="background-color:#E8DAC2;color:#2C1618;"'
);

fs.writeFileSync(hp, html, 'utf8');
console.log('zaheera hard-cream injected. size: ' + html.length);