import { Compiler } from "inkjs/compiler/Compiler";
import { CompilerOptions } from "inkjs/compiler/CompilerOptions";
import { Story } from "inkjs/engine/Story";
import { InkjsFileHandler } from "./file/InkjsFileHandler";
import { InkStory } from "./story/InkStory";
import type { InkStoryOptions } from "./types";

function isCompiledJson(input: string): boolean {
  const trimmed = input.trim();
  return trimmed.startsWith("{") && trimmed.endsWith("}");
}

export function createInkStory(source: string | Story, options?: InkStoryOptions): InkStory {
  let story: Story;

  if (source instanceof Story) {
    story = source;
  } else if (typeof source === "string") {
    if (isCompiledJson(source)) {
      story = new Story(source);
    } else {
      const errorHandler = options?.errorHandler || null;
      const inkjsHandler = options?.fileHandler ? new InkjsFileHandler(options.fileHandler) : null;
      const compilerOptions = new CompilerOptions(null, [], false, errorHandler, inkjsHandler);
      const compiler = new Compiler(source, compilerOptions);
      story = compiler.Compile();
    }
  } else {
    throw new Error("Invalid source type: expected string or Story");
  }

  return new InkStory(story, options?.title || "Ink Story", options);
}
