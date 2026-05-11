import { PluginRegistry } from "@inkweave/core";
import {
  audioPlugin,
  autoButtonPlugin,
  autoRestorePlugin,
  autoSavePlugin,
  cdButtonPlugin,
  classTagPlugin,
  fadeEffectPlugin,
  imagePlugin,
  linkOpenPlugin,
  memoryPlugin,
  reignsPlugin,
  scrollAfterChoicePlugin,
} from "@inkweave/plugins/react";

export const initPlugins = (pluginConfig?: Record<string, boolean>, display?: string) => {
  PluginRegistry.clear();
  PluginRegistry.register(imagePlugin);
  PluginRegistry.register(audioPlugin);
  PluginRegistry.register(autoRestorePlugin);
  PluginRegistry.register(autoSavePlugin);
  PluginRegistry.register(fadeEffectPlugin);
  PluginRegistry.register(scrollAfterChoicePlugin);
  PluginRegistry.register(linkOpenPlugin);
  PluginRegistry.register(memoryPlugin);
  PluginRegistry.register(autoButtonPlugin);
  PluginRegistry.register(cdButtonPlugin);
  PluginRegistry.register(classTagPlugin);
  PluginRegistry.registerLayout(reignsPlugin);

  PluginRegistry.setLayout(display ?? null);
  PluginRegistry.setEnabled(pluginConfig ?? {});
};
