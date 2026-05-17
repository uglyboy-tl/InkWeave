import type { Table, ValidationError } from "../types";
import type { CheckResult, ValueParserType } from "./types";
import { resolveExtract, ValidationRule } from "./types";

export interface ReferenceDef {
  from: string;
  col: string;
  to: string;
  extract?: ((value: string) => string[]) | ValueParserType;
}

/**
 * 跨表引用校验规则
 *
 * 检查源表中某列的值是否存在于目标表的主键中。
 * 游戏类型通过 extract 函数自定义值的提取方式（如逗号分隔、正则提取等）。
 */
export class ReferenceRule extends ValidationRule {
  private refs: ReferenceDef[];

  constructor(refs: ReferenceDef[]) {
    super();
    this.refs = refs;
  }

  check(tables: Record<string, Table>): CheckResult {
    const errors: ValidationError[] = [];

    for (const ref of this.refs) {
      const sourceTable = tables[ref.from];
      const targetTable = tables[ref.to];
      if (!sourceTable || !targetTable) continue;

      const targetKeyCol = targetTable.headers[0];
      if (!targetKeyCol) continue;

      const targetKeys = new Set<string>();
      for (const row of targetTable.rows) {
        if (row?.[targetKeyCol]) targetKeys.add(row[targetKeyCol]);
      }

      const extractor = resolveExtract(ref.extract) ?? ((v: string) => [v]);

      for (let i = 0; i < sourceTable.rows.length; i++) {
        const row = sourceTable.rows[i];
        if (!row) continue;
        const value = row[ref.col];
        if (!value) continue;

        const values = extractor(value);
        for (const v of values) {
          const trimmed = v.trim();
          if (trimmed && !targetKeys.has(trimmed)) {
            errors.push({
              table: ref.from,
              row: i,
              column: ref.col,
              message: `"${trimmed}" not found in ${ref.to}`,
            });
          }
        }
      }
    }

    return { errors, warnings: [] };
  }
}
