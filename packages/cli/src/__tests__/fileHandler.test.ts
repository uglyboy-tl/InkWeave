import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { NodeFileHandler } from "../fileHandler";

describe("NodeFileHandler", () => {
  const testDir = join(import.meta.dir, "test-fixture");
  const mainFile = join(testDir, "main.ink");
  const includeFile = join(testDir, "chapter1.ink");

  beforeAll(() => {
    mkdirSync(testDir, { recursive: true });
    writeFileSync(mainFile, "INCLUDE chapter1.ink\nHello World");
    writeFileSync(includeFile, "This is chapter 1.");
  });

  afterAll(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  describe("resolveFilename", () => {
    it("should resolve relative to base directory", () => {
      const handler = new NodeFileHandler(mainFile);
      const result = handler.resolveFilename("chapter1.ink");
      expect(result).toBe(includeFile);
    });

    it("should resolve nested paths", () => {
      const handler = new NodeFileHandler(mainFile);
      const result = handler.resolveFilename("stories/intro.ink");
      expect(result).toBe(join(testDir, "stories/intro.ink"));
    });
  });

  describe("loadFile", () => {
    it("should load file content", () => {
      const handler = new NodeFileHandler(mainFile);
      const content = handler.loadFile("chapter1.ink");
      expect(content).toBe("This is chapter 1.");
    });

    it("should throw error for non-existent file", () => {
      const handler = new NodeFileHandler(mainFile);
      expect(() => handler.loadFile("nonexistent.ink")).toThrow();
    });
  });

  describe("constructor", () => {
    it("should accept basePath option", () => {
      const handler = new NodeFileHandler("/path/to/story.ink");
      expect(handler.resolveFilename("test.ink")).toBe("/path/to/test.ink");
    });
  });
});
