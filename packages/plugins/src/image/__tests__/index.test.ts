import { beforeEach, describe, expect, it, mock } from "bun:test";
import { Patches, Tags } from "@inkweave/core";
import { createMockStory } from "../../../test/utils";
import { imagePlugin as load, useStoryImage } from "../index";

describe("image", () => {
  beforeEach(() => {
    Patches.patches = [];
    useStoryImage.getState().setImage("");
  });

  describe("load", () => {
    it("should register image tag", () => {
      load.onLoad();
      expect(Tags.functions.has("image")).toBe(true);
    });

    it("should register patch", () => {
      load.onLoad();
      expect(Patches.patches.length).toBeGreaterThan(0);
    });
  });

  describe("useStoryImage", () => {
    it("should have initial empty image", () => {
      expect(useStoryImage.getState().image).toBe("");
    });

    it("should set image", () => {
      useStoryImage.getState().setImage("test.png");
      expect(useStoryImage.getState().image).toBe("test.png");
    });

    it("should clear image", () => {
      useStoryImage.getState().setImage("test.png");
      useStoryImage.getState().setImage("");
      expect(useStoryImage.getState().image).toBe("");
    });
  });

  describe("fileHandler integration", () => {
    it("should use fileHandler for path resolution", () => {
      load.onLoad();
      const mockFileHandler = {
        resolveFilename: mock((path: string) => `/base/${path}`),
        loadFile: mock(() => ""),
      };
      const mockStory = createMockStory({
        options: { fileHandler: mockFileHandler },
      });
      Tags.process(mockStory as unknown as Parameters<typeof Tags.process>[0], "image: test.png");
      expect(useStoryImage.getState().image).toBe("/base/test.png");
    });

    it("should handle path without fileHandler", () => {
      load.onLoad();
      const mockStory = createMockStory();
      Tags.process(mockStory as unknown as Parameters<typeof Tags.process>[0], "image: test.png");
      expect(useStoryImage.getState().image).toBe("test.png");
    });

    it("should clear image when tag value is empty", () => {
      load.onLoad();
      useStoryImage.getState().setImage("existing.png");
      const mockStory = createMockStory();
      Tags.process(mockStory as unknown as Parameters<typeof Tags.process>[0], "image");
      expect(useStoryImage.getState().image).toBe("");
    });
  });

  describe("Patches", () => {
    it("should add image property", () => {
      load.onLoad();
      const mockStory = createMockStory();
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      expect(mockStory).toHaveProperty("image");
    });

    it("should push image to save_label", () => {
      load.onLoad();
      const mockStory = createMockStory();
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      expect(mockStory.save_label).toContain("image");
    });

    it("should clear image on clears callback", () => {
      load.onLoad();
      useStoryImage.getState().setImage("test.png");
      const mockStory = createMockStory();
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      mockStory.eventEmitter.emit("story.cleared");
      expect(useStoryImage.getState().image).toBe("");
    });

    it("should set image via property setter", () => {
      load.onLoad();
      const mockStory = createMockStory();
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      (mockStory as unknown as { image: string }).image = "new.png";
      expect(useStoryImage.getState().image).toBe("new.png");
    });
  });
});
