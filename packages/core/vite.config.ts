import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'InkWeaveCore',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        'inkjs',
        'inkjs/engine/Story',
        'inkjs/engine/Choice',
        'inkjs/compiler/IFileHandler',
        'zustand',
      ],
      output: {
        globals: {
          inkjs: 'inkjs',
          zustand: 'zustand',
        },
      },
    },
    outDir: 'dist',
    sourcemap: true,
  },
  plugins: [
    dts({
      include: ['src/**/*.ts'],
      exclude: ['src/**/__tests__/**'],
      outDir: 'dist',
    }),
  ],
});
