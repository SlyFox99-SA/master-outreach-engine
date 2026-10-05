import Alpine from 'alpinejs';
import activeConfig from './data/active-config.json';

const brandConfigs = import.meta.env.DEV ? import.meta.glob('./data/config-*.json', { eager: true, import: 'default' }) : {};

function pick() {
  const k = new URLSearchParams(location.search).get('brand') || localStorage.getItem('brand');
  if (import.meta.env.DEV && k) {
    for (const p in brandConfigs) if (p.endsWith('config-' + k + '.json')) return brandConfigs[p];
  }
  return activeConfig;
}

const cfg = pick();

const store = {
  ...cfg,
  waLink: function(p) {
    const d = String(this.whatsapp || '').replace(/\D/g, '');
    const m = p && p.waMessage ? p.waMessage : 'Hi ' + (this.brand?.name || '') + '! I want to know more.';
    return 'https://wa.me/' + d + '?text=' + encodeURIComponent(m);
  },
  formatZAR: function(v) {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(v || 0);
  },
  payLink: function(product) {
    if (!this.payment || !this.payment.merchantId) return '#';
    const base = this.payment.sandbox ? 'https://sandbox.payfast.co.za/eng/process' : 'https://www.payfast.co.za/eng/process';
    const params = new URLSearchParams({
      merchant_id: this.payment.merchantId,
      merchant_key: this.payment.merchantKey,
      amount: Number(product.price).toFixed(2),
      item_name: product.name,
      return_url: this.payment.returnUrl || location.href,
      cancel_url: this.payment.cancelUrl || location.href
    });
    return base + '?' + params.toString();
  }
};

Alpine.store('config', store);

const r = document.documentElement;
for (const k of ['primary','accent','ink','surface']) {
  if (cfg.theme?.[k]) r.style.setProperty('--brand-' + k, cfg.theme[k]);
}
document.title = (cfg.brand?.name || 'Outreach') + ' - Master Engine';

window.downloadStory = async () => {
  const { toPng } = await import('html-to-image');
  const n = document.querySelector('#device-frame');
  if (!n) return;
  const d = await toPng(n, { width: 1080, height: 1920, pixelRatio: 1, cacheBust: true });
  const a = document.createElement('a');
  a.href = d;
  a.download = 'story-' + cfg.id + '.png';
  a.click();
};

window.Alpine = Alpine;
Alpine.start();
