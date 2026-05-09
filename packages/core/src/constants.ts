import type { InkStoryOptions } from "./types";

export const CHOICE_SEPARATOR = "\x00ink-divider\x00";

export const DEFAULT_STORY_OPTIONS: InkStoryOptions = {
  debug: false,
};

export const Events = {
  STORY_INITIALIZED: "story.initialized",
  STORY_CLEARED: "story.cleared",
  STORY_DISPOSE: "story.dispose",
  STORY_RESTART_START: "story.restart.start",
  STORY_RESTART_END: "story.restart.end",
  STORY_CONTINUE_START: "story.continue.start",
  STORY_CONTINUE_END: "story.continue.end",
  CHOICE_SELECTING: "choice.selecting",
  CHOICE_SELECTED: "choice.selected",
  CONTENTS_CHANGED: "contents.changed",
  INTERACTION_TRIGGERED: "interaction.triggered",
} as const;
