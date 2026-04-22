export interface PluginConfig {
  id: string;
  enabledByDefault: boolean;
  onLoad: () => void;
}

export class Plugins {
  private static _plugins: Map<string, PluginConfig> = new Map();
  private _loadedPluginIds: Set<string> = new Set(); // 当前实例已加载的插件ID

  constructor() {
    this.loadEnabledPlugins();

    // 监听故事销毁事件来清理插件状态
    //ink.eventEmitter.on(Events.STORY_DISPOSE, () => {
    //  this.clear();
    //});
  }

  static register(config: PluginConfig) {
    Plugins._plugins.set(config.id, config);
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
  }

  static getAllPlugins() {
    return Array.from(Plugins._plugins.keys());
  }

  getLoadedPlugins() {
    return Array.from(this._loadedPluginIds);
  }
}
