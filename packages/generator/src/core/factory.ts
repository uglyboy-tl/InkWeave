import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, isAbsolute, join } from "node:path";
import { matchTables } from "./matcher";
import { TemplateEngine } from "./template";
import type {
  GameType,
  GameTypeDefinition,
  GeneratedModule,
  UnifiedGameData,
  ValidationError,
  ValidationResult,
} from "./types";
import { RuleValidator } from "./validator";
import type { ValidationRule } from "./validator/types";

const BUILTIN_TPL_DIR = join(import.meta.dir, "../modes");

function resolveTemplatePath(id: string, name: string): string {
  if (isAbsolute(name)) return name;
  const builtin = join(BUILTIN_TPL_DIR, id, "templates", name);
  if (existsSync(builtin)) return builtin;
  return name;
}

export function defineGameType(def: GameTypeDefinition): GameType {
  const engine = new TemplateEngine(def.generate.helpers);

  const defaultEntry = `${def.id}/index.md`;
  const entry = def.generate.entry ?? defaultEntry;
  const entryPrefix = dirname(entry);

  const templateSource: Record<string, HandlebarsTemplateDelegate> = {};
  for (const name of def.generate.templates) {
    const filePath = resolveTemplatePath(def.id, name);
    const content = readFileSync(filePath, "utf-8");
    const outPath = join(entryPrefix, basename(name).replace(/\.hbs$/, ""));
    templateSource[outPath] = engine.compile(content);
  }

  const transform = def.generate.transform ?? ((data: UnifiedGameData) => data.tables);
  const rules: ValidationRule[] = def.validate ?? [];

  return {
    id: def.id,
    name: def.name,
    description: def.description,
    tableSchemas: def.tableSchemas ?? {},
    requiredTables: def.requiredTables ?? [],

    validate(data: UnifiedGameData): ValidationResult {
      const matched = matchTables(data.tables, this.tableSchemas);
      const errors: ValidationError[] = [];
      for (const name of this.requiredTables) {
        if (!matched[name]) {
          errors.push({ table: name, message: `Missing required table: ${name}` });
        }
      }
      if (errors.length > 0) return { valid: false, errors };
      if (rules.length === 0) return { valid: true, errors };
      const validator = new RuleValidator(matched, rules);
      return validator.validate();
    },

    generate(data: UnifiedGameData): GeneratedModule {
      const matched = matchTables(data.tables, this.tableSchemas);
      const merged: UnifiedGameData = { ...data, tables: matched };
      const templateData = transform(merged);
      const files = Object.entries(templateSource).map(([path, render]) => ({
        path,
        content: render(templateData),
      }));
      return { files, entry };
    },
  };
}
