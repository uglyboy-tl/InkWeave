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

  constructor(ink: InkStory) {
    this.load();
    ink.eventEmitter.on(Events.STORY_DISPOSE, () => {
      this.dispose();
    });
  }

  get loadedIds() {
    return Array.from(this._loadedIds);
  }

  load() {
    this._loadedIds.clear();

    Patches.clear();
    TagHandler.clear();
    ChoiceHandler.clear();
    ContentParser.clear();
    Externals.clear();

    for (const plugin of PluginRegistry.getAll()) {
      if (PluginRegistry.isEnabled(plugin.id)) {
        plugin.onLoad();
        this._loadedIds.add(plugin.id);
      }
    }
  }

  dispose() {
    this._loadedIds.clear();
  }
}
