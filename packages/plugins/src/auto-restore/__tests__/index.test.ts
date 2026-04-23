import { beforeEach, describe, expect, it, vi } from "bun:test";
import { Events, Patches, Tags } from "@inkweave/core";
import { createMockStory } from "../../../test/utils";
import type { SaveSlot } from "../../memory";
import { memory } from "../../memory";
import { autoRestorePlugin as plugin } from "../index";

describe("autorestore plugin", () => {
  beforeEach(() => {
    Patches.clear();
    Tags.clear();
    vi.clearAllMocks();
  });

  it("should register patch", () => {
    plugin.onLoad();
    expect(Patches.patches.length).toBe(1);
  });

  it("should autosave on choice selected", () => {
    plugin.onLoad();

    const mockInk = createMockStory();

    const onSpy = vi.spyOn(mockInk.eventEmitter, "on");
    const patch = Patches.patches[0];
    if (patch) {
      patch.bind(mockInk, "")();
    }

    expect(onSpy).toHaveBeenCalledWith(Events.CHOICE_SELECTED, expect.any(Function));
  });

  it("should auto restore on story initialized", () => {
    plugin.onLoad();

    const mockSaveData: SaveSlot = {
      data: JSON.stringify({ state: "test-state" }),
      timestamp: "Jan 1, 12:00",
      meta: "test",
    };

    const showSpy = vi.spyOn(memory, "show").mockReturnValue([mockSaveData]);
    const loadSpy = vi.spyOn(memory, "load").mockImplementation(() => {});

    const mockInk = createMockStory();

    const onSpy = vi.spyOn(mockInk.eventEmitter, "on");
    const patch = Patches.patches[0];
    if (patch) {
      patch.bind(mockInk, "")();
    }

    const initCall = onSpy.mock.calls.find((call) => call[0] === Events.STORY_INITIALIZED);
    if (initCall?.[1]) {
      (initCall[1] as () => void)();
    }

    expect(showSpy).toHaveBeenCalledWith("test-story");
    expect(loadSpy).toHaveBeenCalled();
  });

  it("should use once to restore only once per instance", () => {
    plugin.onLoad();

    const mockSaveData: SaveSlot = {
      data: JSON.stringify({ state: "test-state" }),
      timestamp: "Jan 1, 12:00",
      meta: "test",
    };

    vi.spyOn(memory, "show").mockReturnValue([mockSaveData]);
    const loadSpy = vi.spyOn(memory, "load").mockImplementation(() => {});

    const mockInk = createMockStory();

    const onceSpy = vi.spyOn(mockInk.eventEmitter, "once");
    const patch = Patches.patches[0];
    if (patch) {
      patch.bind(mockInk, "")();
    }

    expect(onceSpy).toHaveBeenCalledWith(Events.STORY_INITIALIZED, expect.any(Function));

    mockInk.eventEmitter.emit(Events.STORY_INITIALIZED, { story: mockInk });
    mockInk.eventEmitter.emit(Events.STORY_INITIALIZED, { story: mockInk });

    expect(loadSpy).toHaveBeenCalledTimes(1);
  });
});
