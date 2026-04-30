import type { InkStory } from "../story/InkStory";

type ExternalFunc = (...args: unknown[]) => unknown;

export class ExternalFunctions {
  private static _functions: Map<string, ExternalFunc> = new Map();

  static get functions() {
    return ExternalFunctions._functions;
  }

  static set functions(value: Map<string, ExternalFunc>) {
    ExternalFunctions._functions = value;
  }

  static add(id: string, func: ExternalFunc) {
    ExternalFunctions.functions.set(id, func);
  }

  static get(id: string) {
    return ExternalFunctions.functions.get(id);
  }

  static bind(ink: InkStory, id: string) {
    let externalFunction = ExternalFunctions.get(id);
    if (!externalFunction && typeof window !== "undefined") {
      const fn = (window as unknown as Record<string, unknown>)[id];
      if (typeof fn === "function") {
        externalFunction = fn as ExternalFunc;
      }
    }
    if (externalFunction) {
      ink.story.BindExternalFunction(id, externalFunction.bind(ink));
    }
  }

  static clear() {
    ExternalFunctions.functions.clear();
  }
}
