import type { InkStory, Plugin } from "@inkweave/core";
import { Patches, Tags } from "@inkweave/core";
import { memory } from "../memory";

const options = {
  autosave_enabled: true,
};

export const autoSavePlugin: Plugin = {
  id: "autosave",
  name: "Auto Save Plugin",
  description: "Automatically saves game state when autosave tag is encountered",
  enabledByDefault: true,
  onLoad: () => {
    Tags.add("autosave", (_: string | null | undefined, ink: InkStory) => {
      if (ink.options.autosave_enabled) {
        memory.save(1, ink);
      }
    });

    Patches.add(null, options);
  },
};
