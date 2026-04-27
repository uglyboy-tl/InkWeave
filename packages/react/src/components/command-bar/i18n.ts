import { Commands } from "../../commands";
import type { TranslationFunction } from "../../types";

export const t: TranslationFunction = (key) => {
  if (!key) return undefined;
  return Commands.getTranslations(key) ?? key;
};
