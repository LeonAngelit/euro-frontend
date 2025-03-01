// filepath: vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import envCompatible from 'vite-plugin-env-compatible';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react(), envCompatible()],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser global polyfills
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true
        })
      ]
    }
  },
  server: {
    open: true,
  },
  build: {
    outDir: 'build',
  },
});