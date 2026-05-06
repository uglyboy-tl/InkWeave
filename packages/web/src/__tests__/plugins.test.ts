import { describe, expect, it } from "bun:test";
import { createInkStory, Patches, PluginRegistry } from "@inkweave/core";
import {
  audioPlugin,
  autoRestorePlugin,
  fadeEffectPlugin,
  imagePlugin,
  linkOpenPlugin,
  scrollAfterChoicePlugin,
} from "@inkweave/plugins/react";
import { initPlugins } from "../react/plugins";

describe("PluginRegistry configuration", () => {
  it("should load only enabled plugins when configuration is provided", () => {
    PluginRegistry.clear();
    Patches.clear();

    PluginRegistry.register(imagePlugin);
    PluginRegistry.register(audioPlugin);
    PluginRegistry.register(autoRestorePlugin);
    PluginRegistry.register(fadeEffectPlugin);
    PluginRegistry.register(scrollAfterChoicePlugin);
    PluginRegistry.register(linkOpenPlugin);

    PluginRegistry.setEnabled({
      image: false,
      audio: true,
      "auto-restore": false,
      "fade-effect": true,
      "link-open": true,
    });

    const ink = createInkStory("");
    const loadedPlugins = ink.pluginLoader.loadedIds.sort();

    const expectedPlugins = ["audio", "fade-effect", "link-open", "scroll-after-choice"].sort();

    expect(loadedPlugins).toEqual(expectedPlugins);

    ink.dispose();
  });

  it("should load all plugins when no configuration is provided", () => {
    PluginRegistry.clear();
    Patches.clear();

    PluginRegistry.register(imagePlugin);
    PluginRegistry.register(audioPlugin);
    PluginRegistry.register(autoRestorePlugin);
    PluginRegistry.register(fadeEffectPlugin);
    PluginRegistry.register(scrollAfterChoicePlugin);
    PluginRegistry.register(linkOpenPlugin);

    PluginRegistry.setEnabled({
      image: true,
      audio: true,
      "auto-restore": true,
      "fade-effect": true,
      "link-open": true,
      "scroll-after-choice": true,
    });

    const ink = createInkStory("");
    const loadedPlugins = ink.pluginLoader.loadedIds.sort();

    const expectedPlugins = [
      "audio",
      "auto-restore",
      "fade-effect",
      "image",
      "link-open",
      "scroll-after-choice",
    ].sort();

    expect(loadedPlugins).toEqual(expectedPlugins);

    ink.dispose();
  });

  it("should handle partial configuration correctly", () => {
    PluginRegistry.clear();
    Patches.clear();

    PluginRegistry.register(imagePlugin);
    PluginRegistry.register(audioPlugin);
    PluginRegistry.register(autoRestorePlugin);
    PluginRegistry.register(fadeEffectPlugin);

    PluginRegistry.setEnabled({
      image: false,
    });

    const ink = createInkStory("");
    const loadedPlugins = ink.pluginLoader.loadedIds.sort();

    const expectedPlugins = ["audio", "auto-restore", "fade-effect"].sort();

    expect(loadedPlugins).toEqual(expectedPlugins);

    ink.dispose();
  });

  it("should work with initPlugins function as used in web initialization", () => {
    PluginRegistry.clear();
    Patches.clear();

    const config = {
      image: false,
      audio: true,
      "auto-restore": false,
      "fade-effect": false,
    };

    initPlugins(config);

    const ink = createInkStory("");
    const loadedPlugins = ink.pluginLoader.loadedIds;

    expect(loadedPlugins).toContain("audio");

    expect(loadedPlugins).not.toContain("image");
    expect(loadedPlugins).not.toContain("auto-restore");
    expect(loadedPlugins).not.toContain("fade-effect");

    ink.dispose();
  });
});
