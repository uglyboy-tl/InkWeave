import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import type { Table, UnifiedGameData } from "../types";
import { CsvParser } from "./CsvParser";
import { JsonParser } from "./JsonParser";
import { MarkdownParser } from "./MarkdownParser";
import type { Parser } from "./types";

export { CsvParser } from "./CsvParser";
export { JsonParser } from "./JsonParser";
export { MarkdownParser } from "./MarkdownParser";
export type { Parser } from "./types";

const parsers: Parser[] = [new JsonParser(), new MarkdownParser(), new CsvParser()];
const formatMap = { csv: CsvParser, markdown: MarkdownParser, json: JsonParser } as const;
const SUPPORTED_EXT = [".md", ".csv", ".json"];

function mergeEntry(tables: Record<string, Table>, data: UnifiedGameData, filename: string): void {
  for (const [key, table] of Object.entries(data.tables)) {
    tables[key === "data" ? filename.replace(/\.[^.]+$/, "") : key] = table;
  }
}

export function loadInput(input: string | string[]): UnifiedGameData {
  const tables: Record<string, Table> = {};
  const paths = Array.isArray(input) ? input : [input];

  for (const p of paths) {
    const stat = statSync(p);
    if (stat.isDirectory()) {
      const files = readdirSync(p)
        .filter((f) => SUPPORTED_EXT.includes(extname(f)))
        .sort();
      for (const f of files) mergeEntry(tables, autoParse(readFileSync(join(p, f), "utf-8")), f);
    } else if (stat.isFile()) {
      mergeEntry(tables, autoParse(readFileSync(p, "utf-8")), p);
    }
  }

  return { tables };
}

export function autoParse(input: string): UnifiedGameData {
  for (const parser of parsers) {
    if (parser.detect(input)) return parser.parse(input);
  }
  return new CsvParser().parse(input);
}

export function parse(input: string, format: keyof typeof formatMap): UnifiedGameData {
  const Parser = formatMap[format];
  if (!Parser) throw new Error(`Unknown format: ${format}`);
  return new Parser().parse(input);
}
