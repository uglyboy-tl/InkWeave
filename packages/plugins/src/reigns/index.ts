import type { InkStory, InkStoryContext, Layout } from "@inkweave/core";
import { choicesStore, contentsStore, Events, InteractionManager, Patches } from "@inkweave/core";
import "./styles.css";
import { createSwipeHandler } from "./swipe";

const MAX_ROTATION = 15;

function getChoiceText(index: number): string {
  const choice = choicesStore.getState().choices[index];
  return choice?.text ?? "";
}

export const reignsPlugin: Layout = {
  id: "reigns",
  injectClassName: "reigns-mode",
  exclude: ["scroll-after-choice"],
  name: "Reigns Card Plugin",
  description: "Provides card swipe interaction for Reigns-style games",
  onLoad: () => {
    choicesStore.getState().setChoicesVisible(false);

    Patches.add(function (this: InkStoryContext) {
      const ink = this as unknown as InkStory;

      ink.interactionManager.register("swipe-left", InteractionManager.presets.left);
      ink.interactionManager.register("swipe-right", InteractionManager.presets.right);

      let hintOverlay: HTMLElement | null = null;
      let storyEl: HTMLElement | null = null;
      let cleanupSwipe: (() => void) | null = null;

      const initHintOverlay = () => {
        if (hintOverlay) return;
        hintOverlay = document.createElement("div");
        hintOverlay.className = "reigns-hint-overlay";
        hintOverlay.innerHTML = `
          <div class="reigns-hint reigns-hint-left"></div>
          <div class="reigns-hint reigns-hint-right"></div>
        `;
        storyEl?.appendChild(hintOverlay);
      };

      const clearHintOverlay = () => {
        if (!hintOverlay) return;
        (hintOverlay.querySelector(".reigns-hint-left") as HTMLElement).style.opacity = "0";
        (hintOverlay.querySelector(".reigns-hint-right") as HTMLElement).style.opacity = "0";
      };

      const updateHintOverlay = (deltaX: number, threshold: number) => {
        if (!hintOverlay) return;
        const leftHint = hintOverlay.querySelector(".reigns-hint-left") as HTMLElement;
        const rightHint = hintOverlay.querySelector(".reigns-hint-right") as HTMLElement;

        if (deltaX < 0) {
          leftHint.textContent = getChoiceText(0);
          leftHint.style.opacity = `${Math.min(1, Math.abs(deltaX) / threshold)}`;
          rightHint.style.opacity = "0";
        } else if (deltaX > 0) {
          rightHint.textContent = getChoiceText(1);
          rightHint.style.opacity = `${Math.min(1, deltaX / threshold)}`;
          leftHint.style.opacity = "0";
        }
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
          onMove: updateHintOverlay,
          onSwipeLeft: () => {
            clearHintOverlay();
            setTimeout(() => ink.interactionManager.trigger("swipe-left"), 150);
          },
          onSwipeRight: () => {
            clearHintOverlay();
            setTimeout(() => ink.interactionManager.trigger("swipe-right"), 150);
          },
          onSwipeCancel: clearHintOverlay,
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
        initHintOverlay();
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
        hintOverlay?.remove();
      });
    }, {});
  },
};
