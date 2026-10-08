import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  server: { port: 5173, open: false },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        'client-zaheera-fragrances': resolve(__dirname, 'clients/zaheera-fragrances/src/index.html'),
        'client-techhub-phones': resolve(__dirname, 'clients/techhub-phones/src/index.html'),
        'client-monetech-sneakers': resolve(__dirname, 'clients/monetech-sneakers/src/index.html'),
        'client-lumo-skincare': resolve(__dirname, 'clients/lumo-skincare/src/index.html')
      }
    }
  }
});
