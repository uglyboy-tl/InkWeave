import type { UnifiedGameData } from "../types";

export interface Parser {
  parse(input: string): UnifiedGameData;
  detect(input: string): boolean;
}
