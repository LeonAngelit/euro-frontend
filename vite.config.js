import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// REMOVED: import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import envCompatible from "vite-plugin-env-compatible";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { VitePWA } from "vite-plugin-pwa";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  define: {
    "process.env": {},
    global: "globalThis", // MOVED here so it applies to the whole app
  },
  plugins: [
    vue(),
    envCompatible(),
    nodePolyfills({
      // We explicitly tell the modern plugin to handle Buffer and Process,
      // replacing what the esbuild plugin was trying to do.
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "EuroContest",
        short_name: "EuroContest",
        description: "App Eurovision",
        theme_color: "#02025e",
        background_color: "#ff0088",
        start_url: "/",
        display: "fullscreen",
        icons: [
          {
            src: "/star_icon_128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "/star_icon_512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  // REMOVED: optimizeDeps completely as it was causing the conflict
  server: {
    open: true,
  },
  build: {
    outDir: "dist",
  },
});
