import { resolve } from "path";
import { existsSync, renameSync } from "fs";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    emptyOutDir: true,
    // 库包需要合并为单 CSS 文件，避免代码分割导致样式缺失
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: [/^svelte(\/|$)/, /^@inkweave\/core(\/|$)/],
    },
    sourcemap: true,
  },
  plugins: [
    svelte(),
    dts({
      include: ["src/**/*.ts", "src/**/*.svelte"],
      exclude: ["src/**/__tests__/**"],
      outDir: "dist",
    }),
    {
      name: "rename-css",
      closeBundle() {
        const cssSrc = resolve(__dirname, "dist/index.css");
        const cssDest = resolve(__dirname, "dist/svelte.css");
        if (existsSync(cssSrc)) {
          renameSync(cssSrc, cssDest);
        }
      },
    },
  ],
});
