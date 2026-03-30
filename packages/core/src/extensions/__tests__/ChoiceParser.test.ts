import { describe, expect, it, vi } from "bun:test";
import { Choice } from "../../types";
import { ChoiceParser } from "../ChoiceParser";

describe("ChoiceParser", () => {
  describe("Choice", () => {
    it("should create choice with default type", () => {
      const choice = new Choice("Test", 0);
      expect(choice.text).toBe("Test");
      expect(choice.index).toBe(0);
      expect(choice.type).toBe("default");
    });

    it("should create choice with custom type", () => {
      const choice = new Choice("Test", 1, "special");
      expect(choice.type).toBe("special");
    });

    it("should handle empty text", () => {
      const choice = new Choice("", 0);
      expect(choice.text).toBe("");
    });
  });

  describe("add", () => {
    it("should register tag handler", () => {
      const fn = vi.fn();
      ChoiceParser.add("custom", fn);
      expect(ChoiceParser.tags.has("custom")).toBe(true);
    });
  });

  describe("process", () => {
    it("should process choice with tags", () => {
      const fn = vi.fn();
      ChoiceParser.add("custom", fn);
      const inkChoice = {
        text: "Test",
        index: 0,
        tags: ["custom:value"],
      } as unknown as Parameters<typeof ChoiceParser.process>[0];
      const choice = new Choice("Test", 0);
      ChoiceParser.process(inkChoice, choice);
      expect(fn).toHaveBeenCalled();
    });

    it("should handle choice without tags", () => {
      const inkChoice = {
        text: "Test",
        index: 0,
        tags: null,
      } as unknown as Parameters<typeof ChoiceParser.process>[0];
      const choice = new Choice("Test", 0);
      ChoiceParser.process(inkChoice, choice);
    });

    it("should handle choice with empty tags", () => {
      const inkChoice = {
        text: "Test",
        index: 0,
        tags: [],
      } as unknown as Parameters<typeof ChoiceParser.process>[0];
      const choice = new Choice("Test", 0);
      ChoiceParser.process(inkChoice, choice);
    });

    it("should handle choice without text", () => {
      const inkChoice = {
        text: "",
        index: 0,
        tags: null,
      } as unknown as Parameters<typeof ChoiceParser.process>[0];
      const choice = new Choice("", 0);
      ChoiceParser.process(inkChoice, choice);
    });
  });

  describe("unclickable", () => {
    it("should set unclickable type", () => {
      const inkChoice = {
        text: "Test",
        index: 0,
        tags: ["unclickable"],
      } as unknown as Parameters<typeof ChoiceParser.process>[0];
      const choice = new Choice("Test", 0);
      ChoiceParser.process(inkChoice, choice);
      expect(choice.type).toBe("unclickable");
    });
  });

  describe("clear", () => {
    it("should clear custom tags", () => {
      ChoiceParser.add("custom", vi.fn());
      ChoiceParser.clear();
      expect(ChoiceParser.tags.has("custom")).toBe(false);
    });

    it("should keep unclickable tag", () => {
      ChoiceParser.clear();
      expect(ChoiceParser.tags.has("unclickable")).toBe(true);
    });
  });
});
