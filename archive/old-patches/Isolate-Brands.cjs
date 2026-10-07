const fs = require('fs');
const shells = {
  'templates\\brands\\zaheera\\index.html': 'zaheera',
  'templates\\brands\\techhub\\index.html': 'techhub',
  'templates\\brands\\monetech\\index.html': 'monetech',
  'templates\\brands\\lumo\\index.html': 'lumo',
  'templates\\_preview\\zaheera-v2\\index.html': 'zaheera'
};
let total = 0;
for (const [rel, brand] of Object.entries(shells)) {
  const p = process.cwd() + '\\' + rel;
  if (!fs.existsSync(p)) { console.log('SKIP ' + rel); continue; }
  let t = fs.readFileSync(p, 'utf8');
  let h = 0;

  // 1. strip the data-brand-default script (race-causing)
  const before1 = t.split('<script data-brand-default=').length - 1;
  if (before1) {
    t = t.replace(/<script data-brand-default="[^"]*">[\s\S]*?<\/script>\s*/g, '');
    h++;
    console.log('  stripped ' + before1 + ' brand-default script(s)');
  }

  // 2. inject window.__BRAND__ right before <script src="/main.js">
  if (!t.includes('window.__BRAND__')) {
    const anchor = '<script src="/main.js"></script>';
    if (t.includes(anchor)) {
      t = t.replace(anchor, '<script>window.__BRAND__="' + brand + '";</script>\n' + anchor);
      h++;
      console.log('  injected window.__BRAND__="' + brand + '"');
    } else {
      console.log('  MISS main.js anchor');
    }
  } else {
    console.log('  __BRAND__ already present');
  }

  // 3. header logo href="/" → self
  const before3 = t.split('<a href="/" class="disp').length - 1;
  if (before3) {
    t = t.replace(/<a href="\/" class="disp/g, '<a href="./" class="disp');
    h++;
    console.log('  header logo self-referenced (' + before3 + ')');
  }

  fs.writeFileSync(p, t, 'utf8');
  console.log('  ' + rel + ' -> ' + h + ' changes');
  total += h;
}

// ---- main.js strict brand resolution + view mode scoping ----
const mp = process.cwd() + '\\main.js';
let m = fs.readFileSync(mp, 'utf8');
let mh = 0;

// strict brand priority
const oldB = 'var brand = params.get("brand") || localStorage.getItem("brand") || "active";';
const newB = 'var brand = params.get("brand") || window.__BRAND__ || localStorage.getItem("brand") || "active";';
if (m.includes(oldB)) { m = m.replace(oldB, newB); mh++; console.log('main.js: strict brand priority'); }
else console.log('main.js: MISS brand resolution anchor');

// scope view.mode per brand
const oldV = 'var savedView=null; try { savedView=localStorage.getItem("view.mode"); } catch(e){}';
const newV = 'var savedView=null; try { savedView=localStorage.getItem("view." + (cfg.id || brand) + ".mode"); } catch(e){}';
if (m.includes(oldV)) { m = m.replace(oldV, newV); mh++; console.log('main.js: view.mode read scoped'); }
else console.log('main.js: MISS savedView anchor');

const oldS = 'window.Alpine.store("view",{mode:savedView||"grid",set:function(m){this.mode=m; try{localStorage.setItem("view.mode",m);}catch(e){}}});';
const newS = 'window.Alpine.store("view",{mode:savedView||"grid",set:function(m){this.mode=m; try{localStorage.setItem("view." + (cfg.id || brand) + ".mode",m);}catch(e){}}});';
if (m.includes(oldS)) { m = m.replace(oldS, newS); mh++; console.log('main.js: view.mode write scoped'); }
else console.log('main.js: MISS view store anchor');

fs.writeFileSync(mp, m, 'utf8');
console.log('main.js -> ' + mh + ' changes');
console.log('total: ' + (total + mh));