import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/cli.ts"),
      name: "InkWeaveCLI",
      formats: ["es"],
      fileName: () => "cli.js",
    },
    rollupOptions: {
      external: ["@inkweave/core", "inkjs", /^inkjs\//, "commander", "prompts", "node:readline", "node:fs", "node:path"],
      output: {
        globals: {
          "@inkweave/core": "InkWeaveCore",
          inkjs: "inkjs",
          commander: "commander",
          prompts: "prompts",
        },
      },
    },
    sourcemap: true,
    outDir: "dist",
    emptyOutDir: true,
  },
});