import type { Table, ValidationError } from "../types";
import type { CheckResult } from "./types";
import { ValidationRule } from "./types";

export class RequiredValuesRule extends ValidationRule {
  constructor(
    private table: string,
    private columns: string[],
  ) {
    super();
  }

  check(tables: Record<string, Table>): CheckResult {
    const errors: ValidationError[] = [];
    const rows = tables[this.table]?.rows ?? [];
    for (let i = 0; i < rows.length; i++) {
      for (const col of this.columns) {
        if (!rows[i]?.[col]) {
          errors.push({ table: this.table, row: i, column: col, message: `Missing ${col}` });
        }
      }
    }
    return { errors, warnings: [] };
  }
}
