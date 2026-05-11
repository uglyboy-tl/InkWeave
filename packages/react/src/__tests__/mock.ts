import { vi } from "bun:test";
import { EventEmitter } from "@inkweave/core";

/**
 * 创建 InkStory 的模拟对象
 * 用于测试目的，提供必要的属性和方法
 */
export function createMockInk(
  overrides: Partial<{
    continue?: () => void;
    choose?: (choice: number) => void;
    options?: Record<string, unknown>;
    eventEmitter?: EventEmitter;
    pluginLoader?: { activeDisplayClassName: string | null };
    [key: string]: unknown;
  }> = {},
) {
  return {
    eventEmitter: new EventEmitter(),
    continue: vi.fn(),
    choose: vi.fn(),
    options: {},
    pluginLoader: { activeDisplayClassName: null },
    ...overrides,
  };
}
