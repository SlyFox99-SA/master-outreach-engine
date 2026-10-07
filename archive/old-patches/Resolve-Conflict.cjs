const fs = require('fs');
const p = process.cwd() + '\\data\\config-zaheera.json';
let t = fs.readFileSync(p, 'utf8');
const before = t.length;
// keep BOTH sides of the conflict, drop markers
t = t.replace(/<<<<<<< [^\n]*\n([\s\S]*?)=======\n([\s\S]*?)>>>>>>> [^\n]*\n/g, function(m, ours, theirs) {
  // ours = current HEAD images (2), theirs = stash images (3) + story
  // theirs already has the story and the newer images; append cloudinary from ours
  const cloudMatch = ours.match(/https:\/\/res\.cloudinary\.com[^\s"]+/);
  if (theirs.includes('"story"')) {
    if (cloudMatch && !theirs.includes(cloudMatch[0])) {
      // add cloudinary URL as 4th image
      return theirs.replace(/(\],\s*"story")/, ',\n          "' + cloudMatch[0] + '"\n        $1');
    }
    return theirs;
  }
  return ours + theirs;
});
fs.writeFileSync(p, t, 'utf8');
console.log('conflict resolved. ' + before + ' -> ' + t.length + ' bytes');
const out = JSON.parse(t);
const oud = out.products.find(function(x){ return x.name === 'Oud Noir'; });
console.log('Oud Noir images: ' + oud.images.length);
console.log('Oud Noir has story: ' + !!oud.story);