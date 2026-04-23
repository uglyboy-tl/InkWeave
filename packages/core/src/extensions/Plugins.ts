import type { InkStory } from "../story/InkStory";
import { Events, type Plugin } from "../types";
import { ChoiceParser } from "./ChoiceParser";
import { ExternalFunctions } from "./ExternalFunctions";
import { Parser } from "./Parser";
import { Patches } from "./Patches";
import { Tags } from "./Tags";

export class Plugins {
  private static _plugins: Map<string, Plugin> = new Map();
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

  loadEnabledPlugins() {
    Plugins._plugins.forEach((plugin, id) => {
      // 从 ink.options 检查是否启用了该插件
      const enabled = plugin.enabledByDefault;

      // 检查此插件是否已在该实例上加载
      if (enabled && !this._loadedPluginIds.has(id)) {
        plugin.onLoad();
        this._loadedPluginIds.add(id);
      }
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
