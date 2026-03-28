import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      include: ['src/lib/**/*.ts', 'src/lib/**/*.tsx'],
      outDir: 'dist',
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: {
        'lib/index': resolve(__dirname, 'src/lib/index.ts'),
        'lib/core/index': resolve(__dirname, 'src/lib/core/index.ts'),
        'lib/stores/index': resolve(__dirname, 'src/lib/stores/index.ts'),
        'lib/features/index': resolve(__dirname, 'src/lib/features/index.ts'),
        'lib/components/index': resolve(__dirname, 'src/lib/components/index.ts'),
      },
      name: 'InkPlayer',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'inkjs',
        'inkjs/engine/Story',
        'inkjs/engine/Choice',
        'inkjs/engine/VariablesState',
        'inkjs/compiler/Compiler',
        'zustand',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          inkjs: 'inkjs',
          zustand: 'zustand',
        },
      },
    },
    sourcemap: true,
    minify: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@lib': resolve(__dirname, 'src/lib'),
    },
  },
});
