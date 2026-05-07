import { PluginRegistry } from "@inkweave/core";
import {
  autoButtonPlugin,
  autoRestorePlugin,
  autoSavePlugin,
  cdButtonPlugin,
  classTagPlugin,
  fadeEffectPlugin,
  imagePlugin,
  linkOpenPlugin,
  memoryPlugin,
  scrollAfterChoicePlugin,
} from "@inkweave/plugins/solidjs";

export const initPlugins = (pluginConfig?: Record<string, boolean>) => {
  PluginRegistry.register(imagePlugin);
  PluginRegistry.register(autoRestorePlugin);
  PluginRegistry.register(autoSavePlugin);
  PluginRegistry.register(scrollAfterChoicePlugin);
  PluginRegistry.register(linkOpenPlugin);
  PluginRegistry.register(classTagPlugin);
  PluginRegistry.register(fadeEffectPlugin);
  PluginRegistry.register(memoryPlugin);
  PluginRegistry.register(autoButtonPlugin);
  PluginRegistry.register(cdButtonPlugin);

  if (pluginConfig) {
    PluginRegistry.setEnabled(pluginConfig);
  }
};
