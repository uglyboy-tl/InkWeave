import type { ColumnDef, TableSchema } from "../../core";
import type { StatDef } from "./config";

export const CONTROL_COLUMNS: ColumnDef[] = [
  {
    name: "add_card",
    type: "string",
    required: false,
    description: "添加到牌库的卡牌（逗号分隔）",
    default: "",
  },
  {
    name: "remove_card",
    type: "string",
    required: false,
    description: "从牌库移除的卡牌（逗号分隔）",
    default: "",
  },
  {
    name: "next_card",
    type: "string",
    required: false,
    description: "下一张强制出现的卡牌",
    default: "",
  },
];

/**
 * 王权系统 - 卡牌表结构
 */
export const cardsSchema: TableSchema = {
  name: "卡片表 (Cards)",
  description: "卡牌定义表",
  keyColumn: "name",
  columns: [
    { name: "name", type: "string", required: true, description: "卡牌名称" },
    { name: "content", type: "string", required: true, description: "卡牌内容/描述" },
    { name: "left_option", type: "string", required: true, description: "左选项文本" },
    { name: "right_option", type: "string", required: true, description: "右选项文本" },
    { name: "left_event", type: "string", required: true, description: "左选项对应的事件名" },
    { name: "right_event", type: "string", required: true, description: "右选项对应的事件名" },
  ],
};

/**
 * 根据 StatDef 动态构建事件表结构
 */
export function createEventsSchema(stats: StatDef[]): TableSchema {
  return {
    name: "事件表 (Events)",
    description: "事件效果表",
    keyColumn: "name",
    columns: [
      { name: "name", type: "string", required: true, description: "事件名称" },
      ...stats.map(
        (s): ColumnDef => ({
          name: s.id,
          type: "string",
          required: false,
          description: `${s.name}变化 (+/-数字)`,
          default: "0",
        }),
      ),
      ...CONTROL_COLUMNS,
    ],
  };
}

/**
 * 王权系统 - 条件表结构
 */
export const conditionsSchema: TableSchema = {
  name: "条件表 (Conditions)",
  description: "触发条件表",
  keyColumn: "name",
  columns: [
    { name: "name", type: "string", required: true, description: "条件名称" },
    {
      name: "required_events",
      type: "string",
      required: false,
      description: "需要的事件及阈值（如 抚琴传谣:1，多个用逗号分隔）",
      default: "",
    },
    {
      name: "excluded_events",
      type: "string",
      required: false,
      description: "排除的事件及阈值（如 抚琴传谣:2）",
      default: "",
    },
    {
      name: "condition",
      type: "string",
      required: false,
      description: "四维条件表达式（如 C > 3 & A >= 5）",
      default: "",
    },
    { name: "trigger_event", type: "string", required: true, description: "满足条件时触发的事件" },
  ],
};

/**
 * 王权系统 - 属性结局表结构
 */
export const statsSchema: TableSchema = {
  name: "属性表 (Stats)",
  description: "属性结局表",
  keyColumn: "stat",
  columns: [
    {
      name: "stat",
      type: "string",
      required: true,
      description: "属性 ID（如 C/P/A/M，对应 StatDef 的 id）",
    },
    { name: "dir", type: "enum", required: true, description: "方向（+ 或 -）", enum: ["+", "-"] },
    {
      name: "text",
      type: "string",
      required: true,
      description: "结局文本（\\n 换行，#class: xxx 标记样式）",
    },
  ],
};
