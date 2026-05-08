import { existsSync, renameSync } from "fs";
import { resolve } from "path";
import type { PluginOption } from "vite";

export function renameCssPlugin(destName: string): PluginOption {
  return {
    name: "rename-css",
    closeBundle() {
      const cssSrc = resolve(__dirname, "dist/plugins.css");
      const cssDest = resolve(__dirname, `dist/${destName}.css`);
      if (existsSync(cssSrc)) {
        renameSync(cssSrc, cssDest);
      }
    },
  };
}
