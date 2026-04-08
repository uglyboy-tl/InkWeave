#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createInkStory } from "@inkweave/core";
import { program } from "commander";
import { NodeFileHandler } from "./fileHandler";
import { runStory } from "./runner";

program
  .name("inkweave")
  .description("CLI tool to run Ink story files")
  .version("1.0.0")
  .argument("<file>", "Ink story file (.ink or .json)")
  .option("-d, --debug", "Enable debug mode", false)
  .action(async (file: string, options: { debug: boolean }) => {
    try {
      const filePath = resolve(file);

      if (!existsSync(filePath)) {
        console.error(`Error: File not found - ${filePath}`);
        process.exit(1);
      }

      const content = readFileSync(filePath, "utf-8");
      const fileHandler = new NodeFileHandler(filePath);

      const story = createInkStory(content, {
        title: file,
        debug: options.debug,
        fileHandler,
      });

      await runStory(story);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Runtime error:", error.message);
      } else {
        console.error("Runtime error:", error);
      }
      process.exit(1);
    }
  });

program.parse();
