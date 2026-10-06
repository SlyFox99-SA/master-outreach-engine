import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  server: { port: 5173, open: false },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: { main: resolve(__dirname, 'index.html'), checkout: resolve(__dirname, 'checkout.html'), admin: resolve(__dirname, 'admin/index.html') }
    }
  }
});
