import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { setTranslationFunction, t } from "../locales/i18n";

describe("Internationalization", () => {
  // Reset translation function before each test
  beforeEach(() => {
    setTranslationFunction(null);
  });

  afterEach(() => {
    setTranslationFunction(null);
  });

  describe("Default English translations", () => {
    it("should return default English for modal save title", () => {
      expect(t("modal_save_title")).toBe("Save Game");
    });

    it("should return default English for modal restore title", () => {
      expect(t("modal_restore_title")).toBe("Restore Game");
    });

    it("should return default English for slot empty", () => {
      expect(t("slot_empty")).toBe("Empty");
    });

    it("should return default English for close", () => {
      expect(t("close")).toBe("Close");
    });

    it("should return default English for menu items", () => {
      expect(t("menu_save")).toBe("Save");
      expect(t("menu_restore")).toBe("Restore");
      expect(t("menu_restart")).toBe("Restart");
    });

    it("should return default English for menu aria labels", () => {
      expect(t("menu_save_aria")).toBe("Save game");
      expect(t("menu_restore_aria")).toBe("Restore saved game");
      expect(t("menu_restart_aria")).toBe("Restart game");
    });

    it("should generate slot translations dynamically", () => {
      expect(t("slot_1")).toBe("Slot 1");
      expect(t("slot_2")).toBe("Slot 2");
      expect(t("slot_5")).toBe("Slot 5");
    });

    it("should return key as-is for unknown keys", () => {
      expect(t("unknown_key")).toBe("unknown_key");
    });
  });

  describe("Custom translation function", () => {
    it("should use custom translation function when provided", () => {
      const customTranslate = (key: string) => {
        const translations: Record<string, string> = {
          modal_save_title: "保存游戏",
          modal_restore_title: "读取存档",
          slot_empty: "空",
          close: "关闭",
          menu_save: "保存",
          menu_restore: "读取",
          menu_restart: "重新开始",
          slot_1: "槽位 1",
        };
        return translations[key] || key;
      };

      setTranslationFunction(customTranslate);

      expect(t("modal_save_title")).toBe("保存游戏");
      expect(t("modal_restore_title")).toBe("读取存档");
      expect(t("slot_empty")).toBe("空");
      expect(t("close")).toBe("关闭");
      expect(t("menu_save")).toBe("保存");
      expect(t("slot_1")).toBe("槽位 1");
      expect(t("unknown_key")).toBe("unknown_key");
    });

    it("should handle complex custom translation logic", () => {
      const customTranslate = (key: string) => {
        // Simulate a more complex translation system
        if (key.startsWith("slot_")) {
          const slotNumber = key.split("_")[1];
          return `自定义槽位 ${slotNumber}`;
        }
        return `translated_${key}`;
      };

      setTranslationFunction(customTranslate);

      expect(t("slot_3")).toBe("自定义槽位 3");
      expect(t("menu_save")).toBe("translated_menu_save");
    });
  });

  describe("Custom translation function behavior", () => {
    it("should use custom function for all keys, including returning key as-is", () => {
      const customTranslate = (key: string) => {
        if (key === "custom_key") {
          return "custom_value";
        }
        // Return key as-is for other keys (common pattern)
        return key;
      };

      setTranslationFunction(customTranslate);

      expect(t("custom_key")).toBe("custom_value");
      expect(t("modal_save_title")).toBe("modal_save_title"); // Custom function returns key as-is
    });
  });
});
