import type { TranslationFunction } from "./locales";

export interface InkWeaveOptions {
  container: string | HTMLElement;
  story: string;
  title?: string;
  basePath?: string;
  theme?: "light" | "dark";
  plugins?: Record<string, boolean>;
  translations?: TranslationFunction;
}
