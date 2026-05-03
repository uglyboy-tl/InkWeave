import type { TableSchema } from "../../core/types";

/**
 * 问卷/考试系统 - 题目表结构
 */
export const questionsSchema: TableSchema = {
  name: "questions",
  description: "题目定义表",
  keyColumn: "id",
  columns: [
    { name: "id", type: "string", required: true, description: "题目ID" },
    {
      name: "type",
      type: "enum",
      required: true,
      enum: ["choice", "input", "judge"],
      description: "题目类型",
    },
    { name: "content", type: "string", required: true, description: "题目内容" },
    {
      name: "optionA",
      type: "string",
      required: false,
      description: "选项A（选择题必填）",
      default: "",
    },
    {
      name: "optionB",
      type: "string",
      required: false,
      description: "选项B（选择题必填）",
      default: "",
    },
    { name: "optionC", type: "string", required: false, description: "选项C", default: "" },
    { name: "optionD", type: "string", required: false, description: "选项D", default: "" },
    {
      name: "answer",
      type: "string",
      required: true,
      description: "正确答案（选择题为A/B/C/D，输入题为可接受答案，判断题为true/false）",
    },
    { name: "score", type: "number", required: false, description: "分值", default: "1" },
    { name: "explanation", type: "string", required: false, description: "答案解析", default: "" },
    { name: "category", type: "string", required: false, description: "题目分类", default: "" },
  ],
};

/**
 * 问卷/考试系统 - 结果配置表结构
 */
export const resultsSchema: TableSchema = {
  name: "results",
  description: "结果区间配置表",
  keyColumn: "min",
  columns: [
    { name: "min", type: "number", required: true, description: "最低分数占比（百分比）" },
    { name: "max", type: "number", required: true, description: "最高分数占比（百分比）" },
    { name: "title", type: "string", required: true, description: "结果标题" },
    { name: "description", type: "string", required: true, description: "结果描述" },
  ],
};

/**
 * 问卷/考试系统 - 配置表结构
 */
export const surveyConfigSchema: TableSchema = {
  name: "config",
  description: "问卷配置表",
  keyColumn: "key",
  columns: [
    { name: "key", type: "string", required: true, description: "配置项名称" },
    { name: "value", type: "string", required: true, description: "配置值" },
  ],
};
