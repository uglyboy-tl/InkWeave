import { loadInput } from "./parsers";
import type { GameType, GeneratedModule, UnifiedGameData, ValidationResult } from "./types";

export interface PipelineOptions {
  input: string | string[];
  plugin: GameType;
}

export interface PipelineResult {
  data: UnifiedGameData;
  validation: ValidationResult;
  module: GeneratedModule | null;
}

export function runPipeline(options: PipelineOptions): PipelineResult {
  const data = loadInput(options.input);
  const validation = options.plugin.validate(data);
  if (!validation.valid) return { data, validation, module: null };
  const module = options.plugin.generate(data);
  return { data, validation, module };
}
