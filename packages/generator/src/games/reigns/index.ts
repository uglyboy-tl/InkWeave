import { readFileSync } from "node:fs";
import { join } from "node:path";
import Handlebars from "handlebars";
import { registry } from "../../core/registry";
import type {
  GameType,
  GeneratedModule,
  Table,
  UnifiedGameData,
  ValidationResult,
} from "../../core/types";
import { cardsSchema, configSchema } from "./schema";

// 读取模板文件
function loadTemplate(name: string): string {
  return readFileSync(join(__dirname, "templates", name), "utf-8");
}

// 默认配置
const DEFAULT_CONFIG = {
  initialChurch: 5,
  initialPeople: 5,
  initialArmy: 5,
  initialMoney: 5,
  maxAttribute: 9,
};

/**
 * 王权系统游戏类型
 *
 * 卡牌驱动的左右选择游戏，管理多个属性（教会、民众、军队、金钱）。
 * 每个卡牌有左右两个选项，选择后会影响属性并可能添加/移除卡牌。
 */
export class ReignsGenerator implements GameType {
  readonly id = "reigns";
  readonly name = "王权系统";
  readonly description = "卡牌驱动的左右选择游戏，管理多个属性";
  readonly requiredTables = ["cards"];
  readonly tableSchemas = {
    cards: cardsSchema,
    config: configSchema,
  };

  private handlebars: typeof Handlebars;

  constructor() {
    this.handlebars = Handlebars.create();
    this.registerHelpers();
  }

  validate(data: UnifiedGameData): ValidationResult {
    const errors: Array<{ table: string; row?: number; column?: string; message: string }> = [];

    // 检查必需的表
    if (!data.tables.cards) {
      errors.push({
        table: "cards",
        message: "Missing required table: cards",
      });
      return { valid: false, errors };
    }

    const cards = data.tables.cards;

    // 验证每张卡牌
    for (let i = 0; i < cards.rows.length; i++) {
      const row = cards.rows[i];
      if (!row) continue;

      if (!row.name) {
        errors.push({ table: "cards", row: i, column: "name", message: "Missing card name" });
      }
      if (!row.Content) {
        errors.push({ table: "cards", row: i, column: "Content", message: "Missing card content" });
      }
      if (!row.Left) {
        errors.push({
          table: "cards",
          row: i,
          column: "Left",
          message: "Missing left option text",
        });
      }
      if (!row.Right) {
        errors.push({
          table: "cards",
          row: i,
          column: "Right",
          message: "Missing right option text",
        });
      }

      // 验证属性影响格式
      const effectColumns = ["LC", "LP", "LA", "LM", "RC", "RP", "RA", "RM"];
      for (const col of effectColumns) {
        const value = row[col];
        if (value && !this.isValidEffect(value)) {
          errors.push({
            table: "cards",
            row: i,
            column: col,
            message: `Invalid effect format: ${value}. Expected +/-number or empty`,
          });
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  private isValidEffect(value: string): boolean {
    if (!value) return true;
    return /^[+-]?\d+$/.test(value.trim());
  }

  generate(data: UnifiedGameData): GeneratedModule {
    const config = this.parseConfig(data.tables.config);
    const cardsTable = data.tables.cards;
    if (!cardsTable) {
      throw new Error("Missing required cards table");
    }
    const cards = this.transformCards(cardsTable);
    const attributes = ["content", "left_option", "right_option"];

    const templateData = {
      cards,
      config,
      attributes,
      defaults: {
        content: "什么也没有",
        left_option: "左划",
        right_option: "右划",
      },
      cardsFile: "reigns/cards.ink",
      utilsFile: "reigns/utils.ink",
    };

    const render = (template: string) => this.handlebars.compile(template)(templateData);

    const files = [
      {
        path: "reigns/cards.ink",
        content: render(loadTemplate("cards.ink.hbs")),
      },
      {
        path: "reigns/utils.ink",
        content: render(loadTemplate("utils.ink.hbs")),
      },
      {
        path: "reigns/game.ink",
        content: render(loadTemplate("game.ink.hbs")),
      },
    ];

    return {
      files,
      entry: "reigns/game.ink",
    };
  }

  private parseConfig(configTable?: Table): Record<string, number> {
    const config = { ...DEFAULT_CONFIG };

    if (configTable) {
      for (const row of configTable.rows) {
        const key = row.key;
        const value = row.value;
        if (key && value) {
          const numValue = Number.parseInt(value, 10);
          if (!Number.isNaN(numValue)) {
            (config as Record<string, number>)[key] = numValue;
          }
        }
      }
    }

    return config;
  }

  private transformCards(table: Table): Record<string, Record<string, string>> {
    const result: Record<string, Record<string, string>> = {};

    for (const row of table.rows) {
      const name = row.name ?? "";
      if (!name) continue;
      result[name] = {
        Content: row.Content ?? "",
        Left: row.Left ?? "",
        Right: row.Right ?? "",
        LC: row.LC ?? "",
        LP: row.LP ?? "",
        LA: row.LA ?? "",
        LM: row.LM ?? "",
        LN: row.LN ?? "",
        LR: row.LR ?? "",
        RC: row.RC ?? "",
        RP: row.RP ?? "",
        RA: row.RA ?? "",
        RM: row.RM ?? "",
        RN: row.RN ?? "",
        RR: row.RR ?? "",
      };
    }

    return result;
  }

  private registerHelpers(): void {
    // 连接对象的所有 key，首项加括号（ink LIST 语法）
    this.handlebars.registerHelper("joinKeysFirst", (obj: Record<string, unknown>) => {
      if (!obj || typeof obj !== "object") return "";
      const keys = Object.keys(obj);
      if (keys.length === 0) return "";
      return `(${keys[0]}), ${keys.slice(1).join(", ")}`;
    });

    // 获取嵌套属性
    this.handlebars.registerHelper("get", (obj: Record<string, unknown>, key: string) => {
      return obj?.[key];
    });

    // 相等比较
    this.handlebars.registerHelper("eq", (a: unknown, b: unknown) => {
      return a === b;
    });

    // 检查是否有左选项效果
    this.handlebars.registerHelper("hasLeftEffect", (card: Record<string, string>) => {
      return !!(card.LC || card.LP || card.LA || card.LM || card.LN || card.LR);
    });

    // 检查是否有右选项效果
    this.handlebars.registerHelper("hasRightEffect", (card: Record<string, string>) => {
      return !!(card.RC || card.RP || card.RA || card.RM || card.RN || card.RR);
    });

    // 解析效果值（+/-数字）
    this.handlebars.registerHelper("parseEffect", (value: string) => {
      if (!value) return "";
      const trimmed = value.trim();
      if (trimmed.startsWith("+")) {
        return `+= ${trimmed.slice(1)}`;
      } else if (trimmed.startsWith("-")) {
        return `-= ${trimmed.slice(1)}`;
      }
      return `+= ${trimmed}`;
    });

    // 遍历对象
    this.handlebars.registerHelper(
      "eachEntries",
      function (this: unknown, obj: Record<string, unknown>, options: Handlebars.HelperOptions) {
        if (!obj || typeof obj !== "object") return "";
        let result = "";
        for (const [key, value] of Object.entries(obj)) {
          result += options.fn({
            key,
            value,
            ...((typeof value === "object" && value !== null ? value : {}) as Record<
              string,
              unknown
            >),
          });
        }
        return result;
      },
    );
  }
}

// 注册游戏类型
registry.register(new ReignsGenerator());
