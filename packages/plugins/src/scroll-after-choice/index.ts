import type { Plugin } from "@inkweave/core";
import { Events, Patches } from "@inkweave/core";

export const scrollAfterChoicePlugin: Plugin = {
  id: "scroll-after-choice",
  name: "Scroll After Choice Plugin",
  description: "Automatically scrolls to the latest content after choices are made",
  enabledByDefault: true,
  onLoad: () => {
    Patches.add(function (this: import("@inkweave/core").InkStoryContext) {
      let scrollTimer: ReturnType<typeof setTimeout> | null = null;

      // 使用事件系统监听选择更新
      const unsubscribeChoice = this.eventEmitter.on(Events.CHOICE_SELECTED, () => {
        if (scrollTimer) clearTimeout(scrollTimer);

        scrollTimer = setTimeout(() => {
          if (typeof document !== "undefined") {
            const lastButton = document.querySelector(
              '[data-inkweave="choices"] > li:last-child',
            ) as HTMLElement;
            if (lastButton) {
              const element = document.querySelector('[data-inkweave="story"]') as HTMLElement;
              element?.scrollTo({
                top: lastButton.offsetTop,
                behavior: "smooth",
              });
            }
          }
        }, 0);
      });

      // 监听内容变更事件
      const unsubscribeContent = this.eventEmitter.on(Events.CONTENTS_CHANGED, () => {
        if (scrollTimer) clearTimeout(scrollTimer);

        scrollTimer = setTimeout(() => {
          if (typeof document !== "undefined") {
            const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
            if (storyElement) {
              // 滚动到底部
              storyElement.scrollTo({
                top: storyElement.scrollHeight,
                behavior: "smooth",
              });
            }
          }
        }, 0);
      });

      // 在 dispose 时清理所有资源
      this.eventEmitter.on(Events.STORY_DISPOSE, () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        unsubscribeChoice();
        unsubscribeContent();
      });

      // 在 clear 时也清理资源（例如 restart 操作）
      this.eventEmitter.on(Events.STORY_CLEARED, () => {
        if (scrollTimer) clearTimeout(scrollTimer);
      });
    }, {});
  },
};
