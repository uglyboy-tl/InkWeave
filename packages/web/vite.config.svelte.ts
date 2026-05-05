import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mode = process.env.NODE_ENV || "production";
const processPolyfill = `if(typeof window!=="undefined"&&typeof window.process==="undefined"){window.process={env:{NODE_ENV:${JSON.stringify(mode)}},browser:true}}`;

export default defineConfig({
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.browser": true,
  },
  build: {
    emptyOutDir: false,
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "src/svelte/main.ts"),
      name: "InkWeave",
      formats: ["iife"],
      fileName: () => "inkweave-svelte.min.js",
    },
    rolldownOptions: {
      output: {
        banner: processPolyfill,
        assetFileNames: 'inkweave-svelte.min.css',
        codeSplitting: false,
      },
    },
    sourcemap: false,
    minify: "esbuild",
  },
  plugins: [svelte()],
});