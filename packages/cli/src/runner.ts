import { CHOICE_SEPARATOR, type InkStory } from "@inkweave/core";
import prompts from "prompts";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function typewriter(text: string, delayMs: number): Promise<void> {
  for (const char of text) {
    process.stdout.write(char);
    if (char !== "\n" && char !== " ") {
      await sleep(delayMs);
    }
  }
}

export async function runStory(story: InkStory): Promise<void> {
  const getLineDelay = (): number => {
    const lineDelay = story.options.linedelay;
    if (typeof lineDelay === "number" && lineDelay > 0) {
      return lineDelay * 1000;
    }
    return 0;
  };

  let shouldClearScreen = false;
  let lastDisplayedIndex = -1;

  story.clears.push(() => {
    shouldClearScreen = true;
    lastDisplayedIndex = -1;
  });

  const displayContent = async () => {
    if (shouldClearScreen) {
      shouldClearScreen = false;
      console.clear();
    }

    const contents = story.contents;
    if (contents.length === 0) {
      return;
    }

    const startIndex = lastDisplayedIndex + 1;
    if (startIndex >= contents.length) {
      return;
    }

    const lineDelayMs = getLineDelay();
    const charDelayMs = 30;

    for (let i = startIndex; i < contents.length; i++) {
      const content = contents[i];
      lastDisplayedIndex = i;

      if (!content) {
        continue;
      }
      if (content.includes(CHOICE_SEPARATOR)) {
        continue;
      }
      if (content.trim()) {
        await typewriter(content, charDelayMs);
        if (lineDelayMs > 0) {
          await sleep(lineDelayMs);
        }
      }
    }
  };

  const handleChoice = async () => {
    const choices = story.choices;
    if (choices.length === 0) {
      console.log("\n=== Story End ===");
      return false;
    }

    const choiceItems = choices.map((choice) => ({
      title: choice.text,
      value: choice.index,
      disabled: choice.type === "unclickable",
    }));

    const response = await prompts({
      type: "select",
      name: "choice",
      message: "Choose",
      choices: choiceItems,
    });

    if (response.choice === undefined) {
      return false;
    }

    process.stdout.write("\x1B[1A\x1B[2K");
    story.choose(response.choice);
    return true;
  };

  story.clear();
  story.continue();
  await displayContent();

  while (await handleChoice()) {
    await displayContent();
  }
}
