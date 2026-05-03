import type { Parser, UnifiedGameData } from "../types";
import { CsvParser } from "./CsvParser";
import { JsonParser } from "./JsonParser";
import { MarkdownParser } from "./MarkdownParser";

export { CsvParser } from "./CsvParser";
export { JsonParser } from "./JsonParser";
export { MarkdownParser } from "./MarkdownParser";

const parsers: Parser[] = [new JsonParser(), new MarkdownParser(), new CsvParser()];
const formatMap = { csv: CsvParser, markdown: MarkdownParser, json: JsonParser } as const;

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

export const parseCsv = (input: string) => new CsvParser().parse(input);
export const parseJson = (input: string) => new JsonParser().parse(input);
export const parseMarkdown = (input: string) => new MarkdownParser().parse(input);
