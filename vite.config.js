import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  server: { port: 5173, open: false },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        seller: resolve(__dirname, 'seller/index.html'),
        track: resolve(__dirname, 'track/index.html'),
        'client-zaheera-fragrances': resolve(__dirname, 'clients/zaheera-fragrances/src/index.html'),
        'client-techhub-phones': resolve(__dirname, 'clients/techhub-phones/src/index.html'),
        'client-monetech-sneakers': resolve(__dirname, 'clients/monetech-sneakers/src/index.html'),
        'client-lumo-skincare': resolve(__dirname, 'clients/lumo-skincare/src/index.html')
      }
    }
  }
});
