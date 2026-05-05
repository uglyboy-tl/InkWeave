import type { ContentItem, Plugin } from "@inkweave/core";
import { contentsStore, Events, type InkStoryContext, Patches, TagHandler } from "@inkweave/core";
import { create } from "zustand";

type ContentComplete = {
  contentComplete: boolean;
  last_content: string;
  setContentComplete: (v: boolean) => void;
  setLastContent: (c: ContentItem[]) => void;
};

export const useContentComplete = create<ContentComplete>((set) => ({
  contentComplete: false,
  last_content: "",
  setContentComplete: (v) => set({ contentComplete: v }),
  setLastContent: (contents) => {
    const lastItem = contents.length > 0 ? contents[contents.length - 1] : null;
    set({ last_content: lastItem?.text ?? "" });
  },
}));

export function createFadeEffectPlugin(
  setupChoicesCanShow: (ink: InkStoryContext) => void,
): Plugin {
  const options = { linedelay: 0.05 };

  return {
    id: "fade-effect",
    name: "Fade Effect Plugin",
    description: "Provides text fade-in effect with configurable line delay",
    enabledByDefault: true,
    onLoad: () => {
      TagHandler.add("linedelay", (val: string | null | undefined, ink) => {
        if (val != null) {
          const v = parseFloat(val);
          if (!Number.isNaN(v)) {
            ink.linedelay = v;
            if (v === 0) useContentComplete.getState().setContentComplete(true);
          }
        }
      });

      Patches.add(function (this: InkStoryContext) {
        const orig = this.choose as (i: number) => void;
        this.choose = (i: number) => {
          if (this.options.linedelay !== 0) {
            useContentComplete.getState().setContentComplete(false);
            useContentComplete.getState().setLastContent(this.contents as ContentItem[]);
          }
          return orig.call(this, i);
        };

        Object.defineProperty(this, "linedelay", {
          get() {
            return this.options.linedelay;
          },
          set(v: number) {
            this.options.linedelay = v;
          },
          enumerable: true,
          configurable: true,
        });
        this.save_label.push("linedelay");

        Object.defineProperty(this, "visibleLines", {
          get() {
            const last = useContentComplete.getState().last_content;
            if (!last) return -1;
            const c = this.contents as ContentItem[];
            for (let i = c.length - 1; i >= 0; i--) {
              if (c[i]?.text === last) return i;
            }
            return -1;
          },
        });

        setupChoicesCanShow(this);

        let timer: ReturnType<typeof setTimeout> | null = null;
        const unsub = contentsStore.subscribe(() => {
          if (timer) clearTimeout(timer);
          if (this.options.linedelay === 0) {
            useContentComplete.getState().setContentComplete(true);
            return;
          }
          const visible = this.visibleLines as number;
          const total = (this.contents as ContentItem[]).length;
          // When visible is -1 (no previous content), treat all lines as new
          const lines = visible >= 0 ? total - visible : total;
          useContentComplete.getState().setContentComplete(false);
          timer = setTimeout(
            () => useContentComplete.getState().setContentComplete(true),
            Math.max(0, lines * (this.options.linedelay as number) * 1000),
          );
        });

        this.eventEmitter.on(Events.STORY_DISPOSE, () => {
          unsub();
          if (timer) clearTimeout(timer);
        });
        this.eventEmitter.on(Events.STORY_CLEARED, () => {
          if (this.options.linedelay !== 0) useContentComplete.getState().setContentComplete(false);
          useContentComplete.getState().setLastContent([]);
        });
      }, options);
    },
  };
}
