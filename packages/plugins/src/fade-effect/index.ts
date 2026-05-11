import {
  choicesStore,
  contentsStore,
  Events,
  type InkStory,
  type InkStoryContext,
  Patches,
  type Plugin,
  TagHandler,
} from "@inkweave/core";

export const fadeEffectPlugin: Plugin = {
  id: "fade-effect",
  name: "Fade Effect Plugin",
  description: "Provides text fade-in effect with configurable line delay",
  enabledByDefault: true,
  onLoad: () => {
    TagHandler.add("linedelay", (val: string | null | undefined, ink: InkStory) => {
      if (val != null) {
        const v = parseFloat(val);
        if (!Number.isNaN(v)) {
          (ink as unknown as Record<string, unknown>).linedelay = v;
        }
      }
    });

    Patches.add(
      function (this: InkStoryContext) {
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

        let timer: ReturnType<typeof setTimeout> | null = null;
        const unsub = contentsStore.subscribe(() => {
          if (timer) clearTimeout(timer);

          if (this.options.linedelay === 0) {
            return;
          }

          const { visibleLines, contents } = contentsStore.getState();
          const total = contents.length;
          const lines = visibleLines != null && visibleLines >= 0 ? total - visibleLines : total;

          if (total === 0) return;

          choicesStore.getState().setChoicesVisible(false);
          timer = setTimeout(
            () => choicesStore.getState().setChoicesVisible(true),
            lines * (this.options.linedelay as number) * 1000,
          );
        });

        this.eventEmitter.on(Events.STORY_DISPOSE, () => {
          unsub();
          clearTimeout(timer ?? undefined);
        });
      },
      { linedelay: 0.05 },
    );
  },
};
