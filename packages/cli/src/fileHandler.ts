import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve, sep } from "node:path";
import { BaseFileHandler } from "@inkweave/core";

export class NodeFileHandler extends BaseFileHandler {
  private baseDir: string;

  constructor(basePath: string) {
    super({ basePath });
    this.baseDir = resolve(dirname(resolve(basePath)));
  }

  override resolveFilename(filename: string): string {
    return resolve(this.baseDir, filename);
  }

  override loadFile(filename: string): string {
    const fullPath = this.resolveFilename(filename);
    const normalizedPath = resolve(fullPath);
    if (!normalizedPath.startsWith(this.baseDir + sep) && normalizedPath !== this.baseDir) {
      throw new Error(`Security: Path traversal detected - ${filename}`);
    }
    if (!existsSync(normalizedPath)) {
      throw new Error(`File not found: ${normalizedPath}`);
    }
    return readFileSync(normalizedPath, "utf-8");
  }
}
