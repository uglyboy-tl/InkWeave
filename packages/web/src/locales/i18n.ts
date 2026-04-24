export type TranslationFunction = (key: string) => string;

// Default English translations
const defaultEnglishTranslations: Record<string, string> = {
  // Save Modal translations
  modal_save_title: "Save Game",
  modal_restore_title: "Restore Game",
  slot_empty: "Empty",
  close: "Close",

  // Menu button translations
  menu_save: "Save",
  menu_restore: "Restore",
  menu_restart: "Restart",
  menu_save_aria: "Save game",
  menu_restore_aria: "Restore saved game",
  menu_restart_aria: "Restart game",
};

// Generate slot keys dynamically (slot_1, slot_2, etc.)
for (let i = 1; i <= 5; i++) {
  defaultEnglishTranslations[`slot_${i}`] = `Slot ${i}`;
}

// Global translation function that can be set by external users
let translateFn: TranslationFunction | null = null;

/**
 * Set the translation function for the entire web module
 */
export const setTranslationFunction = (fn: TranslationFunction | null | undefined): void => {
  translateFn = fn ?? null;
};

/**
 * Get translated text
 * If no translation function is set, returns the default English translation
 */
export const t = (key: string): string => {
  if (translateFn) {
    return translateFn(key);
  }

  // Fallback: return default English translation or key if not found
  const translation = defaultEnglishTranslations[key];
  if (translation !== undefined) {
    return translation;
  }

  // Warn about missing translation key in development
  if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
    console.warn(`Missing translation for key: "${key}"`);
  }

  return key;
};
