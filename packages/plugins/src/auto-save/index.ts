import type { InkStory, Plugin } from "@inkweave/core";
import { Tags } from "@inkweave/core";
import { Commands } from "@inkweave/react";
import { memory, reserveSlot } from "../memory";

export const autoSavePlugin: Plugin = {
  id: "auto-save",
  name: "Auto Save Plugin",
  description: "Automatically saves game state when autosave tag is encountered",
  enabledByDefault: true,
  onLoad: () => {
    Tags.add("autosave", (_: string | null | undefined, ink: InkStory) => {
      memory.save(1, ink);
    });
    reserveSlot(1, "modal_slot_auto");
    Commands.addTranslations({ modal_slot_auto: "Auto-Save" });
  },
  dependencies: ["memory"],
};
