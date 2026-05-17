import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { Command } from "commander";
import type { GameType } from "../core";
import { runPipeline } from "../core";
import { duel } from "../modes/duel";
import { reigns } from "../modes/reigns";
import { survey } from "../modes/survey";

const MODES: Record<string, GameType> = { reigns, duel, survey };

const program = new Command()
  .name("inkweave-gen")
  .description("Ink script generator for various game types")
  .version("0.1.0");

program
  .command("generate")
  .alias("gen")
  .description("Generate ink files from input data")
  .argument("<input>", "Input file or directory")
  .requiredOption("-t, --type <type>", `Available: ${Object.keys(MODES).join(", ")}`)
  .option("-o, --output <dir>", "Output directory")
  .option("--dry-run", "Preview output without writing files", false)
  .action((input, options) => {
    const mode = MODES[options.type];
    if (!mode) {
      console.error(
        `Unknown game type: ${options.type}\nAvailable: ${Object.keys(MODES).join(", ")}`,
      );
      process.exit(1);
    }

    const { validation, module } = runPipeline({ input, plugin: mode });

    if (!validation.valid) {
      console.error("Validation failed:");
      for (const e of validation.errors) console.error(`  - [${e.table}] ${e.message}`);
      process.exit(1);
    }

    if (validation.warnings?.length) {
      console.warn("Warnings:");
      for (const w of validation.warnings) console.warn(`  - [${w.table}] ${w.message}`);
    }

    if (!module) return;

    if (options.dryRun) {
      for (const file of module.files) console.log(`\n--- ${file.path} ---\n${file.content}`);
      return;
    }

    if (!options.output) {
      console.error("Error: --output is required");
      process.exit(1);
    }

    for (const file of module.files) {
      const filePath = join(options.output, file.path);
      mkdirSync(dirname(filePath), { recursive: true });
      writeFileSync(filePath, file.content, "utf-8");
    }
    console.log(`Generated ${module.files.length} files in ${options.output}`);
  });

program
  .command("list")
  .description("List all available game types")
  .action(() => {
    const ids = Object.keys(MODES);
    if (!ids.length) return console.log("No game types available.");
    console.log("Available game types:\n");
    for (const id of ids) {
      const mode = MODES[id];
      if (mode) console.log(`  ${id.padEnd(12)} ${mode.description}`);
    }
  });

program
  .command("schema")
  .description("Show schema for a game type")
  .requiredOption("-t, --type <type>", "Game type")
  .action((options) => {
    const mode = MODES[options.type];
    if (!mode) {
      console.error(`Unknown game type: ${options.type}`);
      process.exit(1);
    }
    console.log(`Schema for ${mode.name}:\n${JSON.stringify(mode.tableSchemas, null, 2)}`);
  });

export { program };

if (import.meta.main) {
  program.parse();
}
