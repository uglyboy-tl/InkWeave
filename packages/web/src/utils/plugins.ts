import { Plugins } from "@inkweave/core";
import {
  audioPlugin,
  autoButtonPlugin,
  autoRestorePlugin,
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
  Plugins.register(fadeEffectPlugin);
  Plugins.register(scrollAfterChoicePlugin);
  Plugins.register(linkOpenPlugin);
  Plugins.register(memoryPlugin);
  Plugins.register(autoButtonPlugin);
  Plugins.register(cdButtonPlugin);
  Plugins.register(classTagPlugin);

  // 设置插件启用配置
  if (pluginConfig) {
    Plugins.setPluginsEnabled(pluginConfig);
  }
};
