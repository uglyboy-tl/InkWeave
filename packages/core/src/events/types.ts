import type { InkStoryContext } from "../types";

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
