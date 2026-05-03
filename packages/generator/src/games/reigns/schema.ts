import type { TableSchema } from "../../core/types";

/**
 * 王权系统 - 卡牌表结构
 */
export const cardsSchema: TableSchema = {
  name: "cards",
  description: "卡牌定义表",
  keyColumn: "name",
  columns: [
    { name: "name", type: "string", required: true, description: "卡牌名称" },
    { name: "Content", type: "string", required: true, description: "卡牌内容/描述" },
    { name: "Left", type: "string", required: true, description: "左选项文本" },
    { name: "Right", type: "string", required: true, description: "右选项文本" },
    // 左选项效果
    {
      name: "LC",
      type: "string",
      required: false,
      description: "左选项对教会的影响 (+/-数字)",
      default: "",
    },
    { name: "LP", type: "string", required: false, description: "左选项对民众的影响", default: "" },
    { name: "LA", type: "string", required: false, description: "左选项对军队的影响", default: "" },
    { name: "LM", type: "string", required: false, description: "左选项对金钱的影响", default: "" },
    { name: "LN", type: "string", required: false, description: "左选项新增卡牌", default: "" },
    { name: "LR", type: "string", required: false, description: "左选项移除卡牌", default: "" },
    // 右选项效果
    { name: "RC", type: "string", required: false, description: "右选项对教会的影响", default: "" },
    { name: "RP", type: "string", required: false, description: "右选项对民众的影响", default: "" },
    { name: "RA", type: "string", required: false, description: "右选项对军队的影响", default: "" },
    { name: "RM", type: "string", required: false, description: "右选项对金钱的影响", default: "" },
    { name: "RN", type: "string", required: false, description: "右选项新增卡牌", default: "" },
    { name: "RR", type: "string", required: false, description: "右选项移除卡牌", default: "" },
  ],
};

/**
 * 王权系统 - 属性配置表结构
 */
export const configSchema: TableSchema = {
  name: "config",
  description: "游戏配置表",
  keyColumn: "key",
  columns: [
    { name: "key", type: "string", required: true, description: "配置项名称" },
    { name: "value", type: "string", required: true, description: "配置值" },
    { name: "description", type: "string", required: false, description: "配置描述", default: "" },
  ],
};
