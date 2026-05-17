import { beforeEach, describe, expect, it } from "bun:test";
import type { Table, UnifiedGameData } from "../core/types";
import { duel } from "../modes/duel";

describe("DuelGenerator", () => {
  let generator: typeof duel;

  beforeEach(() => {
    generator = duel;
  });

  const createRolesTable = (): Table => ({
    headers: ["name", "type1", "type2", "hp", "atk", "def", "spAtk", "spDef", "spd"],
    rows: [
      {
        name: "皮卡丘",
        type1: "Electric",
        type2: "",
        hp: "35",
        atk: "55",
        def: "40",
        spAtk: "50",
        spDef: "50",
        spd: "90",
      },
      {
        name: "喷火龙",
        type1: "Fire",
        type2: "Flying",
        hp: "78",
        atk: "84",
        def: "78",
        spAtk: "109",
        spDef: "85",
        spd: "100",
      },
      {
        name: "妙蛙草",
        type1: "Grass",
        type2: "Poison",
        hp: "60",
        atk: "62",
        def: "63",
        spAtk: "80",
        spDef: "80",
        spd: "60",
      },
    ],
    lookup: {
      皮卡丘: {
        name: "皮卡丘",
        type1: "Electric",
        type2: "",
        hp: "35",
        atk: "55",
        def: "40",
        spAtk: "50",
        spDef: "50",
        spd: "90",
      },
      喷火龙: {
        name: "喷火龙",
        type1: "Fire",
        type2: "Flying",
        hp: "78",
        atk: "84",
        def: "78",
        spAtk: "109",
        spDef: "85",
        spd: "100",
      },
      妙蛙草: {
        name: "妙蛙草",
        type1: "Grass",
        type2: "Poison",
        hp: "60",
        atk: "62",
        def: "63",
        spAtk: "80",
        spDef: "80",
        spd: "60",
      },
    },
  });

  const createMovesTable = (): Table => ({
    headers: ["name", "type", "power", "category"],
    rows: [
      { name: "十万伏特", type: "Electric", power: "90", category: "Special" },
      { name: "火焰喷射", type: "Fire", power: "90", category: "Special" },
      { name: "飞叶快刀", type: "Grass", power: "55", category: "Special" },
      { name: "撞击", type: "Normal", power: "40", category: "Physical" },
    ],
    lookup: {
      十万伏特: { name: "十万伏特", type: "Electric", power: "90", category: "Special" },
      火焰喷射: { name: "火焰喷射", type: "Fire", power: "90", category: "Special" },
      飞叶快刀: { name: "飞叶快刀", type: "Grass", power: "55", category: "Special" },
      撞击: { name: "撞击", type: "Normal", power: "40", category: "Physical" },
    },
  });

  const createTypeChartTable = (): Table => ({
    headers: ["attack", "Normal", "Fire", "Water", "Electric", "Grass", "Flying", "Poison"],
    rows: [
      {
        attack: "Normal",
        Normal: "1",
        Fire: "1",
        Water: "1",
        Electric: "1",
        Grass: "1",
        Flying: "1",
        Poison: "1",
      },
      {
        attack: "Fire",
        Normal: "1",
        Fire: "0.5",
        Water: "0.5",
        Electric: "1",
        Grass: "2",
        Flying: "1",
        Poison: "1",
      },
      {
        attack: "Water",
        Normal: "1",
        Fire: "2",
        Water: "0.5",
        Electric: "1",
        Grass: "0.5",
        Flying: "1",
        Poison: "1",
      },
      {
        attack: "Electric",
        Normal: "1",
        Fire: "1",
        Water: "2",
        Electric: "0.5",
        Grass: "0.5",
        Flying: "2",
        Poison: "1",
      },
      {
        attack: "Grass",
        Normal: "1",
        Fire: "0.5",
        Water: "2",
        Electric: "1",
        Grass: "0.5",
        Flying: "0.5",
        Poison: "0.5",
      },
    ],
    lookup: {
      Normal: {
        attack: "Normal",
        Normal: "1",
        Fire: "1",
        Water: "1",
        Electric: "1",
        Grass: "1",
        Flying: "1",
        Poison: "1",
      },
      Fire: {
        attack: "Fire",
        Normal: "1",
        Fire: "0.5",
        Water: "0.5",
        Electric: "1",
        Grass: "2",
        Flying: "1",
        Poison: "1",
      },
      Water: {
        attack: "Water",
        Normal: "1",
        Fire: "2",
        Water: "0.5",
        Electric: "1",
        Grass: "0.5",
        Flying: "1",
        Poison: "1",
      },
      Electric: {
        attack: "Electric",
        Normal: "1",
        Fire: "1",
        Water: "2",
        Electric: "0.5",
        Grass: "0.5",
        Flying: "2",
        Poison: "1",
      },
      Grass: {
        attack: "Grass",
        Normal: "1",
        Fire: "0.5",
        Water: "2",
        Electric: "1",
        Grass: "0.5",
        Flying: "0.5",
        Poison: "0.5",
      },
    },
  });

  const createTestData = (): UnifiedGameData => ({
    tables: {
      roles: createRolesTable(),
      moves: createMovesTable(),
      typeChart: createTypeChartTable(),
    },
  });

  describe("metadata", () => {
    it("should have correct id", () => {
      expect(generator.id).toBe("duel");
    });

    it("should have correct name", () => {
      expect(generator.name).toBe("对战系统");
    });

    it("should have required tables", () => {
      expect(generator.requiredTables).toEqual(["roles", "moves", "typeChart"]);
    });
  });

  describe("validate", () => {
    it("should validate correct data", () => {
      const data = createTestData();
      const result = generator.validate(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect missing roles table", () => {
      const data: UnifiedGameData = { tables: { moves: createMovesTable() } };
      const result = generator.validate(data);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.table === "roles")).toBe(true);
    });

    it("should detect missing moves table", () => {
      const data: UnifiedGameData = { tables: { roles: createRolesTable() } };
      const result = generator.validate(data);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.table === "moves")).toBe(true);
    });

    it("should detect missing typeChart table", () => {
      const data: UnifiedGameData = {
        tables: { roles: createRolesTable(), moves: createMovesTable() },
      };
      const result = generator.validate(data);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.table === "typeChart")).toBe(true);
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
      expect(fileNames).toContain("duel/base.ink");
      expect(fileNames).toContain("duel/move.ink");
      expect(fileNames).toContain("duel/type.ink");
      expect(fileNames).toContain("duel/utils.ink");
      expect(fileNames).toContain("duel/index.md");
    });

    it("should generate valid base.ink content", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const baseInk = result.files.find((f) => f.path === "duel/base.ink");
      expect(baseInk).toBeDefined();
      if (!baseInk) return;

      expect(baseInk.content).toContain("LIST HERO_NAME=");
      expect(baseInk.content).toContain("皮卡丘");
      expect(baseInk.content).toContain("喷火龙");
      expect(baseInk.content).toContain("妙蛙草");
      expect(baseInk.content).toContain("== function get_HP(name)");
      expect(baseInk.content).toContain("== function get_Atk(name)");
      expect(baseInk.content).toContain("== function get_Def(name)");
      expect(baseInk.content).toContain("== function get_SpAtk(name)");
      expect(baseInk.content).toContain("== function get_SpDef(name)");
      expect(baseInk.content).toContain("== function get_Spd(name)");
      expect(baseInk.content).toContain("== function get_Type1(name)");
      expect(baseInk.content).toContain("== function get_Type2(name)");
    });

    it("should generate valid move.ink content", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const moveInk = result.files.find((f) => f.path === "duel/move.ink");
      expect(moveInk).toBeDefined();
      if (!moveInk) return;

      expect(moveInk.content).toContain("LIST MOVE=");
      expect(moveInk.content).toContain("十万伏特");
      expect(moveInk.content).toContain("火焰喷射");
      expect(moveInk.content).toContain("飞叶快刀");
      expect(moveInk.content).toContain("撞击");
      expect(moveInk.content).toContain("== function get_move_power(_move)");
      expect(moveInk.content).toContain("== function get_move_type(_move)");
    });

    it("should generate valid type.ink content", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const typeInk = result.files.find((f) => f.path === "duel/type.ink");
      expect(typeInk).toBeDefined();
      if (!typeInk) return;

      expect(typeInk.content).toContain("LIST TYPE_LIST=");
      expect(typeInk.content).toContain("Normal");
      expect(typeInk.content).toContain("Fire");
      expect(typeInk.content).toContain("Water");
      expect(typeInk.content).toContain("Electric");
      expect(typeInk.content).toContain("Grass");
      expect(typeInk.content).toContain("== function type_chart(type1, type2)");
    });

    it("should generate valid utils.ink content", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const utilsInk = result.files.find((f) => f.path === "duel/utils.ink");
      expect(utilsInk).toBeDefined();
      if (!utilsInk) return;

      expect(utilsInk.content).toContain("CONST MAX_LEVEL = 100");
      expect(utilsInk.content).toContain("== function calculate_damage");
      expect(utilsInk.content).toContain("== function calculate_hp");
      expect(utilsInk.content).toContain("== function calculate_stat");
      expect(utilsInk.content).toContain("== function calculate_times");
    });

    it("should generate valid index.md with frontmatter and game logic", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const battleInk = result.files.find((f) => f.path === "duel/index.md");
      expect(battleInk).toBeDefined();
      if (!battleInk) return;

      expect(battleInk.content).toContain("---");
      expect(battleInk.content).toContain("layout: game");
      expect(battleInk.content).toContain("display: duel");
      expect(battleInk.content).toContain("INCLUDE base.ink");
      expect(battleInk.content).toContain("INCLUDE move.ink");
      expect(battleInk.content).toContain("INCLUDE type.ink");
      expect(battleInk.content).toContain("INCLUDE utils.ink");
      expect(battleInk.content).toContain("== function get_damage");
      expect(battleInk.content).toContain("== function get_stat");
      expect(battleInk.content).toContain("== function get_enemy_stat");
    });

    it("should include correct role stats", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const baseInk = result.files.find((f) => f.path === "duel/base.ink");
      expect(baseInk).toBeDefined();
      if (!baseInk) return;

      expect(baseInk.content).toContain("~ return 35");
      expect(baseInk.content).toContain("~ return 55");
      expect(baseInk.content).toContain("~ return 90");
      expect(baseInk.content).toContain("~ return 78");
      expect(baseInk.content).toContain("~ return 109");
    });

    it("should include correct move data", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const moveInk = result.files.find((f) => f.path === "duel/move.ink");
      expect(moveInk).toBeDefined();
      if (!moveInk) return;

      expect(moveInk.content).toContain("~ return 90");
      expect(moveInk.content).toContain("~ return 55");
      expect(moveInk.content).toContain("~ return 40");
    });

    it("should include type chart multipliers", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const typeInk = result.files.find((f) => f.path === "duel/type.ink");
      expect(typeInk).toBeDefined();
      if (!typeInk) return;

      expect(typeInk.content).toContain("~ times = 2");
      expect(typeInk.content).toContain("~ times = 0.5");
    });
  });
});
