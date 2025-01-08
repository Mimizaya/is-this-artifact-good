import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const ReactCompilerConfig = {
  target: '19' // '17' | '18' | '19'
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
    VitePWA({
      registerType: 'autoUpdate', // Automatically update service worker
      workbox: {
        // Specify caching options here
        runtimeCaching: [
          {
            urlPattern: (event: any) => {
              const { url } = event; // event is a FetchEvent, which has a 'url' property
              return url.pathname.startsWith('/'); // Cache assets from public folder
            },
            handler: 'CacheFirst', // Use Cache-First strategy (prefer cache)
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 1000, // Limit to 1000 images
                maxAgeSeconds: 60 * 60 * 24 * 30, // Cache for 30 days
              },
            },
          },
        ],
      },
    }),
  ],
  base: '/is-this-artifact-good/', // GitHub repo name
  server: {
    host: true, // or use '0.0.0.0'
    port: 5173, // or your preferred port
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  assetsInclude: ['**/*.csv'],  // CSV files as assets
})
