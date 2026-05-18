import type { Table, ValidationError } from "../../core";
import { defineGameType, RequiredValuesRule, UniquenessRule, ValidationRule } from "../../core";
import type { CheckResult } from "../../core/validator/types";
import { questionsSchema, resultsSchema, surveyConfigSchema } from "./schema";

/**
 * 选择题选项校验规则
 *
 * 当题目类型为 choice 时，optionA 和 optionB 为必填。
 */
class ChoiceOptionsRule extends ValidationRule {
  check(tables: Record<string, Table>): CheckResult {
    const errors: ValidationError[] = [];
    const rows = tables.questions?.rows ?? [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.type !== "choice") continue;
      if (!row.optionA) {
        errors.push({ table: "questions", row: i, column: "optionA", message: "选择题缺少选项A" });
      }
      if (!row.optionB) {
        errors.push({ table: "questions", row: i, column: "optionB", message: "选择题缺少选项B" });
      }
    }

    return { errors, warnings: [] };
  }
}

/**
 * 答案格式校验规则
 *
 * 选择题答案应为 A/B/C/D 的组合，判断题答案应为 true/false。
 */
class AnswerFormatRule extends ValidationRule {
  check(tables: Record<string, Table>): CheckResult {
    const errors: ValidationError[] = [];
    const rows = tables.questions?.rows ?? [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row?.answer) continue;

      const answer = row.answer.trim();
      if (!answer) continue;

      if (row.type === "choice") {
        const validChoices = /^[A-Da-d]$/;
        if (!validChoices.test(answer)) {
          errors.push({
            table: "questions",
            row: i,
            column: "answer",
            message: `选择题答案格式错误: "${answer}"（应为 A/B/C/D 之一）`,
          });
        }
      } else if (row.type === "judge") {
        const validJudge = /^(true|false|对|错|正确|错误)$/i;
        if (!validJudge.test(answer)) {
          errors.push({
            table: "questions",
            row: i,
            column: "answer",
            message: `判断题答案格式错误: "${answer}"（应为 true/false）`,
          });
        }
      }
    }

    return { errors, warnings: [] };
  }
}

/**
 * 结果区间校验规则
 *
 * 检查结果表的 min/max 是否合法：min < max，且不重叠。
 */
class ResultsRangeRule extends ValidationRule {
  check(tables: Record<string, Table>): CheckResult {
    const errors: ValidationError[] = [];
    const rows = tables.results?.rows ?? [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row) continue;

      const min = Number(row.min);
      const max = Number(row.max);

      if (Number.isNaN(min) || Number.isNaN(max)) {
        errors.push({ table: "results", row: i, message: "结果区间 min/max 必须为数字" });
        continue;
      }

      if (min >= max) {
        errors.push({
          table: "results",
          row: i,
          message: `结果区间无效: min(${min}) 必须小于 max(${max})`,
        });
      }

      if (min < 0 || max > 100) {
        errors.push({
          table: "results",
          row: i,
          message: `结果区间超出范围: [${min}, ${max}]（应为 0-100）`,
        });
      }
    }

    // 检查区间重叠
    const ranges = rows
      .map((r, idx) => ({ min: Number(r.min), max: Number(r.max), idx }))
      .filter((r) => !Number.isNaN(r.min) && !Number.isNaN(r.max));

    for (let i = 0; i < ranges.length; i++) {
      const a = ranges[i];
      if (!a) continue;
      for (let j = i + 1; j < ranges.length; j++) {
        const b = ranges[j];
        if (!b) continue;
        if (a.min < b.max && b.min < a.max) {
          errors.push({
            table: "results",
            row: b.idx,
            message: `结果区间 [${b.min}, ${b.max}] 与 [${a.min}, ${a.max}] 重叠`,
          });
        }
      }
    }

    return { errors, warnings: [] };
  }
}

const DEFAULT_CONFIG = {
  title: "",
  description: "",
  maxQuestions: 10,
  randomize: true,
  showAnswer: true,
  passScore: 60,
  isExam: false,
};

function parseConfig(configTable?: Table): Record<string, unknown> {
  const config = { ...DEFAULT_CONFIG };
  if (configTable) {
    for (const row of configTable.rows) {
      const key = row.key;
      const value = row.value;
      if (key && value) {
        const numValue = Number(value);
        if (!Number.isNaN(numValue)) (config as Record<string, unknown>)[key] = numValue;
        else if (value === "true") (config as Record<string, unknown>)[key] = true;
        else if (value === "false") (config as Record<string, unknown>)[key] = false;
        else (config as Record<string, unknown>)[key] = value;
      }
    }
  }
  return config;
}

function transformQuestions(table: Table): Record<string, unknown>[] {
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

function transformResults(table?: Table): Record<string, unknown>[] {
  if (!table || table.rows.length === 0) {
    return [];
  }
  return table.rows.map((row) => ({
    min: Number(row.min) || 0,
    max: Number(row.max) || 100,
    title: row.title ?? "",
    description: row.description ?? "",
  }));
}

export const survey = defineGameType({
  id: "survey",
  name: "问卷/考试系统",
  description: "支持选择题、输入题、判断题，随机出题、得分统计",
  requiredTables: ["questions"],
  tableSchemas: { questions: questionsSchema, results: resultsSchema, config: surveyConfigSchema },

  validate: [
    new UniquenessRule(["questions"]),
    new RequiredValuesRule("questions", ["id", "type", "content", "answer"]),
    new ChoiceOptionsRule(),
    new AnswerFormatRule(),
    new ResultsRangeRule(),
  ],

  generate: {
    entry: "index.md",
    templates: ["index.md.hbs", "questions.ink.hbs"],

    transform(data) {
      const config = parseConfig(data.tables.config);
      const questionsTable = data.tables.questions;
      if (!questionsTable) throw new Error("Missing required questions table");
      const questions = transformQuestions(questionsTable);
      const results = transformResults(data.tables.results);
      const totalScore = questions.reduce((sum, q) => sum + ((q.score as number) || 1), 0);
      const maxQuestions = Number(config.maxQuestions) || questions.length;

      return {
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
    },

    helpers: {
      escapeQuotes(text: unknown) {
        return String(text ?? "").replace(/"/g, '\\"');
      },
    },
  },
});
