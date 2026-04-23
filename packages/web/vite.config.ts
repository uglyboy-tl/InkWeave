import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const processPolyfill = `if(typeof window!=="undefined"&&typeof window.process==="undefined"){window.process={env:{NODE_ENV:"production"},browser:true}}`;

// 由于需要针对不同格式使用不同的外部化策略，我们创建一个基础配置
// 然后在构建脚本中处理不同格式
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    })
  ],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.browser": true,
  },
  build: {
    emptyOutDir: true,
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "InkWeave",
      formats: ["es", "cjs"], // 先构建 ES 和 CJS 格式（外部化依赖）
      fileName: (format) => {
        return `index.${format === "es" ? "js" : format}`;
      },
    },
    rollupOptions: {
      external: [
        // npm 包格式需要外部化这些依赖
        "react",
        "react-dom",
        "@inkweave/core",
        "@inkweave/react",
        "@inkweave/plugins"
      ],
      output: {
        banner: processPolyfill,
        assetFileNames: 'inkweave.min.css',
        globals: {
          // 对于 CDN 引入的情况，指定全局变量名
          react: "React",
          "react-dom": "ReactDOM",
          "@inkweave/core": "InkWeaveCore",
          "@inkweave/react": "InkWeaveReact",
          "@inkweave/plugins": "InkWeavePlugins"
        }
      },
    },
    sourcemap: true, // 为 npm 包提供源码映射
    minify: "esbuild",
  },
});
