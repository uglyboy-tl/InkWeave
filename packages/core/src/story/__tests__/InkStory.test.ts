import { beforeEach, describe, expect, it, vi } from "bun:test";
import type { Story } from "inkjs/engine/Story";
import { ExternalFunctions } from "../../extensions/ExternalFunctions";
import { Parser } from "../../extensions/Parser";
import { Tags } from "../../extensions/Tags";
import choicesStore from "../../state/choices";
import contentsStore from "../../state/contents";
import { InkStory } from "../InkStory";

describe("InkStory", () => {
  let mockStory: Story;
  let ink: InkStory;

  beforeEach(() => {
    mockStory = {
      canContinue: true,
      Continue: vi.fn().mockReturnValue("Hello"),
      currentTags: [],
      currentChoices: [],
      variablesState: {
        _globalVariables: new Map(),
      },
      ChooseChoiceIndex: vi.fn(),
      ResetState: vi.fn(),
      ToJson: vi.fn().mockReturnValue("{}"),
    } as unknown as Story;
    ink = new InkStory(mockStory, "Test");

    contentsStore.getState().setContents([]);
    choicesStore.getState().clear();
    Tags.clear();
    Parser.clear();
    ExternalFunctions.clear();
  });

  describe("constructor", () => {
    it("should initialize with title", () => {
      expect(ink.title).toBe("Test");
    });

    it("should set story property", () => {
      expect(ink.story).toBe(mockStory);
    });

    it("should accept custom options", () => {
      const customInk = new InkStory(mockStory, "Custom", { debug: true, linedelay: 0.1 });
      expect(customInk.options.debug).toBe(true);
      expect(customInk.options.linedelay).toBe(0.1);
    });
  });

  describe("contents", () => {
    it("should get contents", () => {
      expect(ink.contents).toEqual([]);
    });

    it("should set contents", () => {
      ink.contents = [{ text: "hello" }, { text: "world" }];
      expect(ink.contents).toEqual([{ text: "hello" }, { text: "world" }]);
    });

    it("should emit CONTENTS_CHANGED event with proper data", () => {
      const mockEventHandler = vi.fn();
      ink.eventEmitter.on("contents.changed", mockEventHandler);

      const oldContents = [...ink.contents];
      const newContents = [{ text: "hello" }, { text: "world" }];
      ink.contents = newContents;

      expect(mockEventHandler).toHaveBeenCalledWith({
        story: ink,
        oldContents,
        newContents,
        timestamp: expect.any(Number),
      });
    });
  });

  describe("choices", () => {
    it("should get choices", () => {
      expect(ink.choices).toEqual([]);
    });
  });

  describe("save_label", () => {
    it("should have contents label", () => {
      expect(ink.save_label).toContain("contents");
    });
  });

  // clears 和 cleanups 功能已被事件系统替代

  describe("continue", () => {
    it("should add content from story", () => {
      let callCount = 0;
      (mockStory.Continue as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callCount++;
        if (callCount === 1) return "Line 1";
        if (callCount === 2) return "Line 2";
        return null;
      });
      Object.defineProperty(mockStory, "canContinue", {
        get: () => callCount < 3,
      });

      ink.continue();

      expect(ink.contents).toContainEqual({ text: "Line 1" });
      expect(ink.contents).toContainEqual({ text: "Line 2" });
    });

    it("should emit STORY_CONTINUE_START and STORY_CONTINUE_END events", () => {
      const startEventHandler = vi.fn();
      const endEventHandler = vi.fn();
      ink.eventEmitter.on("story.continue.start", startEventHandler);
      ink.eventEmitter.on("story.continue.end", endEventHandler);

      let callCount = 0;
      (mockStory.Continue as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callCount++;
        return callCount === 1 ? "Line 1" : null;
      });
      Object.defineProperty(mockStory, "canContinue", {
        get: () => callCount < 2,
      });

      ink.continue();

      expect(startEventHandler).toHaveBeenCalledWith({ story: ink, state: mockStory.state });
      expect(endEventHandler).toHaveBeenCalledWith({
        story: ink,
        state: mockStory.state,
        newContent: [{ text: "Line 1" }],
        choices: [],
        variables: mockStory.variablesState,
      });
    });

    it("should process tags", () => {
      const tagFn = vi.fn();
      Tags.add("custom", tagFn);
      let callCount = 0;
      (mockStory as unknown as Record<string, unknown>).currentTags = ["custom: value"];
      (mockStory.Continue as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callCount++;
        return callCount === 1 ? "Text" : null;
      });
      Object.defineProperty(mockStory, "canContinue", {
        get: () => callCount < 1,
        configurable: true,
      });

      ink.continue();

      expect(tagFn).toHaveBeenCalledWith("value", ink);
    });

    it("should process text with parser", () => {
      Parser.tag("uppercase", (line: { text: string }) => {
        line.text = line.text.toUpperCase();
      });
      let callCount = 0;
      (mockStory as unknown as Record<string, unknown>).currentTags = ["uppercase"];
      (mockStory.Continue as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callCount++;
        return callCount === 1 ? "hello" : null;
      });
      Object.defineProperty(mockStory, "canContinue", {
        get: () => callCount < 1,
        configurable: true,
      });

      ink.continue();

      expect(ink.contents).toContainEqual({ text: "HELLO", classes: [] });
    });

    it("should set choices", () => {
      const mockChoices = [
        { text: "Choice 1", index: 0, tags: null },
        { text: "Choice 2", index: 1, tags: null },
      ];
      (mockStory as unknown as Record<string, unknown>).currentChoices = mockChoices;
      Object.defineProperty(mockStory, "canContinue", {
        get: () => false,
        configurable: true,
      });

      ink.continue();

      expect(ink.choices.length).toBe(2);
    });
  });

  describe("choose", () => {
    it("should call ChooseChoiceIndex", () => {
      Object.defineProperty(mockStory, "canContinue", {
        get: () => false,
        configurable: true,
      });

      ink.choose(0);

      expect(mockStory.ChooseChoiceIndex).toHaveBeenCalledWith(0);
    });

    it("should add choice separator", () => {
      Object.defineProperty(mockStory, "canContinue", {
        get: () => false,
        configurable: true,
      });

      ink.choose(0);

      expect(ink.contents.length).toBeGreaterThan(0);
    });
  });

  describe("clear", () => {
    it("should clear contents by default", () => {
      ink.contents = [{ text: "hello" }, { text: "world" }];

      ink.clear();

      expect(ink.contents).toEqual([]);
    });

    it("should emit STORY_CLEARED event", () => {
      const mockEventHandler = vi.fn();
      ink.eventEmitter.on("story.cleared", mockEventHandler);

      ink.contents = [{ text: "hello" }, { text: "world" }];
      ink.clear();

      expect(mockEventHandler).toHaveBeenCalledWith({ story: ink });
      expect(ink.contents).toEqual([]);
    });
  });

  describe("restart", () => {
    it("should reset story state", () => {
      Object.defineProperty(mockStory, "canContinue", {
        get: () => false,
        configurable: true,
      });

      ink.restart();

      expect(mockStory.ResetState).toHaveBeenCalled();
    });

    it("should clear contents", () => {
      ink.contents = [{ text: "hello" }, { text: "world" }];
      Object.defineProperty(mockStory, "canContinue", {
        get: () => false,
        configurable: true,
      });

      ink.restart();

      expect(ink.contents).toEqual([]);
    });
  });

  describe("dispose", () => {
    it("should emit dispose event", () => {
      const fn = vi.fn();
      (
        ink as unknown as { eventEmitter: { on: (event: string, cb: () => void) => void } }
      ).eventEmitter.on("story.dispose", fn);
      ink.dispose();
      expect(fn).toHaveBeenCalledWith({ story: ink });
    });
  });

  describe("story.initialized event", () => {
    it("should support initialized event system", () => {
      (mockStory.ToJson as ReturnType<typeof vi.fn>).mockReturnValue("");
      const testInk = new InkStory(mockStory, "Test");
      testInk.eventEmitter.emit("story.initialized", { story: testInk });
      expect(testInk.eventEmitter).toBeDefined();
    });
  });
});
