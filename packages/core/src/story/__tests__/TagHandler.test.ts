import { describe, expect, it, vi } from "bun:test";
import { TagHandler } from "../TagHandler";
import { splitAtCharacter } from "../utils";

describe("TagHandler", () => {
  describe("splitAtCharacter", () => {
    it("should split at colon", () => {
      const result = splitAtCharacter("image: path.png", ":");
      expect(result).toEqual({
        before: "image",
        after: "path.png",
      });
    });

    it("should return trimmed values", () => {
      const result = splitAtCharacter("  image  :  path.png  ", ":");
      expect(result).toEqual({
        before: "image",
        after: "path.png",
      });
    });

    it("should return undefined for empty string", () => {
      const result = splitAtCharacter("", ":");
      expect(result).toBeUndefined();
    });

    it("should return only before if no separator", () => {
      const result = splitAtCharacter("image", ":");
      expect(result).toEqual({ before: "image" });
    });

    it("should return undefined for null", () => {
      const result = splitAtCharacter(null as unknown as string, ":");
      expect(result).toBeUndefined();
    });
  });

  describe("add", () => {
    it("should register and process custom tag", () => {
      const mockFn = vi.fn();
      TagHandler.add("test", mockFn);
      TagHandler.process({} as unknown as Parameters<typeof TagHandler.process>[0], "test: value");
      expect(mockFn).toHaveBeenCalledWith("value", expect.anything());
    });

    it("should register tag without after value", () => {
      const mockFn = vi.fn();
      TagHandler.add("test2", mockFn);
      TagHandler.process({} as unknown as Parameters<typeof TagHandler.process>[0], "test2");
      expect(mockFn).toHaveBeenCalledWith(undefined, expect.anything());
    });
  });

  describe("process", () => {
    it("should update options with number value", () => {
      const story = { options: { linedelay: 0 } } as unknown as Parameters<
        typeof TagHandler.process
      >[0];
      TagHandler.process(story, "linedelay: 0.1");
      expect(story.options.linedelay).toBe(0.1);
    });

    it("should update options with boolean value", () => {
      const story = { options: { debug: false } } as unknown as Parameters<
        typeof TagHandler.process
      >[0];
      TagHandler.process(story, "debug: true");
      expect(story.options.debug).toBe(true);
    });

    it("should handle unknown tag", () => {
      const story = { options: {} } as unknown as Parameters<typeof TagHandler.process>[0];
      TagHandler.process(story, "unknown: value");
    });
  });

  describe("clear", () => {
    it("should clear custom tags", () => {
      TagHandler.add("custom", vi.fn());
      TagHandler.clear();
      expect(TagHandler.handlers.has("custom")).toBe(false);
    });

    it("should keep default tags", () => {
      TagHandler.clear();
      expect(TagHandler.handlers.has("clear")).toBe(true);
      expect(TagHandler.handlers.has("restart")).toBe(true);
    });
  });
});
