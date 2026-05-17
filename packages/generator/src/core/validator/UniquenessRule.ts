import type { Table, ValidationError } from "../types";
import type { CheckResult } from "./types";
import { ValidationRule } from "./types";

/**
 * 主键唯一性校验规则
 */
export class UniquenessRule extends ValidationRule {
  private tableNames?: string[];

  constructor(tableNames?: string[]) {
    super();
    this.tableNames = tableNames;
  }

  check(tables: Record<string, Table>): CheckResult {
    const errors: ValidationError[] = [];
    const targets = this.tableNames ?? Object.keys(tables);

    for (const tableName of targets) {
      const table = tables[tableName];
      if (!table) continue;

      const keyColumn = table.headers[0];
      if (!keyColumn) continue;

      const seen = new Map<string, number>();
      for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i];
        if (!row) continue;
        const key = row[keyColumn];
        if (!key) {
          errors.push({
            table: tableName,
            row: i,
            column: keyColumn,
            message: `Missing ${keyColumn}`,
          });
        } else if (seen.has(key)) {
          errors.push({
            table: tableName,
            row: i,
            column: keyColumn,
            message: `Duplicate ${keyColumn}: ${key} (first at row ${seen.get(key)})`,
          });
        } else {
          seen.set(key, i);
        }
      }
    }

    return { errors, warnings: [] };
  }
}
