import type { Story } from "inkjs/engine/Story";
import { ExternalFunctions } from "../extensions/ExternalFunctions";
import { Parser } from "../extensions/Parser";
import { Patches } from "../extensions/Patches";
import { Tags } from "../extensions/Tags";
import choicesStore from "../state/choices";
import contentsStore from "../state/contents";
import variablesStore from "../state/variables";
import type { InkStoryContext, InkStoryOptions } from "../types";
import { CHOICE_SEPARATOR, DEFAULT_STORY_OPTIONS } from "../types";

type CleanupFunction = () => void;
type SideEffectFunction = () => void;
type ClearFunction = () => void;

export class InkStory implements InkStoryContext {
  title: string;
  story: Story;
  options: InkStoryOptions;
  _side_effects: SideEffectFunction[] = [];
  _cleanups: CleanupFunction[] = [];
  _clears: ClearFunction[] = [];
  _save_label: string[] = ["contents"];
  [key: string]: unknown;

  constructor(story: Story, title: string, options?: InkStoryOptions) {
    this.options = { ...DEFAULT_STORY_OPTIONS, ...options };
    this.story = story;
    this.title = title;
    const content = this.story.ToJson() || "";
    bindFunctions(this);
    Patches.apply(this, content);
    this.bindExternalFunctions(content);
    this.clears.push(() => {
      this.contents.length = 0;
    });
  }

  get contents() {
    return contentsStore.getState().contents;
  }

  set contents(newContent: string[]) {
    contentsStore.getState().setContents(newContent);
  }

  get choices() {
    return choicesStore.getState().choices;
  }

  get clears() {
    return this._clears;
  }

  get cleanups() {
    return this._cleanups;
  }

  get effects() {
    return this._side_effects;
  }

  get save_label() {
    return this._save_label;
  }

  continue() {
    const newContent: string[] = [];

    while (this.story.canContinue) {
      let current_text = this.story.Continue() || "";
      if (this.story.currentTags) {
        this.story.currentTags.forEach((tag) => {
          Tags.process(this, tag);
          if (tag === "clear" || tag === "restart") {
            newContent.length = 0;
          }
        });
        if (current_text && this.story.currentTags.length) {
          current_text = Parser.process(current_text, this.story.currentTags);
        }
      }

      if (current_text.trim()) newContent.push(current_text);
    }
    contentsStore.getState().add(newContent);

    const { currentChoices, variablesState } = this.story;
    choicesStore.getState().setChoices(currentChoices);
    variablesStore.getState().setGlobalVars(variablesState);
  }

  choose(index: number) {
    this.story.ChooseChoiceIndex(index);
    contentsStore.getState().add([CHOICE_SEPARATOR]);
    this.continue();
  }

  clear() {
    this.clears.forEach((clear) => {
      clear();
    });
  }

  restart() {
    this.story.ResetState();
    this.clear();
    this.continue();
  }

  useEffect() {
    this.effects.forEach((effect) => {
      if (effect) {
        effect();
      }
    });
  }

  dispose() {
    this.cleanups.forEach((cleanup) => {
      if (cleanup) {
        cleanup();
      }
    });
  }

  bindExternalFunctions = (content: string) => {
    new Set(Array.from(content.matchAll(/"x\(\)":"(\w+)/gi), (m) => m["1"])).forEach((match) => {
      ExternalFunctions.bind(this, match);
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
      targetRecord[property] = targetRecord[property].bind(target);
    }
  });
}
