import { CHOICE_SEPARATOR, type ContentItem, Events, type InkStory } from "@inkweave/core";
import prompts from "prompts";

async function typewriter(text: string, delayMs: number): Promise<void> {
  for (const char of text) {
    process.stdout.write(char);
    if (char !== "\n" && char !== " ") await Bun.sleep(delayMs);
  }
}

function resolveDelay(value: unknown, defaultMs: number): number {
  return typeof value === "number" && value > 0 ? value * 1000 : defaultMs;
}

function getNewContents(contents: ContentItem[]): ContentItem[] {
  for (let i = contents.length - 1; i >= 0; i--) {
    if (contents[i]?.text === CHOICE_SEPARATOR) return contents.slice(i + 1);
  }
  return contents;
}

export async function runStory(story: InkStory): Promise<void> {
  const lineDelayMs = resolveDelay(story.options.linedelay, 0);
  const charDelayMs = resolveDelay(story.options.chardelay, 30);

  let shouldClearScreen = false;
  const unsubClear = story.eventEmitter.on(Events.STORY_CLEARED, () => {
    shouldClearScreen = true;
  });
  try {
    const displayNewContent = async () => {
      if (shouldClearScreen) {
        shouldClearScreen = false;
        console.clear();
      }
      for (const { text } of getNewContents(story.contents)) {
        if (text.trim()) {
          await typewriter(text, charDelayMs);
          if (lineDelayMs > 0) await Bun.sleep(lineDelayMs);
        }
      }
    };

    const promptChoice = async (): Promise<boolean> => {
      const choices = story.choices;
      if (choices.length === 0) {
        console.log("\n=== Story End ===");
        return false;
      }
      const { choice } = await prompts({
        type: "select",
        name: "choice",
        message: "Choose",
        choices: choices.map((c) => ({
          title: c.text,
          value: c.index,
          disabled: c.type === "unclickable",
        })),
      });
      if (choice === undefined) return false;
      // ANSI: 光标上移 1 行 (1A) + 清除整行 (2K)，隐藏选择提示
      process.stdout.write("\x1B[1A\x1B[2K");
      story.choose(choice);
      return true;
    };

    story.clear();
    story.continue();
    await displayNewContent();
    while (await promptChoice()) {
      await displayNewContent();
    }
  } finally {
    unsubClear();
  }
}
