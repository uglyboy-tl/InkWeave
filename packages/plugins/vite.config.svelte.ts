import { resolve } from "path";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import dts from "vite-plugin-dts";
import { renameCssPlugin } from "./vite.utils";

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/svelte/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `svelte/index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: [
        /^@inkweave\/core(\/|$)/,
        /^@inkweave\/svelte(\/|$)/,
        /^svelte(\/|$)/,
        /^zustand(\/|$)/,
      ],
    },
    sourcemap: true,
  },
  plugins: [
    svelte({
      include: ["**/*.svelte"],
    }),
    dts({
      include: ["src/svelte/**/*.ts", "src/**/svelte/**/*.svelte", "src/types/**/*.d.ts"],
      exclude: ["src/**/__tests__/**"],
      outDir: "dist",
      logLevel: "error",
    }),
    renameCssPlugin("svelte"),
  ],
});
