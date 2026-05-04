import { beforeEach, describe, expect, it, vi } from "bun:test";
import { ContentParser } from "../ContentParser";

describe("ContentParser", () => {
  beforeEach(() => {
    ContentParser.clear();
  });

  describe("tag", () => {
    it("should register tag handler", () => {
      const fn = vi.fn();
      ContentParser.tag("test", fn);
      expect(ContentParser.tags.get("test")).toBe(fn);
    });
  });

  describe("pattern", () => {
    it("should register pattern handler", () => {
      const fn = vi.fn();
      ContentParser.pattern("test", fn);
      expect(ContentParser.patterns).toHaveLength(1);
    });

    it("should register regex pattern", () => {
      const fn = vi.fn();
      ContentParser.pattern(/test/, fn);
      expect(ContentParser.patterns).toHaveLength(1);
    });
  });

  describe("process", () => {
    it("should return text unchanged if no handlers", () => {
      const result = ContentParser.process("Hello World");
      expect(result).toEqual({ text: "Hello World", classes: [] });
    });

    it("should call tag handlers", () => {
      const fn = vi.fn();
      ContentParser.tag("test", fn);
      ContentParser.process("Hello", ["test"]);
      expect(fn).toHaveBeenCalled();
    });

    it("should call pattern handlers", () => {
      const fn = vi.fn();
      ContentParser.pattern("Hello", fn);
      ContentParser.process("Hello World", []);
      expect(fn).toHaveBeenCalled();
    });

    it("should call regex pattern handlers", () => {
      const fn = vi.fn();
      ContentParser.pattern(/Hello/, fn);
      ContentParser.process("Hello World", []);
      expect(fn).toHaveBeenCalled();
    });

    it("should handle empty text", () => {
      const result = ContentParser.process("", []);
      expect(result).toEqual({ text: "", classes: [] });
    });

    it("should handle undefined text", () => {
      const result = ContentParser.process(undefined as unknown as string, []);
      expect(result).toEqual({ text: "", classes: [] });
    });
  });

  describe("clear", () => {
    it("should clear all handlers", () => {
      ContentParser.tag("test", vi.fn());
      ContentParser.pattern("test", vi.fn());
      ContentParser.clear();
      expect(ContentParser.tags.size).toBe(0);
      expect(ContentParser.patterns.length).toBe(0);
    });
  });
});
