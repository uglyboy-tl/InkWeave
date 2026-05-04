import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        "react/index": resolve(__dirname, "src/react/index.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) =>
        `${entryName}.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: [
        "@inkweave/core",
        "@inkweave/react",
        "react",
        "react/jsx-runtime",
        "zustand",
        /^zustand\//,
      ],
      output: {
        globals: {
          "@inkweave/core": "InkWeaveCore",
          "@inkweave/react": "InkWeaveReact",
          react: "React",
          zustand: "zustand",
        },
      },
    },
    sourcemap: true,
  },
  plugins: [
    dts({
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: ["src/**/__tests__/**"],
      outDir: "dist",
    }),
  ],
});
