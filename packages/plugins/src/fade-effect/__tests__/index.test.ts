import { beforeEach, describe, expect, it } from "bun:test";
import { choicesStore, contentsStore, Patches, TagHandler } from "@inkweave/core";
import { createMockStory } from "../../../test/utils";
import { fadeEffectPlugin as plugin } from "../index";

describe("fadeEffect", () => {
  beforeEach(() => {
    Patches.clear();
    choicesStore.setState({ choicesVisible: true });
    contentsStore.setState({ visibleLines: null });
  });

  describe("load", () => {
    it("should register patch", () => {
      plugin.onLoad();
      expect(Patches.patches.length).toBeGreaterThan(0);
    });

    it("should register linedelay tag", () => {
      plugin.onLoad();
      expect(TagHandler.handlers.has("linedelay")).toBe(true);
    });
  });

  describe("linedelay tag", () => {
    it("should set linedelay option from tag value", () => {
      plugin.onLoad();
      const mockStory = createMockStory();
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      TagHandler.process(mockStory as never, "linedelay: 0.1");
      expect(mockStory.options.linedelay).toBe(0.1);
    });

    it("should handle linedelay 0", () => {
      plugin.onLoad();
      const mockStory = createMockStory();
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      TagHandler.process(mockStory as never, "linedelay: 0");
      expect(mockStory.options.linedelay).toBe(0);
    });

    it("should handle invalid linedelay value", () => {
      plugin.onLoad();
      const mockStory = createMockStory();
      TagHandler.process(mockStory as never, "linedelay: invalid");
      expect(mockStory.options.linedelay).toBeUndefined();
    });

    it("should handle null linedelay value", () => {
      plugin.onLoad();
      const mockStory = createMockStory();
      TagHandler.process(mockStory as never, "linedelay:");
      expect(mockStory.options.linedelay).toBeUndefined();
    });
  });

  describe("Patches", () => {
    it("should add linedelay property", () => {
      plugin.onLoad();
      const mockStory = createMockStory({
        options: { linedelay: 0.05 },
      });
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      expect(mockStory).toHaveProperty("linedelay");
    });

    it("should call clear function", () => {
      plugin.onLoad();
      const mockStory = createMockStory({
        options: { linedelay: 0.05 },
        contents: [{ text: "line1" }],
      });
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      mockStory.eventEmitter.emit("story.cleared");
    });
  });

  describe("contentsStore subscription", () => {
    it("should set choicesVisible immediately when delay is zero", async () => {
      plugin.onLoad();
      const mockStory = createMockStory({
        options: { linedelay: 0 },
      });
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");

      choicesStore.getState().setChoicesVisible(false);
      contentsStore.setState({ contents: [{ text: "new content" }] });
      expect(choicesStore.getState().choicesVisible).toBe(true);
    });

    it("should hide choices and schedule timer on content with delay", async () => {
      plugin.onLoad();
      const mockStory = createMockStory({
        options: { linedelay: 0.01 },
        contents: [{ text: "line1" }],
      });
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");

      contentsStore.setState({ contents: [{ text: "line1" }, { text: "line2" }] });
      expect(choicesStore.getState().choicesVisible).toBe(false);

      await new Promise((r) => setTimeout(r, 50));
      expect(choicesStore.getState().choicesVisible).toBe(true);
    });

    it("should remain subscribed after clear and complete content", async () => {
      plugin.onLoad();
      const mockStory = createMockStory({
        options: { linedelay: 0.05 },
      });
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");

      mockStory.eventEmitter.emit("story.cleared");
      contentsStore.setState({ contents: [{ text: "new" }] });

      await new Promise((r) => setTimeout(r, 100));
      expect(choicesStore.getState().choicesVisible).toBe(true);
    });

    it("should handle multiple onLoad calls without issues", () => {
      plugin.onLoad();
      plugin.onLoad();
      const patch = Patches.patches[0];
      const mockStory = createMockStory({ options: { linedelay: 0.05 } });
      expect(() => patch?.call(mockStory as never, "")).not.toThrow();
    });
  });

  describe("CSS injection", () => {
    it("should have onLoad method", () => {
      expect(typeof plugin.onLoad).toBe("function");
    });
  });
});
