import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { Tags } from "@inkweave/core";
import { linkOpenPlugin as plugin } from "../index";

describe("linkopen", () => {
  describe("load", () => {
    it("should register linkopen tag", () => {
      plugin.onLoad();
      expect(Tags.functions.has("linkopen")).toBe(true);
    });
  });

  describe("security", () => {
    const originalOpen = window.open;
    const mockOpen = mock(() => null);

    beforeEach(() => {
      window.open = mockOpen as unknown as typeof window.open;
    });

    afterEach(() => {
      window.open = originalOpen;
      mockOpen.mockClear();
    });

    it("should open http URLs", () => {
      plugin.onLoad();

      Tags.process(
        {} as unknown as Parameters<typeof Tags.process>[0],
        "linkopen: http://example.com",
      );

      expect(mockOpen).toHaveBeenCalledWith("http://example.com", "_blank", "noopener,noreferrer");
    });

    it("should open https URLs", () => {
      plugin.onLoad();

      Tags.process(
        {} as unknown as Parameters<typeof Tags.process>[0],
        "linkopen: https://example.com",
      );

      expect(mockOpen).toHaveBeenCalledWith("https://example.com", "_blank", "noopener,noreferrer");
    });

    it("should block unsafe protocols", () => {
      plugin.onLoad();
      const warnSpy = mock(() => {});
      const originalWarn = console.warn;
      console.warn = warnSpy;

      Tags.process(
        {} as unknown as Parameters<typeof Tags.process>[0],
        "linkopen: javascript:alert(1)",
      );

      expect(mockOpen).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalled();

      console.warn = originalWarn;
    });

    it("should handle invalid URLs", () => {
      plugin.onLoad();
      const warnSpy = mock(() => {});
      const originalWarn = console.warn;
      console.warn = warnSpy;

      Tags.process({} as unknown as Parameters<typeof Tags.process>[0], "linkopen: not a url");

      expect(mockOpen).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalled();

      console.warn = originalWarn;
    });
  });
});
