import { describe, expect, it } from "bun:test";
import type { Choice as InkChoice } from "inkjs/engine/Choice";
import choicesStore from "../choices";

describe("choicesStore", () => {
  describe("initial state", () => {
    it("should have empty choices", () => {
      const { choices } = choicesStore.getState();
      expect(choices).toEqual([]);
    });
  });

  describe("setChoices", () => {
    it("should set choices from ink choices", () => {
      const inkChoices = [
        { text: "Choice 1", index: 0, tags: null },
        { text: "Choice 2", index: 1, tags: null },
      ] as unknown as InkChoice[];
      choicesStore.getState().setChoices(inkChoices);
      const { choices } = choicesStore.getState();
      expect(choices.length).toBe(2);
      expect(choices[0].text).toBe("Choice 1");
      expect(choices[1].text).toBe("Choice 2");
    });

    it("should handle choices with tags", () => {
      const inkChoices = [
        { text: "Choice 1", index: 0, tags: ["unclickable"] },
      ] as unknown as InkChoice[];
      choicesStore.getState().setChoices(inkChoices);
      const { choices } = choicesStore.getState();
      expect(choices[0].type).toBe("unclickable");
    });
  });
});
