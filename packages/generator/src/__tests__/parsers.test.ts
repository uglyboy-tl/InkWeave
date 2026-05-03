import { describe, expect, it } from "bun:test";
import { autoParse, CsvParser, JsonParser, MarkdownParser } from "../core/parsers";

describe("Parsers", () => {
  describe("CsvParser", () => {
    const parser = new CsvParser();

    it("should detect CSV format", () => {
      const csv = "name,hp,atk\nhero,100,50";
      expect(parser.detect(csv)).toBe(true);
    });

    it("should parse simple CSV", () => {
      const csv = `name,type1,hp,atk,def
皮卡丘,Electric,35,55,40
喷火龙,Fire,78,84,78`;

      const result = parser.parse(csv);
      const table = result.tables.data;

      expect(table).toBeDefined();
      if (!table) return;

      expect(table.headers).toEqual(["name", "type1", "hp", "atk", "def"]);
      expect(table.rows).toHaveLength(2);
      expect(table.lookup.皮卡丘).toEqual({
        name: "皮卡丘",
        type1: "Electric",
        hp: "35",
        atk: "55",
        def: "40",
      });
    });

    it("should parse multiple tables separated by empty lines", () => {
      const csv = `# roles
name,hp
hero,100

# moves
name,power
slash,50`;

      const result = parser.parse(csv);
      const roles = result.tables.roles;
      const moves = result.tables.moves;

      expect(roles).toBeDefined();
      expect(moves).toBeDefined();
      expect(roles?.rows).toHaveLength(1);
      expect(moves?.rows).toHaveLength(1);
    });
  });

  describe("MarkdownParser", () => {
    const parser = new MarkdownParser();

    it("should detect Markdown format", () => {
      const md = `| name | hp |
|------|-----|
| hero | 100 |`;
      expect(parser.detect(md)).toBe(true);
    });

    it("should parse Markdown tables", () => {
      const md = `## Role
| name | type1 | hp |
|------|-------|-----|
| 皮卡丘 | Electric | 35 |
| 喷火龙 | Fire | 78 |

## Move
| name | power |
|------|-------|
| 十万伏特 | 90 |`;

      const result = parser.parse(md);
      const role = result.tables.Role;
      const move = result.tables.Move;

      expect(role).toBeDefined();
      expect(move).toBeDefined();
      expect(role?.rows).toHaveLength(2);
      expect(move?.rows).toHaveLength(1);
      expect(role?.lookup.皮卡丘?.hp).toBe("35");
    });
  });

  describe("JsonParser", () => {
    const parser = new JsonParser();

    it("should detect JSON format", () => {
      const json = '{"roles": []}';
      expect(parser.detect(json)).toBe(true);
    });

    it("should parse JSON array", () => {
      const json = JSON.stringify([
        { name: "皮卡丘", hp: 35 },
        { name: "喷火龙", hp: 78 },
      ]);

      const result = parser.parse(json);
      const table = result.tables.data;

      expect(table).toBeDefined();
      expect(table?.rows).toHaveLength(2);
    });

    it("should parse JSON object with multiple tables", () => {
      const json = JSON.stringify({
        roles: [{ name: "皮卡丘", hp: 35 }],
        moves: [{ name: "十万伏特", power: 90 }],
      });

      const result = parser.parse(json);
      const roles = result.tables.roles;
      const moves = result.tables.moves;

      expect(roles).toBeDefined();
      expect(moves).toBeDefined();
    });
  });

  describe("autoParse", () => {
    it("should auto-detect CSV", () => {
      const csv = "name,hp\nhero,100";
      const result = autoParse(csv);
      expect(result.tables.data).toBeDefined();
    });

    it("should auto-detect Markdown", () => {
      const md = `| name | hp |
|------|-----|
| hero | 100 |`;
      const result = autoParse(md);
      expect(result.tables.data).toBeDefined();
    });

    it("should auto-detect JSON", () => {
      const json = JSON.stringify([{ name: "hero", hp: 100 }]);
      const result = autoParse(json);
      expect(result.tables.data).toBeDefined();
    });
  });
});
