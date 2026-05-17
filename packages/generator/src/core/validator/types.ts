import type { Table, ValidationError } from "../types";

/** 校验结果 */
export interface CheckResult {
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * 校验规则抽象基类
 *
 * 所有具体校验规则都继承此类。游戏类型可以自由组合、注入自定义规则。
 * 校验按规则添加顺序执行。
 */
export abstract class ValidationRule {
  /** 执行校验，返回结果 */
  abstract check(tables: Record<string, Table>): CheckResult;
}

/** 值解析器类型 */
export type ValueParserType = "comma" | "beforeColon";

/** 值解析器注册表 */
export const VALUE_PARSERS: Record<ValueParserType, (v: string) => string[]> = {
  comma: (v) =>
    v
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean),
  /** 按逗号拆分后取冒号前的内容，用于 "事件名:阈值" 等 key:value 格式 */
  beforeColon: (v) =>
    v
      .split(/[,，]/)
      .map((s) => s.split(":")[0]?.trim() ?? "")
      .filter(Boolean),
};

/** 将 extract 字段从字符串简写解析为实际函数 */
export function resolveExtract(
  extract?: ((value: string) => string[]) | ValueParserType,
): ((value: string) => string[]) | undefined {
  if (typeof extract === "string") return VALUE_PARSERS[extract];
  return extract;
}

export interface ColumnDef {
  name: string;
  required?: boolean;
  /** 引用其他表的主键 */
  references?: string | string[];
  /** 值解析器 */
  valueParser?: ValueParserType;
}
