import type { Plugin } from "@inkweave/core";
import { ChoiceParser, Patches } from "@inkweave/core";
import { ChoiceRegistry } from "@inkweave/react";
import AutoChoice from "./AutoButton";

export const autoButtonPlugin: Plugin = {
  id: "autoButton",
  name: "Auto Button Plugin",
  description: "Provides auto choice button functionality for ink stories",
  enabledByDefault: true,
  onLoad: () => {
    ChoiceParser.add("auto", (new_choice, val) => {
      new_choice.type = "auto";
      new_choice.val = val;
    });
    ChoiceRegistry.register("auto", AutoChoice);
    Patches.add(null, {});
  },
};
