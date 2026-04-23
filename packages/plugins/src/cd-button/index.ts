import type { Plugin } from "@inkweave/core";
import { ChoiceParser, Patches } from "@inkweave/core";
import { ChoiceRegistry } from "@inkweave/react";
import CooldownChoice from "./CdButton";

const options = {
  cdTemplate: "{text} ({time})",
};

export const cdButtonPlugin: Plugin = {
  id: "cd-button",
  name: "Cooldown Button Plugin",
  description: "Provides cooldown choice button functionality for ink stories",
  enabledByDefault: true,
  onLoad: () => {
    ChoiceParser.add("cd", (new_choice, val) => {
      new_choice.type = "cd";
      new_choice.val = val;
    });
    ChoiceRegistry.register("cd", CooldownChoice);
    Patches.add(null, options);
  },
};
