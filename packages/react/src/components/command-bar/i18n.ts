import type { TranslationFunction } from "@inkweave/core";
import { CommandRegistry } from "@inkweave/core";

export const t: TranslationFunction = (key) => {
  if (!key) return undefined;
  return CommandRegistry.getTranslation(key) ?? key;
};
