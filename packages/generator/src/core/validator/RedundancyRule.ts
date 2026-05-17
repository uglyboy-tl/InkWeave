import type { Table, ValidationError } from "../types";
import type { CheckResult, ValueParserType } from "./types";
import { resolveExtract, ValidationRule } from "./types";

export interface ReferenceSource {
  table: string;
  col: string;
  extract?: ((value: string) => string[]) | ValueParserType;
}

/**
 * 冗余键校验规则
 */
export class RedundancyRule extends ValidationRule {
  private table: string;
  private excludeFirst: boolean;
  private referencedBy: ReferenceSource[];

  constructor(table: string, referencedBy: ReferenceSource[], excludeFirst = true) {
    super();
    this.table = table;
    this.excludeFirst = excludeFirst;
    this.referencedBy = referencedBy;
  }

  check(tables: Record<string, Table>): CheckResult {
    const warnings: ValidationError[] = [];
    const table = tables[this.table];
    if (!table) return { errors: [], warnings };

    const keyCol = table.headers[0];
    if (!keyCol) return { errors: [], warnings };

    const referencedValues = new Set<string>();
    for (const src of this.referencedBy) {
      const srcTable = tables[src.table];
      if (!srcTable) continue;
      const extractor = resolveExtract(src.extract) ?? ((v: string) => [v]);

      for (const row of srcTable.rows) {
        if (!row) continue;
        const value = row[src.col];
        if (!value) continue;
        const values = extractor(value);
        for (const v of values) {
          const trimmed = v.trim();
          if (trimmed) referencedValues.add(trimmed);
        }
      }
    }

    for (let i = 0; i < table.rows.length; i++) {
      if (this.excludeFirst && i === 0) continue;
      const row = table.rows[i];
      if (!row) continue;
      const key = row[keyCol];
      if (key && !referencedValues.has(key)) {
        warnings.push({
          table: this.table,
          row: i,
          column: keyCol,
          message: `"${key}" is never referenced`,
        });
      }
    }

    return { errors: [], warnings };
  }
}
