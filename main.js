import Alpine from 'alpinejs';
import activeConfig from './data/active-config.json';
const brandConfigs = import.meta.env.DEV ? import.meta.glob('./data/config-*.json', { eager: true, import: 'default' }) : {};
function pickConfig() {
  const p = new URLSearchParams(location.search);
  const k = p.get('brand') || localStorage.getItem('brand');
  if (import.meta.env.DEV && k) {
    const h = Object.entries(brandConfigs).find(([path]) => path.endsWith(`config-${k}.json`));
    if (h) return h[1];
  }
  return activeConfig;
}

document.addEventListener('alpine:init', () => {
  Alpine.store('config', {
    id: '', brand: {}, theme: {}, whatsapp: '', products: [],
    init() {
      Object.assign(this, pickConfig());
      this.applyTheme();
      document.title = `${this.brand?.name ?? 'Outreach'} · Master Engine`;
    },
    applyTheme() {
      const r = document.documentElement;
      for (const k of ['primary','accent','ink','surface']) {
        if (this.theme?.[k]) r.style.setProperty(`--brand-${k}`, this.theme[k]);
      }
    },
    waLink(p = null) {
      const d = String(this.whatsapp || '').replace(/\D/g, '');
      const m = p?.waMessage ?? `Hi ${this.brand?.name ?? ''}! I want to know more about your ${p?.name ?? 'products'}.`;
      return `https://wa.me/${d}?text=${encodeURIComponent(m)}`;
    },
    formatZAR(v) {
      return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(v ?? 0);
    }
  });
});

window.downloadStory = async () => {
  const { toPng } = await import('html-to-image');
  const n = document.querySelector('#device-frame');
  if (!n) return;
  const d = await toPng(n, { width: 1080, height: 1920, pixelRatio: 1, cacheBust: true });
  const a = document.createElement('a');
  a.href = d;
  a.download = `story-${Alpine.store('config').id}-${Date.now()}.png`;
  a.click();
};

Alpine.start();
