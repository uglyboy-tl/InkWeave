import { Events, type InkStoryContext, Patches } from "@inkweave/core";

const load = () => {
  Patches.add(function (this: InkStoryContext) {
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;

    // 使用事件系统监听选择更新
    const unsubscribeChoice = this.eventEmitter.on(Events.CHOICE_SELECTED, () => {
      if (scrollTimer) clearTimeout(scrollTimer);

      scrollTimer = setTimeout(() => {
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
      }, 0);
    });

    // 监听内容变更事件
    const unsubscribeContent = this.eventEmitter.on(Events.CONTENTS_CHANGED, () => {
      if (scrollTimer) clearTimeout(scrollTimer);

      scrollTimer = setTimeout(() => {
        const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
        if (storyElement) {
          // 滚动到底部
          storyElement.scrollTo({
            top: storyElement.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 0);
    });

    // 使用事件系统来处理清理操作
    const unsubscribeCleanup = this.eventEmitter.on(Events.STORY_CLEARED, () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      unsubscribeChoice();
      unsubscribeContent();
      unsubscribeCleanup(); // 清理自身监听器
    });
  }, {});
};

export default load;
