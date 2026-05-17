import { beforeEach, describe, expect, it } from "bun:test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { $ } from "bun";
import type { GeneratedFile, Table, UnifiedGameData } from "../core/types";
import { createReigns } from "../modes/reigns";
import { DEFAULT_STATS } from "../modes/reigns/config";

const COMPILE_SCRIPT = join(import.meta.dir, "../../../core/scripts/compile-ink.ts");

async function compileInkFiles(files: GeneratedFile[]): Promise<void> {
  const fileMap = new Map(files.map((f) => [f.path, f.content]));
  const entry = files.find((f) => f.path === "reigns/index.md");
  if (!entry) throw new Error("No entry file (expected reigns/index.md)");

  if (!entry) throw new Error("No entry file");

  function stripFrontmatter(content: string): string {
    return content.replace(/^---[\s\S]*?---\n*/, "");
  }

  function resolve(content: string): string {
    return content.replace(/^INCLUDE\s+(.+)$/gm, (_, raw: string) => {
      const name = raw.trim();
      const included = fileMap.get(name) || fileMap.get(`reigns/${name}`);
      if (!included) throw new Error(`Cannot find included file: ${name}`);
      return resolve(included);
    });
  }

  const merged = resolve(stripFrontmatter(entry.content));
  const tmpDir = "/tmp/inkweave-test";
  mkdirSync(tmpDir, { recursive: true });
  const tmpFile = join(tmpDir, "test-merged.ink");
  writeFileSync(tmpFile, merged, "utf-8");

  const result = await $`bun run ${COMPILE_SCRIPT} ${tmpFile}`.quiet();
  if (result.exitCode !== 0) {
    throw new Error(
      `Ink compilation failed (exit ${result.exitCode}):\n${result.stderr.toString()}`,
    );
  }
}

describe("ReignsGenerator", () => {
  let generator: ReturnType<typeof createReigns>;

  beforeEach(() => {
    generator = createReigns(DEFAULT_STATS);
  });

  const createCardsTable = (): Table => ({
    headers: ["name", "content", "left_option", "right_option", "left_event", "right_event"],
    rows: [
      {
        name: "start",
        content: "你登上王位，俯瞰你的王国。",
        left_option: "励精图治",
        right_option: "维持现状",
        left_event: "勤政",
        right_event: "守成",
      },
      {
        name: "农民",
        content: "一个农民来到你面前，抱怨收成不好。",
        left_option: "减税",
        right_option: "无视",
        left_event: "体恤民意",
        right_event: "漠视民生",
      },
    ],
    lookup: {
      start: {
        name: "start",
        content: "你登上王位，俯瞰你的王国。",
        left_option: "励精图治",
        right_option: "维持现状",
        left_event: "勤政",
        right_event: "守成",
      },
      农民: {
        name: "农民",
        content: "一个农民来到你面前，抱怨收成不好。",
        left_option: "减税",
        right_option: "无视",
        left_event: "体恤民意",
        right_event: "漠视民生",
      },
    },
  });

  const createEventsTable = (): Table => ({
    headers: ["name", "A", "B", "C", "D", "add_card", "remove_card", "next_card"],
    rows: [
      {
        name: "勤政",
        A: "+1",
        B: "+1",
        C: "0",
        D: "-1",
        add_card: "",
        remove_card: "",
        next_card: "",
      },
      {
        name: "守成",
        A: "0",
        B: "0",
        C: "0",
        D: "0",
        add_card: "",
        remove_card: "",
        next_card: "",
      },
      {
        name: "体恤民意",
        A: "+1",
        B: "+2",
        C: "0",
        D: "-1",
        add_card: "",
        remove_card: "",
        next_card: "",
      },
      {
        name: "漠视民生",
        A: "0",
        B: "-1",
        C: "0",
        D: "0",
        add_card: "",
        remove_card: "",
        next_card: "",
      },
      {
        name: "获得声望",
        A: "0",
        B: "0",
        C: "0",
        D: "0",
        add_card: "",
        remove_card: "",
        next_card: "",
      },
    ],
    lookup: {},
  });

  const createConditionsTable = (): Table => ({
    headers: ["name", "required_events", "excluded_events", "condition", "trigger_event"],
    rows: [
      {
        name: "声望积累_1",
        required_events: "体恤民意:2",
        excluded_events: "体恤民意:3",
        condition: "",
        trigger_event: "获得声望",
      },
    ],
    lookup: {
      声望积累_1: {
        name: "声望积累_1",
        required_events: "体恤民意:2",
        excluded_events: "体恤民意:3",
        condition: "",
        trigger_event: "获得声望",
      },
    },
  });

  const createStatsTable = (): Table => ({
    headers: ["stat", "dir", "text"],
    rows: [
      { stat: "A", dir: "-", text: "赐鸩酒，薨。" },
      { stat: "A", dir: "+", text: "暗中毒杀。" },
      { stat: "B", dir: "-", text: "罢官流放。" },
      { stat: "B", dir: "+", text: "秋后问斩。" },
      { stat: "C", dir: "-", text: "死于乱军。" },
      { stat: "C", dir: "+", text: "兵败身亡。" },
      { stat: "D", dir: "-", text: "遇刺身亡。" },
      { stat: "D", dir: "+", text: "玉石俱焚。" },
    ],
    lookup: {},
  });

  const createTestData = (): UnifiedGameData => ({
    tables: {
      cards: createCardsTable(),
      events: createEventsTable(),
      conditions: createConditionsTable(),
      stats: createStatsTable(),
    },
  });

  describe("metadata", () => {
    it("should have correct id", () => {
      expect(generator.id).toBe("reigns");
    });

    it("should have correct name", () => {
      expect(generator.name).toBe("王权系统");
    });

    it("should have required tables", () => {
      expect(generator.requiredTables).toEqual(["cards", "events", "conditions", "stats"]);
    });

    it("should have default stats config", () => {
      const schemas = generator.tableSchemas;
      expect(schemas.events).toBeDefined();
      const eventsCols = schemas.events?.columns.map((c) => c.name);
      expect(eventsCols).toContain("A");
      expect(eventsCols).toContain("B");
      expect(eventsCols).toContain("C");
      expect(eventsCols).toContain("D");
    });
  });

  describe("validate", () => {
    it("should pass valid data", () => {
      const data = createTestData();
      const result = generator.validate(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect missing tables", () => {
      const data: UnifiedGameData = { tables: {} };
      const result = generator.validate(data);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(4);
    });

    it("should detect missing card name", () => {
      const data = createTestData();
      const cards = data.tables.cards;
      if (cards?.rows[0]) {
        cards.rows[0].name = "";
      }
      const result = generator.validate(data);
      expect(result.valid).toBe(false);
    });

    it("should detect missing card content", () => {
      const data = createTestData();
      const cards = data.tables.cards;
      if (cards?.rows[0]) {
        cards.rows[0].content = "";
      }
      const result = generator.validate(data);
      expect(result.valid).toBe(false);
    });

    it("should detect missing left option", () => {
      const data = createTestData();
      const cards = data.tables.cards;
      if (cards?.rows[0]) {
        cards.rows[0].left_option = "";
      }
      const result = generator.validate(data);
      expect(result.valid).toBe(false);
    });

    it("should detect missing right option", () => {
      const data = createTestData();
      const cards = data.tables.cards;
      if (cards?.rows[0]) {
        cards.rows[0].right_option = "";
      }
      const result = generator.validate(data);
      expect(result.valid).toBe(false);
    });

    it("should detect missing event name", () => {
      const data = createTestData();
      const events = data.tables.events;
      if (events?.rows[0]) {
        events.rows[0].name = "";
      }
      const result = generator.validate(data);
      expect(result.valid).toBe(false);
    });
  });

  describe("generate", () => {
    it("should generate correct number of files", () => {
      const data = createTestData();
      const result = generator.generate(data);
      expect(result.files).toHaveLength(5);
    });

    it("should generate all required files", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const fileNames = result.files.map((f) => f.path);
      expect(fileNames).toContain("reigns/cards.ink");
      expect(fileNames).toContain("reigns/events.ink");
      expect(fileNames).toContain("reigns/conditions.ink");
      expect(fileNames).toContain("reigns/stats.ink");
      expect(fileNames).toContain("reigns/index.md");
    });

    it("should have correct entry file", () => {
      const data = createTestData();
      const result = generator.generate(data);
      expect(result.entry).toBe("reigns/index.md");
    });

    it("should generate cards.ink with card data and functions", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const cardsInk = result.files.find((f) => f.path === "reigns/cards.ink");
      expect(cardsInk).toBeDefined();
      if (!cardsInk) return;

      expect(cardsInk.content).toContain("LIST CARD_LIST =");
      expect(cardsInk.content).toContain("start");
      expect(cardsInk.content).toContain("农民");

      expect(cardsInk.content).toContain("== function get_content(card)");
      expect(cardsInk.content).toContain("== function get_left_option(card)");
      expect(cardsInk.content).toContain("== function get_right_option(card)");
      expect(cardsInk.content).toContain("== function left_event(card)");
      expect(cardsInk.content).toContain("== function right_event(card)");

      expect(cardsInk.content).toContain("你登上王位，俯瞰你的王国。");
      expect(cardsInk.content).toContain("减税");
      expect(cardsInk.content).toContain("无视");
    });

    it("should generate events.ink with event definitions and stat changes", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const eventsInk = result.files.find((f) => f.path === "reigns/events.ink");
      expect(eventsInk).toBeDefined();
      if (!eventsInk) return;

      expect(eventsInk.content).toContain("=== do_event(event_name)");
      expect(eventsInk.content).toContain("= 勤政_event");
      expect(eventsInk.content).toContain("= 守成_event");

      expect(eventsInk.content).toContain("~ A += 1");
      expect(eventsInk.content).toContain("~ B += 1");
      expect(eventsInk.content).toContain("~ D -= 1");
    });

    it("should generate conditions.ink with condition checks", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const condInk = result.files.find((f) => f.path === "reigns/conditions.ink");
      expect(condInk).toBeDefined();
      if (!condInk) return;

      expect(condInk.content).toContain("=== check_conditions(event_name)");
      expect(condInk.content).toContain("do_event.体恤民意_event >= 2");
      expect(condInk.content).toContain('-> do_event("获得声望") ->');
    });

    it("should generate stats.ink with variable declarations and game over checks", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const statsInk = result.files.find((f) => f.path === "reigns/stats.ink");
      expect(statsInk).toBeDefined();
      if (!statsInk) return;

      expect(statsInk.content).toContain("VAR A = 5");
      expect(statsInk.content).toContain("VAR B = 5");
      expect(statsInk.content).toContain("VAR C = 5");
      expect(statsInk.content).toContain("VAR D = 5");

      expect(statsInk.content).toContain("=== check_stats");
      expect(statsInk.content).toContain(">= 10");
      expect(statsInk.content).toContain("<= 0");
      expect(statsInk.content).toContain("赐鸩酒，薨。");
      expect(statsInk.content).toContain("罢官流放。");
    });

    it("should generate index.md with frontmatter, INCLUDE directives and game loop", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const indexFile = result.files.find((f) => f.path === "reigns/index.md");
      expect(indexFile).toBeDefined();
      if (!indexFile) return;

      expect(indexFile.content).toContain("---");
      expect(indexFile.content).toContain("layout: game");
      expect(indexFile.content).toContain("display: reigns");
      expect(indexFile.content).toContain("statusBar:");
      expect(indexFile.content).toContain("- key: A");
      expect(indexFile.content).toContain("label: 势力甲");

      expect(indexFile.content).toContain("INCLUDE cards.ink");
      expect(indexFile.content).toContain("INCLUDE events.ink");
      expect(indexFile.content).toContain("INCLUDE conditions.ink");
      expect(indexFile.content).toContain("INCLUDE stats.ink");

      expect(indexFile.content).toContain("== loop(card)");
      expect(indexFile.content).toContain("get_content(card)");
      expect(indexFile.content).toContain("get_left_option(card)");
      expect(indexFile.content).toContain("get_right_option(card)");
      expect(indexFile.content).toContain("== function get_next_card(card)");
    });

    it("should generate Ink that compiles successfully", async () => {
      const data = createTestData();
      const result = generator.generate(data);
      await compileInkFiles(result.files);
    });
  });

  describe("custom stats config", () => {
    const customStats = [
      { id: "W", name: "威望", initial: 3, min: 0, max: 8 },
      { id: "F", name: "财富", initial: 5, min: 0, max: 10 },
    ];

    it("should accept custom stat definitions", () => {
      const custom = createReigns(customStats);

      const schemas = custom.tableSchemas;
      expect(schemas.events).toBeDefined();
      const eventsCols = schemas.events?.columns.map((c: { name: string }) => c.name);
      expect(eventsCols).toContain("W");
      expect(eventsCols).toContain("F");
      expect(eventsCols).not.toContain("A");
    });

    it("should generate ink with custom stat names", () => {
      const custom = createReigns(customStats);

      const eventsTable: Table = {
        headers: ["name", "W", "F", "add_card", "remove_card", "next_card"],
        rows: [
          { name: "test_event", W: "+1", F: "-1", add_card: "", remove_card: "", next_card: "" },
        ],
        lookup: {},
      };

      const data: UnifiedGameData = {
        tables: {
          cards: createCardsTable(),
          events: eventsTable,
          conditions: createConditionsTable(),
          stats: createStatsTable(),
        },
      };

      const result = custom.generate(data);
      const eventsInk = result.files.find((f) => f.path === "reigns/events.ink");
      expect(eventsInk).toBeDefined();
      if (!eventsInk) return;

      expect(eventsInk.content).toContain("~ W += 1");
      expect(eventsInk.content).toContain("~ F -= 1");
      expect(eventsInk.content).not.toContain("圣眷");
    });
  });
});
