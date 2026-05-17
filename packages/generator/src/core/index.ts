export { defineGameType } from "./factory";
export { matchTables } from "./matcher";
export type { Parser } from "./parsers";
export { autoParse, loadInput, parse } from "./parsers";
export type { PipelineOptions, PipelineResult } from "./pipeline";
export { runPipeline } from "./pipeline";

export { registerCoreHelpers, TemplateEngine, templateEngine } from "./template";
export type {
  ColumnDef,
  GameType,
  GameTypeDefinition,
  GeneratedFile,
  GeneratedModule,
  Table,
  TableSchema,
  UnifiedGameData,
  ValidationError,
  ValidationResult,
} from "./types";
export {
  RedundancyRule,
  ReferenceRule,
  RequiredValuesRule,
  RuleValidator,
  UniquenessRule,
  VALUE_PARSERS,
  ValidationRule,
} from "./validator";
