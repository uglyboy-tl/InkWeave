import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { Command } from "commander";
import { autoParse, parse } from "../core/parsers";
import { registry } from "../core/registry";

const program = new Command()
  .name("inkweave-gen")
  .description("Ink script generator for various game types")
  .version("0.1.0");

program
  .command("generate")
  .alias("gen")
  .description("Generate ink files from input data")
  .requiredOption("-t, --type <type>", "Game type (e.g., duel, reigns, survey)")
  .requiredOption("-i, --input <file>", "Input file path")
  .requiredOption("-o, --output <dir>", "Output directory")
  .option("-f, --format <format>", "Input format (csv, markdown, json)", "auto")
  .option("--dry-run", "Preview output without writing files", false)
  .action((options) => {
    const inputContent = readFileSync(options.input, "utf-8");
    const data =
      options.format === "auto" ? autoParse(inputContent) : parse(inputContent, options.format);
    const gameType = registry.get(options.type);

    if (!gameType) {
      console.error(
        `Unknown game type: ${options.type}\nAvailable: ${registry.getIds().join(", ")}`,
      );
      process.exit(1);
    }

    const validation = gameType.validate(data);
    if (!validation.valid) {
      console.error("Validation failed:");
      for (const e of validation.errors) console.error(`  - [${e.table}] ${e.message}`);
      process.exit(1);
    }

    const result = gameType.generate(data);

    if (options.dryRun) {
      for (const file of result.files) {
        console.log(`\n--- ${file.path} ---\n${file.content}`);
      }
      return;
    }

    for (const file of result.files) {
      const filePath = join(options.output, file.path);
      mkdirSync(dirname(filePath), { recursive: true });
      writeFileSync(filePath, file.content, "utf-8");
    }
    console.log(
      `Generated ${result.files.length} files in ${options.output}\nEntry: ${result.entry}`,
    );
  });

program
  .command("list")
  .description("List all available game types")
  .action(() => {
    const types = registry.getAll();
    if (!types.length) return console.log("No game types registered.");
    console.log("Available game types:\n");
    for (const t of types) console.log(`  ${t.id.padEnd(12)} ${t.description}`);
  });

program
  .command("schema")
  .description("Show schema for a game type")
  .requiredOption("-t, --type <type>", "Game type")
  .action((options) => {
    const gameType = registry.get(options.type);
    if (!gameType) {
      console.error(`Unknown game type: ${options.type}`);
      process.exit(1);
    }
    console.log(`Schema for ${gameType.name}:\n${JSON.stringify(gameType.tableSchemas, null, 2)}`);
  });

export { program };

if (import.meta.main) {
  program.parse();
}
