import { beforeEach, describe, expect, it, vi } from "bun:test";
import { Externals } from "../Externals";

describe("Externals", () => {
  beforeEach(() => {
    Externals.clear();
  });

  describe("add", () => {
    it("should register function", () => {
      const fn = () => "result";
      Externals.add("test", fn);
      expect(Externals.get("test")).toBe(fn);
    });

    it("should register multiple functions", () => {
      const fn1 = () => 1;
      const fn2 = () => 2;
      Externals.add("fn1", fn1);
      Externals.add("fn2", fn2);
      expect(Externals.functions.size).toBe(2);
    });
  });

  describe("get", () => {
    it("should return registered function", () => {
      const fn = () => "result";
      Externals.add("test", fn);
      expect(Externals.get("test")).toBe(fn);
    });

    it("should return undefined for non-existent", () => {
      expect(Externals.get("nonexistent")).toBeUndefined();
    });
  });

  describe("bind", () => {
    it("should bind function to story", () => {
      const fn = vi.fn();
      Externals.add("test", fn);
      const ink = {
        story: {
          BindExternalFunction: vi.fn(),
        },
      };
      Externals.bind(ink as unknown as Parameters<typeof Externals.bind>[0], "test");
      expect(ink.story.BindExternalFunction).toHaveBeenCalled();
    });

    it("should handle undefined function", () => {
      const ink = {
        story: {
          BindExternalFunction: vi.fn(),
        },
      };
      Externals.bind(ink as unknown as Parameters<typeof Externals.bind>[0], "nonexistent");
      expect(ink.story.BindExternalFunction).not.toHaveBeenCalled();
    });
  });

  describe("clear", () => {
    it("should clear all functions", () => {
      Externals.add("fn1", () => {});
      Externals.add("fn2", () => {});
      Externals.clear();
      expect(Externals.functions.size).toBe(0);
    });
  });

  describe("functions getter", () => {
    it("should return functions map", () => {
      const fn = () => {};
      Externals.add("test", fn);
      expect(Externals.functions.has("test")).toBe(true);
    });
  });

  describe("clear + add", () => {
    it("should replace all functions via clear then add", () => {
      Externals.add("test", () => "test");
      Externals.clear();
      Externals.add("custom", () => "custom");
      expect(Externals.functions.has("custom")).toBe(true);
      expect(Externals.functions.has("test")).toBe(false);
    });
  });
});
