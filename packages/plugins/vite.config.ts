import { resolve } from "path";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        "react/index": resolve(__dirname, "src/react/index.ts"),
        "svelte/index": resolve(__dirname, "src/svelte/index.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) =>
        `${entryName}.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: [
        /^@inkweave\/core(\/|$)/,
        /^@inkweave\/react(\/|$)/,
        /^@inkweave\/svelte(\/|$)/,
        /^@inkweave\/solidjs(\/|$)/,
        /^react(\/|$)/,
        /^svelte(\/|$)/,
        /^solid-js(\/|$)/,
        /^zustand(\/|$)/,
      ],
    },
    sourcemap: true,
  },
  plugins: [
    react({
    include: ["**/react/**/*.{tsx,jsx}"],
  }),
    svelte({
      include: ["**/*.svelte"],
    }),
    dts({
      include: ["src/**/*.ts", "src/react/**/*.tsx", "src/**/*.svelte"],
      // solidjs 类型由 vite.config.solidjs.ts 独立生成（使用 solidjs 专用 tsconfig）
      exclude: ["src/**/__tests__/**", "src/**/solidjs/**"],
      outDir: "dist",
      logLevel: "error",
    }),
  ],
});
