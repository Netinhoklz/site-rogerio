import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Caminhos relativos: o build funciona na raiz do domínio ou em subpasta da public_html (Locaweb)
  base: './',
  server: {
    port: 5173,
    open: true,
  },
});
