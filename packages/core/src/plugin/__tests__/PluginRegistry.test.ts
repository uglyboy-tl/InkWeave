import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { PluginRegistry } from "../PluginRegistry";

const createMockPlugin = (id: string, enabledByDefault = true) => ({
  id,
  name: `Test Plugin ${id}`,
  enabledByDefault,
  onLoad: mock(),
});

describe("PluginRegistry", () => {
  beforeEach(() => {
    PluginRegistry.clear();
  });

  afterEach(() => {
    PluginRegistry.clear();
  });

  describe("register", () => {
    it("should register a plugin", () => {
      const plugin = createMockPlugin("test-plugin-1");
      PluginRegistry.register(plugin);
      expect(PluginRegistry.getAll().map((p) => p.id)).toEqual(["test-plugin-1"]);
    });

    it("should register multiple plugins", () => {
      const plugin1 = createMockPlugin("test-plugin-1");
      const plugin2 = createMockPlugin("test-plugin-2", false);
      PluginRegistry.register(plugin1);
      PluginRegistry.register(plugin2);
      expect(PluginRegistry.getAll().map((p) => p.id)).toEqual(["test-plugin-1", "test-plugin-2"]);
    });
  });

  describe("setEnabled", () => {
    it("should set plugin enabled config", () => {
      PluginRegistry.setEnabled({
        "test-plugin-1": false,
        "test-plugin-2": true,
      });
      expect(PluginRegistry.isEnabled("test-plugin-1")).toBe(false);
      expect(PluginRegistry.isEnabled("test-plugin-2")).toBe(true);
    });

    it("should merge configs when called multiple times", () => {
      PluginRegistry.setEnabled({
        "test-plugin-1": false,
        "test-plugin-2": true,
      });
      PluginRegistry.setEnabled({
        "test-plugin-2": false,
        "test-plugin-3": true,
      });
      expect(PluginRegistry.isEnabled("test-plugin-1")).toBe(false);
      expect(PluginRegistry.isEnabled("test-plugin-2")).toBe(false);
      expect(PluginRegistry.isEnabled("test-plugin-3")).toBe(true);
    });

    it("should fall back to default when not configured", () => {
      const plugin = createMockPlugin("test-plugin-1", true);
      PluginRegistry.register(plugin);
      expect(PluginRegistry.isEnabled("test-plugin-1")).toBe(true);
    });

    it("should handle empty or invalid config", () => {
      PluginRegistry.register(createMockPlugin("image", true));
      PluginRegistry.register(createMockPlugin("audio", true));

      PluginRegistry.setEnabled(null as unknown as Record<string, boolean>);
      PluginRegistry.setEnabled(undefined as unknown as Record<string, boolean>);
      PluginRegistry.setEnabled({});

      expect(PluginRegistry.isEnabled("audio")).toBe(true);
      expect(PluginRegistry.isEnabled("image")).toBe(true);
    });
  });
});
