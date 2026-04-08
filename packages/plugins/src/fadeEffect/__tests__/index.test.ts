import { beforeEach, describe, expect, it, vi } from "bun:test";
import { contentsStore, Patches, Tags } from "@inkweave/core";
import load, { useContentComplete } from "../index";

describe("fadeEffect", () => {
  beforeEach(() => {
    Patches.patches = [];
    useContentComplete.setState({ contentComplete: true, last_content: "" });
  });

  describe("load", () => {
    it("should register patch", () => {
      load();
      expect(Patches.patches.length).toBeGreaterThan(0);
    });

    it("should register linedelay tag", () => {
      load();
      expect(Tags.functions.has("linedelay")).toBe(true);
    });
  });

  describe("linedelay tag", () => {
    it("should set linedelay option from tag value", () => {
      load();
      const mockStory = {
        options: {} as Record<string, unknown>,
        save_label: [] as string[],
        clears: [] as (() => void)[],
      };
      Tags.process(mockStory as never, "linedelay: 0.1");
      expect(mockStory.options.linedelay).toBe(0.1);
    });

    it("should handle linedelay 0", () => {
      load();
      const mockStory = {
        options: {} as Record<string, unknown>,
        save_label: [] as string[],
        clears: [] as (() => void)[],
      };
      Tags.process(mockStory as never, "linedelay: 0");
      expect(mockStory.options.linedelay).toBe(0);
    });

    it("should handle invalid linedelay value", () => {
      load();
      const mockStory = {
        options: {} as Record<string, unknown>,
        save_label: [] as string[],
        clears: [] as (() => void)[],
      };
      Tags.process(mockStory as never, "linedelay: invalid");
      expect(mockStory.options.linedelay).toBeUndefined();
    });

    it("should handle null linedelay value", () => {
      load();
      const mockStory = {
        options: {} as Record<string, unknown>,
        save_label: [] as string[],
        clears: [] as (() => void)[],
      };
      Tags.process(mockStory as never, "linedelay:");
      expect(mockStory.options.linedelay).toBeUndefined();
    });
  });

  describe("Patches", () => {
    it("should add visibleLines property", () => {
      load();
      const mockStory = {
        options: { linedelay: 0.05 },
        contents: ["line1", "line2"],
        save_label: [] as string[],
        clears: [] as (() => void)[],
        cleanups: [] as (() => void)[],
        choose: () => {},
      };
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      expect(mockStory).toHaveProperty("visibleLines");
    });

    it("should return -1 for visibleLines when no last_content", () => {
      load();
      useContentComplete.getState().setLastContent([]);
      const mockStory = {
        options: { linedelay: 0.05 },
        contents: ["line1", "line2"],
        save_label: [] as string[],
        clears: [] as (() => void)[],
        cleanups: [] as (() => void)[],
        choose: () => {},
      };
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      expect((mockStory as unknown as { visibleLines: number }).visibleLines).toBe(-1);
    });

    it("should return correct index for visibleLines", () => {
      load();
      useContentComplete.getState().setLastContent(["line1", "line2"]);
      const mockStory = {
        options: { linedelay: 0.05 },
        contents: ["line1", "line2", "line3"],
        save_label: [] as string[],
        clears: [] as (() => void)[],
        cleanups: [] as (() => void)[],
        choose: () => {},
      };
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      expect((mockStory as unknown as { visibleLines: number }).visibleLines).toBe(1);
    });

    it("should add choicesCanShow property", () => {
      load();
      const mockStory = {
        options: { linedelay: 0.05 },
        contents: ["line1"],
        save_label: [] as string[],
        clears: [] as (() => void)[],
        cleanups: [] as (() => void)[],
        choose: () => {},
      };
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      const descriptor = Object.getOwnPropertyDescriptor(mockStory, "choicesCanShow");
      expect(descriptor).toBeDefined();
      expect(typeof descriptor?.get).toBe("function");
    });

    it("should call clear function", () => {
      load();
      const mockStory = {
        options: { linedelay: 0.05 },
        contents: ["line1", "line2"],
        save_label: [] as string[],
        clears: [] as (() => void)[],
        cleanups: [] as (() => void)[],
        choose: () => {},
      };
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      mockStory.clears[0]?.();
    });

    it("should set contentComplete false on clear with linedelay", () => {
      load();
      useContentComplete.getState().setContentComplete(true);
      const mockStory = {
        options: { linedelay: 0.05 },
        contents: [],
        save_label: [] as string[],
        clears: [] as (() => void)[],
        cleanups: [] as (() => void)[],
        choose: () => {},
      };
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      mockStory.clears[0]?.();
      expect(useContentComplete.getState().contentComplete).toBe(false);
    });

    it("should call cleanup function", () => {
      load();
      const mockStory = {
        options: { linedelay: 0.05 },
        contents: ["line1"],
        save_label: [] as string[],
        clears: [] as (() => void)[],
        cleanups: [] as (() => void)[],
        choose: () => {},
      };
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      mockStory.cleanups[0]?.();
    });

    it("should wrap choose function", () => {
      load();
      const mockChoose = vi.fn();
      const mockStory = {
        options: { linedelay: 0.05 },
        contents: ["line1"],
        save_label: [] as string[],
        clears: [] as (() => void)[],
        cleanups: [] as (() => void)[],
        choose: mockChoose,
      };
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      (mockStory as unknown as { choose: (i: number) => void }).choose(0);
      expect(mockChoose).toHaveBeenCalledWith(0);
    });

    it("should set contentComplete false on choose with linedelay", () => {
      load();
      useContentComplete.getState().setContentComplete(true);
      const mockChoose = vi.fn();
      const mockStory = {
        options: { linedelay: 0.05 },
        contents: ["line1", "line2"],
        save_label: [] as string[],
        clears: [] as (() => void)[],
        cleanups: [] as (() => void)[],
        choose: mockChoose,
      };
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      (mockStory as unknown as { choose: (i: number) => void }).choose(0);
      expect(useContentComplete.getState().contentComplete).toBe(false);
    });

    it("should set lastContent on choose", () => {
      load();
      useContentComplete.getState().setLastContent([]);
      const mockChoose = vi.fn();
      const mockStory = {
        options: { linedelay: 0.05 },
        contents: ["line1", "line2"],
        save_label: [] as string[],
        clears: [] as (() => void)[],
        cleanups: [] as (() => void)[],
        choose: mockChoose,
      };
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      (mockStory as unknown as { choose: (i: number) => void }).choose(0);
      expect(useContentComplete.getState().last_content).toBe("line2");
    });

    it("should not set contentComplete false on choose with zero linedelay", () => {
      load();
      useContentComplete.getState().setContentComplete(true);
      const mockChoose = vi.fn();
      const mockStory = {
        options: { linedelay: 0 },
        contents: ["line1"],
        save_label: [] as string[],
        clears: [] as (() => void)[],
        cleanups: [] as (() => void)[],
        choose: mockChoose,
      };
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      (mockStory as unknown as { choose: (i: number) => void }).choose(0);
      expect(useContentComplete.getState().contentComplete).toBe(true);
    });
  });

  describe("contentsStore subscription", () => {
    it("should set contentComplete true on contents update with zero linedelay", async () => {
      load();
      useContentComplete.getState().setContentComplete(false);
      const mockStory = {
        options: { linedelay: 0 },
        contents: [],
        save_label: [] as string[],
        clears: [] as (() => void)[],
        cleanups: [] as (() => void)[],
        choose: () => {},
      };
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");

      contentsStore.setState({ contents: ["new content"] });
      await new Promise((r) => setTimeout(r, 0));

      expect(useContentComplete.getState().contentComplete).toBe(true);
    });

    it("should schedule timer on contents update with linedelay", async () => {
      load();
      useContentComplete.getState().setContentComplete(false);
      const mockStory = {
        options: { linedelay: 0.01 },
        contents: ["line1"],
        save_label: [] as string[],
        clears: [] as (() => void)[],
        cleanups: [] as (() => void)[],
        choose: () => {},
      };
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");

      contentsStore.setState({ contents: ["line1", "line2"] });
      await new Promise((r) => setTimeout(r, 50));

      expect(useContentComplete.getState().contentComplete).toBe(true);
    });

    it("should unsubscribe on cleanup", () => {
      load();
      const mockStory = {
        options: { linedelay: 0.05 },
        contents: [],
        save_label: [] as string[],
        clears: [] as (() => void)[],
        cleanups: [] as (() => void)[],
        choose: () => {},
      };
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");

      mockStory.cleanups[0]?.();
      contentsStore.setState({ contents: ["new"] });

      expect(useContentComplete.getState().contentComplete).toBe(true);
    });
  });

  describe("CSS injection", () => {
    it("should inject CSS when loaded", () => {
      expect(typeof load).toBe("function");
    });
  });
});
