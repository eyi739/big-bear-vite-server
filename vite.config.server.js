// vite.config.server.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // to avoid CORS issues 
   server: {
         proxy: {
           '/api': {
             target: 'http://localhost:5173', // Your Express server address
             changeOrigin: true,
           },
         },
       },
});