document.addEventListener("alpine:init", function() {
  var params = new URLSearchParams(location.search);
  var brand = params.get("brand") || localStorage.getItem("brand") || "active";
  var all = window.__CONFIGS || {};
  var cfg = all[brand] || all.active || {};
  var defaultShipping = [
    { id: "paxi", name: "Paxi (PEP to PEP)", price: 60 },
    { id: "courier", name: "Courier door-to-door", price: 100 },
    { id: "collect", name: "Collection by arrangement", price: 0 }
  ];
  var store = Object.assign({}, cfg, {
    formatZAR: function(v) { return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(v || 0); },
    hasPayment: function() { return !!(this.payment && this.payment.merchantId); },
    shippingOptions: function() { return (this.shipping && this.shipping.length) ? this.shipping : defaultShipping; },
    getStock: function(p) { if (!p) return 0; if (p.variants && p.variants.length) { return p.variants.reduce(function(s, v) { return s + (Number(v.stock) || 0); }, 0); } return p.stock == null ? Infinity : Number(p.stock); },
    getVariantStock: function(p, vid) { if (!p) return 0; if (!p.variants || !p.variants.length) return p.stock == null ? Infinity : Number(p.stock); var v = p.variants.filter(function(x) { return x.id === vid; })[0]; return v ? (Number(v.stock) || 0) : 0; },
    inStock: function(p) { return this.getStock(p) > 0; },
    hasVariants: function(p) { return !!(p && p.variants && p.variants.length); },
    pickVariant: function(p) { if (!this.hasVariants(p)) return null; var cart = window.Alpine.store("cart"); var sel = cart.selectedVariants[p.id]; var v = p.variants.filter(function(x) { return x.id === sel; })[0]; if (v && v.stock > 0) return v; return p.variants.filter(function(x) { return x.stock > 0; })[0] || p.variants[0]; },
    visibleProducts: function() { var f = window.Alpine.store("filter"); return (this.products || []).filter(function(p) { if (f.category === "all") return true; return p.category === f.category; }); },
    payLink: function(p) { if (!this.payment || !this.payment.merchantId) return "#"; var base = this.payment.sandbox ? "https://sandbox.payfast.co.za/eng/process" : "https://www.payfast.co.za/eng/process"; var q = new URLSearchParams({ merchant_id: this.payment.merchantId, merchant_key: this.payment.merchantKey, amount: Number(p.price).toFixed(2), item_name: p.name, return_url: this.payment.returnUrl || location.href, cancel_url: this.payment.cancelUrl || location.href }); return base + "?" + q.toString(); }
  });
  window.Alpine.store("config", store);
  var r = document.documentElement;
  ["primary", "accent", "ink", "surface"].forEach(function(k) { if (cfg.theme && cfg.theme[k]) r.style.setProperty("--brand-" + k, cfg.theme[k]); });
  document.title = ((cfg.brand && cfg.brand.name) || "Store") + " - " + ((cfg.brand && cfg.brand.tagline) || "");
});
document.addEventListener("alpine:init", function() {
  var savedItems = []; try { savedItems = JSON.parse(localStorage.getItem("cart.items") || "[]") || []; } catch (e) {}
  var savedShip = localStorage.getItem("cart.shipping") || "";
  var savedNote = localStorage.getItem("cart.note") || "";
  var savedRef = localStorage.getItem("cart.ref") || "";
  var savedVar = {}; try { savedVar = JSON.parse(localStorage.getItem("cart.variants") || "{}") || {}; } catch (e) {}
  window.Alpine.store("cart", {
    items: savedItems, open: false, shippingId: savedShip, customerNote: savedNote, orderRef: savedRef, selectedVariants: savedVar, paymentStep: 0,
    persist: function() { try { localStorage.setItem("cart.items", JSON.stringify(this.items)); localStorage.setItem("cart.shipping", this.shippingId || ""); localStorage.setItem("cart.note", this.customerNote || ""); localStorage.setItem("cart.ref", this.orderRef || ""); localStorage.setItem("cart.variants", JSON.stringify(this.selectedVariants)); } catch (e) {} },
    setVariant: function(pid, vid) { this.selectedVariants[pid] = vid; this.persist(); },
    markPaid: function() { if (!this.orderRef) this.orderRef = this.genRef(); this.paymentStep = 1; this.persist(); },
    findItem: function(id, vid) { var k = id + "::" + (vid || "d"); var self = this; return this.items.filter(function(i) { return (i.id + "::" + (i.variantId || "d")) === k; })[0]; },
    add: function(p, variant) { var cfg = window.Alpine.store("config"); var vid = variant ? variant.id : null; var vName = variant ? variant.name : null; var stock = variant ? cfg.getVariantStock(p, vid) : cfg.getStock(p); var ex = this.findItem(p.id, vid); var cur = ex ? ex.qty : 0; if (stock !== Infinity && cur >= stock) return; if (ex) { ex.qty += 1; } else { this.items.push({ id: p.id, variantId: vid, variantName: vName, name: p.name, price: p.price, image: p.image, qty: 1, stock: stock }); } if (!this.orderRef) this.orderRef = this.genRef(); this.persist(); this.open = true; },
    buyNow: function(p, variant) { this.items = []; this.add(p, variant); },
    remove: function(id, vid) { var k = id + "::" + (vid || "d"); this.items = this.items.filter(function(i) { return (i.id + "::" + (i.variantId || "d")) !== k; }); this.persist(); },
    setQty: function(id, vid, q) { var it = this.findItem(id, vid); if (!it) return; var max = it.stock === Infinity ? 999 : it.stock; it.qty = Math.max(1, Math.min(q, max)); this.persist(); },
    clear: function() { this.items = []; this.shippingId = ""; this.customerNote = ""; this.orderRef = ""; this.paymentStep = 0; this.persist(); },
    count: function() { var n = 0; for (var i = 0; i < this.items.length; i++) n += this.items[i].qty; return n; },
    subtotal: function() { var n = 0; for (var i = 0; i < this.items.length; i++) n += this.items[i].price * this.items[i].qty; return n; },
    selectedShipping: function() { var o = window.Alpine.store("config").shippingOptions(); if (!this.shippingId && o.length) this.shippingId = o[0].id; for (var i = 0; i < o.length; i++) if (o[i].id === this.shippingId) return o[i]; return o[0] || { id: "none", name: "No shipping", price: 0 }; },
    grandTotal: function() { return this.subtotal() + (this.selectedShipping().price || 0); },
    genRef: function() { var cfg = window.Alpine.store("config"); var ini = ((cfg.brand && cfg.brand.name) || "ORD").replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase(); var d = new Date(); var ymd = String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0"); var r = Math.random().toString(36).slice(2, 6).toUpperCase(); return ini + "-" + ymd + "-" + r; },
    popMessage: function() { var cfg = window.Alpine.store("config"); var lines = ["Hi " + ((cfg.brand && cfg.brand.name) || "store") + "! Sending proof of payment.", ""]; lines.push("Order Ref: " + (this.orderRef || "N/A")); lines.push(""); lines.push("Items:"); for (var i = 0; i < this.items.length; i++) { var it = this.items[i]; var v = it.variantName ? " (" + it.variantName + ")" : ""; lines.push("- " + it.qty + "x " + it.name + v + " - R" + (it.price * it.qty)); } lines.push(""); lines.push("Subtotal: R" + this.subtotal()); var s = this.selectedShipping(); lines.push("Shipping: " + s.name + " - R" + s.price); lines.push("Grand Total: R" + this.grandTotal()); if (this.customerNote) { lines.push(""); lines.push("Note: " + this.customerNote); } lines.push(""); lines.push("POP screenshot attached below."); return lines.join("\n"); },
    popWhatsApp: function() { var cfg = window.Alpine.store("config"); var d = String(cfg.whatsapp || "").replace(/\D/g, ""); return "https://wa.me/" + d + "?text=" + encodeURIComponent(this.popMessage()); }
  });
});
document.addEventListener("alpine:init", function() {
  window.Alpine.store("filter", { category: "all", set: function(c) { this.category = c; } });
  window.Alpine.store("view", { mode: "grid", set: function(m) { this.mode = m; try { localStorage.setItem("view.mode", m); } catch (e) {} } });
  try { var saved = localStorage.getItem("view.mode"); if (saved) window.Alpine.store("view").mode = saved; } catch (e) {}
});
window.downloadStory = async function() { var mod = await import("html-to-image"); var node = document.querySelector("main"); if (!node) return; var d = await mod.toPng(node, { width: 1080, height: 1920, pixelRatio: 1, cacheBust: true }); var a = document.createElement("a"); a.href = d; a.download = "story.png"; a.click(); };
document.addEventListener("alpine:init", function() { setTimeout(function() { var c = window.Alpine.store("cart"); if (c && c.items.length > 0 && !c.orderRef) { c.orderRef = c.genRef(); c.persist(); } }, 100); });
