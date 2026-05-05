import react from "@vitejs/plugin-react";
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
    emptyOutDir: true,
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "src/react/main.ts"),
      name: "InkWeave",
      formats: ["iife"],
      fileName: () => "inkweave-react.min.js",
    },
    rolldownOptions: {
      output: {
        banner: processPolyfill,
        assetFileNames: 'inkweave-react.min.css',
        codeSplitting: false,
      },
    },
    sourcemap: false,
    minify: "esbuild",
  },
  resolve: {
    alias: {
      "@inkweave/core": resolve(__dirname, "../core/src/index.ts"),
    },
  },
  plugins: [react()],
});