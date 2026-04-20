// Story

// Create
export { createInkStory } from "./create";
export { ChoiceParser } from "./extensions/ChoiceParser";
export { EventEmitter } from "./extensions/EventEmitter";
export { ExternalFunctions } from "./extensions/ExternalFunctions";
export { Parser, type ParserLine } from "./extensions/Parser";
export { Patches } from "./extensions/Patches";
// Extensions (for plugin development)
export { Tags } from "./extensions/Tags";
export { default as choicesStore } from "./state/choices";
// State stores (for react hooks and plugins)
export { default as contentsStore } from "./state/contents";
export { default as createSelectors } from "./state/createSelectors";
export { default as variablesStore } from "./state/variables";
export { InkStory } from "./story/InkStory";

// Types & Constants (for public API)
export type {
  ContentItem,
  ErrorHandler,
  EventData,
  FileHandler,
  InkStoryContext,
  InkStoryOptions,
  SaveData,
} from "./types";
export { BaseFileHandler, CHOICE_SEPARATOR, Choice, Events } from "./types";
