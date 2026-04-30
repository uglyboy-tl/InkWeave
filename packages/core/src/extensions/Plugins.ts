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
      const validatedConfig = Object.fromEntries(
        Object.entries(enabled).filter(([, value]) => typeof value === "boolean"),
      );
      const resolved = Plugins.resolveDependencies(validatedConfig);
      Plugins._pluginsEnabled = { ...Plugins._pluginsEnabled, ...resolved };
    }
  }

  loadEnabledPlugins() {
    this._loadedPluginIds.clear();

    Patches.clear();
    Tags.clear();
    ChoiceParser.clear();
    Parser.clear();
    ExternalFunctions.clear();

    for (const [id, plugin] of Plugins._plugins) {
      const configValue = Plugins._pluginsEnabled[id];
      const isEnabled = configValue !== undefined ? configValue : (plugin.enabledByDefault ?? true);
      if (isEnabled) {
        plugin.onLoad();
        this._loadedPluginIds.add(id);
      }
    }
  }

  clear() {
    this._loadedPluginIds.clear();
  }

  static getAllPlugins() {
    return Array.from(Plugins._plugins.keys());
  }

  getLoadedPlugins() {
    return Array.from(this._loadedPluginIds);
  }

  /**
   * 解析插件启用配置中的依赖级联关系：
   * - 启用某插件时，自动启用其所有依赖（依赖优先于禁用）
   * - 禁用某插件时，自动禁用所有依赖它的插件（但显式启用的除外）
   */
  static resolveDependencies(pluginConfig: Record<string, boolean>): Record<string, boolean> {
    const resolved = { ...pluginConfig };

    // Build dependency graphs from registered plugins
    const deps: Record<string, string[]> = {};
    const rdeps: Record<string, string[]> = {};
    for (const [id, plugin] of Plugins._plugins) {
      deps[id] = plugin.dependencies || [];
      if (!rdeps[id]) rdeps[id] = [];
    }
    for (const [id, plugin] of Plugins._plugins) {
      for (const dep of plugin.dependencies || []) {
        if (!rdeps[dep]) rdeps[dep] = [];
        rdeps[dep].push(id);
      }
    }

    const bfs = (start: string, edges: Record<string, string[]>): Set<string> => {
      const found = new Set<string>();
      const seen = new Set<string>();
      const queue = [start];
      let head = 0;
      while (head < queue.length) {
        const id = queue[head++];
        if (!id || seen.has(id)) continue;
        seen.add(id);
        for (const next of edges[id] || []) {
          if (!found.has(next)) {
            found.add(next);
            queue.push(next);
          }
        }
      }
      return found;
    };

    // Phase 1: enable dependencies of explicitly enabled plugins,
    // but skip dependencies that were explicitly disabled
    for (const [id, enabled] of Object.entries(pluginConfig)) {
      if (enabled) {
        for (const dep of bfs(id, deps)) {
          if (!(dep in pluginConfig && !pluginConfig[dep])) {
            resolved[dep] = true;
          }
        }
      }
    }

    // Phase 2: disable cascades — disable dependents of explicitly disabled plugins,
    // but only if they weren't explicitly enabled in the original config
    for (const [id, enabled] of Object.entries(pluginConfig)) {
      if (!enabled) {
        for (const dep of bfs(id, rdeps)) {
          if (!(dep in pluginConfig && pluginConfig[dep])) {
            if (resolved[dep] !== false) {
              console.warn(
                `InkWeave: plugin "${dep}" implicitly disabled because "${id}" is disabled`,
              );
            }
            resolved[dep] = false;
          }
        }
      }
    }

    return resolved;
  }
}
