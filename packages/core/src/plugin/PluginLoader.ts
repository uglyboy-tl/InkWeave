import { Events } from "../constants";
import { ChoiceHandler } from "../story/ChoiceHandler";
import { ContentParser } from "../story/ContentParser";
import { Externals } from "../story/Externals";
import type { InkStory } from "../story/InkStory";
import { Patches } from "../story/Patches";
import { TagHandler } from "../story/TagHandler";
import { PluginRegistry } from "./PluginRegistry";

export class PluginLoader {
  private _loadedIds: Set<string> = new Set();
  private _activeClassName: string | null = null;

  constructor(ink: InkStory) {
    this.load();
    ink.eventEmitter.on(Events.STORY_DISPOSE, () => {
      this.dispose();
    });
  }

  get loadedIds() {
    return Array.from(this._loadedIds);
  }

  get activeDisplayClassName(): string | null {
    return this._activeClassName;
  }

  load() {
    this._loadedIds.clear();
    this._activeClassName = null;

    Patches.clear();
    TagHandler.clear();
    ChoiceHandler.clear();
    ContentParser.clear();
    Externals.clear();

    // 加载显示类插件（基础，只有当前激活的）
    const displayPlugin = PluginRegistry.getActiveLayout();
    if (displayPlugin && PluginRegistry.isEnabled(displayPlugin.id)) {
      displayPlugin.onLoad();
      this._loadedIds.add(displayPlugin.id);
      this._activeClassName = displayPlugin.injectClassName ?? null;
    }

    // 加载功能类插件
    for (const plugin of PluginRegistry.getPlugins()) {
      if (PluginRegistry.isEnabled(plugin.id)) {
        plugin.onLoad();
        this._loadedIds.add(plugin.id);
      }
    }
  }

  dispose() {
    this._loadedIds.clear();
    this._activeClassName = null;
  }
}
