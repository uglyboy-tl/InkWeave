import { resolve } from "path";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        "react/index": resolve(__dirname, "src/react/index.ts"),
        "svelte/index": resolve(__dirname, "src/svelte/index.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) =>
        `${entryName}.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: [
        "@inkweave/core",
        "@inkweave/react",
        "@inkweave/svelte",
        "react",
        "react/jsx-runtime",
        "svelte",
        "svelte/*",
        "zustand",
        /^zustand\//,
      ],
      output: {
        globals: {
          "@inkweave/core": "InkWeaveCore",
          "@inkweave/react": "InkWeaveReact",
          "@inkweave/svelte": "InkWeaveSvelte",
          react: "React",
          svelte: "svelte",
          zustand: "zustand",
        },
      },
    },
    sourcemap: true,
  },
  plugins: [
    svelte(),
    dts({
      include: ["src/**/*.ts", "src/**/*.tsx", "src/**/*.svelte"],
      exclude: ["src/**/__tests__/**"],
      outDir: "dist",
    }),
  ],
});
