import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import esbuild from "esbuild";
import svelte from "esbuild-svelte";
import { compileModule } from "svelte/compiler";

if (!existsSync("dist")) mkdirSync("dist", { recursive: true });

// Suppress warnings that are not relevant for library builds
const SUPPRESSED_WARNINGS = new Set(["state_referenced_locally"]);

// esbuild-svelte handles .svelte files (not .svelte.ts)
const sveltePlugin = svelte({
  include: /\.svelte$/,
  compilerOptions: { generate: "client" },
  filterWarnings: (warning) => !SUPPRESSED_WARNINGS.has(warning.code),
});

// Custom plugin for .svelte.ts files: strip TS via esbuild, then compile runes via compileModule
const svelteTsPlugin: esbuild.Plugin = {
  name: "svelte-ts",
  setup(build) {
    build.onLoad({ filter: /\.svelte\.ts$/ }, async (args) => {
      const source = readFileSync(args.path, "utf8");
      // Strip TypeScript types since compileModule doesn't support TS natively
      const stripped = await esbuild.transform(source, {
        loader: "ts",
        target: "es2020",
        sourcefile: args.path,
        sourcemap: "inline",
      });
      const compiled = compileModule(stripped.code, {
        filename: args.path.replace(/\.ts$/, ".js"),
        generate: "client",
        dev: false,
      });
      return {
        contents: compiled.js.code,
        loader: "js",
      };
    });
  },
};

const commonOpts: esbuild.BuildOptions = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  target: ["es2020"],
  external: ["svelte", "svelte/*", "@inkweave/core"],
};

// ESM build (CSS extracted automatically from .svelte files)
await esbuild.build({
  ...commonOpts,
  outfile: "dist/index.js",
  format: "esm",
  plugins: [svelteTsPlugin, sveltePlugin],
});

// Move CSS from index.css to svelte.css for web-svelte to find
const cssFile = "dist/index.css";
if (existsSync(cssFile)) {
  writeFileSync("dist/svelte.css", readFileSync(cssFile));
}

// CJS build
await esbuild.build({
  ...commonOpts,
  outfile: "dist/index.cjs",
  format: "cjs",
  plugins: [svelteTsPlugin, sveltePlugin],
});

console.log("Build complete!");
