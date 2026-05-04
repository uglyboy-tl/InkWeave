import type { EventData, EventEmitterInterface, EventHandler } from "./types";

export class EventEmitter implements EventEmitterInterface {
  private handlers: Map<string, Set<EventHandler<EventData>>> = new Map();

  on<T extends EventData = EventData>(eventName: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set<EventHandler<EventData>>());
    }

    this.handlers.get(eventName)?.add(handler as EventHandler<EventData>);

    return () => this.off(eventName, handler);
  }

  off<T extends EventData = EventData>(eventName: string, handler: EventHandler<T>): void {
    const handlers = this.handlers.get(eventName);
    if (handlers) {
      handlers.delete(handler as EventHandler<EventData>);
      if (handlers.size === 0) {
        this.handlers.delete(eventName);
      }
    }
  }

  emit<T extends EventData = EventData>(eventName: string, data?: T): void {
    const handlers = this.handlers.get(eventName);
    if (handlers) {
      const handlersCopy = Array.from(handlers) as EventHandler<T>[];
      for (const handler of handlersCopy) {
        try {
          handler(data || ({} as T));
        } catch (error) {
          console.error(`Error in event handler for "${eventName}":`, error);
        }
      }
    }
  }

  once<T extends EventData = EventData>(eventName: string, handler: EventHandler<T>): () => void {
    const unsubscribe = this.on(eventName, (data: T) => {
      handler(data);
      unsubscribe();
    });

    return unsubscribe;
  }

  listenerCount(eventName: string): number {
    const handlers = this.handlers.get(eventName);
    return handlers?.size ?? 0;
  }

  clear(): void {
    this.handlers.clear();
  }
}
