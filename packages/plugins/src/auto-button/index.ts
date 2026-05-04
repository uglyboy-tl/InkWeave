import type { ChoiceRenderer, Plugin } from "@inkweave/core";
import { ChoiceHandler, Patches } from "@inkweave/core";

export function createAutoButtonPlugin(choiceRenderer: ChoiceRenderer, component: unknown): Plugin {
  return {
    id: "auto-button",
    name: "Auto Button Plugin",
    description: "Provides auto choice button functionality for ink stories",
    enabledByDefault: true,
    onLoad: () => {
      ChoiceHandler.add("auto", (choice, val) => {
        choice.type = "auto";
        choice.val = val;
      });
      choiceRenderer.register("auto", component);
      Patches.add(null, {});
    },
  };
}
