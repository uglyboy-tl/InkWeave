import type { InkStory, InkStoryContext } from "@inkweave/core";
import { Events, Patches } from "@inkweave/core";
import { memory } from "../memory";

const load = () => {
  Patches.add(function (this: InkStoryContext) {
    const ink = this as InkStory;

    ink.eventEmitter.on(Events.CHOICE_SELECTED, () => {
      memory.save(0, ink);
    });

    ink.eventEmitter.once(Events.STORY_INITIALIZED, () => {
      const savedState = memory.show(ink.title)?.[0];
      if (savedState) {
        try {
          const saveData = JSON.parse(savedState.data);
          memory.load(JSON.stringify(saveData), ink);
        } catch (e) {
          console.warn("InkWeave AutoRestore: Failed to load autosave:", e);
        }
      }
    });
  });
};

export default load;
