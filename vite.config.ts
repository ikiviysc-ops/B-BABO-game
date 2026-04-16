import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/B-BABO-game/',
  resolve: {
    alias: {
      '@core': resolve(__dirname, 'src/core'),
      '@engine': resolve(__dirname, 'src/engine'),
      '@entities': resolve(__dirname, 'src/entities'),
      '@systems': resolve(__dirname, 'src/systems'),
      '@data': resolve(__dirname, 'src/data'),
      '@ui': resolve(__dirname, 'src/ui'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@assets': resolve(__dirname, 'src/assets'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: false,
  },
  build: {
    target: 'es2022',
    outDir: 'dist',
    sourcemap: true,
  },
});
