import { beforeEach, describe, expect, it } from "bun:test";
import type { Table, UnifiedGameData } from "../core/types";
import { ReignsGenerator } from "../games/reigns";

describe("ReignsGenerator", () => {
  let generator: ReignsGenerator;

  beforeEach(() => {
    generator = new ReignsGenerator();
  });

  const createCardsTable = (): Table => ({
    headers: [
      "name",
      "Content",
      "Left",
      "Right",
      "LC",
      "LP",
      "LA",
      "LM",
      "LN",
      "LR",
      "RC",
      "RP",
      "RA",
      "RM",
      "RN",
      "RR",
    ],
    rows: [
      {
        name: "农民",
        Content: "一个农民来到你面前，抱怨收成不好。",
        Left: "减税",
        Right: "无视",
        LC: "",
        LP: "+2",
        LA: "",
        LM: "-1",
        LN: "",
        LR: "",
        RC: "",
        RP: "-1",
        RA: "",
        RM: "",
        RN: "",
        RR: "",
      },
      {
        name: "将军",
        Content: "将军请求增加军费。",
        Left: "批准",
        Right: "拒绝",
        LC: "",
        LP: "",
        LA: "+2",
        LM: "-2",
        LN: "",
        LR: "",
        RC: "",
        RP: "",
        RA: "-1",
        RM: "+1",
        RN: "",
        RR: "",
      },
      {
        name: "主教",
        Content: "主教要求建造新的教堂。",
        Left: "同意",
        Right: "反对",
        LC: "+2",
        LP: "+1",
        LA: "",
        LM: "-2",
        LN: "",
        LR: "",
        RC: "-1",
        RP: "",
        RA: "",
        RM: "+1",
        RN: "",
        RR: "",
      },
      {
        name: "商人",
        Content: "商人提议进行贸易。",
        Left: "接受",
        Right: "拒绝",
        LC: "",
        LP: "",
        LA: "",
        LM: "+2",
        LN: "",
        LR: "",
        RC: "",
        RP: "-1",
        RA: "",
        RM: "-1",
        RN: "",
        RR: "",
      },
    ],
    lookup: {
      农民: {
        name: "农民",
        Content: "一个农民来到你面前，抱怨收成不好。",
        Left: "减税",
        Right: "无视",
        LC: "",
        LP: "+2",
        LA: "",
        LM: "-1",
        LN: "",
        LR: "",
        RC: "",
        RP: "-1",
        RA: "",
        RM: "",
        RN: "",
        RR: "",
      },
      将军: {
        name: "将军",
        Content: "将军请求增加军费。",
        Left: "批准",
        Right: "拒绝",
        LC: "",
        LP: "",
        LA: "+2",
        LM: "-2",
        LN: "",
        LR: "",
        RC: "",
        RP: "",
        RA: "-1",
        RM: "+1",
        RN: "",
        RR: "",
      },
      主教: {
        name: "主教",
        Content: "主教要求建造新的教堂。",
        Left: "同意",
        Right: "反对",
        LC: "+2",
        LP: "+1",
        LA: "",
        LM: "-2",
        LN: "",
        LR: "",
        RC: "-1",
        RP: "",
        RA: "",
        RM: "+1",
        RN: "",
        RR: "",
      },
      商人: {
        name: "商人",
        Content: "商人提议进行贸易。",
        Left: "接受",
        Right: "拒绝",
        LC: "",
        LP: "",
        LA: "",
        LM: "+2",
        LN: "",
        LR: "",
        RC: "",
        RP: "-1",
        RA: "",
        RM: "-1",
        RN: "",
        RR: "",
      },
    },
  });

  const createConfigTable = (): Table => ({
    headers: ["key", "value"],
    rows: [
      { key: "initialChurch", value: "5" },
      { key: "initialPeople", value: "5" },
      { key: "initialArmy", value: "5" },
      { key: "initialMoney", value: "5" },
      { key: "maxAttribute", value: "9" },
    ],
    lookup: {
      initialChurch: { key: "initialChurch", value: "5" },
      initialPeople: { key: "initialPeople", value: "5" },
      initialArmy: { key: "initialArmy", value: "5" },
      initialMoney: { key: "initialMoney", value: "5" },
      maxAttribute: { key: "maxAttribute", value: "9" },
    },
  });

  const createTestData = (): UnifiedGameData => ({
    tables: {
      cards: createCardsTable(),
      config: createConfigTable(),
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
      expect(generator.requiredTables).toEqual(["cards"]);
    });
  });

  describe("validate", () => {
    it("should validate correct data", () => {
      const data = createTestData();
      const result = generator.validate(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect missing cards table", () => {
      const data: UnifiedGameData = { tables: {} };
      const result = generator.validate(data);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.table === "cards")).toBe(true);
    });

    it("should detect missing card name", () => {
      const data = createTestData();
      const cards = data.tables.cards;
      if (cards?.rows[0]) {
        cards.rows[0].name = "";
      }
      const result = generator.validate(data);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.column === "name")).toBe(true);
    });

    it("should detect missing card content", () => {
      const data = createTestData();
      const cards = data.tables.cards;
      if (cards?.rows[0]) {
        cards.rows[0].Content = "";
      }
      const result = generator.validate(data);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.column === "Content")).toBe(true);
    });

    it("should detect missing left option", () => {
      const data = createTestData();
      const cards = data.tables.cards;
      if (cards?.rows[0]) {
        cards.rows[0].Left = "";
      }
      const result = generator.validate(data);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.column === "Left")).toBe(true);
    });

    it("should detect missing right option", () => {
      const data = createTestData();
      const cards = data.tables.cards;
      if (cards?.rows[0]) {
        cards.rows[0].Right = "";
      }
      const result = generator.validate(data);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.column === "Right")).toBe(true);
    });

    it("should validate effect format", () => {
      const data = createTestData();
      const cards = data.tables.cards;
      if (cards?.rows[0]) {
        cards.rows[0].LP = "abc";
      }
      const result = generator.validate(data);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.column === "LP")).toBe(true);
    });

    it("should accept valid effect formats", () => {
      const data = createTestData();
      const cards = data.tables.cards;
      if (cards?.rows[0]) {
        cards.rows[0].LP = "+2";
        cards.rows[0].LM = "-1";
        cards.rows[0].LA = "3";
      }
      const result = generator.validate(data);
      expect(result.valid).toBe(true);
    });
  });

  describe("generate", () => {
    it("should generate correct number of files", () => {
      const data = createTestData();
      const result = generator.generate(data);
      expect(result.files).toHaveLength(3);
    });

    it("should generate all required files", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const fileNames = result.files.map((f) => f.path);
      expect(fileNames).toContain("reigns/cards.ink");
      expect(fileNames).toContain("reigns/utils.ink");
      expect(fileNames).toContain("reigns/game.ink");
    });

    it("should generate valid cards.ink content", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const cardsInk = result.files.find((f) => f.path === "reigns/cards.ink");
      expect(cardsInk).toBeDefined();
      if (!cardsInk) return;

      expect(cardsInk.content).toContain("LIST CARD_LIST=");
      expect(cardsInk.content).toContain("农民");
      expect(cardsInk.content).toContain("将军");
      expect(cardsInk.content).toContain("主教");
      expect(cardsInk.content).toContain("商人");
      expect(cardsInk.content).toContain("== function get_content(name)");
      expect(cardsInk.content).toContain("== function get_left_option(name)");
      expect(cardsInk.content).toContain("== function get_right_option(name)");
      expect(cardsInk.content).toContain("== function process_left_option(name)");
      expect(cardsInk.content).toContain("== function process_right_option(name)");
    });

    it("should generate valid utils.ink content", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const utilsInk = result.files.find((f) => f.path === "reigns/utils.ink");
      expect(utilsInk).toBeDefined();
      if (!utilsInk) return;

      expect(utilsInk.content).toContain("VAR Church = 5");
      expect(utilsInk.content).toContain("VAR People = 5");
      expect(utilsInk.content).toContain("VAR Army = 5");
      expect(utilsInk.content).toContain("VAR Money = 5");
      expect(utilsInk.content).toContain("== function next_card(card)");
      expect(utilsInk.content).toContain("== function check_game_over()");
    });

    it("should generate valid game.ink content", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const gameInk = result.files.find((f) => f.path === "reigns/game.ink");
      expect(gameInk).toBeDefined();
      if (!gameInk) return;

      expect(gameInk.content).toContain("INCLUDE reigns/cards.ink");
      expect(gameInk.content).toContain("INCLUDE reigns/utils.ink");
      expect(gameInk.content).toContain("== loop(card)");
      expect(gameInk.content).toContain("get_content(card)");
      expect(gameInk.content).toContain("get_left_option(card)");
      expect(gameInk.content).toContain("get_right_option(card)");
      expect(gameInk.content).toContain("process_left_option(card)");
      expect(gameInk.content).toContain("process_right_option(card)");
    });

    it("should include card content text", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const cardsInk = result.files.find((f) => f.path === "reigns/cards.ink");
      expect(cardsInk).toBeDefined();
      if (!cardsInk) return;

      expect(cardsInk.content).toContain("一个农民来到你面前，抱怨收成不好。");
      expect(cardsInk.content).toContain("将军请求增加军费。");
      expect(cardsInk.content).toContain("主教要求建造新的教堂。");
      expect(cardsInk.content).toContain("商人提议进行贸易。");
    });

    it("should include option text", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const cardsInk = result.files.find((f) => f.path === "reigns/cards.ink");
      expect(cardsInk).toBeDefined();
      if (!cardsInk) return;

      expect(cardsInk.content).toContain("减税");
      expect(cardsInk.content).toContain("无视");
      expect(cardsInk.content).toContain("批准");
      expect(cardsInk.content).toContain("拒绝");
    });

    it("should include effect calculations", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const cardsInk = result.files.find((f) => f.path === "reigns/cards.ink");
      expect(cardsInk).toBeDefined();
      if (!cardsInk) return;

      expect(cardsInk.content).toContain("People += 2");
      expect(cardsInk.content).toContain("Money -= 1");
      expect(cardsInk.content).toContain("People -= 1");
    });

    it("should use custom config when provided", () => {
      const data = createTestData();
      data.tables.config = {
        headers: ["key", "value"],
        rows: [
          { key: "initialChurch", value: "3" },
          { key: "initialPeople", value: "7" },
          { key: "initialArmy", value: "4" },
          { key: "initialMoney", value: "6" },
        ],
        lookup: {},
      };

      const result = generator.generate(data);
      const utilsInk = result.files.find((f) => f.path === "reigns/utils.ink");
      expect(utilsInk).toBeDefined();
      if (!utilsInk) return;

      expect(utilsInk.content).toContain("VAR Church = 3");
      expect(utilsInk.content).toContain("VAR People = 7");
      expect(utilsInk.content).toContain("VAR Army = 4");
      expect(utilsInk.content).toContain("VAR Money = 6");
    });

    it("should include game over conditions", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const utilsInk = result.files.find((f) => f.path === "reigns/utils.ink");
      expect(utilsInk).toBeDefined();
      if (!utilsInk) return;

      expect(utilsInk.content).toContain("信仰过低");
      expect(utilsInk.content).toContain("民众造反");
      expect(utilsInk.content).toContain("敌国入侵");
      expect(utilsInk.content).toContain("资本家夺权");
      expect(utilsInk.content).toContain("教会夺权");
      expect(utilsInk.content).toContain("遭受神罚");
      expect(utilsInk.content).toContain("军队暴乱");
      expect(utilsInk.content).toContain("财富引发觊觎");
    });
  });
});
