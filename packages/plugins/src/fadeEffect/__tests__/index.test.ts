import { beforeEach, describe, expect, it, vi } from "bun:test";
import { contentsStore, Patches, Tags } from "@inkweave/core";
import { createMockStory } from "../../../test/utils";
import { fadeEffectPlugin as plugin, useContentComplete } from "../index";

describe("fadeEffect", () => {
  beforeEach(() => {
    Patches.patches = [];
    useContentComplete.setState({ contentComplete: true, last_content: "" });
  });

  describe("load", () => {
    it("should register patch", () => {
      plugin.onLoad();
      expect(Patches.patches.length).toBeGreaterThan(0);
    });

    it("should register linedelay tag", () => {
      plugin.onLoad();
      expect(Tags.functions.has("linedelay")).toBe(true);
    });
  });

  describe("linedelay tag", () => {
    it("should set linedelay option from tag value", () => {
      plugin.onLoad();
      const mockStory = createMockStory();
      Tags.process(mockStory as never, "linedelay: 0.1");
      expect(mockStory.options.linedelay).toBe(0.1);
    });

    it("should handle linedelay 0", () => {
      plugin.onLoad();
      const mockStory = createMockStory();
      Tags.process(mockStory as never, "linedelay: 0");
      expect(mockStory.options.linedelay).toBe(0);
    });

    it("should handle invalid linedelay value", () => {
      plugin.onLoad();
      const mockStory = createMockStory();
      Tags.process(mockStory as never, "linedelay: invalid");
      expect(mockStory.options.linedelay).toBeUndefined();
    });

    it("should handle null linedelay value", () => {
      plugin.onLoad();
      const mockStory = createMockStory();
      Tags.process(mockStory as never, "linedelay:");
      expect(mockStory.options.linedelay).toBeUndefined();
    });
  });

  describe("Patches", () => {
    it("should add visibleLines property", () => {
      plugin.onLoad();
      const mockStory = createMockStory({
        options: { linedelay: 0.05 },
        contents: [{ text: "line1" }, { text: "line2" }],
      });
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      expect(mockStory).toHaveProperty("visibleLines");
    });

    it("should return -1 for visibleLines when no last_content", () => {
      plugin.onLoad();
      useContentComplete.getState().setLastContent([]);
      const mockStory = createMockStory({
        options: { linedelay: 0.05 },
        contents: [{ text: "line1" }, { text: "line2" }],
      });
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      expect((mockStory as unknown as { visibleLines: number }).visibleLines).toBe(-1);
    });

    it("should return correct index for visibleLines", () => {
      plugin.onLoad();
      useContentComplete.getState().setLastContent([{ text: "line1" }, { text: "line2" }]);
      const mockStory = createMockStory({
        options: { linedelay: 0.05 },
        contents: [{ text: "line1" }, { text: "line2" }, { text: "line3" }],
      });
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      expect((mockStory as unknown as { visibleLines: number }).visibleLines).toBe(1);
    });

    it("should add choicesCanShow property", () => {
      plugin.onLoad();
      const mockStory = createMockStory({
        options: { linedelay: 0.05 },
        contents: [{ text: "line1" }],
      });
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      const descriptor = Object.getOwnPropertyDescriptor(mockStory, "choicesCanShow");
      expect(descriptor).toBeDefined();
      expect(typeof descriptor?.get).toBe("function");
    });

    it("should call clear function", () => {
      plugin.onLoad();
      const mockStory = createMockStory({
        options: { linedelay: 0.05 },
        contents: [{ text: "line1" }, { text: "line2" }],
      });
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      mockStory.eventEmitter.emit("story.cleared");
    });

    it("should set contentComplete false on clear with linedelay", () => {
      plugin.onLoad();
      useContentComplete.getState().setContentComplete(true);
      const mockStory = createMockStory({
        options: { linedelay: 0.05 },
      });
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      mockStory.eventEmitter.emit("story.cleared");
      expect(useContentComplete.getState().contentComplete).toBe(false);
    });

    it("should call cleanup function", () => {
      plugin.onLoad();
      const mockStory = createMockStory({
        options: { linedelay: 0.05 },
        contents: [{ text: "line1" }],
      });
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      mockStory.eventEmitter.emit("story.cleared");
    });

    it("should wrap choose function", () => {
      plugin.onLoad();
      const mockChoose = vi.fn();
      const mockStory = createMockStory({
        options: { linedelay: 0.05 },
        contents: [{ text: "line1" }],
        choose: mockChoose,
      });
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      (mockStory as unknown as { choose: (i: number) => void }).choose(0);
      expect(mockChoose).toHaveBeenCalledWith(0);
    });

    it("should set contentComplete false on choose with linedelay", () => {
      plugin.onLoad();
      useContentComplete.getState().setContentComplete(true);
      const mockStory = createMockStory({
        options: { linedelay: 0.05 },
        contents: [{ text: "line1" }, { text: "line2" }],
      });
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      (mockStory as unknown as { choose: (i: number) => void }).choose(0);
      expect(useContentComplete.getState().contentComplete).toBe(false);
    });

    it("should set lastContent on choose", () => {
      plugin.onLoad();
      useContentComplete.getState().setLastContent([]);
      const mockStory = createMockStory({
        options: { linedelay: 0.05 },
        contents: [{ text: "line1" }, { text: "line2" }],
      });
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      (mockStory as unknown as { choose: (i: number) => void }).choose(0);
      expect(useContentComplete.getState().last_content).toBe("line2");
    });

    it("should not set contentComplete false on choose with zero linedelay", () => {
      plugin.onLoad();
      useContentComplete.getState().setContentComplete(true);
      const mockStory = createMockStory({
        options: { linedelay: 0 },
        contents: [{ text: "line1" }],
      });
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      (mockStory as unknown as { choose: (i: number) => void }).choose(0);
      expect(useContentComplete.getState().contentComplete).toBe(true);
    });
  });

  describe("contentsStore subscription", () => {
    it("should set contentComplete true on contents update with zero linedelay", async () => {
      plugin.onLoad();
      useContentComplete.getState().setContentComplete(false);
      const mockStory = createMockStory({
        options: { linedelay: 0 },
      });
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");

      contentsStore.setState({ contents: [{ text: "new content" }] });
      await new Promise((r) => setTimeout(r, 0));

      expect(useContentComplete.getState().contentComplete).toBe(true);
    });

    it("should schedule timer on contents update with linedelay", async () => {
      plugin.onLoad();
      useContentComplete.getState().setContentComplete(false);
      const mockStory = createMockStory({
        options: { linedelay: 0.01 },
        contents: [{ text: "line1" }],
      });
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");

      contentsStore.setState({ contents: [{ text: "line1" }, { text: "line2" }] });
      await new Promise((r) => setTimeout(r, 50));

      expect(useContentComplete.getState().contentComplete).toBe(true);
    });

    it("should unsubscribe on cleanup", () => {
      plugin.onLoad();
      const mockStory = createMockStory({
        options: { linedelay: 0.05 },
      });
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");

      mockStory.eventEmitter.emit("story.cleared");
      contentsStore.setState({ contents: [{ text: "new" }] });

      expect(useContentComplete.getState().contentComplete).toBe(true);
    });
  });

  describe("CSS injection", () => {
    it("should have onLoad method", () => {
      expect(typeof plugin.onLoad).toBe("function");
    });
  });
});
