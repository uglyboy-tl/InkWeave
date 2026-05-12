import { expect, test } from "@playwright/test";
import { gotoFixture } from "../helpers";

test.describe("CD Button Plugin", () => {
  test.beforeEach(async ({ page }) => {
    await gotoFixture(page, "story=plugins/cd-button.ink&plugins=cd-button");
    await page.waitForSelector("#inkweave-story");
  });

  test("should compile without errors", async ({ page }) => {
    const consoleMessages: { type: string; text: string }[] = [];

    page.on("console", (msg) => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
      });
    });

    await page.reload();
    await page.waitForSelector("#inkweave-story");

    const hasCompilationError = consoleMessages.some(
      (msg) => msg.text.includes("Failed to initialize") || msg.text.includes("Compilation failed"),
    );
    expect(hasCompilationError).toBe(false);
  });

  test("should allow normal choice to work immediately", async ({ page }) => {
    const normalChoice = page.locator('.inkweave-choice:has-text("Normal Choice")');
    await normalChoice.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("This is a normal choice that works immediately.");
  });

  test("should execute cd button and loop back", async ({ page }) => {
    const cdButton = page.locator('.inkweave-choice:has-text("CD Button")').first();
    await cdButton.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("You clicked the cooldown button!");
    await expect(contents).toContainText("Counter is now 1");
  });

  test("should prevent cd button clicks during cooldown", async ({ page }) => {
    const cdButton = page.locator('.inkweave-choice:has-text("CD Button")').first();
    await cdButton.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Counter is now 1");

    await expect(cdButton).not.toContainText("(", { timeout: 1000 });
    await cdButton.click();

    const finalContents = page.locator(".inkweave-contents");
    await expect(finalContents).toContainText("Counter is now 2");
  });

  test("should allow cd button click after cooldown expires", async ({ page }) => {
    const cdButton = page.locator('.inkweave-choice:has-text("CD Button")').first();
    await cdButton.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Counter is now 1");

    await expect(cdButton).not.toContainText("(", { timeout: 1000 });
    await cdButton.click();

    await expect(contents).toContainText("Counter is now 2");
  });

  test("should increment counter correctly across multiple loops", async ({ page }) => {
    const cdButton = page.locator('.inkweave-choice:has-text("CD Button")').first();
    const contents = page.locator(".inkweave-contents");

    const texts = ["Counter is now 1", "Counter is now 2", "Counter is now 3"];
    for (const text of texts) {
      await cdButton.click();
      await expect(contents).toContainText(text);
      await expect(cdButton).not.toContainText("(", { timeout: 1000 });
    }
  });

  test("should show countdown and recover for cd:3", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    const slowButton = page.locator('.inkweave-choice:has-text("Slow CD Button")');

    // 点击 cd:3 按钮，此时还没有 countdown 文本（首次挂载）
    await slowButton.click();
    await expect(contents).toContainText("Counter is now 1");

    // 循环回来后按钮显示倒计时文本（如 "(3)"）
    const countdownLocator = page.locator('.inkweave-choice:has-text("Slow CD Button (")');
    await expect(countdownLocator).toBeAttached({ timeout: 1000 });

    // cooldown 期满后按钮文本应恢复（不含括号）
    await expect(async () => {
      const text = await slowButton.textContent();
      expect(text).not.toContain("(");
    }).toPass({ timeout: 4000 });

    // 恢复后可再次点击
    await slowButton.click();
    await expect(contents).toContainText("Counter is now 2");
  });
});
