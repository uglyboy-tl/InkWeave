import { BaseFileHandler } from "@inkweave/core";

export class FetchFileHandler extends BaseFileHandler {
  override loadFile(filename: string): string {
    const path = this.resolveFilename(filename);
    const xhr = new XMLHttpRequest();
    xhr.open("GET", path, false);
    xhr.send();

    if (xhr.status !== 200) {
      throw new Error(`Failed to load: ${path}`);
    }

    return xhr.responseText;
  }
}
