
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

const base = '/2427-COMFORTS/';
const basePath = base.replace(/\/$/, '');

// https://vitejs.dev/config/
export default defineConfig({
  base,

  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      [`${base}api`]: {
        target: process.env.API_PROXY_TARGET || 'http://127.0.0.1:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(basePath, ''),
      },
    },
  },
});
