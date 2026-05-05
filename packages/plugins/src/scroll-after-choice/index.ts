import type { Plugin } from "@inkweave/core";
import { Events, Patches } from "@inkweave/core";

const scrollToBottom = () => {
  const story = document.querySelector('[data-inkweave="story"]') as HTMLElement;
  if (story) {
    story.scrollTo({ top: story.scrollHeight, behavior: "smooth" });
  }
};

const scrollPending = (fn: () => void) => {
  requestAnimationFrame(() => requestAnimationFrame(fn));
};

export const scrollAfterChoicePlugin: Plugin = {
  id: "scroll-after-choice",
  name: "Scroll After Choice Plugin",
  description: "Automatically scrolls to the latest content after choices are made",
  enabledByDefault: true,
  onLoad: () => {
    Patches.add(function (this: import("@inkweave/core").InkStoryContext) {
      let scrollTimer: ReturnType<typeof setTimeout> | null = null;

      const unsubscribeChoice = this.eventEmitter.on(Events.CHOICE_SELECTED, () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          scrollPending(() => {
            const lastButton = document.querySelector(
              '[data-inkweave="choices"] > li:last-child',
            ) as HTMLElement;
            if (lastButton) {
              const story = document.querySelector('[data-inkweave="story"]') as HTMLElement;
              story?.scrollTo({ top: lastButton.offsetTop, behavior: "smooth" });
            }
          });
        }, 50);
      });

      const unsubscribeContent = this.eventEmitter.on(Events.CONTENTS_CHANGED, () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => scrollPending(scrollToBottom), 50);
      });

      this.eventEmitter.on(Events.STORY_DISPOSE, () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        unsubscribeChoice();
        unsubscribeContent();
      });

      this.eventEmitter.on(Events.STORY_CLEARED, () => {
        if (scrollTimer) clearTimeout(scrollTimer);
      });
    }, {});
  },
};
