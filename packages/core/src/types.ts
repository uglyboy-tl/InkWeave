import type { ErrorHandler as InkErrorHandler } from 'inkjs/engine/Error';

export type ErrorHandler = InkErrorHandler;

// Constants
export const CHOICE_SEPARATOR = '\x00ink-divider\x00';

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
    this.basePath = options?.basePath || '';
  }

  resolveFilename(filename: string): string {
    if (this.basePath) {
      return this.basePath + '/' + filename;
    }
    return filename;
  }

  loadFile(_filename: string): string {
    throw new Error('loadFile must be implemented by subclass');
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
  clears: Array<() => void>;
  cleanups: Array<() => void>;
  _side_effects: Array<() => void>;
  [key: string]: unknown;
}

export interface SaveData {
  state: string;
  contents?: string[];
  image?: string;
  [key: string]: unknown;
}

export class Choice {
  text: string;
  index: number;
  type: string;
  val?: string;
  constructor(text: string, index: number, type: string = 'default') {
    this.text = text || '';
    this.index = index;
    this.type = type;
  }
}
