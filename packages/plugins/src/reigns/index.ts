import type { Plugin } from "@inkweave/core";
import {
  choicesStore,
  contentsStore,
  Events,
  InteractionManager,
  Patches,
  variablesStore,
} from "@inkweave/core";
import "./styles.css";

const SWIPE_THRESHOLD = 80;
const MAX_ROTATION = 15;
const STATUS_BARS = ["Church", "People", "Army", "Money"] as const;
const STATUS_LABELS: Record<string, string> = {
  Church: "信仰",
  People: "民众",
  Army: "军队",
  Money: "财富",
};

interface SwipeState {
  startX: number;
  currentX: number;
  isDragging: boolean;
}

export const reignsPlugin: Plugin = {
  id: "reigns",
  name: "Reigns Card Plugin",
  description: "Provides card swipe interaction for Reigns-style games",
  enabledByDefault: false,
  onLoad: () => {
    choicesStore.getState().setChoicesVisible(false);

    Patches.add(function (this: import("@inkweave/core").InkStoryContext) {
      const ink = this as unknown as import("@inkweave/core").InkStory;

      ink.interactionManager.register("swipe-left", InteractionManager.presets.left);
      ink.interactionManager.register("swipe-right", InteractionManager.presets.right);

      let initialized = false;
      let statusBar: HTMLElement | null = null;
      let hintOverlay: HTMLElement | null = null;
      let storyEl: HTMLElement | null = null;
      let bindings: ReturnType<typeof bindCardEvents> | null = null;
      let unsubContents: (() => void) | null = null;

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
        initDom();
      };

      const initDom = () => {
        if (initialized) return;
        if (!storyEl) return;
        initialized = true;

        const cardEl = storyEl.querySelector(".inkweave-contents") as HTMLElement;
        if (cardEl) {
          cardEl.style.position = "relative";
          cardEl.style.zIndex = "3";
        }

        // 状态栏插入到 nav 中，CommandBar 前面
        statusBar = document.createElement("div");
        statusBar.className = "reigns-status-bar";
        statusBar.innerHTML = STATUS_BARS.map(
          (key) => `
          <div class="reigns-status-item">
            <span class="reigns-status-label">${STATUS_LABELS[key]}</span>
            <div class="reigns-status-track">
              <div class="reigns-status-fill" data-status="${key}"></div>
            </div>
          </div>
        `,
        ).join("");

        const navEl = storyEl.parentElement?.querySelector("nav");
        if (navEl) {
          navEl.style.opacity = "1";
          navEl.insertBefore(statusBar, navEl.firstChild);
        }

        hintOverlay = document.createElement("div");
        hintOverlay.className = "reigns-hint-overlay";
        hintOverlay.innerHTML = `
          <div class="reigns-hint reigns-hint-left"></div>
          <div class="reigns-hint reigns-hint-right"></div>
        `;

        storyEl.classList.add("reigns-mode");
        storyEl.appendChild(hintOverlay);

        bindings = bindCardEvents();
        requestAnimationFrame(updateStatusBar);
      };

      const updateStatusBar = () => {
        if (!statusBar) return;
        const vars = variablesStore.getState().variables;
        STATUS_BARS.forEach((key) => {
          const value = (vars.get(key) as number) ?? 0;
          const fill = statusBar?.querySelector(
            `.reigns-status-fill[data-status="${key}"]`,
          ) as HTMLElement;
          if (fill) {
            const percent = Math.max(0, Math.min(100, (value / 10) * 100));
            fill.style.width = `${percent}%`;
          }
        });
      };

      const bindCardEvents = () => {
        if (!storyEl) return null;
        const cardEl = storyEl.querySelector(".inkweave-contents") as HTMLElement;
        if (!cardEl) {
          console.warn("Reigns plugin: inkweave-contents not found during rebind");
          return null;
        }

        // 重置卡片位置和旋转
        cardEl.style.transition = "none";
        cardEl.style.transform = "translateX(0) rotate(0deg)";

        const swipeState: SwipeState = { startX: 0, currentX: 0, isDragging: false };

        const applyTransform = (deltaX: number) => {
          if (!storyEl) return;
          const rotation = (deltaX / storyEl.clientWidth) * MAX_ROTATION * 2;
          cardEl.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
        };

        const getChoiceText = (index: number): string => {
          const choices = choicesStore.getState().choices;
          return choices[index]?.text ?? "";
        };

        const handleStart = (x: number) => {
          swipeState.startX = x;
          swipeState.currentX = x;
          swipeState.isDragging = true;
          cardEl.style.transition = "none";
        };

        const handleMove = (x: number) => {
          if (!swipeState.isDragging) return;
          swipeState.currentX = x;
          const deltaX = x - swipeState.startX;
          applyTransform(deltaX);

          if (!hintOverlay) return;
          const leftHint = hintOverlay.querySelector(".reigns-hint-left") as HTMLElement;
          const rightHint = hintOverlay.querySelector(".reigns-hint-right") as HTMLElement;

          if (deltaX < 0) {
            leftHint.textContent = getChoiceText(0);
            leftHint.style.opacity = `${Math.min(1, Math.abs(deltaX) / SWIPE_THRESHOLD)}`;
            rightHint.style.opacity = "0";
          } else if (deltaX > 0) {
            rightHint.textContent = getChoiceText(1);
            rightHint.style.opacity = `${Math.min(1, deltaX / SWIPE_THRESHOLD)}`;
            leftHint.style.opacity = "0";
          }
        };

        const handleEnd = () => {
          if (!swipeState.isDragging) return;
          swipeState.isDragging = false;

          const deltaX = swipeState.currentX - swipeState.startX;
          cardEl.style.transition = "transform 0.3s ease-out";

          if (deltaX < -SWIPE_THRESHOLD) {
            cardEl.style.transform = `translateX(-150%) rotate(-${MAX_ROTATION}deg)`;
            setTimeout(() => ink.interactionManager.trigger("swipe-left"), 150);
          } else if (deltaX > SWIPE_THRESHOLD) {
            cardEl.style.transform = `translateX(150%) rotate(${MAX_ROTATION}deg)`;
            setTimeout(() => ink.interactionManager.trigger("swipe-right"), 150);
          } else {
            cardEl.style.transform = "translateX(0) rotate(0deg)";
          }

          if (hintOverlay) {
            (hintOverlay.querySelector(".reigns-hint-left") as HTMLElement).style.opacity = "0";
            (hintOverlay.querySelector(".reigns-hint-right") as HTMLElement).style.opacity = "0";
          }
        };

        const onTouchStart = (e: TouchEvent) => {
          if (e.touches[0]) handleStart(e.touches[0].clientX);
        };
        const onTouchMove = (e: TouchEvent) => {
          if (e.touches[0]) handleMove(e.touches[0].clientX);
        };

        cardEl.addEventListener("touchstart", onTouchStart, { passive: true });
        cardEl.addEventListener("touchmove", onTouchMove, { passive: true });
        cardEl.addEventListener("touchend", handleEnd);

        const onMouseDown = (e: MouseEvent) => {
          handleStart(e.clientX);
          const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
          const onMouseUp = () => {
            handleEnd();
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
          };
          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        };
        cardEl.addEventListener("mousedown", onMouseDown);

        return { cardEl, onTouchStart, onTouchMove, handleEnd, onMouseDown };
      };

      // 键盘支持
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        if (e.key === "ArrowLeft") {
          ink.interactionManager.trigger("swipe-left");
        } else if (e.key === "ArrowRight") {
          ink.interactionManager.trigger("swipe-right");
        }
      };
      document.addEventListener("keydown", onKeyDown);

      // 等待 DOM 渲染完成后初始化
      waitForDom();

      // 内容更新时重新绑定卡片事件
      unsubContents = contentsStore.subscribe(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // 先尝试重置当前卡片的 transform
            const currentCard = storyEl?.querySelector(".inkweave-contents") as HTMLElement;
            if (currentCard) {
              currentCard.style.transition = "none";
              currentCard.style.transform = "translateX(0) rotate(0deg)";
            }

            if (bindings) {
              bindings.cardEl.removeEventListener("touchstart", bindings.onTouchStart);
              bindings.cardEl.removeEventListener("touchmove", bindings.onTouchMove);
              bindings.cardEl.removeEventListener("touchend", bindings.handleEnd);
              bindings.cardEl.removeEventListener("mousedown", bindings.onMouseDown);
            }
            bindings = bindCardEvents();
            requestAnimationFrame(updateStatusBar);
          });
        });
      });

      this.eventEmitter.on(Events.STORY_DISPOSE, () => {
        if (unsubContents) unsubContents();
        document.removeEventListener("keydown", onKeyDown);
        if (bindings) {
          bindings.cardEl.removeEventListener("touchstart", bindings.onTouchStart);
          bindings.cardEl.removeEventListener("touchmove", bindings.onTouchMove);
          bindings.cardEl.removeEventListener("touchend", bindings.handleEnd);
          bindings.cardEl.removeEventListener("mousedown", bindings.onMouseDown);
        }
        if (statusBar) statusBar.remove();
        if (hintOverlay) hintOverlay.remove();
        if (storyEl) {
          storyEl.classList.remove("reigns-mode");
          const navEl = storyEl.parentElement?.querySelector("nav");
          if (navEl) navEl.style.opacity = "";
        }
      });
    }, {});
  },
};
