import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

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
      entry: resolve(__dirname, "src/main.ts"),
      name: "InkWeave",
      formats: ["iife"],
      fileName: () => "inkweave.min.js",
    },
    rollupOptions: {
      output: {
        banner: processPolyfill,
        assetFileNames: 'inkweave.min.css',
      },
    },
    sourcemap: false,
    minify: "esbuild",
  },
  plugins: [react()],
});