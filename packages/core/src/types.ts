import type { ErrorHandler as InkErrorHandler } from "inkjs/engine/Error";
import type { EventEmitterInterface } from "./events/types";
import type { FileHandler } from "./file/FileHandler";

export type ErrorHandler = InkErrorHandler;

export interface InkStoryOptions {
  title?: string;
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
  [key: string]: unknown;
}

export class Choice {
  text: string;
  index: number;
  type: string;
  val?: string;
  classes: string[];
  constructor(text: string, index: number, type: string = "default") {
    this.text = text || "";
    this.index = index;
    this.type = type;
    this.classes = ["inkweave-choice"];
  }
}

export type TranslationFunction = (content: string | undefined) => string | undefined;
