const fs = require('fs');
const p = process.cwd() + '\\seller\\index.html';
let t = fs.readFileSync(p, 'utf8');
let hits = 0;

// ===== 1. Replace image field template =====
const imgRe = /<template x-if="f\.type === 'image'">[\s\S]*?<\/template>/;
const newTpl = `<template x-if="f.type === 'image'">
            <div data-multi-image>
              <div class="grid grid-cols-3 gap-2 mb-2">
                <template x-for="(url, idx) in (Array.isArray(editing[f.name]) ? editing[f.name] : (editing[f.name] ? [editing[f.name]] : []))" :key="idx">
                  <div class="relative aspect-square rounded-lg overflow-hidden bg-black/5 ring-1 ring-black/5">
                    <img :src="url" class="w-full h-full object-cover" alt="">
                    <button type="button" @click="removeImage(f.name, idx)" class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white text-sm leading-none">&times;</button>
                    <span x-show="idx === 0" class="absolute bottom-1 left-1 text-[10px] font-semibold bg-black/70 text-white px-1.5 py-0.5 rounded">Primary</span>
                  </div>
                </template>
                <button type="button" @click="addImages(f.name)" x-show="(Array.isArray(editing[f.name]) ? editing[f.name].length : (editing[f.name] ? 1 : 0)) < 6" class="aspect-square rounded-lg border-2 border-dashed border-black/15 hover:border-black/30 hover:bg-black/5 flex flex-col items-center justify-center gap-1 text-xs opacity-70">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                  <span>Add photos</span>
                </button>
              </div>
              <p x-show="imgBusy" class="text-xs opacity-60 mb-1" x-text="imgStatus"></p>
              <details class="text-xs">
                <summary class="cursor-pointer opacity-50 hover:opacity-80">Advanced: paste image URL</summary>
                <input type="text" placeholder="https://..." @change="if($event.target.value.trim()){ addImageUrl(f.name, $event.target.value.trim()); $event.target.value=''; }" class="w-full mt-2 px-3 py-2 border border-black/10 bg-white focus:outline-none text-xs" style="border-radius: var(--radius);">
              </details>
            </div>
          </template>`;
if (imgRe.test(t)) { t = t.replace(imgRe, newTpl); hits++; } else console.log('MISS image template');

// ===== 2. Insert helper methods before uploadTo =====
const methods = `    imgBusy: false,
    imgStatus: '',

    compress(file, maxDim, q) {
      return new Promise(function(resolve) {
        if (!file || !file.type || file.type.indexOf('image/') !== 0) return resolve(file);
        if (file.size < 400 * 1024) return resolve(file);
        var img = new Image();
        var url = URL.createObjectURL(file);
        img.onload = function() {
          var w = img.naturalWidth, h = img.naturalHeight;
          if (w > maxDim || h > maxDim) { var r = Math.min(maxDim / w, maxDim / h); w = Math.round(w * r); h = Math.round(h * r); }
          var c = document.createElement('canvas'); c.width = w; c.height = h;
          c.getContext('2d').drawImage(img, 0, 0, w, h);
          c.toBlob(function(blob) { URL.revokeObjectURL(url); resolve(blob || file); }, 'image/jpeg', q);
        };
        img.onerror = function() { URL.revokeObjectURL(url); resolve(file); };
        img.src = url;
      });
    },

    ensureImageArray(fieldName) {
      if (!Array.isArray(this.editing[fieldName])) {
        this.editing[fieldName] = this.editing[fieldName] ? [this.editing[fieldName]] : [];
      }
      return this.editing[fieldName];
    },

    addImageUrl(fieldName, url) {
      var arr = this.ensureImageArray(fieldName);
      if (arr.length < 6 && url) arr.push(url);
    },

    removeImage(fieldName, idx) {
      var arr = this.ensureImageArray(fieldName);
      arr.splice(idx, 1);
    },

    addImages(fieldName) {
      var self = this;
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;
      input.onchange = async function() {
        var files = Array.prototype.slice.call(input.files || []);
        if (!files.length) return;
        var arr = self.ensureImageArray(fieldName);
        var room = 6 - arr.length;
        files = files.slice(0, room);
        self.imgBusy = true;
        try {
          for (var i = 0; i < files.length; i++) {
            self.imgStatus = 'Compressing ' + (i + 1) + '/' + files.length + '...';
            var blob = await self.compress(files[i], 1600, 0.85);
            self.imgStatus = 'Uploading ' + (i + 1) + '/' + files.length + '...';
            var form = new FormData();
            form.append('file', blob, 'photo-' + Date.now() + '-' + i + '.jpg');
            form.append('upload_preset', 'outreach_unsigned');
            form.append('folder', 'products');
            var r = await fetch('https://api.cloudinary.com/v1_1/e4kmlh67/image/upload', { method: 'POST', body: form });
            var d = await r.json();
            if (d.secure_url) arr.push(d.secure_url + '?q_auto,f_auto,w_1000');
            else self.imgStatus = 'Upload failed: ' + ((d.error && d.error.message) || 'unknown');
          }
          self.imgStatus = 'Added ' + files.length + ' photo(s)';
        } catch (e) {
          console.error(e);
          self.imgStatus = 'Upload error: ' + e.message;
        } finally {
          self.imgBusy = false;
          setTimeout(function() { if (!self.imgBusy) self.imgStatus = ''; }, 2500);
        }
      };
      input.click();
    },

    uploadTo(path) {`;
const mAnchor = '    uploadTo(path) {';
if (t.includes(mAnchor)) { t = t.replace(mAnchor, methods); hits++; } else console.log('MISS uploadTo anchor');

// ===== 3. openEdit — normalize string -> array for image fields =====
const oldOpen = "openEdit(listKey, index) { this.editList = listKey; this.editIndex = index; var item = (this.store[listKey] || [])[index] || {}; this.editing = JSON.parse(JSON.stringify(item)); if (typeof this.editing === 'string') this.editing = { url: this.editing, name: this.editing }; this.modalOpen = true; },";
const newOpen = "openEdit(listKey, index) { this.editList = listKey; this.editIndex = index; var item = (this.store[listKey] || [])[index] || {}; this.editing = JSON.parse(JSON.stringify(item)); if (typeof this.editing === 'string') this.editing = { url: this.editing, name: this.editing }; var self = this; this.schema(listKey).fields.forEach(function(f) { if (f.type === 'image' && !Array.isArray(self.editing[f.name])) { self.editing[f.name] = self.editing[f.name] ? [self.editing[f.name]] : []; } }); this.modalOpen = true; },";
if (t.includes(oldOpen)) { t = t.replace(oldOpen, newOpen); hits++; } else console.log('MISS openEdit');

// ===== 4. saveItem — write images[] + image = images[0] =====
const oldSave = "      else item = this.editing;";
const newSave = "      else { item = this.editing; var self2 = this; s.fields.forEach(function(f) { if (f.type === 'image') { var arr = Array.isArray(item[f.name]) ? item[f.name].filter(Boolean) : (item[f.name] ? [item[f.name]] : []); item.images = arr; item.image = arr[0] || ''; } }); }";
if (t.includes(oldSave)) { t = t.replace(oldSave, newSave); hits++; } else console.log('MISS saveItem');

fs.writeFileSync(p, t, 'utf8');
console.log('seller/index.html patched, ' + hits + '/4 hits');