import { describe, expect, it } from "bun:test";
import { createInkStory, Patches, Plugins } from "@inkweave/core";
import {
  audioPlugin,
  autoRestorePlugin,
  fadeEffectPlugin,
  imagePlugin,
  linkOpenPlugin,
  scrollAfterChoicePlugin,
} from "@inkweave/plugins";
import { initPlugins } from "../utils/plugins";

describe("Plugins configuration", () => {
  it("should load only enabled plugins when configuration is provided", () => {
    // Clear existing state
    // biome-ignore lint/suspicious/noExplicitAny: Testing private members
    (Plugins as any)._plugins.clear();
    // biome-ignore lint/suspicious/noExplicitAny: Testing private members
    (Plugins as any)._pluginsEnabled = {};
    Patches.clear();

    // Register plugins
    Plugins.register(imagePlugin);
    Plugins.register(audioPlugin);
    Plugins.register(autoRestorePlugin);
    Plugins.register(fadeEffectPlugin);
    Plugins.register(scrollAfterChoicePlugin);
    Plugins.register(linkOpenPlugin);

    // Configure plugins
    Plugins.setPluginsEnabled({
      image: false, // disable image plugin
      audio: true, // enable audio plugin
      "auto-restore": false, // disable auto-restore plugin
      "fade-effect": true, // enable fade-effect plugin
    });

    const ink = createInkStory("");
    const loadedPlugins = ink.plugins.getLoadedPlugins().sort();

    // Expected: audio, fade-effect, scroll-after-choice, link-open
    // NOT loaded: image, auto-restore
    const expectedPlugins = ["audio", "fade-effect", "link-open", "scroll-after-choice"].sort();

    expect(loadedPlugins).toEqual(expectedPlugins);

    // Clean up
    ink.dispose();
  });

  it("should load all plugins when no configuration is provided", () => {
    // Clear existing state
    // biome-ignore lint/suspicious/noExplicitAny: Testing private members
    (Plugins as any)._plugins.clear();
    // biome-ignore lint/suspicious/noExplicitAny: Testing private members
    (Plugins as any)._pluginsEnabled = {};
    Patches.clear();

    // Register plugins
    Plugins.register(imagePlugin);
    Plugins.register(audioPlugin);
    Plugins.register(autoRestorePlugin);
    Plugins.register(fadeEffectPlugin);
    Plugins.register(scrollAfterChoicePlugin);
    Plugins.register(linkOpenPlugin);

    const ink = createInkStory("");
    const loadedPlugins = ink.plugins.getLoadedPlugins().sort();

    // All plugins have enabledByDefault: true
    const expectedPlugins = [
      "audio",
      "auto-restore",
      "fade-effect",
      "image",
      "link-open",
      "scroll-after-choice",
    ].sort();

    expect(loadedPlugins).toEqual(expectedPlugins);

    // Clean up
    ink.dispose();
  });

  it("should handle partial configuration correctly", () => {
    // Clear existing state
    // biome-ignore lint/suspicious/noExplicitAny: Testing private members
    (Plugins as any)._plugins.clear();
    // biome-ignore lint/suspicious/noExplicitAny: Testing private members
    (Plugins as any)._pluginsEnabled = {};
    Patches.clear();

    // Register plugins
    Plugins.register(imagePlugin);
    Plugins.register(audioPlugin);
    Plugins.register(autoRestorePlugin);
    Plugins.register(fadeEffectPlugin);

    // Only configure one plugin
    Plugins.setPluginsEnabled({
      image: false,
    });

    const ink = createInkStory("");
    const loadedPlugins = ink.plugins.getLoadedPlugins().sort();

    // All plugins except 'image' should be loaded
    const expectedPlugins = ["audio", "auto-restore", "fade-effect"].sort();

    expect(loadedPlugins).toEqual(expectedPlugins);

    // Clean up
    ink.dispose();
  });

  it("should work with initPlugins function as used in web initialization", () => {
    // Clear existing state
    // biome-ignore lint/suspicious/noExplicitAny: Testing private members
    (Plugins as any)._plugins.clear();
    // biome-ignore lint/suspicious/noExplicitAny: Testing private members
    (Plugins as any)._pluginsEnabled = {};
    Patches.clear();

    // Use the actual initPlugins function that web uses
    const config = {
      image: false, // disable image plugin
      audio: true, // enable audio plugin
      "auto-restore": false, // disable auto-restore plugin
      "fade-effect": false, // disable fade-effect plugin
    };

    initPlugins(config);

    const ink = createInkStory("");
    const loadedPlugins = ink.plugins.getLoadedPlugins();

    // Verify explicitly enabled plugins are in the loaded list
    expect(loadedPlugins).toContain("audio");

    // Verify explicitly disabled plugins are NOT in the loaded list
    expect(loadedPlugins).not.toContain("image");
    expect(loadedPlugins).not.toContain("auto-restore");
    expect(loadedPlugins).not.toContain("fade-effect");

    // Clean up
    ink.dispose();
  });
});
