import {
  defineGameType,
  RedundancyRule,
  ReferenceRule,
  RequiredValuesRule,
  UniquenessRule,
  VALUE_PARSERS,
} from "../../core";
import type { StatDef } from "./config";
import { DEFAULT_CONFIG } from "./config";
import { cardsSchema, conditionsSchema, createEventsSchema, statsSchema } from "./schema";

function processEvents(
  rows: Record<string, string>[],
  stats: StatDef[],
): Record<string, unknown>[] {
  return rows.map((row) => ({
    ...row,
    _statChanges: stats
      .map((s) => ({ id: s.id, value: row[s.id] || "0" }))
      .filter((sc) => sc.value !== "0" && sc.value !== ""),
  }));
}

function processEndings(
  rows: Record<string, string>[],
  stats: StatDef[],
): Record<string, unknown>[] {
  return rows.map((row) => {
    const statDef = stats.find((s) => s.id === row.stat);
    return { ...row, _statName: statDef?.name ?? row.stat };
  });
}

function processConditions(
  rows: Record<string, string>[],
  stats: StatDef[],
): {
  eventConditions: Record<string, string>[];
  statConditions: Record<string, string>[];
} {
  const eventConditions: Record<string, string>[] = [];
  const statConditions: Record<string, string>[] = [];

  for (const row of rows) {
    const required = parseEventThresholds(row.required_events ?? "");
    const excluded = parseEventThresholds(row.excluded_events ?? "");
    const condExpr = (row.condition ?? "").trim();

    if (required.length > 0) {
      const primaryEvent = required[0]?.name ?? "";
      const parts: string[] = [];
      for (const evt of required) parts.push(`do_event.${evt.name}_event >= ${evt.threshold}`);
      for (const evt of excluded) parts.push(`do_event.${evt.name}_event < ${evt.threshold}`);
      eventConditions.push({
        ...row,
        _primaryEvent: primaryEvent,
        _conditionExpr: parts.length > 0 ? `${parts.join(" && ")}:` : "",
      });
    }

    if (condExpr && /[><=]/.test(condExpr)) {
      let parsed = condExpr;
      for (const s of stats) {
        parsed = parsed.replace(new RegExp(`\\b${s.id}\\b`, "g"), s.name);
      }
      parsed = parsed.replace(/\s*&\s*/g, " && ").replace(/\s*\|\s*/g, " || ");
      if (parsed) statConditions.push({ ...row, _conditionStatExpr: `${parsed}:` });
    }
  }

  return { eventConditions, statConditions };
}

function parseEventThresholds(value: string): Array<{ name: string; threshold: number }> {
  if (!value) return [];
  return value
    .split(/[,，]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((item) => {
      const parts = item.split(":");
      return { name: parts[0]?.trim() ?? "", threshold: parseInt(parts[1]?.trim() ?? "1", 10) };
    });
}

export function createReigns(stats: StatDef[]) {
  const eventsSchema = createEventsSchema(stats);

  return defineGameType({
    id: "reigns",
    name: "王权系统",
    description: "卡牌驱动的左右选择游戏，管理多个属性",
    requiredTables: ["cards", "events", "conditions", "stats"],
    tableSchemas: {
      cards: cardsSchema,
      events: eventsSchema,
      conditions: conditionsSchema,
      stats: statsSchema,
    },

    validate: [
      new RequiredValuesRule("cards", [
        "name",
        "content",
        "left_option",
        "right_option",
        "left_event",
        "right_event",
      ]),
      new UniquenessRule(["cards"]),
      new UniquenessRule(["events"]),
      new UniquenessRule(["conditions"]),
      new ReferenceRule([
        { from: "cards", col: "left_event", to: "events" },
        { from: "cards", col: "right_event", to: "events" },
        {
          from: "conditions",
          col: "required_events",
          to: "events",
          extract: VALUE_PARSERS.beforeColon,
        },
        {
          from: "conditions",
          col: "excluded_events",
          to: "events",
          extract: VALUE_PARSERS.beforeColon,
        },
        { from: "conditions", col: "trigger_event", to: "events" },
        { from: "events", col: "add_card", to: "cards", extract: VALUE_PARSERS.comma },
        { from: "events", col: "remove_card", to: "cards", extract: VALUE_PARSERS.comma },
        { from: "events", col: "next_card", to: "cards" },
      ]),
      new RedundancyRule("cards", [
        { table: "events", col: "add_card", extract: VALUE_PARSERS.comma },
        { table: "events", col: "next_card" },
      ]),
      new RedundancyRule("events", [
        { table: "cards", col: "left_event" },
        { table: "cards", col: "right_event" },
        { table: "conditions", col: "required_events", extract: VALUE_PARSERS.beforeColon },
        { table: "conditions", col: "excluded_events", extract: VALUE_PARSERS.beforeColon },
        { table: "conditions", col: "trigger_event" },
      ]),
    ],

    generate: {
      templates: [
        "index.md.hbs",
        "cards.ink.hbs",
        "events.ink.hbs",
        "conditions.ink.hbs",
        "stats.ink.hbs",
      ],

      transform(data) {
        const cards = data.tables.cards?.rows ?? [];
        const events = processEvents(data.tables.events?.rows ?? [], stats);
        const conditions = processConditions(data.tables.conditions?.rows ?? [], stats);
        const endings = processEndings(data.tables.stats?.rows ?? [], stats);
        const allMax = Math.max(...stats.map((s) => s.max ?? 10));
        const allMin = Math.min(...stats.map((s) => s.min ?? 0));

        return {
          stats,
          cards,
          events,
          eventConditions: conditions.eventConditions,
          statConditions: conditions.statConditions,
          endings,
          maxThreshold: allMax,
          minThreshold: allMin,
        };
      },

      helpers: {
        parseStatEffect(value: unknown) {
          const s = String(value ?? "");
          if (!s || s === "0") return "";
          const num = parseInt(s.trim(), 10);
          if (Number.isNaN(num) || num === 0) return "";
          return num > 0 ? `+= ${num}` : `-= ${Math.abs(num)}`;
        },
        replaceCommas(text: unknown) {
          const s = String(text ?? "");
          return s.replace(/，/g, ", ");
        },
        splitLines(text: unknown) {
          const s = String(text ?? "");
          if (!s) return [""];
          return s.replace(/\\n/g, "\n").split("\n");
        },
        startsWith(text: unknown, prefix: unknown) {
          return String(text ?? "").startsWith(String(prefix ?? ""));
        },
        formatClassLine(text: unknown) {
          const s = String(text ?? "");
          const match = s.match(/^#class:\s*(\S+)/);
          return match ? `#class: ${match[1]}` : "";
        },
      },
    },
  });
}

export const reigns = createReigns(DEFAULT_CONFIG.stats);
