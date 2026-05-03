import { readFileSync } from "node:fs";
import { join } from "node:path";
import { templateEngine } from "../../core/emitter/TemplateEngine";
import { registry } from "../../core/registry";
import type {
  GameType,
  GeneratedModule,
  Table,
  UnifiedGameData,
  ValidationResult,
} from "../../core/types";
import { movesSchema, rolesSchema, typeChartSchema } from "./schema";

function loadTemplate(name: string): string {
  return readFileSync(join(__dirname, "templates", name), "utf-8");
}

export class DuelGenerator implements GameType {
  readonly id = "duel";
  readonly name = "对战系统";
  readonly description = "回合制对战系统，支持属性克制、伤害计算、技能系统";
  readonly requiredTables = ["roles", "moves", "typeChart"];
  readonly tableSchemas = {
    roles: rolesSchema,
    moves: movesSchema,
    typeChart: typeChartSchema,
  };

  validate(data: UnifiedGameData): ValidationResult {
    const errors: Array<{ table: string; row?: number; column?: string; message: string }> = [];

    for (const tableName of this.requiredTables) {
      if (!data.tables[tableName]) {
        errors.push({ table: tableName, message: `Missing required table: ${tableName}` });
      }
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    const roles = data.tables.roles;
    if (roles) {
      for (let i = 0; i < roles.rows.length; i++) {
        const row = roles.rows[i];
        if (row) {
          if (!row.name) {
            errors.push({ table: "roles", row: i, message: "Missing name column" });
          }
          if (!row.type1) {
            errors.push({ table: "roles", row: i, message: "Missing type1 column" });
          }
          const hp = Number(row.hp);
          if (Number.isNaN(hp) || hp <= 0) {
            errors.push({ table: "roles", row: i, column: "hp", message: "Invalid HP value" });
          }
        }
      }
    }

    const moves = data.tables.moves;
    if (moves) {
      for (let i = 0; i < moves.rows.length; i++) {
        const row = moves.rows[i];
        if (row) {
          if (!row.name) {
            errors.push({ table: "moves", row: i, message: "Missing name column" });
          }
          const power = Number(row.power);
          if (Number.isNaN(power) || power < 0) {
            errors.push({
              table: "moves",
              row: i,
              column: "power",
              message: "Invalid power value",
            });
          }
          if (!["Physical", "Special"].includes(row.category ?? "")) {
            errors.push({
              table: "moves",
              row: i,
              column: "category",
              message: "Invalid category value",
            });
          }
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  generate(data: UnifiedGameData): GeneratedModule {
    const rolesTable = data.tables.roles;
    const movesTable = data.tables.moves;
    const typeChartTable = data.tables.typeChart;

    if (!rolesTable || !movesTable || !typeChartTable) {
      throw new Error("Missing required tables");
    }

    const roles = this.transformRoles(rolesTable);
    const moves = this.transformMoves(movesTable);
    const typeChart = this.transformTypeChart(typeChartTable);
    const types = this.extractTypes(rolesTable);

    const templateData = {
      roles,
      moves,
      typeChart,
      types,
      stats: ["HP", "Atk", "Def", "SpAtk", "SpDef", "Spd"],
      maxLevel: 100,
      roleFile: "duel/base.ink",
      moveFile: "duel/move.ink",
      typeFile: "duel/type.ink",
      utilsFile: "duel/utils.ink",
    };

    const files = [
      {
        path: "duel/base.ink",
        content: templateEngine.render(loadTemplate("roles.ink.hbs"), templateData),
      },
      {
        path: "duel/move.ink",
        content: templateEngine.render(loadTemplate("moves.ink.hbs"), templateData),
      },
      {
        path: "duel/type.ink",
        content: templateEngine.render(loadTemplate("type-chart.ink.hbs"), templateData),
      },
      {
        path: "duel/utils.ink",
        content: templateEngine.render(loadTemplate("utils.ink.hbs"), templateData),
      },
      {
        path: "duel/battle.ink",
        content: templateEngine.render(loadTemplate("battle.ink.hbs"), templateData),
      },
    ];

    return { files, entry: "index.ink" };
  }

  private transformRoles(table: Table): Record<string, Record<string, string | number>> {
    const result: Record<string, Record<string, string | number>> = {};
    for (const row of table.rows) {
      const name = row.name ?? "";
      if (!name) continue;
      result[name] = {
        type1: row.type1 ?? "Normal",
        type2: row.type2 ?? "",
        hp: Number(row.hp) || 100,
        atk: Number(row.atk) || 50,
        def: Number(row.def) || 50,
        spAtk: Number(row.spAtk) || 50,
        spDef: Number(row.spDef) || 50,
        spd: Number(row.spd) || 50,
      };
    }
    return result;
  }

  private transformMoves(table: Table): Record<string, Record<string, string | number>> {
    const result: Record<string, Record<string, string | number>> = {};
    for (const row of table.rows) {
      const name = row.name ?? "";
      if (!name) continue;
      result[name] = {
        type: row.type ?? "Normal",
        power: Number(row.power) || 0,
        category: row.category ?? "Physical",
      };
    }
    return result;
  }

  private transformTypeChart(table: Table): Record<string, Record<string, number>> {
    const result: Record<string, Record<string, number>> = {};
    for (const row of table.rows) {
      const attackType = row.attack ?? "";
      if (!attackType) continue;
      result[attackType] = {};
      for (const [key, value] of Object.entries(row)) {
        if (key !== "attack") {
          const entry = result[attackType];
          if (entry) {
            entry[key] = Number(value) || 1;
          }
        }
      }
    }
    return result;
  }

  private extractTypes(table: Table): string[] {
    const types = new Set<string>();
    for (const row of table.rows) {
      if (row.type1) types.add(row.type1);
      if (row.type2) types.add(row.type2);
    }
    return Array.from(types);
  }
}

registry.register(new DuelGenerator());
