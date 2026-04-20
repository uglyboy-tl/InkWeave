/**
 * 事件发射器类，用于在 InkWeave 组件之间实现事件驱动通信
 * 借鉴 Calico 的事件系统设计模式
 */

import type { EventData, EventEmitterInterface, EventHandler } from "../types";

export class EventEmitter implements EventEmitterInterface {
  private handlers: Map<string, Set<EventHandler<EventData>>> = new Map();

  /**
   * 订阅事件
   * @param eventName 事件名称
   * @param handler 事件处理器
   */
  on<T extends EventData = EventData>(eventName: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set<EventHandler<EventData>>());
    }

    const handlers = this.handlers.get(eventName);
    if (handlers) {
      handlers.add(handler as EventHandler<EventData>);
    }

    // 返回取消订阅函数
    return () => this.off(eventName, handler);
  }

  /**
   * 取消订阅事件
   * @param eventName 事件名称
   * @param handler 事件处理器
   */
  off<T extends EventData = EventData>(eventName: string, handler: EventHandler<T>): void {
    const handlers = this.handlers.get(eventName);
    if (handlers) {
      handlers.delete(handler as EventHandler<EventData>);
      if (handlers.size === 0) {
        this.handlers.delete(eventName);
      }
    }
  }

  /**
   * 发射事件
   * @param eventName 事件名称
   * @param data 事件数据
   */
  emit<T extends EventData = EventData>(eventName: string, data?: T): void {
    const handlers = this.handlers.get(eventName);
    if (handlers) {
      // 创建副本以防止在迭代过程中修改集合
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

  /**
   * 订阅一次性的事件
   * @param eventName 事件名称
   * @param handler 事件处理器
   */
  once<T extends EventData = EventData>(eventName: string, handler: EventHandler<T>): () => void {
    const unsubscribe = this.on(eventName, (data: T) => {
      handler(data);
      unsubscribe();
    });

    return unsubscribe;
  }

  /**
   * 获取指定事件的处理器数量
   * @param eventName 事件名称
   */
  listenerCount(eventName: string): number {
    const handlers = this.handlers.get(eventName);
    return handlers?.size ?? 0;
  }

  /**
   * 清空所有事件处理器
   */
  clear(): void {
    this.handlers.clear();
  }
}
