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

function wrapChoose(ink: InkStoryContext) {
  if ((ink.choose as Record<string, unknown>).__wrapped) return;
  const cc = useContentComplete.getState();
  const orig = ink.choose as (i: number) => void;
  ink.choose = (i: number) => {
    if (ink.options.linedelay !== 0) {
      cc.setContentComplete(false);
      cc.setLastContent(ink.contents as ContentItem[]);
    }
    return orig.call(ink, i);
  };
  (ink.choose as Record<string, unknown>).__wrapped = true;
}

function defineLinedelay(ink: InkStoryContext) {
  Object.defineProperty(ink, "linedelay", {
    get() {
      return ink.options.linedelay;
    },
    set(v: number) {
      ink.options.linedelay = v;
    },
    enumerable: true,
    configurable: true,
  });
  ink.save_label.push("linedelay");
}

function defineVisibleLines(ink: InkStoryContext) {
  Object.defineProperty(ink, "visibleLines", {
    get() {
      const last = useContentComplete.getState().last_content;
      if (last === "") return -1;
      const contents = ink.contents as ContentItem[];
      for (let i = contents.length - 1; i >= 0; i--) {
        if (contents[i]?.text === last) return i;
      }
      return -1;
    },
    enumerable: true,
    configurable: true,
  });
}

function defineChoicesCanShow(ink: InkStoryContext) {
  Object.defineProperty(ink, "choicesCanShow", {
    get() {
      return useContentComplete.getState().contentComplete;
    },
    enumerable: true,
    configurable: true,
  });
}

function watchContent(ink: InkStoryContext) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const unsub = contentsStore.subscribe(() => {
    if (timer) clearTimeout(timer);

    const delay = (ink.options.linedelay as number) ?? 0.05;
    if (delay === 0) {
      useContentComplete.getState().setContentComplete(true);
      return;
    }

    const visible = ink.visibleLines as number;
    const total = (ink.contents as ContentItem[]).length;
    const lines = visible >= 0 ? total - visible : total;
    useContentComplete.getState().setContentComplete(false);

    timer = setTimeout(
      () => useContentComplete.getState().setContentComplete(true),
      lines * delay * 1000,
    );
  });

  ink.eventEmitter.on(Events.STORY_DISPOSE, () => {
    unsub();
    if (timer) clearTimeout(timer);
  });
  ink.eventEmitter.on(Events.STORY_CLEARED, () => {
    if (ink.options.linedelay !== 0) useContentComplete.getState().setContentComplete(false);
    useContentComplete.getState().setLastContent([]);
  });
}

export function createFadeEffectPlugin(
  setupChoicesCanShow?: (ink: InkStoryContext) => void,
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
        wrapChoose(this);
        defineLinedelay(this);
        defineVisibleLines(this);
        defineChoicesCanShow(this);

        if (setupChoicesCanShow) {
          setupChoicesCanShow(this);
        }

        watchContent(this);
      }, options);
    },
  };
}
