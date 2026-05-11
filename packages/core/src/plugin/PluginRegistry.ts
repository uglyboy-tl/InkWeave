import { defaultLayoutPlugin } from "./defaultLayoutPlugin";
import type { Layout, Plugin } from "./types";

export class PluginRegistry {
  private static _layouts: Map<string, Layout> = new Map();
  private static _plugins: Map<string, Plugin> = new Map();
  private static _enabledConfig: Record<string, boolean> = {};
  private static _activeLayoutId: string | null = null;

  private static ensureBuiltinPlugins() {
    if (!PluginRegistry._layouts.has("default-layout")) {
      PluginRegistry._layouts.set("default-layout", defaultLayoutPlugin);
    }
  }

  static register(plugin: Plugin) {
    PluginRegistry._plugins.set(plugin.id, plugin);
  }

  static registerLayout(plugin: Layout) {
    PluginRegistry._layouts.set(plugin.id, plugin);
  }

  // --- 公共 ---

  static get(id: string): Layout | Plugin | undefined {
    return PluginRegistry._layouts.get(id) ?? PluginRegistry._plugins.get(id);
  }

  static getPlugins(): Plugin[] {
    return Array.from(PluginRegistry._plugins.values());
  }

  static getLayouts(): Layout[] {
    return Array.from(PluginRegistry._layouts.values());
  }

  // --- Layout ---

  static setLayout(pluginId: string | null) {
    PluginRegistry.ensureBuiltinPlugins();
    if (pluginId !== null && !PluginRegistry._layouts.has(pluginId)) {
      console.warn(`InkWeave: display plugin "${pluginId}" not found`);
      return;
    }
    PluginRegistry._activeLayoutId = pluginId;
  }

  static getActiveLayout(): Layout | null {
    PluginRegistry.ensureBuiltinPlugins();
    const id = PluginRegistry._activeLayoutId ?? "default-layout";
    return PluginRegistry._layouts.get(id) ?? null;
  }

  // --- Plugin ---

  static setEnabled(enabled: Record<string, boolean>) {
    PluginRegistry.ensureBuiltinPlugins();
    if (!enabled || typeof enabled !== "object") return;
    const validated = Object.fromEntries(
      Object.entries(enabled).filter(([, value]) => typeof value === "boolean"),
    );
    const resolved = PluginRegistry.resolveDependencies(validated);
    PluginRegistry._enabledConfig = { ...PluginRegistry._enabledConfig, ...resolved };
  }

  static isEnabled(id: string): boolean {
    if (PluginRegistry._layouts.has(id)) {
      return id === (PluginRegistry._activeLayoutId ?? "default-layout");
    }

    // 活跃 Layout 的 exclude 列表中的插件自动禁用
    const layout = PluginRegistry.getActiveLayout();
    if (layout?.exclude?.includes(id)) {
      if (!(id in PluginRegistry._enabledConfig)) {
        return false;
      }
    }

    const configValue = PluginRegistry._enabledConfig[id];
    if (configValue !== undefined) return configValue;
    return PluginRegistry._plugins.get(id)?.enabledByDefault ?? true;
  }

  static clear() {
    PluginRegistry._layouts.clear();
    PluginRegistry._plugins.clear();
    PluginRegistry._enabledConfig = {};
    PluginRegistry._activeLayoutId = null;
  }

  static resolveDependencies(pluginConfig: Record<string, boolean>): Record<string, boolean> {
    const resolved = { ...pluginConfig };

    const deps: Record<string, string[]> = {};
    const rdeps: Record<string, string[]> = {};
    for (const [id, plugin] of PluginRegistry._plugins) {
      deps[id] = plugin.dependencies ?? [];
      if (!rdeps[id]) rdeps[id] = [];
    }
    for (const [id, plugin] of PluginRegistry._plugins) {
      for (const dep of plugin.dependencies ?? []) {
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
        for (const next of edges[id] ?? []) {
          if (!found.has(next)) {
            found.add(next);
            queue.push(next);
          }
        }
      }
      return found;
    };

    for (const [id, enabled] of Object.entries(pluginConfig)) {
      if (enabled) {
        for (const dep of bfs(id, deps)) {
          if (!(dep in pluginConfig && !pluginConfig[dep])) {
            resolved[dep] = true;
          }
        }
      }
    }

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
