/**
 * @inkweave/generator - Ink 脚本生成器
 *
 * 提供数据驱动的 ink 代码生成能力，支持多种游戏类型。
 */

// 输出层
export { InkEmitter, inkEmitter } from "./core/emitter/InkEmitter";
export { TemplateEngine, templateEngine } from "./core/emitter/TemplateEngine";

// 解析器
export {
  autoParse,
  CsvParser,
  JsonParser,
  MarkdownParser,
  parse,
  parseCsv,
  parseJson,
  parseMarkdown,
} from "./core/parsers";
// 注册表
export { registerGameType, registry } from "./core/registry";
// 核心类型
export type {
  ColumnDef,
  GameType,
  GameTypeConstructor,
  GeneratedFile,
  GeneratedModule,
  Parser,
  Table,
  TableSchema,
  UnifiedGameData,
  ValidationError,
  ValidationResult,
} from "./core/types";

// 游戏类型系统（导入以触发注册）
export { DuelGenerator } from "./games/duel";
export { ReignsGenerator } from "./games/reigns";
export { SurveyGenerator } from "./games/survey";
