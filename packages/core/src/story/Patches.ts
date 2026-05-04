import type { InkStoryContext } from "../types";

export type PatchFn = (this: InkStoryContext, content: string) => void;

export class Patches {
  private static _patches: PatchFn[] = [];
  private static _options: Record<string, unknown> = {};

  static get patches() {
    return Patches._patches;
  }

  static add(callback: PatchFn | null, patchOptions: Record<string, unknown> = {}) {
    Object.assign(Patches._options, patchOptions);
    if (callback) Patches._patches.push(callback);
  }

  static apply(story: InkStoryContext, content: string) {
    if (!story.options) return;
    Object.assign(story.options, Patches._options);
    for (const patch of Patches._patches) {
      if (patch) {
        patch.call(story, content);
      }
    }
  }

  static clear() {
    Patches._patches = [];
    Patches._options = {};
  }
}
