// 构建库入口
await Bun.build({
  entrypoints: ["src/index.ts"],
  outdir: "dist",
  target: "node",
  format: "esm",
  naming: "[name].js",
  packages: "external",
  minify: true,
});

// 构建 CLI 入口
await Bun.build({
  entrypoints: ["src/cli/index.ts"],
  outdir: "dist",
  target: "node",
  format: "esm",
  naming: "cli.js",
  packages: "external",
  minify: true,
});

console.log("Build complete!");
