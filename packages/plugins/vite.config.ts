import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "InkWeavePlugins",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
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
