import type { GeneratedFile, GeneratedModule } from "../types";
import { templateEngine } from "./TemplateEngine";

/**
 * Ink 代码发射器
 *
 * 负责将模板和数据转换为 ink 代码文件。
 */
export class InkEmitter {
  /**
   * 使用模板生成 ink 文件
   */
  emitTemplate(template: string, data: Record<string, unknown>, filename: string): GeneratedFile {
    const content = templateEngine.render(template, data);
    return { path: filename, content };
  }

  /**
   * 使用多个模板生成多个 ink 文件
   */
  emitTemplates(templates: Record<string, string>, data: Record<string, unknown>): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    for (const [filename, template] of Object.entries(templates)) {
      files.push(this.emitTemplate(template, data, filename));
    }

    return files;
  }

  /**
   * 生成入口 ink 文件（包含 INCLUDE 语句）
   */
  emitEntry(includes: string[], entryName: string = "index.ink"): GeneratedFile {
    const content = includes.map((inc) => `INCLUDE ${inc}`).join("\n");
    return { path: entryName, content };
  }

  /**
   * 生成完整的模块
   */
  emitModule(
    templates: Record<string, string>,
    data: Record<string, unknown>,
    entryName: string = "index.ink",
  ): GeneratedModule {
    const files = this.emitTemplates(templates, data);
    const entry = this.emitEntry(
      files.map((f) => f.path),
      entryName,
    );

    return {
      files: [...files, entry],
      entry: entryName,
    };
  }
}

/**
 * 全局 InkEmitter 实例
 */
export const inkEmitter = new InkEmitter();
