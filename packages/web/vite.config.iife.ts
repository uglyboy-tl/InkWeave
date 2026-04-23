import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

const processPolyfill = `if(typeof window!=="undefined"&&typeof window.process==="undefined"){window.process={env:{NODE_ENV:"production"},browser:true}}`;

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.browser": true,
  },
  build: {
    emptyOutDir: false, // 不清空目录，因为我们只想添加 IIFE 文件
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
});