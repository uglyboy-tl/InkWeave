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
} from "@inkweave/plugins/solidjs";

export const initPlugins = (pluginConfig?: Record<string, boolean>) => {
  PluginRegistry.register(imagePlugin);
  PluginRegistry.register(audioPlugin);
  PluginRegistry.register(autoRestorePlugin);
  PluginRegistry.register(autoSavePlugin);
  PluginRegistry.register(scrollAfterChoicePlugin);
  PluginRegistry.register(linkOpenPlugin);
  PluginRegistry.register(classTagPlugin);
  PluginRegistry.register(fadeEffectPlugin);
  PluginRegistry.register(memoryPlugin);
  PluginRegistry.register(autoButtonPlugin);
  PluginRegistry.register(cdButtonPlugin);
  PluginRegistry.register(reignsPlugin);

  if (pluginConfig) {
    PluginRegistry.setEnabled(pluginConfig);
  }
};
