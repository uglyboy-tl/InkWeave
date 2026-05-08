import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { renameCssPlugin } from "./vite.utils";

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/react/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `react/index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: [
        /^@inkweave\/core(\/|$)/,
        /^@inkweave\/react(\/|$)/,
        /^react(\/|$)/,
        /^react-dom(\/|$)/,
        /^zustand(\/|$)/,
      ],
    },
    sourcemap: true,
  },
  plugins: [
    react({
      include: ["**/react/**/*.{tsx,jsx}"],
    }),
    dts({
      include: ["src/react/**/*.ts", "src/**/react/**/*.tsx", "src/types/**/*.d.ts"],
      exclude: ["src/**/__tests__/**"],
      outDir: "dist",
      logLevel: "error",
    }),
    renameCssPlugin("react"),
  ],
});
