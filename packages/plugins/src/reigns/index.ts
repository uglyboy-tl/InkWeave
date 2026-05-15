import type { InkStory, InkStoryContext, Layout } from "@inkweave/core";
import { contentsStore, Events, InteractionManager, Patches } from "@inkweave/core";
import "./styles.css";
import { createSwipeHandler } from "./swipe";

const MAX_ROTATION = 15;

export const reignsPlugin: Layout = {
  id: "reigns",
  injectClassName: "reigns-mode",
  exclude: ["scroll-after-choice"],
  name: "Reigns Card Plugin",
  description: "Provides card swipe interactions for Reigns-style games",
  onLoad: () => {
    Patches.add(function (this: InkStoryContext) {
      const ink = this as unknown as InkStory;

      ink.interactionManager.register("swipe-left", InteractionManager.presets.left);
      ink.interactionManager.register("swipe-right", InteractionManager.presets.right);

      let storyEl: HTMLElement | null = null;
      let cleanupSwipe: (() => void) | null = null;

      const updateHintOpacity = (deltaX: number, threshold: number) => {
        const choicesEl = storyEl?.querySelector(".inkweave-choices") as HTMLElement | null;
        if (!choicesEl) return;
        const leftHint = choicesEl.querySelector("li:first-child") as HTMLElement | null;
        const rightHint = choicesEl.querySelector("li:last-child") as HTMLElement | null;

        if (deltaX < 0) {
          leftHint && (leftHint.style.opacity = `${Math.min(1, Math.abs(deltaX) / threshold)}`);
          rightHint && (rightHint.style.opacity = "0");
        } else if (deltaX > 0) {
          rightHint && (rightHint.style.opacity = `${Math.min(1, deltaX / threshold)}`);
          leftHint && (leftHint.style.opacity = "0");
        }
      };

      const clearHintOpacity = () => {
        const choicesEl = storyEl?.querySelector(".inkweave-choices") as HTMLElement | null;
        if (!choicesEl) return;
        const leftHint = choicesEl.querySelector("li:first-child") as HTMLElement | null;
        const rightHint = choicesEl.querySelector("li:last-child") as HTMLElement | null;
        leftHint && (leftHint.style.opacity = "0");
        rightHint && (rightHint.style.opacity = "0");
      };

      const bindCardEvents = () => {
        const cardEl = storyEl?.querySelector(".inkweave-contents") as HTMLElement;
        if (!cardEl) return;

        cardEl.style.position = "relative";
        cardEl.style.zIndex = "3";
        cardEl.style.transition = "none";
        cardEl.style.transform = "translateX(0) rotate(0deg)";

        cleanupSwipe = createSwipeHandler(cardEl, {
          threshold: 80,
          maxRotation: MAX_ROTATION,
          onMove: updateHintOpacity,
          onSwipeLeft: () => {
            clearHintOpacity();
            setTimeout(() => ink.interactionManager.trigger("swipe-left"), 150);
          },
          onSwipeRight: () => {
            clearHintOpacity();
            setTimeout(() => ink.interactionManager.trigger("swipe-right"), 150);
          },
          onSwipeCancel: clearHintOpacity,
        });
      };

      const waitForDom = (retries = 0): void => {
        if (retries > 50) {
          console.warn("Reigns plugin: DOM not found after retries");
          return;
        }
        storyEl = document.querySelector('[data-inkweave="story"]') as HTMLElement;
        if (!storyEl) {
          requestAnimationFrame(() => waitForDom(retries + 1));
          return;
        }
        bindCardEvents();
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        if (e.key === "ArrowLeft") {
          ink.interactionManager.trigger("swipe-left");
        } else if (e.key === "ArrowRight") {
          ink.interactionManager.trigger("swipe-right");
        }
      };
      document.addEventListener("keydown", onKeyDown);
      waitForDom();

      const unsubContents = contentsStore.subscribe(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const cardEl = storyEl?.querySelector(".inkweave-contents") as HTMLElement;
            if (cardEl) {
              cardEl.style.transition = "none";
              cardEl.style.transform = "translateX(0) rotate(0deg)";
            }
            cleanupSwipe?.();
            bindCardEvents();
          });
        });
      });

      this.eventEmitter.on(Events.STORY_DISPOSE, () => {
        unsubContents();
        document.removeEventListener("keydown", onKeyDown);
        cleanupSwipe?.();
      });
    }, {});
  },
};
