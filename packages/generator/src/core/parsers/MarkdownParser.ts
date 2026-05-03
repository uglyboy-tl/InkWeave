import type { Parser, Table, UnifiedGameData } from "../types";

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
   * 按 ## 标题分割文档
   */
  private splitByHeaders(input: string): [string, string][] {
    const sections: [string, string][] = [];
    const lines = input.split("\n");
    let currentName = "data";
    let currentLines: string[] = [];

    for (const line of lines) {
      const headerMatch = line.match(/^##\s+(.+)$/);
      if (headerMatch) {
        if (currentLines.length > 0) {
          sections.push([currentName, currentLines.join("\n")]);
        }
        currentName = headerMatch[1]?.trim() ?? "data";
        currentLines = [];
      } else {
        currentLines.push(line);
      }
    }

    if (currentLines.length > 0) {
      sections.push([currentName, currentLines.join("\n")]);
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

/**
 * 便捷函数：解析 Markdown 表格
 */
export function parseMarkdown(input: string): UnifiedGameData {
  return new MarkdownParser().parse(input);
}
