import type { ErrorHandler as InkErrorHandler } from "inkjs/engine/Error";

export type ErrorHandler = InkErrorHandler;

export type EventHandler<T = unknown> = (data: T) => void;

export interface EventData {
  story?: InkStoryContext;
  [key: string]: unknown;
}

export interface EventEmitterInterface {
  on<T extends EventData = EventData>(eventName: string, handler: EventHandler<T>): () => void;
  off<T extends EventData = EventData>(eventName: string, handler: EventHandler<T>): void;
  emit<T extends EventData = EventData>(eventName: string, data?: T): void;
  once<T extends EventData = EventData>(eventName: string, handler: EventHandler<T>): () => void;
  listenerCount(eventName: string): number;
  clear(): void;
}

// Constants
export const CHOICE_SEPARATOR = "\x00ink-divider\x00";

export const DEFAULT_STORY_OPTIONS: InkStoryOptions = {
  debug: false,
};

// Types
export interface FileHandler {
  loadFile(filename: string): string;
}

export class BaseFileHandler implements FileHandler {
  protected basePath: string;

  constructor(options?: { basePath?: string }) {
    this.basePath = options?.basePath || "";
  }

  resolveFilename(filename: string): string {
    if (this.basePath) {
      return `${this.basePath.replace(/\/$/, "")}/${filename}`;
    }
    return filename;
  }

  loadFile(_filename: string): string {
    throw new Error("loadFile must be implemented by subclass");
  }
}

export interface InkStoryOptions {
  title?: string;
  debug?: boolean;
  linedelay?: number;
  errorHandler?: ErrorHandler;
  fileHandler?: FileHandler;
  [key: string]: unknown;
}

export interface InkStoryContext {
  options: InkStoryOptions;
  save_label: string[];
  eventEmitter: EventEmitterInterface;
  [key: string]: unknown;
}

export interface ContentItem {
  text: string;
  classes?: string[];
}

export interface SaveData {
  state: string;
  contents?: ContentItem[];
  image?: string;
  [key: string]: unknown;
}

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
} as const;

export class Choice {
  text: string;
  index: number;
  type: string;
  val?: string;
  constructor(text: string, index: number, type: string = "default") {
    this.text = text || "";
    this.index = index;
    this.type = type;
  }
}
