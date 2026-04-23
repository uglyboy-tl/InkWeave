import type { InkStory } from "../story/InkStory";
import { Events, type Plugin } from "../types";
import { ChoiceParser } from "./ChoiceParser";
import { ExternalFunctions } from "./ExternalFunctions";
import { Parser } from "./Parser";
import { Patches } from "./Patches";
import { Tags } from "./Tags";

export class Plugins {
  private static _plugins: Map<string, Plugin> = new Map();
  private static _pluginsEnabled: Record<string, boolean> = {}; // 全局插件启用状态映射
  private _loadedPluginIds: Set<string> = new Set(); // 当前实例已加载的插件ID

  constructor(ink: InkStory) {
    this.loadEnabledPlugins();
    // 监听故事销毁事件来清理插件状态
    ink.eventEmitter.on(Events.STORY_DISPOSE, () => {
      this.clear();
    });
    return;
  }

  static register(plugin: Plugin) {
    Plugins._plugins.set(plugin.id, plugin);
  }

  static setPluginsEnabled(enabled: Record<string, boolean>) {
    if (enabled && typeof enabled === "object") {
      // 只添加 boolean 类型的值
      const validatedConfig = Object.fromEntries(
        Object.entries(enabled).filter(([, value]) => typeof value === "boolean"),
      );
      Plugins._pluginsEnabled = { ...Plugins._pluginsEnabled, ...validatedConfig };
    }
  }

  loadEnabledPlugins() {
    // 使用 filter 和 forEach 来处理插件加载
    Array.from(Plugins._plugins.entries())
      .filter(([id, plugin]) => {
        // 获取配置值，undefined 表示未配置
        const configValue = Plugins._pluginsEnabled[id];
        // 如果有配置，使用配置值；否则使用默认值
        const isEnabled =
          configValue !== undefined ? configValue : (plugin.enabledByDefault ?? true);
        return isEnabled && !this._loadedPluginIds.has(id);
      })
      .forEach(([, plugin]) => {
        plugin.onLoad();
        this._loadedPluginIds.add(plugin.id);
      });
  }

  clear() {
    this._loadedPluginIds.clear();
    Patches.clear();
    Tags.clear();
    ChoiceParser.clear();
    Parser.clear();
    ExternalFunctions.clear();
  }

  static getAllPlugins() {
    return Array.from(Plugins._plugins.keys());
  }

  getLoadedPlugins() {
    return Array.from(this._loadedPluginIds);
  }
}
