import type { FileHandler } from "./FileHandler";
import { BaseFileHandler } from "./FileHandler";

export class InkjsFileHandler {
  private handler: FileHandler;
  private resolve: (filename: string) => string;

  constructor(handler: FileHandler) {
    this.handler = handler;
    this.resolve =
      handler instanceof BaseFileHandler || typeof handler.resolveFilename === "function"
        ? (f: string) => handler.resolveFilename?.(f) ?? f
        : (f: string) => f;
  }

  readonly ResolveInkFilename = (filename: string): string => {
    return this.resolve(filename);
  };

  readonly LoadInkFileContents = (filename: string): string => {
    return this.handler.loadFile(filename);
  };
}
