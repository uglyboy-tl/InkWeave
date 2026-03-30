import { describe, expect, it, mock } from "bun:test";
import { Patches, Tags } from "@inkweave/core";
import load, { useStoryImage } from "../index";

describe("image", () => {
  describe("load", () => {
    it("should register image tag", () => {
      load();
      expect(Tags.functions.has("image")).toBe(true);
    });

    it("should register patch", () => {
      load();
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
      load();
      const mockFileHandler = {
        resolveFilename: mock((path: string) => `/base/${path}`),
        loadFile: mock(() => ""),
      };
      const mockStory = {
        options: { fileHandler: mockFileHandler },
        save_label: [],
        clears: [],
      };
      Tags.process(mockStory as unknown as Parameters<typeof Tags.process>[0], "image: test.png");
      expect(useStoryImage.getState().image).toBe("/base/test.png");
    });

    it("should handle path without fileHandler", () => {
      load();
      const mockStory = {
        options: {},
        save_label: [],
        clears: [],
      };
      Tags.process(mockStory as unknown as Parameters<typeof Tags.process>[0], "image: test.png");
      expect(useStoryImage.getState().image).toBe("test.png");
    });
  });
});
