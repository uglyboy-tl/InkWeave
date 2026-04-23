import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { createInkStory } from "../../create";
import type { InkStory } from "../../story/InkStory";
import { Plugins } from "../Plugins";

// Mock plugins for testing
const createMockPlugin = (id: string, enabledByDefault: boolean = true) => ({
  id,
  name: `Test Plugin ${id}`,
  enabledByDefault,
  onLoad: mock(),
});

describe("Plugins", () => {
  beforeEach(() => {
    // Clear existing plugins before each test
    // biome-ignore lint/suspicious/noExplicitAny: Testing private members
    (Plugins as any)._plugins.clear();
    // biome-ignore lint/suspicious/noExplicitAny: Testing private members
    (Plugins as any)._pluginsEnabled = {};
  });

  afterEach(() => {
    // Clean up after each test
    // biome-ignore lint/suspicious/noExplicitAny: Testing private members
    (Plugins as any)._plugins.clear();
    // biome-ignore lint/suspicious/noExplicitAny: Testing private members
    (Plugins as any)._pluginsEnabled = {};
  });

  describe("register", () => {
    it("should register a plugin", () => {
      const plugin = createMockPlugin("test-plugin-1");
      Plugins.register(plugin);
      expect(Plugins.getAllPlugins()).toEqual(["test-plugin-1"]);
    });

    it("should register multiple plugins", () => {
      const plugin1 = createMockPlugin("test-plugin-1");
      const plugin2 = createMockPlugin("test-plugin-2", false);
      Plugins.register(plugin1);
      Plugins.register(plugin2);
      expect(Plugins.getAllPlugins()).toEqual(["test-plugin-1", "test-plugin-2"]);
    });
  });

  describe("setPluginsEnabled", () => {
    it("should set plugin enabled configuration", () => {
      Plugins.setPluginsEnabled({
        "test-plugin-1": false,
        "test-plugin-2": true,
      });

      // Access private static property to verify
      // biome-ignore lint/suspicious/noExplicitAny: Testing private members
      expect((Plugins as any)._pluginsEnabled).toEqual({
        "test-plugin-1": false,
        "test-plugin-2": true,
      });
    });

    it("should merge configurations when called multiple times", () => {
      // First call
      Plugins.setPluginsEnabled({
        "test-plugin-1": false,
        "test-plugin-2": true,
      });

      // Second call should merge, not replace
      Plugins.setPluginsEnabled({
        "test-plugin-2": false, // override existing
        "test-plugin-3": true, // add new
      });

      // Access private static property to verify
      // biome-ignore lint/suspicious/noExplicitAny: Testing private members
      expect((Plugins as any)._pluginsEnabled).toEqual({
        "test-plugin-1": false, // preserved from first call
        "test-plugin-2": false, // overridden by second call
        "test-plugin-3": true, // added in second call
      });
    });

    it("should only process boolean values in plugin config", () => {
      const imagePlugin = {
        id: "image",
        name: "Image Plugin",
        enabledByDefault: true,
        onLoad: () => {},
      };

      const audioPlugin = {
        id: "audio",
        name: "Audio Plugin",
        enabledByDefault: true,
        onLoad: () => {},
      };

      // Register plugins
      Plugins.register(imagePlugin);
      Plugins.register(audioPlugin);

      // Test with mixed types - only boolean values should be processed
      const config = {
        image: false, // boolean - should be processed
        audio: "true", // string - should be ignored
        "invalid-plugin": 123, // number - should be ignored
        another: null, // null - should be ignored
      };

      Plugins.setPluginsEnabled(config as Record<string, unknown> as Record<string, boolean>);

      const ink = createInkStory("");
      const loadedPlugins = ink.plugins.getLoadedPlugins();

      // Only 'image' should be disabled, 'audio' should use default (enabled)
      expect(loadedPlugins).toContain("audio"); // audio enabled by default
      expect(loadedPlugins).not.toContain("image"); // image explicitly disabled

      ink.dispose();
    });

    it("should handle empty or invalid config gracefully", () => {
      const imagePlugin = {
        id: "image",
        name: "Image Plugin",
        enabledByDefault: true,
        onLoad: () => {},
      };

      const audioPlugin = {
        id: "audio",
        name: "Audio Plugin",
        enabledByDefault: true,
        onLoad: () => {},
      };

      // Register plugins
      Plugins.register(imagePlugin);
      Plugins.register(audioPlugin);

      // Test with null, undefined, and empty object
      Plugins.setPluginsEnabled(null as unknown as Record<string, boolean>);
      Plugins.setPluginsEnabled(undefined as unknown as Record<string, boolean>);
      Plugins.setPluginsEnabled({});

      const ink = createInkStory("");
      const loadedPlugins = ink.plugins.getLoadedPlugins();

      // Both plugins should be loaded (default enabled state)
      expect(loadedPlugins).toContain("audio");
      expect(loadedPlugins).toContain("image");

      ink.dispose();
    });
  });

  describe("loadEnabledPlugins", () => {
    it("should load plugins based on default enabled state when no config is set", () => {
      const plugin1 = createMockPlugin("test-plugin-1", true);
      const plugin2 = createMockPlugin("test-plugin-2", false);

      Plugins.register(plugin1);
      Plugins.register(plugin2);

      // Create story which will trigger plugin loading
      const ink = createInkStory("");

      // plugin1 should be loaded (enabledByDefault: true)
      // plugin2 should not be loaded (enabledByDefault: false)
      expect(plugin1.onLoad).toHaveBeenCalledTimes(1);
      expect(plugin2.onLoad).toHaveBeenCalledTimes(0);

      // Get the plugins instance from the ink story
      const pluginsInstance = (ink as InkStory).plugins;
      expect(pluginsInstance.getLoadedPlugins()).toEqual(["test-plugin-1"]);
    });

    it("should load plugins based on config when config is provided", () => {
      const plugin1 = createMockPlugin("test-plugin-1", true);
      const plugin2 = createMockPlugin("test-plugin-2", false);
      const plugin3 = createMockPlugin("test-plugin-3", true);

      Plugins.register(plugin1);
      Plugins.register(plugin2);
      Plugins.register(plugin3);

      // Set config that overrides defaults
      Plugins.setPluginsEnabled({
        "test-plugin-1": false, // disable plugin that was enabled by default
        "test-plugin-2": true, // enable plugin that was disabled by default
        "test-plugin-3": false, // disable plugin that was enabled by default
      });

      // Create story which will trigger plugin loading
      const ink = createInkStory("");

      // Only plugin2 should be loaded based on config
      expect(plugin1.onLoad).toHaveBeenCalledTimes(0);
      expect(plugin2.onLoad).toHaveBeenCalledTimes(1);
      expect(plugin3.onLoad).toHaveBeenCalledTimes(0);

      // Get the plugins instance from the ink story
      const pluginsInstance = (ink as InkStory).plugins;
      expect(pluginsInstance.getLoadedPlugins()).toEqual(["test-plugin-2"]);
    });

    it("should fall back to default when config doesn't specify a plugin", () => {
      const plugin1 = createMockPlugin("test-plugin-1", true);
      const plugin2 = createMockPlugin("test-plugin-2", false);

      Plugins.register(plugin1);
      Plugins.register(plugin2);

      // Only configure plugin1, leave plugin2 to use default
      Plugins.setPluginsEnabled({
        "test-plugin-1": false,
      });

      // Create story which will trigger plugin loading
      const ink = createInkStory("");

      // plugin1 should be disabled by config, plugin2 should use default (false)
      expect(plugin1.onLoad).toHaveBeenCalledTimes(0);
      expect(plugin2.onLoad).toHaveBeenCalledTimes(0);

      // Get the plugins instance from the ink story
      const pluginsInstance = (ink as InkStory).plugins;
      expect(pluginsInstance.getLoadedPlugins()).toEqual([]);
    });
  });
});
