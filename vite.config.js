// filepath: vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import envCompatible from 'vite-plugin-env-compatible';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { VitePWA } from 'vite-plugin-pwa';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  define: {
    'process.env': {}
  },
  plugins: [react(), envCompatible(), nodePolyfills(), VitePWA({
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true,
    },
    manifest: {
      name: 'EuroContest',
      short_name: 'EuroContest',
      description: 'App Eurovision',
      theme_color: '#02025e',
      background_color: "#ff0088",
      start_url: "/",
      display: "fullscreen",
      icons: [
        {
          src: '/star_icon_128.png',
          sizes: '128x128',
          type: 'image/png',
        },
        {
          src: '/star_icon_512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
  }),],
  optimizeDeps: {
    esbuildOptions: {

      define: {
        global: 'globalThis',
        'process.env': '{}',
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