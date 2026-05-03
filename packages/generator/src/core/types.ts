/**
 * @inkweave/generator 核心类型定义
 *
 * 定义了输入解析、游戏类型生成、输出产物等核心接口。
 */

// ============================================================
// 输入数据结构（解析后的统一中间态）
// ============================================================

/** 表格数据 */
export interface Table {
  /** 列名列表 */
  headers: string[];
  /** 行数据（每行是一个 key-value 对象） */
  rows: Record<string, string>[];
  /** 按首列索引的查找表（首列值 -> 该行数据） */
  lookup: Record<string, Record<string, string>>;
}

/** 统一的游戏数据结构 */
export interface UnifiedGameData {
  /** 多个表格，key 为表名 */
  tables: Record<string, Table>;
  /** 全局配置 */
  config?: Record<string, unknown>;
  /** 元数据 */
  meta?: Record<string, unknown>;
}

// ============================================================
// 解析器
// ============================================================

/** 解析器接口 */
export interface Parser {
  /** 解析输入字符串为统一数据结构 */
  parse(input: string): UnifiedGameData;
  /** 检测输入是否为当前格式 */
  detect(input: string): boolean;
}

// ============================================================
// 生成产物
// ============================================================

/** 生成的单个文件 */
export interface GeneratedFile {
  /** 文件路径（相对于输出目录） */
  path: string;
  /** 文件内容 */
  content: string;
}

/** 生成的模块（包含多个文件） */
export interface GeneratedModule {
  /** 所有生成的文件 */
  files: GeneratedFile[];
  /** 入口文件路径 */
  entry: string;
}

// ============================================================
// 表结构定义（用于验证和 AI 参考）
// ============================================================

/** 列定义 */
export interface ColumnDef {
  /** 列名 */
  name: string;
  /** 数据类型 */
  type: "string" | "number" | "boolean" | "enum";
  /** 是否必填 */
  required: boolean;
  /** 枚举值列表（type 为 'enum' 时） */
  enum?: string[];
  /** 默认值 */
  default?: string;
  /** 描述（供 AI 和用户理解） */
  description: string;
}

/** 表结构定义 */
export interface TableSchema {
  /** 表名 */
  name: string;
  /** 描述 */
  description: string;
  /** 列定义 */
  columns: ColumnDef[];
  /** 主键列名 */
  keyColumn: string;
}

// ============================================================
// 游戏类型接口
// ============================================================

/** 验证错误 */
export interface ValidationError {
  table: string;
  row?: number;
  column?: string;
  message: string;
}

/** 验证结果 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// ============================================================
// 游戏类型接口
// ============================================================

/** 游戏类型定义 */
export interface GameType {
  /** 类型 ID（命令行使用） */
  readonly id: string;
  /** 显示名称 */
  readonly name: string;
  /** 描述 */
  readonly description: string;
  /** 需要的表格名称列表 */
  readonly requiredTables: string[];
  /** 每个表格的结构定义 */
  readonly tableSchemas: Record<string, TableSchema>;
  /** 验证输入数据 */
  validate(data: UnifiedGameData): ValidationResult;
  /** 生成 ink 文件 */
  generate(data: UnifiedGameData): GeneratedModule;
}

/** 游戏类型构造函数接口 */
export interface GameTypeConstructor {
  new (): GameType;
}
