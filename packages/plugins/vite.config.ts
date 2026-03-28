import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'InkWeavePlugins',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        '@inkweave/core',
        '@inkweave/react',
        'inkjs',
        'inkjs/compiler/IFileHandler',
        'react',
        'react/jsx-runtime',
        'zustand',
        'zustand/middleware',
      ],
      output: {
        globals: {
          '@inkweave/core': 'InkWeaveCore',
          '@inkweave/react': 'InkWeaveReact',
          inkjs: 'inkjs',
          react: 'React',
          zustand: 'zustand',
        },
      },
    },
    sourcemap: true,
  },
  plugins: [
    dts({
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/__tests__/**'],
      outDir: 'dist',
    }),
  ],
});
