import { BaseFileHandler } from "@inkweave/core";

export class FetchFileHandler extends BaseFileHandler {
  // inkjs 的 IFileHandler.LoadInkFileContents 签名是同步 string，无法改为异步
  // 这是上游限制（非 InkWeave 设计选择），短期只能保持同步 XHR
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
