import type { InkStory } from "./InkStory";
import { splitAtCharacter } from "./utils";

type TagHandlerFn = (val: string | null | undefined, ink: InkStory) => void;

export class TagHandler {
  private static _handlers: Map<string, TagHandlerFn> = new Map();
  private static readonly _builtins: Set<string> = new Set(["clear", "restart"]);

  static get handlers() {
    return TagHandler._handlers;
  }

  static clear() {
    for (const [key] of TagHandler._handlers.entries()) {
      if (!TagHandler._builtins.has(key)) {
        TagHandler._handlers.delete(key);
      }
    }
  }

  static add(tagName: string, callback: TagHandlerFn) {
    TagHandler.handlers.set(tagName, callback);
  }

  static isFlushTag(tagName: string): boolean {
    return TagHandler._builtins.has(tagName);
  }

  static process = (ink: InkStory, inputString: string) => {
    const splitTag = splitAtCharacter(inputString, ":");
    if (splitTag) {
      if (TagHandler.handlers.has(splitTag.before)) {
        TagHandler.handlers.get(splitTag.before)?.(splitTag.after, ink);
      } else {
        const options = ink.options as Record<string, unknown>;
        if (options[splitTag.before] !== undefined) {
          let newValue: string | number | boolean | undefined = splitTag.after;
          const optionType = typeof options[splitTag.before];
          switch (optionType) {
            case "string":
              break;
            case "number":
              if (typeof newValue === "string") {
                newValue = parseFloat(newValue);
              } else {
                newValue = undefined;
              }
              break;
            case "boolean":
              newValue = !!newValue;
              break;
            default:
              newValue = undefined;
          }
          if (newValue !== undefined && !Number.isNaN(newValue)) {
            options[splitTag.before] = newValue;
          }
        }
      }
    }
  };
}

TagHandler.add("clear", (_: string | null | undefined, ink: InkStory) => {
  ink.clear();
});

TagHandler.add("restart", (_: string | null | undefined, ink: InkStory) => {
  ink.restart();
});
