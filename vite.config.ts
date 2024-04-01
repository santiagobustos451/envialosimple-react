import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  preview: {
    port: 8080,
    strictPort: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://apitest.envialosimple.email',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    port: 8080,
    strictPort: true,
    host: true,
    origin: 'http://0.0.0.0:8080',
  },
  plugins: [react()],
});
