import type { ContentItem, InkStory, InkStoryContext } from "@inkweave/core";
import { EventEmitter } from "@inkweave/core";

/**
 * 创建 mock InkStory 对象用于测试
 * @param overrides 覆盖的属性
 * @returns mock InkStoryContext 对象
 */
export function createMockStory(
  overrides: Partial<InkStory & InkStoryContext> = {},
): InkStoryContext & Partial<InkStory> {
  return {
    eventEmitter: new EventEmitter(),
    options: {} as Record<string, unknown>,
    save_label: [],
    title: "test-story",
    contents: [] as ContentItem[],
    choose: (_index: number) => {},
    ...overrides,
  };
}
