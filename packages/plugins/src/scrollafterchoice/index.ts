import { Patches, choicesStore } from '@inkweave/core';

const load = () => {
  Patches.add(function () {
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;

    const unsub = choicesStore.subscribe(() => {
      if (scrollTimer) clearTimeout(scrollTimer);

      scrollTimer = setTimeout(() => {
        const lastButton = document.querySelector(
          '[data-inkweave="choices"] > li:last-child',
        ) as HTMLElement;
        if (lastButton) {
          const element = document.querySelector('[data-inkweave="story"]') as HTMLElement;
          element?.scrollTo({
            top: lastButton.offsetTop,
            behavior: 'smooth',
          });
        }
      }, 0);
    });

    this.cleanups.push(() => {
      unsub();
      if (scrollTimer) clearTimeout(scrollTimer);
    });
  }, {});
};

export default load;
