import type { InkStory } from "./InkStory";

type ExternalFn = (...args: unknown[]) => unknown;

type ExternalResolver = (id: string) => ExternalFn | undefined;

export class Externals {
  private static _functions: Map<string, ExternalFn> = new Map();
  private static _resolver?: ExternalResolver;

  static get functions() {
    return Externals._functions;
  }

  static setResolver(resolver: ExternalResolver) {
    Externals._resolver = resolver;
  }

  static add(id: string, func: ExternalFn) {
    Externals.functions.set(id, func);
  }

  static get(id: string) {
    return Externals.functions.get(id);
  }

  static bind(ink: InkStory, id: string) {
    let externalFn = Externals.get(id);
    if (!externalFn && Externals._resolver) {
      externalFn = Externals._resolver(id);
    }
    if (externalFn) {
      ink.story.BindExternalFunction(id, externalFn.bind(ink));
    }
  }

  static clear() {
    Externals.functions.clear();
  }
}
