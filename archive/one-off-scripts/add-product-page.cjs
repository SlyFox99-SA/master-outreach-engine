const fs = require('fs');

// 1. index.html — wrap product card in link
const ix = 'clients/techhub-phones/src/index.html';
let t = fs.readFileSync(ix, 'utf8');
let h = 0;

// The card starts with <li class="flex flex-col..."> then <div class="aspect-square...">.
// We insert an <a> wrapper around the image + title + blurb + price (but not the buttons).
const openAnchor = '<li class="flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-black/5 hover:shadow-md transition-shadow"><div class="aspect-square';
const withAnchor = '<li class="flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-black/5 hover:shadow-md transition-shadow"><a :href="\'.\\/product.html?brand=\' + ($store.config.id || \'techhub\') + \'&id=\' + p.id" class="block"><div class="aspect-square';
if (t.includes(openAnchor)) { t = t.replace(openAnchor, withAnchor); h++; console.log('  card wrapped in <a>'); }
else console.log('  MISS open anchor');

// Close the anchor just before the buttons' flex container
const closeAnchor = '<div class="mt-auto pt-2 flex flex-col gap-1">';
const closeWithAnchor = '</a><div class="mt-auto pt-2 flex flex-col gap-1">';
if (t.includes(closeAnchor)) { t = t.replace(closeAnchor, closeWithAnchor); h++; console.log('  anchor closed'); }
else console.log('  MISS close anchor');

fs.writeFileSync(ix, t, 'utf8');
console.log('index.html: ' + h + ' changes');

// 2. Build-Client.ps1 — also copy product.html if it exists
const bp = 'scripts/Build-Client.ps1';
let p = fs.readFileSync(bp, 'utf8');
if (!p.includes('product.html')) {
  // find the line that copies checkout.html
  const marker = "'Copy-Item \"$c\\src\\checkout.html\" \"$o\\checkout.html\" -Force'";
  if (p.includes('Copy-Item "$c\\src\\checkout.html"')) {
    p = p.replace(
      'Copy-Item "$c\\src\\checkout.html" "$o\\checkout.html" -Force',
      'Copy-Item "$c\\src\\checkout.html" "$o\\checkout.html" -Force\r\n  if (Test-Path "$c\\src\\product.html") { Copy-Item "$c\\src\\product.html" "$o\\product.html" -Force }'
    );
    fs.writeFileSync(bp, p, 'utf8');
    console.log('  Build-Client.ps1: product.html added');
  } else console.log('  MISS checkout copy line');
} else console.log('  Build-Client.ps1: already handles product.html');