import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
