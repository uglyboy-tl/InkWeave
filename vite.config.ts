import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

const processPolyfill = `if(typeof window!=="undefined"&&typeof window.process==="undefined"){window.process={env:{},browser:true}}`;

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    'process.browser': true,
  },
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'InkPlayerGlobal',
      fileName: 'ink-player-web',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        assetFileNames: 'style.[ext]',
        globals: {},
        banner: processPolyfill,
      },
    },
    sourcemap: false,
    minify: 'esbuild',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@lib': resolve(__dirname, 'src/lib'),
    },
  },
});
