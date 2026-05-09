import { Events } from "../constants";
import type { Choice } from "../types";
import type { InkStory } from "./InkStory";

export type InteractionResolver = (choices: Choice[]) => number | null;

export class InteractionManager {
  private _rules: Map<string, InteractionResolver> = new Map();
  private _story: InkStory;

  static presets = {
    left: (choices: Choice[]) => choices[0]?.index ?? null,
    right: (choices: Choice[]) => choices[1]?.index ?? null,
    first: (choices: Choice[]) => choices[0]?.index ?? null,
    second: (choices: Choice[]) => choices[1]?.index ?? null,
  } as const;

  constructor(story: InkStory) {
    this._story = story;
  }

  get story(): InkStory {
    return this._story;
  }

  register(name: string, resolver: InteractionResolver): void {
    this._rules.set(name, resolver);
  }

  unregister(name: string): void {
    this._rules.delete(name);
  }

  trigger(name: string): boolean {
    const resolver = this._rules.get(name);
    if (!resolver) {
      console.warn(`InteractionManager: "${name}" is not registered`);
      return false;
    }

    const choices = this._story.choices;
    const index = resolver(choices);
    if (index === null || index === undefined) return false;

    this._story.eventEmitter.emit(Events.INTERACTION_TRIGGERED, {
      story: this._story,
      interaction: name,
      index,
    });

    return true;
  }

  getRegistered(): string[] {
    return Array.from(this._rules.keys());
  }

  has(name: string): boolean {
    return this._rules.has(name);
  }

  clear(): void {
    this._rules.clear();
  }
}
