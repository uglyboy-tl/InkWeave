import { afterEach, beforeEach, describe, expect, it, mock, vi } from "bun:test";
import { createInkStory } from "@inkweave/core";
import { runStory } from "../runner";

const promptsMock = mock();

mock.module("prompts", () => ({
  default: promptsMock,
}));

describe("runStory", () => {
  let consoleClearSpy: ReturnType<typeof vi.spyOn>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let stdoutWriteSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleClearSpy = vi.spyOn(console, "clear").mockImplementation(() => {});
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    stdoutWriteSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    promptsMock.mockClear();
  });

  afterEach(() => {
    consoleClearSpy.mockRestore();
    consoleLogSpy.mockRestore();
    stdoutWriteSpy.mockRestore();
  });

  describe("basic flow", () => {
    it("should display content and end when no choices", async () => {
      promptsMock.mockResolvedValue({ choice: undefined });

      const source = "Hello World";
      const story = createInkStory(source);

      await runStory(story);

      expect(stdoutWriteSpy).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith("\n=== Story End ===");
    });

    it("should handle clear callback", async () => {
      promptsMock.mockResolvedValue({ choice: undefined });

      const source = "Hello World";
      const story = createInkStory(source);

      story.clear();
      await runStory(story);

      expect(consoleClearSpy).toHaveBeenCalled();
    });
  });

  describe("line delay", () => {
    it("should handle linedelay option", async () => {
      promptsMock.mockResolvedValue({ choice: undefined });

      const source = "Line 1";
      const story = createInkStory(source, { linedelay: 0 });

      await runStory(story);

      expect(stdoutWriteSpy).toHaveBeenCalled();
    });

    it("should apply positive linedelay", async () => {
      promptsMock.mockResolvedValue({ choice: undefined });

      const source = "Line 1\nLine 2";
      const story = createInkStory(source, { linedelay: 0.001 });

      await runStory(story);

      expect(stdoutWriteSpy).toHaveBeenCalled();
    });

    it("should skip empty content", async () => {
      promptsMock.mockResolvedValue({ choice: undefined });

      const source = "   \nHello";
      const story = createInkStory(source);

      await runStory(story);

      expect(stdoutWriteSpy).toHaveBeenCalled();
    });
  });

  describe("choice handling", () => {
    it("should prompt user for choice", async () => {
      promptsMock.mockResolvedValue({ choice: undefined });

      const source = "Hello\n+ [Choice 1]\n+ [Choice 2]";
      const story = createInkStory(source);

      await runStory(story);

      expect(promptsMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "select",
          name: "choice",
        }),
      );
    });

    it("should exit when user cancels choice", async () => {
      promptsMock.mockResolvedValue({ choice: undefined });

      const source = "Hello\n+ [Choice 1]";
      const story = createInkStory(source);

      await runStory(story);

      expect(promptsMock).toHaveBeenCalledTimes(1);
    });

    it("should continue after selecting choice", async () => {
      promptsMock.mockResolvedValueOnce({ choice: 0 }).mockResolvedValueOnce({ choice: undefined });

      const source = `
Hello
+ [Go left] -> left
+ [Go right] -> right

=== left
You went left.
+ [Continue] -> done

=== right
You went right.
+ [Continue] -> done

=== done
The end.
`;
      const story = createInkStory(source);

      await runStory(story);

      expect(promptsMock).toHaveBeenCalledTimes(2);
    });
  });

  describe("content filtering", () => {
    it("should skip CHOICE_SEPARATOR content", async () => {
      promptsMock.mockResolvedValue({ choice: undefined });

      const source = "Hello";
      const story = createInkStory(source);

      await runStory(story);

      const calls = stdoutWriteSpy.mock.calls as string[][];
      const writtenContent = calls.map((call) => call[0]).join("");
      expect(writtenContent).not.toContain("[*]");
    });
  });
});
