import type { Plugin } from "./types";

export class PluginRegistry {
  private static _plugins: Map<string, Plugin> = new Map();
  private static _enabledConfig: Record<string, boolean> = {};

  static get plugins() {
    return PluginRegistry._plugins;
  }

  static register(plugin: Plugin) {
    PluginRegistry._plugins.set(plugin.id, plugin);
  }

  static get(id: string): Plugin | undefined {
    return PluginRegistry._plugins.get(id);
  }

  static getAll(): Plugin[] {
    return Array.from(PluginRegistry._plugins.values());
  }

  static setEnabled(enabled: Record<string, boolean>) {
    if (enabled && typeof enabled === "object") {
      const validated = Object.fromEntries(
        Object.entries(enabled).filter(([, value]) => typeof value === "boolean"),
      );
      const resolved = PluginRegistry.resolveDependencies(validated);
      PluginRegistry._enabledConfig = { ...PluginRegistry._enabledConfig, ...resolved };
    }
  }

  static isEnabled(id: string): boolean {
    const configValue = PluginRegistry._enabledConfig[id];
    if (configValue !== undefined) return configValue;
    const plugin = PluginRegistry._plugins.get(id);
    return plugin?.enabledByDefault ?? true;
  }

  static clear() {
    PluginRegistry._plugins.clear();
    PluginRegistry._enabledConfig = {};
  }

  static resolveDependencies(pluginConfig: Record<string, boolean>): Record<string, boolean> {
    const resolved = { ...pluginConfig };

    const deps: Record<string, string[]> = {};
    const rdeps: Record<string, string[]> = {};
    for (const [id, plugin] of PluginRegistry._plugins) {
      deps[id] = plugin.dependencies || [];
      if (!rdeps[id]) rdeps[id] = [];
    }
    for (const [id, plugin] of PluginRegistry._plugins) {
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
