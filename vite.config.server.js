// vite.config.server.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    ssr: true,
    outDir: 'dist/server',
    lib: {
      entry: 'src/server/index.js',
      name: 'server',
      formats: ['cjs'],
    },
  },
  ssr: {
    external: ['react', 'react-dom'],
  },
});