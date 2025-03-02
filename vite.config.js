// filepath: vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import envCompatible from 'vite-plugin-env-compatible';
import {nodePolyfills} from 'vite-plugin-node-polyfills';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  /*define: {
    'process.env': {}
  },*/
  plugins: [react()],
  //plugins: [react(), envCompatible(), nodePolyfills()],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser global polyfills
      define: {
        global: 'globalThis',
       // 'process.env': '{}', 
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