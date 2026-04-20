import { CHOICE_SEPARATOR, type ContentItem, Events, type InkStory } from "@inkweave/core";
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

/**
 * 获取自上次分隔符后的新内容
 * @param contents 完整的内容数组
 * @returns 从最后出现的分隔符之后的内容，如果没有分隔符则返回全部内容
 */
function getNewContents(contents: ContentItem[]): ContentItem[] {
  const separatorIndex = contents.findIndex((item) => item.text === CHOICE_SEPARATOR);
  if (separatorIndex === -1) {
    return contents; // 没有分隔符，返回全部内容
  }
  return contents.slice(separatorIndex + 1); // 从分隔符之后的部分开始返回
}

export async function runStory(story: InkStory): Promise<void> {
  const lineDelay = story.options.linedelay;
  const lineDelayMs = typeof lineDelay === "number" && lineDelay > 0 ? lineDelay * 1000 : 0;
  const charDelayMs = 30;

  let shouldClearScreen = false;
  story.eventEmitter.on(Events.STORY_CLEARED, () => {
    shouldClearScreen = true;
  });

  const displayNewContent = async () => {
    if (shouldClearScreen) {
      shouldClearScreen = false;
      console.clear();
    }

    for (const contentItem of getNewContents(story.contents)) {
      const content = contentItem.text;
      if (content?.trim()) {
        await typewriter(content, charDelayMs);
        if (lineDelayMs > 0) await sleep(lineDelayMs);
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

    process.stdout.write("\x1B[1A\x1B[2K"); // 清除上一行输出（隐藏选择提示）
    story.choose(choice);
    return true;
  };

  story.clear();
  story.continue();
  await displayNewContent();

  while (await promptChoice()) {
    await displayNewContent();
  }
}
