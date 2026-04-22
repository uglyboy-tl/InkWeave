import type { Story } from "inkjs/engine/Story";
import { EventEmitter } from "../extensions/EventEmitter";
import { ExternalFunctions } from "../extensions/ExternalFunctions";
import { Parser } from "../extensions/Parser";
import { Patches } from "../extensions/Patches";
import { Plugins } from "../extensions/Plugins";
import { Tags } from "../extensions/Tags";
import choicesStore from "../state/choices";
import contentsStore from "../state/contents";
import variablesStore from "../state/variables";
import type {
  ContentItem,
  EventEmitterInterface,
  InkStoryContext,
  InkStoryOptions,
} from "../types";
import { CHOICE_SEPARATOR, DEFAULT_STORY_OPTIONS, Events } from "../types";

export class InkStory implements InkStoryContext {
  title: string;
  story: Story;
  options: InkStoryOptions;
  eventEmitter: EventEmitterInterface;
  plugins: Plugins;
  _save_label: string[] = ["contents"];
  [key: string]: unknown;

  constructor(story: Story, title: string, options?: InkStoryOptions) {
    this.options = { ...DEFAULT_STORY_OPTIONS, ...options };
    this.story = story;
    this.title = title;
    this.eventEmitter = new EventEmitter() as EventEmitterInterface;
    this.plugins = new Plugins(this);
    const content = this.story.ToJson() || "";
    bindFunctions(this);
    Patches.apply(this, content);
    this.bindExternalFunctions(content);

    // 使用事件系统来清除内容
    const unsubscribeClear = this.eventEmitter.on(Events.STORY_CLEARED, () => {
      contentsStore.getState().clear();
    });

    /**
     * 注册 story.dispose 监听器来自动清理 story.cleared 监听器
     * 这是唯一注册后不移除的监听器，因为它的生命周期与 InkStory 实例相同
     * 当 dispose 被调用时，unsub 会自动取消 story.cleared 的监听器
     */
    this.eventEmitter.on(Events.STORY_DISPOSE, () => {
      unsubscribeClear();
    });

    // 发射初始化事件，让插件可以扩展或自定义行为
    // 延迟到构造函数末尾，确保实例完全初始化
    this.eventEmitter.emit(Events.STORY_INITIALIZED, { story: this });
  }

  get contents() {
    return contentsStore.getState().contents;
  }

  set contents(newContent: ContentItem[]) {
    const oldContents = this.contents.length > 0 ? [...this.contents] : [];
    contentsStore.getState().setContents(newContent);

    // 发射内容变更事件
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

  get save_label() {
    return this._save_label;
  }

  continue() {
    // 发射故事继续前事件
    this.eventEmitter.emit(Events.STORY_CONTINUE_START, { story: this, state: this.story.state });

    const newContent: ContentItem[] = [];

    while (this.story.canContinue) {
      let current_content: ContentItem = { text: this.story.Continue() || "" };
      if (this.story.currentTags) {
        this.story.currentTags.forEach((tag) => {
          Tags.process(this, tag);
          if (tag === "clear" || tag === "restart") {
            newContent.length = 0;
          }
        });
        if (current_content.text && this.story.currentTags.length) {
          current_content = Parser.process(current_content.text, this.story.currentTags);
        }
      }

      if (current_content.text.trim()) newContent.push(current_content);
    }
    contentsStore.getState().add(newContent);

    const { currentChoices, variablesState } = this.story;
    choicesStore.getState().setChoices(currentChoices);
    variablesStore.getState().setGlobalVars(variablesState);

    // 发射故事继续后事件
    this.eventEmitter.emit(Events.STORY_CONTINUE_END, {
      story: this,
      state: this.story.state,
      newContent,
      choices: currentChoices,
      variables: variablesState,
    });
  }

  choose(index: number) {
    // 发射选择前事件
    this.eventEmitter.emit(Events.CHOICE_SELECTING, {
      story: this,
      index,
      choices: this.choices,
      selectedChoice: this.choices[index],
    });

    this.story.ChooseChoiceIndex(index);
    contentsStore.getState().add([{ text: CHOICE_SEPARATOR }]);
    this.continue();

    // 发射选择后事件
    this.eventEmitter.emit(Events.CHOICE_SELECTED, {
      story: this,
      index,
      choices: this.choices,
      selectedChoice: this.choices[index],
    });
  }

  clear() {
    this.eventEmitter.emit(Events.STORY_CLEARED, { story: this });
  }

  restart() {
    this.eventEmitter.emit(Events.STORY_RESTART_START, { story: this });

    this.story.ResetState();
    this.clear(); // this will emit story.clear.start and story.clear.end
    this.continue();

    this.eventEmitter.emit(Events.STORY_RESTART_END, { story: this });
  }

  dispose() {
    this.eventEmitter.emit(Events.STORY_DISPOSE, { story: this });
    this.clear();
    this.eventEmitter.clear();
  }

  bindExternalFunctions = (content: string) => {
    const matches = Array.from(content.matchAll(/"x\(\)":"(\w+)/gi));
    const externalIds = new Set(
      matches.map((m) => m[1]).filter((id): id is string => id !== undefined),
    );
    externalIds.forEach((id) => {
      ExternalFunctions.bind(this, id);
    });
  };
}

function bindFunctions(target: object) {
  const prototype = Object.getPrototypeOf(target);

  Object.getOwnPropertyNames(prototype).forEach((property) => {
    if (
      property !== "constructor" &&
      typeof Object.getOwnPropertyDescriptor(prototype, property)?.value === "function"
    ) {
      const targetRecord = target as Record<string, (...args: unknown[]) => unknown>;
      const method = targetRecord[property];
      if (method) {
        targetRecord[property] = method.bind(target);
      }
    }
  });
}
