import type { Table, UnifiedGameData } from "../types";
import type { Parser } from "./types";

/**
 * Markdown 表格解析器
 *
 * 支持标准 Markdown 表格格式：
 * ```markdown
 * ## 表名
 * | col1 | col2 | col3 |
 * |------|------|------|
 * | val1 | val2 | val3 |
 * ```
 */
export class MarkdownParser implements Parser {
  detect(input: string): boolean {
    const lines = input.trim().split("\n");
    let hasHeader = false;
    let hasSeparator = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) hasHeader = true;
      if (/^\|[\s\-:|]+\|$/.test(trimmed)) hasSeparator = true;
      if (hasHeader && hasSeparator) return true;
    }
    return false;
  }

  parse(input: string): UnifiedGameData {
    const sections = this.splitByHeaders(input);
    const tables: Record<string, Table> = {};

    for (const [name, content] of sections) {
      const table = this.parseTable(content);
      if (table) {
        tables[name] = table;
      }
    }

    return { tables };
  }

  /**
   * 按 ## 标题或空行分割文档。
   * 有 ## 标题时用标题文本作表名，无标题时自动编号。
   */
  private splitByHeaders(input: string): [string, string][] {
    const sections: [string, string][] = [];
    const paragraphs = input.split(/\n\n+/);
    let autoIndex = 0;

    for (const para of paragraphs) {
      const lines = para.trim().split("\n");
      if (lines.length < 2) continue;

      let name: string;
      let content: string;

      const firstLine = lines[0]?.trim() ?? "";
      const headerMatch = firstLine.match(/^##\s+(.+)$/);
      if (headerMatch) {
        name = headerMatch[1]?.trim() ?? "data";
        content = lines.slice(1).join("\n");
      } else {
        name = autoIndex === 0 ? "data" : `data_${autoIndex}`;
        content = para;
      }

      sections.push([name, content]);
      autoIndex++;
    }

    return sections;
  }

  private parseTable(content: string): Table | null {
    const lines = content
      .trim()
      .split("\n")
      .filter((l) => l.trim());
    if (lines.length < 3) return null;

    // 找到表头行和分隔线
    let headerIndex = -1;
    let separatorIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i]?.trim() ?? "";
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        if (headerIndex === -1) {
          headerIndex = i;
        } else if (separatorIndex === -1 && /^\|[\s\-:|]+\|$/.test(trimmed)) {
          separatorIndex = i;
          break;
        }
      }
    }

    if (headerIndex === -1 || separatorIndex === -1) return null;

    // 解析表头
    const headerLine = lines[headerIndex] ?? "";
    const headers = this.parseRow(headerLine);
    const keyColumn = headers[0] ?? "";

    // 解析数据行
    const rows: Record<string, string>[] = [];
    const lookup: Record<string, Record<string, string>> = {};

    for (let i = separatorIndex + 1; i < lines.length; i++) {
      const trimmed = lines[i]?.trim() ?? "";
      if (!trimmed.startsWith("|")) break;

      const values = this.parseRow(trimmed);
      const row: Record<string, string> = {};

      for (let j = 0; j < headers.length; j++) {
        const header = headers[j] ?? "";
        row[header] = values[j] ?? "";
      }

      rows.push(row);
      const key = row[keyColumn];
      if (key) {
        lookup[key] = row;
      }
    }

    return { headers, rows, lookup };
  }

  private parseRow(line: string): string[] {
    return line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());
  }
}
