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
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      name: "InkWeave",
      formats: ["iife"],
      fileName: (format) => `inkweave.min.${format === "iife" ? "js" : format}`,
    },
    rollupOptions: {
      output: {
        banner: processPolyfill,
        assetFileNames: "inkweave.min.[ext]",
      },
    },
    sourcemap: false,
    minify: "esbuild",
  },
});
