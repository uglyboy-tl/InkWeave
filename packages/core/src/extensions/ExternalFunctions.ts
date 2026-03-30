import type { InkStory } from "../story/InkStory";

export class ExternalFunctions {
  private static _functions: Map<string, Function> = new Map();

  static get functions() {
    return ExternalFunctions._functions;
  }

  static set functions(value: Map<string, Function>) {
    ExternalFunctions._functions = value;
  }

  static add(id: string, func: Function) {
    ExternalFunctions.functions.set(id, func);
  }

  static get(id: string) {
    return ExternalFunctions.functions.get(id);
  }

  static bind(ink: InkStory, id: string) {
    const externalFunction =
      ExternalFunctions.get(id) ||
      (typeof window !== "undefined"
        ? (window as unknown as Record<string, Function>)[id]
        : undefined);
    if (externalFunction) {
      ink.story.BindExternalFunction(id, externalFunction.bind(ink));
    }
  }

  static clear() {
    ExternalFunctions.functions.clear();
  }
}
