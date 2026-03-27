// Story
export { InkStory } from './story/InkStory';

// Extensions (for plugin development)
export { Tags } from './extensions/Tags';
export { Parser, type ParserLine } from './extensions/Parser';
export { Patches } from './extensions/Patches';
export { ExternalFunctions } from './extensions/ExternalFunctions';
export { ChoiceParser } from './extensions/ChoiceParser';

// State stores (for react hooks and plugins)
export { default as contentsStore } from './state/contents';
export { default as choicesStore } from './state/choices';
export { default as variablesStore } from './state/variables';
export { default as createSelectors } from './state/createSelectors';

// Create
export { createInkStory } from './create';

// Types & Constants (for public API)
export type { InkStoryOptions, InkStoryContext, SaveData, FileHandler } from './types';
export { Choice, CHOICE_SEPARATOR, BaseFileHandler } from './types';