import type { ChoiceRenderer, Plugin } from "@inkweave/core";
import { ChoiceHandler, Patches } from "@inkweave/core";

export function createCdButtonPlugin(choiceRenderer: ChoiceRenderer, component: unknown): Plugin {
  const options = { cdTemplate: "{text} ({time})" };

  return {
    id: "cd-button",
    name: "Cooldown Button Plugin",
    description: "Provides cooldown choice button functionality for ink stories",
    enabledByDefault: true,
    onLoad: () => {
      ChoiceHandler.add("cd", (choice, val) => {
        choice.type = "cd";
        choice.val = val;
      });
      choiceRenderer.register("cd", component);
      Patches.add(null, options);
    },
  };
}
