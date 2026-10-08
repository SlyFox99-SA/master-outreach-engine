const fs = require('fs');
const p = 'clients/zaheera-fragrances/src/index.html';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// Find the Add button and Buy button positions
const addStart = t.indexOf('>Add</button>');
const buyStart = t.indexOf('>Buy</button>');
if (addStart === -1 || buyStart === -1) { console.log('MISS: buttons not found'); process.exit(1); }

// Find the <button that opens the Add button
const addBtnOpen = t.lastIndexOf('<button', addStart);
// Find the </div> that closes the parent flex row (after Buy)
const afterBuy = t.indexOf('</div>', buyStart);

// Extract the two <button ...>Add</button> and <button ...>Buy</button>
const addBtnHtml = t.slice(addBtnOpen, addStart + '>Add</button>'.length);
const buyBtnHtml = t.slice(t.lastIndexOf('<button', buyStart), buyStart + '>Buy</button>'.length);

// Build wrapped block
const wrapped = '<div class="flex items-center gap-1.5 shrink-0">\n              ' + addBtnHtml.trim() + '\n              ' + buyBtnHtml.trim() + '\n            </div>';

// Replace from Add <button to Buy </button>
t = t.slice(0, addBtnOpen) + wrapped + t.slice(buyStart + '>Buy</button>'.length);
h++;
console.log('  buttons grouped');
fs.writeFileSync(p, t, 'utf8');
console.log('size: ' + t.length);