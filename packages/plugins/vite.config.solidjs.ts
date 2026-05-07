import { resolve } from "path";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/solidjs/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `solidjs/index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: [
        /^@inkweave\/core(\/|$)/,
        /^@inkweave\/solidjs(\/|$)/,
        /^solid-js(\/|$)/,
        /^zustand(\/|$)/,
      ],
    },
    sourcemap: true,
  },
  plugins: [
    solid({
      include: ["**/solidjs/**/*.{tsx,jsx}"],
    }),
    dts({
      include: ["src/solidjs/**/*.ts", "src/**/solidjs/**/*.tsx", "src/types/**/*.d.ts"],
      exclude: ["src/**/__tests__/**"],
      outDir: "dist",
      tsconfigPath: resolve(__dirname, "tsconfig.solidjs.json"),
    }),
  ],
});
