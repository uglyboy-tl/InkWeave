import type { Table } from "../../core";
import { defineGameType } from "../../core";
import { questionsSchema, resultsSchema, surveyConfigSchema } from "./schema";

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
  if (!table) {
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

export const survey = defineGameType({
  id: "survey",
  name: "问卷/考试系统",
  description: "支持选择题、输入题、判断题，随机出题、得分统计",
  requiredTables: ["questions"],
  tableSchemas: { questions: questionsSchema, results: resultsSchema, config: surveyConfigSchema },

  generate: {
    templates: ["index.md.hbs"],

    transform(data) {
      const config = parseConfig(data.tables.config);
      const questionsTable = data.tables.questions;
      if (!questionsTable) throw new Error("Missing required questions table");
      const questions = transformQuestions(questionsTable);
      const results = transformResults(data.tables.results);
      const totalScore = questions.reduce((sum, q) => sum + ((q.score as number) || 1), 0);
      const maxQuestions = config.maxQuestions || questions.length;

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
  },
});
