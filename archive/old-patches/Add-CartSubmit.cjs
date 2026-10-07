const fs = require('fs');
const p = process.cwd() + '\\main.js';
let t = fs.readFileSync(p, 'utf8');
let h = 0;

// Add new fields right after orderRef init inside the cart store
const anchor = 'orderRef: localStorage.getItem("cart." + (cfg.id || brand) + ".ref") || "",';
const extra = `orderRef: localStorage.getItem("cart." + (cfg.id || brand) + ".ref") || "",
    buyerName: localStorage.getItem("cart." + (cfg.id || brand) + ".buyerName") || "",
    buyerPhone: localStorage.getItem("cart." + (cfg.id || brand) + ".buyerPhone") || "",
    buyerAddress: localStorage.getItem("cart." + (cfg.id || brand) + ".buyerAddress") || "",
    sending: false, sent: false, error: "",`;

if (t.includes(anchor) && !t.includes('buyerName:')) {
  t = t.replace(anchor, extra);
  h++;
  console.log('cart store: added buyer + submission fields');
}

// Persist buyer fields
const persistAnchor = 'localStorage.setItem("cart." + (cfg.id || brand) + ".ref",this.orderRef||"");';
if (!t.includes('.buyerName",this.buyerName')) {
  t = t.replace(persistAnchor, persistAnchor + ' localStorage.setItem("cart." + (cfg.id || brand) + ".buyerName",this.buyerName||""); localStorage.setItem("cart." + (cfg.id || brand) + ".buyerPhone",this.buyerPhone||""); localStorage.setItem("cart." + (cfg.id || brand) + ".buyerAddress",this.buyerAddress||"");');
  h++;
  console.log('cart store: persist buyer fields');
}

// Add submitOrder method just before "reset:"
const resetAnchor = 'reset: function(){ this.clear(); this.open=false; },';
const submitMethod = `submitOrder: async function(){
      var self = this;
      var cfg = window.Alpine.store("config");
      if (!this.buyerName || !this.buyerName.trim()) { this.error = "Please enter your name."; return; }
      if (!this.buyerPhone || !this.buyerPhone.trim()) { this.error = "Please enter your WhatsApp number."; return; }
      var ship = this.selectedShipping();
      if (ship.id !== "collect" && (!this.buyerAddress || !this.buyerAddress.trim())) { this.error = "Please enter a delivery address."; return; }
      if (!this.items.length) { this.error = "Your cart is empty."; return; }
      this.error = "";
      this.sending = true;
      try {
        var order = {
          ref: this.orderRef,
          createdAt: new Date().toISOString(),
          buyer: { name: this.buyerName.trim(), phone: this.buyerPhone.trim(), address: (this.buyerAddress||"").trim() },
          items: this.items,
          subtotal: this.subtotal(),
          shipping: { name: ship.name, price: ship.price },
          total: this.grandTotal(),
          status: "new"
        };
        var res = await fetch("https://outreach-save-api.gifttsima16.workers.dev/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brand: cfg.id, order: order })
        });
        var j = await res.json().catch(function(){ return {}; });
        if (!res.ok || !j.ok) { this.error = "Order could not be saved. Please try again."; this.sending = false; return; }
        var lines = ["Hi " + ((cfg.brand && cfg.brand.name) || "store") + "! Proof of payment attached.", ""];
        lines.push("Ref: " + (this.orderRef || "N/A"));
        lines.push("");
        for (var i = 0; i < this.items.length; i++) {
          var it = this.items[i];
          lines.push(it.qty + "x " + it.name + (it.variantName ? " (" + it.variantName + ")" : "") + " - R" + (it.price * it.qty));
        }
        lines.push("");
        lines.push("Subtotal: R" + this.subtotal());
        lines.push("Shipping: " + ship.name + " - R" + ship.price);
        lines.push("Total: R" + this.grandTotal());
        if (this.buyerAddress) { lines.push(""); lines.push("Deliver to: " + this.buyerAddress); }
        var digits = String(cfg.whatsapp || "").replace(/\D/g, "");
        window.open("https://wa.me/" + digits + "?text=" + encodeURIComponent(lines.join("\\n")), "_blank");
        this.items = [];
        this.persist();
        this.sent = true;
      } catch (e) {
        this.error = "Network error: " + e.message;
      }
      this.sending = false;
    },
    reset: function(){ this.clear(); this.open=false; },`;

if (t.includes(resetAnchor) && !t.includes('submitOrder: async function')) {
  t = t.replace(resetAnchor, submitMethod);
  h++;
  console.log('cart store: added submitOrder method');
}

fs.writeFileSync(p, t, 'utf8');
console.log('main.js -> ' + h + ' changes');