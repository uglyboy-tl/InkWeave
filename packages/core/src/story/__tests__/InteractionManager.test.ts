import { beforeEach, describe, expect, it, vi } from "bun:test";
import type { Choice as InkChoice } from "inkjs/engine/Choice";
import type { Story } from "inkjs/engine/Story";
import { Events } from "../../constants";
import choicesStore from "../../state/choices";
import { Choice } from "../../types";
import { InkStory } from "../InkStory";
import { InteractionManager } from "../InteractionManager";

describe("InteractionManager", () => {
  let mockStory: Story;
  let ink: InkStory;
  let manager: InteractionManager;

  beforeEach(() => {
    mockStory = {
      canContinue: false,
      Continue: vi.fn(),
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
    manager = ink.interactionManager;
  });

  describe("constructor", () => {
    it("should store reference to InkStory", () => {
      expect(manager.story).toBe(ink);
    });
  });

  describe("register / unregister", () => {
    it("should register an interaction", () => {
      manager.register("swipe-left", (choices) => choices[0]?.index ?? null);
      expect(manager.has("swipe-left")).toBe(true);
    });

    it("should unregister an interaction", () => {
      manager.register("swipe-left", (choices) => choices[0]?.index ?? null);
      manager.unregister("swipe-left");
      expect(manager.has("swipe-left")).toBe(false);
    });

    it("should return registered names", () => {
      manager.register("swipe-left", (choices) => choices[0]?.index ?? null);
      manager.register("swipe-right", (choices) => choices[1]?.index ?? null);
      expect(manager.getRegistered()).toContain("swipe-left");
      expect(manager.getRegistered()).toContain("swipe-right");
    });

    it("should clear all registrations", () => {
      manager.register("swipe-left", (choices) => choices[0]?.index ?? null);
      manager.register("swipe-right", (choices) => choices[1]?.index ?? null);
      manager.clear();
      expect(manager.getRegistered()).toEqual([]);
    });
  });

  describe("presets", () => {
    it("should have left preset returning first choice index", () => {
      const choices = [new Choice("Left", 0), new Choice("Right", 1)];
      const result = InteractionManager.presets.left(choices);
      expect(result).toBe(0);
    });

    it("should have right preset returning second choice index", () => {
      const choices = [new Choice("Left", 0), new Choice("Right", 1)];
      const result = InteractionManager.presets.right(choices);
      expect(result).toBe(1);
    });

    it("should have first preset returning first choice index", () => {
      const choices = [new Choice("A", 0), new Choice("B", 1)];
      const result = InteractionManager.presets.first(choices);
      expect(result).toBe(0);
    });

    it("should have second preset returning second choice index", () => {
      const choices = [new Choice("A", 0), new Choice("B", 1)];
      const result = InteractionManager.presets.second(choices);
      expect(result).toBe(1);
    });

    it("should return null for missing choices", () => {
      expect(InteractionManager.presets.left([])).toBeNull();
      expect(InteractionManager.presets.right([])).toBeNull();
    });
  });

  describe("trigger", () => {
    it("should return false for unregistered interaction", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      expect(manager.trigger("nonexistent")).toBe(false);
      expect(warnSpy).toHaveBeenCalledWith('InteractionManager: "nonexistent" is not registered');
      warnSpy.mockRestore();
    });

    it("should emit INTERACTION_TRIGGERED event with correct data", () => {
      const handler = vi.fn();
      ink.eventEmitter.on(Events.INTERACTION_TRIGGERED, handler);
      manager.register("swipe-left", (choices) => choices[0]?.index ?? null);

      const inkChoices = [
        { text: "Left", index: 0, tags: null },
        { text: "Right", index: 1, tags: null },
      ] as unknown as InkChoice[];
      choicesStore.getState().setChoices(inkChoices);

      const result = manager.trigger("swipe-left");
      expect(result).toBe(true);
      expect(handler).toHaveBeenCalledWith({
        story: ink,
        interaction: "swipe-left",
        index: 0,
      });
    });

    it("should return false when resolver returns null", () => {
      const handler = vi.fn();
      ink.eventEmitter.on(Events.INTERACTION_TRIGGERED, handler);
      manager.register("swipe-left", () => null);

      expect(manager.trigger("swipe-left")).toBe(false);
      expect(handler).not.toHaveBeenCalled();
    });

    it("should work with preset resolvers", () => {
      const handler = vi.fn();
      ink.eventEmitter.on(Events.INTERACTION_TRIGGERED, handler);

      const inkChoices = [
        { text: "Left", index: 0, tags: null },
        { text: "Right", index: 1, tags: null },
      ] as unknown as InkChoice[];

      manager.register("left", InteractionManager.presets.left);
      manager.register("right", InteractionManager.presets.right);

      choicesStore.getState().setChoices(inkChoices);
      manager.trigger("left");
      expect(handler).toHaveBeenCalledWith({
        story: ink,
        interaction: "left",
        index: 0,
      });

      choicesStore.getState().setChoices(inkChoices);
      manager.trigger("right");
      expect(handler).toHaveBeenCalledWith({
        story: ink,
        interaction: "right",
        index: 1,
      });
    });
  });

  describe("integration with InkStory", () => {
    it("should automatically call choose when trigger fires", () => {
      const chooseSpy = vi.spyOn(ink, "choose");

      const inkChoices = [
        { text: "Left", index: 0, tags: null },
        { text: "Right", index: 1, tags: null },
      ] as unknown as InkChoice[];
      choicesStore.getState().setChoices(inkChoices);

      ink.interactionManager.register("left", InteractionManager.presets.left);
      ink.interactionManager.trigger("left");

      expect(chooseSpy).toHaveBeenCalledWith(0);
    });
  });
});
