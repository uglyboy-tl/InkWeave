import type { Table, ValidationError, ValidationResult } from "../types";
import type { ValidationRule } from "./types";

export type { ReferenceSource } from "./RedundancyRule";
export { RedundancyRule } from "./RedundancyRule";
export type { ReferenceDef } from "./ReferenceRule";
export { ReferenceRule } from "./ReferenceRule";
export { RequiredValuesRule } from "./RequiredValuesRule";
export type { CheckResult, ColumnDef } from "./types";
export { VALUE_PARSERS, ValidationRule } from "./types";
export { UniquenessRule } from "./UniquenessRule";

export class RuleValidator {
  private rules: ValidationRule[];
  private tables: Record<string, Table>;

  constructor(tables: Record<string, Table>, rules: ValidationRule[]) {
    this.tables = tables;
    this.rules = rules;
  }

  validate(): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    for (const rule of this.rules) {
      const result = rule.check(this.tables);
      errors.push(...result.errors);
      warnings.push(...result.warnings);
    }

    return { valid: errors.length === 0, errors, warnings };
  }
}
