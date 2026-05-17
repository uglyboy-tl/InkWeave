import type { TableSchema } from "../../core";

/**
 * 对战系统 - 角色表结构
 */
export const rolesSchema: TableSchema = {
  name: "roles",
  description: "角色/怪物定义表",
  keyColumn: "name",
  columns: [
    { name: "name", type: "string", required: true, description: "角色名称" },
    { name: "type1", type: "string", required: true, description: "主属性" },
    { name: "type2", type: "string", required: false, description: "副属性", default: "" },
    { name: "hp", type: "number", required: true, description: "生命值" },
    { name: "atk", type: "number", required: true, description: "攻击力" },
    { name: "def", type: "number", required: true, description: "防御力" },
    { name: "spAtk", type: "number", required: true, description: "特攻" },
    { name: "spDef", type: "number", required: true, description: "特防" },
    { name: "spd", type: "number", required: true, description: "速度" },
  ],
};

/**
 * 对战系统 - 技能表结构
 */
export const movesSchema: TableSchema = {
  name: "moves",
  description: "技能/招式定义表",
  keyColumn: "name",
  columns: [
    { name: "name", type: "string", required: true, description: "技能名称" },
    { name: "type", type: "string", required: true, description: "技能属性" },
    { name: "power", type: "number", required: true, description: "威力" },
    {
      name: "category",
      type: "enum",
      required: true,
      enum: ["Physical", "Special"],
      description: "类别（物理/特殊）",
    },
  ],
};

/**
 * 对战系统 - 属性克制表结构
 */
export const typeChartSchema: TableSchema = {
  name: "typeChart",
  description: "属性克制关系表",
  keyColumn: "attack",
  columns: [
    { name: "attack", type: "string", required: true, description: "攻击属性" },
    {
      name: "Normal",
      type: "number",
      required: false,
      description: "对普通属性倍率",
      default: "1",
    },
    { name: "Fire", type: "number", required: false, description: "对火属性倍率", default: "1" },
    { name: "Water", type: "number", required: false, description: "对水属性倍率", default: "1" },
    {
      name: "Electric",
      type: "number",
      required: false,
      description: "对电属性倍率",
      default: "1",
    },
    { name: "Grass", type: "number", required: false, description: "对草属性倍率", default: "1" },
    { name: "Ice", type: "number", required: false, description: "对冰属性倍率", default: "1" },
    {
      name: "Fighting",
      type: "number",
      required: false,
      description: "对格斗属性倍率",
      default: "1",
    },
    { name: "Poison", type: "number", required: false, description: "对毒属性倍率", default: "1" },
    {
      name: "Ground",
      type: "number",
      required: false,
      description: "对地面属性倍率",
      default: "1",
    },
    {
      name: "Flying",
      type: "number",
      required: false,
      description: "对飞行属性倍率",
      default: "1",
    },
    {
      name: "Psychic",
      type: "number",
      required: false,
      description: "对超能属性倍率",
      default: "1",
    },
    { name: "Bug", type: "number", required: false, description: "对虫属性倍率", default: "1" },
    { name: "Rock", type: "number", required: false, description: "对岩石属性倍率", default: "1" },
    { name: "Ghost", type: "number", required: false, description: "对幽灵属性倍率", default: "1" },
    { name: "Dragon", type: "number", required: false, description: "对龙属性倍率", default: "1" },
    { name: "Dark", type: "number", required: false, description: "对恶属性倍率", default: "1" },
    { name: "Steel", type: "number", required: false, description: "对钢属性倍率", default: "1" },
    { name: "Fairy", type: "number", required: false, description: "对妖精属性倍率", default: "1" },
  ],
};
