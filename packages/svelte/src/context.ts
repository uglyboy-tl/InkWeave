import type { InkStory } from "@inkweave/core";
import { getContext, setContext } from "svelte";

const STORY_KEY = Symbol("inkweave-story");

export function setStoryContext(ink: InkStory): void {
  setContext(STORY_KEY, ink);
}

export function getStoryContext(): InkStory {
  const ink = getContext<InkStory>(STORY_KEY);
  if (!ink) {
    throw new Error("getStoryContext must be used within a Story component");
  }
  return ink;
}
