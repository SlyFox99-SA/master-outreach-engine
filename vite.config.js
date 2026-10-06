import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

function saveEndpoint() {
  return {
    name: 'seller-save-endpoint',
    configureServer(server) {
      server.middlewares.use('/api/save', (req, res, next) => {
        if (req.method !== 'POST') return next();
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const { brand, data } = JSON.parse(body);
            if (!brand || !data) { res.statusCode = 400; return res.end('Missing brand or data'); }
            const safeBrand = String(brand).replace(/[^a-z0-9-]/gi, '');
            const target = resolve(__dirname, 'data', 'config-' + safeBrand + '.json');
            if (!existsSync(target)) { res.statusCode = 404; return res.end('Config not found: ' + safeBrand); }
            writeFileSync(target, JSON.stringify(data), 'utf8');
            console.log('[seller-save] wrote', target);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true, file: target }));
          } catch (e) {
            console.error('[seller-save] error', e);
            res.statusCode = 500;
            res.end('Save failed: ' + e.message);
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [saveEndpoint()],
  server: { port: 5173, open: false },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        admin: resolve(__dirname, 'admin/index.html'),
        seller: resolve(__dirname, 'seller/index.html'),
        salon: resolve(__dirname, 'templates/salon/index.html'),
        services: resolve(__dirname, 'templates/services/index.html'),
        studio: resolve(__dirname, 'templates/studio/index.html'),
        restaurant: resolve(__dirname, 'templates/restaurant/index.html'),
        personal: resolve(__dirname, 'templates/personal/index.html'),
        starter: resolve(__dirname, 'templates/starter/index.html'),
        track: resolve(__dirname, 'track/index.html'), track: resolve(__dirname, 'track.html')
      }
    }
  }
});