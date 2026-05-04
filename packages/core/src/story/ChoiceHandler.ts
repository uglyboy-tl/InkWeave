import type { Choice as InkChoice } from "inkjs/engine/Choice";
import type { Choice } from "../types";
import { splitAtCharacter } from "./utils";

type ChoiceHandlerFn = (choice: Choice, val?: string) => void;

export class ChoiceHandler {
  private static _handlers: Map<string, ChoiceHandlerFn> = new Map();
  private static readonly _builtins: Set<string> = new Set(["unclickable"]);

  static get handlers() {
    return ChoiceHandler._handlers;
  }

  static clear = () => {
    for (const [key] of ChoiceHandler._handlers.entries()) {
      if (!ChoiceHandler._builtins.has(key)) {
        ChoiceHandler._handlers.delete(key);
      }
    }
  };

  static add = (tag: string, callback: ChoiceHandlerFn) => {
    ChoiceHandler.handlers.set(tag, callback);
  };

  static process = (item: InkChoice, choice: Choice) => {
    if (!item.text) return choice;

    if (item.tags?.length && ChoiceHandler.handlers.size) {
      item.tags.forEach((tag) => {
        const splitTag = splitAtCharacter(tag, ":");

        if (splitTag && ChoiceHandler.handlers.has(splitTag.before)) {
          ChoiceHandler.handlers.get(splitTag.before)?.(choice, splitTag.after);
        }
      });
    }
  };
}

ChoiceHandler.add("unclickable", (choice) => {
  choice.type = "unclickable";
});
