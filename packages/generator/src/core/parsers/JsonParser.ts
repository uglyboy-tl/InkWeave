import type { Table, UnifiedGameData } from "../types";
import type { Parser } from "./types";

/**
 * JSON 解析器
 *
 * 支持两种格式：
 * 1. 简单对象数组：[{ name: "a", hp: 100 }, ...]
 * 2. 多表结构：{ "roles": [...], "moves": [...] }
 */
export class JsonParser implements Parser {
  detect(input: string): boolean {
    const trimmed = input.trim();
    return trimmed.startsWith("{") || trimmed.startsWith("[");
  }

  parse(input: string): UnifiedGameData {
    const data = JSON.parse(input);

    // 如果是数组，包装成单表结构
    if (Array.isArray(data)) {
      return { tables: { data: this.arrayToTable(data) } };
    }

    // 如果是对象，处理每个属性
    if (typeof data === "object" && data !== null) {
      const tables: Record<string, Table> = {};
      const config: Record<string, unknown> = {};
      const meta: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(data)) {
        if (key === "_config") {
          Object.assign(config, value);
        } else if (key === "_meta") {
          Object.assign(meta, value);
        } else if (Array.isArray(value)) {
          tables[key] = this.arrayToTable(value);
        }
      }

      return { tables, config, meta };
    }

    throw new Error("Invalid JSON: expected object or array");
  }

  private arrayToTable(arr: unknown[]): Table {
    if (arr.length === 0) {
      return { headers: [], rows: [], lookup: {} };
    }

    // 从第一个对象提取 headers
    const first = arr[0];
    if (typeof first !== "object" || first === null) {
      throw new Error("Invalid JSON: array items must be objects");
    }

    const headers = Object.keys(first);
    const keyColumn = headers[0] ?? "";
    const rows: Record<string, string>[] = [];
    const lookup: Record<string, Record<string, string>> = {};

    for (const item of arr) {
      if (typeof item !== "object" || item === null) continue;

      const row: Record<string, string> = {};
      for (const header of headers) {
        const value = (item as Record<string, unknown>)[header];
        row[header] = value !== undefined ? String(value) : "";
      }

      rows.push(row);
      const key = row[keyColumn];
      if (key) {
        lookup[key] = row;
      }
    }

    return { headers, rows, lookup };
  }
}
