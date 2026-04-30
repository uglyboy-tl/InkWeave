import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CHOICE_SEPARATOR, contentsStore, type createInkStory } from "@inkweave/core";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const WORKSPACE_ROOT = resolve(__dirname, "../../../../..");
const FIXTURES_DIR = resolve(WORKSPACE_ROOT, "e2e/fixtures/syntax");

export function loadFixture(name: string): string {
  return readFileSync(resolve(FIXTURES_DIR, name), "utf-8");
}

export function clearContentsStore(): void {
  contentsStore.getState().clear();
}

export function getText(story: ReturnType<typeof createInkStory>): string {
  return story.contents
    .filter((c) => c.text !== CHOICE_SEPARATOR)
    .map((c) => c.text)
    .join("\n");
}
