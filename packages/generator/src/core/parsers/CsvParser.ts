import Papa from "papaparse";
import type { Table, UnifiedGameData } from "../types";
import type { Parser } from "./types";

/**
 * CSV 解析器
 *
 * 支持标准 CSV 格式，首行为表头，首列为 key。
 * 多个表格通过空行分隔（或多个文件）。
 */
export class CsvParser implements Parser {
  detect(input: string): boolean {
    const lines = input.trim().split("\n");
    return lines.length >= 2 && (lines[0]?.match(/,/g) || []).length > 0;
  }

  parse(input: string): UnifiedGameData {
    const sections = this.splitSections(input);
    const tables: Record<string, Table> = {};

    for (const [name, content] of sections) {
      tables[name] = this.parseTable(content);
    }

    return { tables };
  }

  /**
   * 将 CSV 按空行分割成多个段落
   * 第一个段落使用默认表名 "data"
   */
  private splitSections(input: string): [string, string][] {
    const sections: [string, string][] = [];
    const parts = input.split(/\n\s*\n/);

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]?.trim() ?? "";
      if (!part) continue;

      // 检查是否有表名标记（第一行以 # 开头）
      const lines = part.split("\n");
      const firstLine = lines[0] ?? "";
      if (firstLine.trim().startsWith("#")) {
        const name = firstLine.trim().slice(1).trim();
        sections.push([name, lines.slice(1).join("\n")]);
      } else {
        // 默认表名
        const name = i === 0 ? "data" : `data_${i}`;
        sections.push([name, part]);
      }
    }

    return sections;
  }

  private parseTable(content: string): Table {
    const result = Papa.parse<Record<string, string>>(content, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim(),
    });

    if (result.errors.length > 0) {
      console.warn("CSV parse warnings:", result.errors);
    }

    const headers = result.meta.fields ?? [];
    const rows = result.data;
    const keyColumn = headers[0] ?? "";
    const lookup: Record<string, Record<string, string>> = {};

    for (const row of rows) {
      const key = row[keyColumn];
      if (key) {
        lookup[key] = row;
      }
    }

    return { headers, rows, lookup };
  }
}
