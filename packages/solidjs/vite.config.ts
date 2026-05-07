import { resolve } from "path";
import { existsSync, renameSync } from "fs";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: [/^solid-js(\/|$)/, /^@inkweave\/core(\/|$)/],
    },
    sourcemap: true,
  },
  plugins: [
    solid(),
    dts({
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: ["src/**/__tests__/**"],
      outDir: "dist",
    }),
    {
      name: "rename-css",
      closeBundle() {
        const cssSrc = resolve(__dirname, "dist/index.css");
        const cssDest = resolve(__dirname, "dist/solidjs.css");
        if (existsSync(cssSrc)) {
          renameSync(cssSrc, cssDest);
        }
      },
    },
  ],
});
