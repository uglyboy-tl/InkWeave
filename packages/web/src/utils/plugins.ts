import { Plugins } from "@inkweave/core";
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
  scrollAfterChoicePlugin,
} from "@inkweave/plugins";

export const initPlugins = (pluginConfig?: Record<string, boolean>) => {
  Plugins.register(imagePlugin);
  Plugins.register(audioPlugin);
  Plugins.register(autoRestorePlugin);
  Plugins.register(autoSavePlugin);
  Plugins.register(fadeEffectPlugin);
  Plugins.register(scrollAfterChoicePlugin);
  Plugins.register(linkOpenPlugin);
  Plugins.register(memoryPlugin);
  Plugins.register(autoButtonPlugin);
  Plugins.register(cdButtonPlugin);
  Plugins.register(classTagPlugin);

  if (pluginConfig) {
    Plugins.setPluginsEnabled(pluginConfig);
  }
};
