export interface FileHandler {
  loadFile(filename: string): string;
  resolveFilename?(filename: string): string;
}

export class BaseFileHandler implements FileHandler {
  protected basePath: string;

  constructor(options?: { basePath?: string }) {
    this.basePath = options?.basePath || "";
  }

  resolveFilename(filename: string): string {
    if (this.basePath) {
      return `${this.basePath.replace(/\/$/, "")}/${filename}`;
    }
    return filename;
  }

  loadFile(_filename: string): string {
    throw new Error("loadFile must be implemented by subclass");
  }
}
