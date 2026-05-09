import type { Story } from "inkjs/engine/Story";
import { DEFAULT_STORY_OPTIONS, Events } from "../constants";
import { EventEmitter } from "../events/EventEmitter";
import { PluginLoader } from "../plugin/PluginLoader";
import choicesStore from "../state/choices";
import contentsStore from "../state/contents";
import variablesStore from "../state/variables";
import type { ContentItem, InkStoryContext, InkStoryOptions } from "../types";
import { ContentParser } from "./ContentParser";
import { Externals } from "./Externals";
import { InteractionManager } from "./InteractionManager";
import { Patches } from "./Patches";
import { TagHandler } from "./TagHandler";

export class InkStory implements InkStoryContext {
  title: string;
  story: Story;
  options: InkStoryOptions;
  eventEmitter: EventEmitter;
  pluginLoader: PluginLoader;
  interactionManager: InteractionManager;
  save_label: string[] = ["contents"];
  [key: string]: unknown;

  constructor(story: Story, title: string, options?: InkStoryOptions) {
    this.options = { ...DEFAULT_STORY_OPTIONS, ...options };
    this.story = story;
    this.title = title;
    this.eventEmitter = new EventEmitter();
    this.pluginLoader = new PluginLoader(this);
    this.interactionManager = new InteractionManager(this);
    this.eventEmitter.on(Events.INTERACTION_TRIGGERED, (data: { index: number }) => {
      this.choose(data.index);
    });
    const content = this.story.ToJson();
    if (content) {
      Patches.apply(this, content);
      this.bindExternalFunctions(content);
    }

    const unsubscribeClear = this.eventEmitter.on(Events.STORY_CLEARED, () => {
      contentsStore.getState().clear();
    });

    this.eventEmitter.on(Events.STORY_DISPOSE, () => {
      unsubscribeClear();
    });

    this.eventEmitter.emit(Events.STORY_INITIALIZED, { story: this });
  }

  get contents() {
    return contentsStore.getState().contents;
  }

  set contents(newContent: ContentItem[]) {
    const oldContents = this.contents.length > 0 ? [...this.contents] : [];
    contentsStore.getState().setContents(newContent);

    this.eventEmitter.emit(Events.CONTENTS_CHANGED, {
      story: this,
      oldContents,
      newContents: newContent,
      timestamp: Date.now(),
    });
  }

  get choices() {
    return choicesStore.getState().choices;
  }

  continue = () => {
    this.eventEmitter.emit(Events.STORY_CONTINUE_START, { story: this, state: this.story.state });

    const newContent: ContentItem[] = [];

    while (this.story.canContinue) {
      let current_content: ContentItem = { text: this.story.Continue() || "" };
      if (this.story.currentTags) {
        this.story.currentTags.forEach((tag) => {
          TagHandler.process(this, tag);
          if (TagHandler.isFlushTag(tag)) {
            newContent.length = 0;
          }
        });
        if (current_content.text && this.story.currentTags.length) {
          current_content = ContentParser.process(current_content.text, this.story.currentTags);
        }
      }

      if (current_content.text.trim()) newContent.push(current_content);
    }
    contentsStore.getState().add(newContent);

    const { currentChoices, variablesState } = this.story;
    choicesStore.getState().setChoices(currentChoices);
    variablesStore.getState().setGlobalVars(variablesState);

    this.eventEmitter.emit(Events.CONTENTS_CHANGED, {
      story: this,
      newContents: newContent,
      timestamp: Date.now(),
    });

    this.eventEmitter.emit(Events.STORY_CONTINUE_END, {
      story: this,
      state: this.story.state,
      newContent,
      choices: currentChoices,
      variables: variablesState,
    });
  };

  choose = (index: number) => {
    const preChoices = [...this.choices];
    const preSelectedChoice = preChoices[index];

    this.eventEmitter.emit(Events.CHOICE_SELECTING, {
      story: this,
      index,
      choices: preChoices,
      selectedChoice: preSelectedChoice,
    });

    this.story.ChooseChoiceIndex(index);
    contentsStore.getState().addSeparator();
    this.continue();

    this.eventEmitter.emit(Events.CHOICE_SELECTED, {
      story: this,
      index,
      choices: preChoices,
      selectedChoice: preSelectedChoice,
    });
  };

  clear = () => {
    this.eventEmitter.emit(Events.STORY_CLEARED, { story: this });
  };

  restart = () => {
    this.eventEmitter.emit(Events.STORY_RESTART_START, { story: this });

    this.story.ResetState();
    this.clear();
    this.continue();

    this.eventEmitter.emit(Events.STORY_RESTART_END, { story: this });
  };

  dispose = () => {
    this.clear();
    this.eventEmitter.emit(Events.STORY_DISPOSE, { story: this });
    variablesStore.setState({ variables: new Map<string, unknown>() });
    this.eventEmitter.clear();
  };

  bindExternalFunctions = (content: string) => {
    try {
      const jsonContent = JSON.parse(content);
      const externalIds = new Set<string>();

      const findExternalFunctions = (obj: unknown) => {
        if (typeof obj === "object" && obj !== null) {
          const recordObj = obj as Record<string, unknown>;
          if ("x()" in recordObj && typeof recordObj["x()"] === "string") {
            externalIds.add(recordObj["x()"]);
          }
          for (const key of Object.keys(recordObj)) {
            findExternalFunctions(recordObj[key]);
          }
        }
      };

      findExternalFunctions(jsonContent);
      externalIds.forEach((id) => {
        Externals.bind(this, id);
      });
    } catch (error) {
      console.warn("Failed to parse story content for external functions:", error);
    }
  };
}
