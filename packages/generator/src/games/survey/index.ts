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
import { questionsSchema, resultsSchema, surveyConfigSchema } from "./schema";

// 读取模板文件
function loadTemplate(name: string): string {
  return readFileSync(join(__dirname, "templates", name), "utf-8");
}

// 默认配置
const DEFAULT_CONFIG = {
  title: "",
  description: "",
  maxQuestions: 10,
  randomize: true,
  showAnswer: true,
  passScore: 60,
  isExam: false,
};

/**
 * 问卷/考试系统游戏类型
 *
 * 支持多种题型（选择题、输入题、判断题），
 * 随机出题、得分统计、结果分级。
 */
export class SurveyGenerator implements GameType {
  readonly id = "survey";
  readonly name = "问卷/考试系统";
  readonly description = "支持选择题、输入题、判断题，随机出题、得分统计";
  readonly requiredTables = ["questions"];
  readonly tableSchemas = {
    questions: questionsSchema,
    results: resultsSchema,
    config: surveyConfigSchema,
  };

  private handlebars: typeof Handlebars;

  constructor() {
    this.handlebars = Handlebars.create();
    this.registerHelpers();
  }

  validate(data: UnifiedGameData): ValidationResult {
    const errors: Array<{ table: string; row?: number; column?: string; message: string }> = [];

    // 检查必需的表
    if (!data.tables.questions) {
      errors.push({
        table: "questions",
        message: "Missing required table: questions",
      });
      return { valid: false, errors };
    }

    const questions = data.tables.questions;

    // 验证每道题目
    for (let i = 0; i < questions.rows.length; i++) {
      const row = questions.rows[i];
      if (!row) continue;

      if (!row.id) {
        errors.push({ table: "questions", row: i, column: "id", message: "Missing question id" });
      }
      if (!row.type) {
        errors.push({
          table: "questions",
          row: i,
          column: "type",
          message: "Missing question type",
        });
      } else if (!["choice", "input", "judge"].includes(row.type)) {
        errors.push({
          table: "questions",
          row: i,
          column: "type",
          message: `Invalid question type: ${row.type}`,
        });
      }
      if (!row.content) {
        errors.push({
          table: "questions",
          row: i,
          column: "content",
          message: "Missing question content",
        });
      }
      if (!row.answer) {
        errors.push({ table: "questions", row: i, column: "answer", message: "Missing answer" });
      }

      // 验证选择题必须有选项
      if (row.type === "choice") {
        if (!row.optionA || !row.optionB) {
          errors.push({
            table: "questions",
            row: i,
            message: "Choice question must have at least optionA and optionB",
          });
        }
        if (!["A", "B", "C", "D"].includes(row.answer ?? "")) {
          errors.push({
            table: "questions",
            row: i,
            column: "answer",
            message: "Choice question answer must be A, B, C, or D",
          });
        }
      }

      // 验证判断题答案
      if (row.type === "judge") {
        if (!["true", "false"].includes(row.answer ?? "")) {
          errors.push({
            table: "questions",
            row: i,
            column: "answer",
            message: "Judge question answer must be true or false",
          });
        }
      }

      // 验证分值
      if (row.score) {
        const score = Number(row.score);
        if (Number.isNaN(score) || score <= 0) {
          errors.push({
            table: "questions",
            row: i,
            column: "score",
            message: "Invalid score value",
          });
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  generate(data: UnifiedGameData): GeneratedModule {
    const config = this.parseConfig(data.tables.config);
    const questionsTable = data.tables.questions;
    if (!questionsTable) {
      throw new Error("Missing required questions table");
    }
    const questions = this.transformQuestions(questionsTable);
    const results = this.transformResults(data.tables.results);

    const totalScore = questions.reduce((sum, q) => sum + ((q.score as number) || 1), 0);
    const maxQuestions = config.maxQuestions || questions.length;

    const templateData = {
      title: config.title || "",
      description: config.description || "",
      isExam: config.isExam || false,
      randomize: config.randomize !== false,
      showAnswer: config.showAnswer !== false,
      passScore: config.passScore || 60,
      totalScore,
      maxQuestions,
      questions,
      results,
    };

    const render = (template: string) => this.handlebars.compile(template)(templateData);

    const files = [
      {
        path: "survey/survey.ink",
        content: render(loadTemplate("survey.ink.hbs")),
      },
    ];

    return {
      files,
      entry: "survey/survey.ink",
    };
  }

  private parseConfig(configTable?: Table): Record<string, unknown> {
    const config = { ...DEFAULT_CONFIG };

    if (configTable) {
      for (const row of configTable.rows) {
        const key = row.key;
        const value = row.value;
        if (key && value) {
          // 尝试解析数字
          const numValue = Number(value);
          if (!Number.isNaN(numValue)) {
            (config as Record<string, unknown>)[key] = numValue;
          } else if (value === "true") {
            (config as Record<string, unknown>)[key] = true;
          } else if (value === "false") {
            (config as Record<string, unknown>)[key] = false;
          } else {
            (config as Record<string, unknown>)[key] = value;
          }
        }
      }
    }

    return config;
  }

  private transformQuestions(table: Table): Record<string, unknown>[] {
    return table.rows.map((row) => ({
      id: row.id ?? "",
      type: row.type ?? "choice",
      content: row.content ?? "",
      optionA: row.optionA ?? "",
      optionB: row.optionB ?? "",
      optionC: row.optionC ?? "",
      optionD: row.optionD ?? "",
      answer: row.answer ?? "",
      score: Number(row.score) || 1,
      explanation: row.explanation ?? "",
      category: row.category ?? "",
    }));
  }

  private transformResults(table?: Table): Record<string, unknown>[] {
    if (!table) {
      // 默认结果
      return [
        { min: 0, max: 40, title: "继续努力", description: "还需要多多学习呢" },
        { min: 40, max: 80, title: "不错", description: "再接再厉" },
        { min: 80, max: 100, title: "优秀", description: "太棒了！" },
      ];
    }

    return table.rows.map((row) => ({
      min: Number(row.min) || 0,
      max: Number(row.max) || 100,
      title: row.title ?? "",
      description: row.description ?? "",
    }));
  }

  private registerHelpers(): void {
    // 相等比较
    this.handlebars.registerHelper("eq", (a: unknown, b: unknown) => {
      return String(a) === String(b);
    });

    // 加法
    this.handlebars.registerHelper("add", (a: number, b: number) => {
      return a + b;
    });
  }
}

// 注册游戏类型
registry.register(new SurveyGenerator());
