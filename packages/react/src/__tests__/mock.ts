import { vi } from "bun:test";
import { EventEmitter } from "@inkweave/core";

/**
 * 创建 InkStory 的模拟对象
 * 用于测试目的，提供必要的属性和方法
 */
export function createMockInk(
  overrides: Partial<{
    restart?: () => void;
    choose?: (choice: number) => void;
    options?: Record<string, unknown>;
    eventEmitter?: EventEmitter;
    [key: string]: unknown;
  }> = {},
) {
  return {
    eventEmitter: new EventEmitter(),
    restart: vi.fn(),
    choose: vi.fn(),
    options: {},
    ...overrides,
  };
}
