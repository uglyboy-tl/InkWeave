import type { Table } from "../../core";
import { defineGameType } from "../../core";
import { movesSchema, rolesSchema, typeChartSchema } from "./schema";

function transformRoles(table: Table): Record<string, Record<string, string | number>> {
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

function transformMoves(table: Table): Record<string, Record<string, string | number>> {
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

function transformTypeChart(table: Table): Record<string, Record<string, number>> {
  const result: Record<string, Record<string, number>> = {};
  for (const row of table.rows) {
    const attackType = row.attack ?? "";
    if (!attackType) continue;
    result[attackType] = {};
    for (const [key, value] of Object.entries(row)) {
      if (key !== "attack") {
        const entry = result[attackType];
        if (entry) entry[key] = Number(value) || 1;
      }
    }
  }
  return result;
}

function extractTypes(table: Table): string[] {
  const types = new Set<string>();
  for (const row of table.rows) {
    if (row.type1) types.add(row.type1);
    if (row.type2) types.add(row.type2);
  }
  return Array.from(types);
}

export const duel = defineGameType({
  id: "duel",
  name: "对战系统",
  description: "回合制对战系统，支持属性克制、伤害计算、技能系统",
  requiredTables: ["roles", "moves", "typeChart"],
  tableSchemas: { roles: rolesSchema, moves: movesSchema, typeChart: typeChartSchema },

  generate: {
    templates: ["index.md.hbs", "base.ink.hbs", "move.ink.hbs", "type.ink.hbs", "utils.ink.hbs"],

    transform(data) {
      const rolesTable = data.tables.roles;
      const movesTable = data.tables.moves;
      const typeChartTable = data.tables.typeChart;

      if (!rolesTable || !movesTable || !typeChartTable) {
        throw new Error("Missing required tables");
      }

      const roles = transformRoles(rolesTable);
      const moves = transformMoves(movesTable);
      const typeChart = transformTypeChart(typeChartTable);
      const types = extractTypes(rolesTable);

      return {
        roles,
        moves,
        typeChart,
        types,
        stats: ["HP", "Atk", "Def", "SpAtk", "SpDef", "Spd"],
        maxLevel: 100,
        roleFile: "roles.ink",
        moveFile: "moves.ink",
        typeFile: "type-chart.ink",
        utilsFile: "utils.ink",
      };
    },
  },
});
