import { test, expect } from "@playwright/test";

test.describe("Auto Button Plugin", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/plugins/auto-button.html");
    await page.waitForSelector(".inkweave-story");
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
    await page.waitForSelector(".inkweave-story");

    const hasCompilationError = consoleMessages.some(
      (msg) =>
        msg.text.includes("Failed to initialize") ||
        msg.text.includes("Compilation failed"),
    );
    expect(hasCompilationError).toBe(false);
  });

  test("should automatically click auto buttons after specified delay", async ({ page }) => {
    const basicChoice = page.locator('.inkweave-choice:has-text("Basic Auto Sequence")');
    await basicChoice.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("The auto button test is complete.", { timeout: 1500 });

    const manualChoice = page.locator('.inkweave-choice:has-text("Manual Choice")');
    await expect(manualChoice).toBeVisible();
  });

  test("should handle multiple consecutive auto buttons with different delays", async ({ page }) => {
    const basicChoice = page.locator('.inkweave-choice:has-text("Basic Auto Sequence")');
    await basicChoice.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("This is the second auto click!", { timeout: 1000 });
  });

  test("should allow manual interaction after auto sequence completes", async ({ page }) => {
    const basicChoice = page.locator('.inkweave-choice:has-text("Basic Auto Sequence")');
    await basicChoice.click();

    await page.waitForSelector('.inkweave-choice:has-text("Manual Choice")', { timeout: 1500 });

    const manualChoice = page.locator('.inkweave-choice:has-text("Manual Choice")');
    await manualChoice.click();

    const finalContents = page.locator(".inkweave-contents");
    await expect(finalContents).toContainText("You manually clicked this choice.");
  });

  test("should allow skipping auto sequence with normal choice", async ({ page }) => {
    const skipChoice = page.locator('.inkweave-choice:has-text("Skip Auto with Normal Choice")');
    await skipChoice.click();

    const normalChoice = page.locator('.inkweave-choice:has-text("Normal Choice - Skip Auto")');
    await normalChoice.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("You successfully skipped the auto sequence!");
    await expect(contents).toContainText("Skipped: true");
  });

  test("should handle auto loop with counter incrementing correctly", async ({ page }) => {
    const loopChoice = page.locator('.inkweave-choice:has-text("Auto Loop with Counter")');
    await loopChoice.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Auto loop completed! Final counter: 3", { timeout: 2000 });
  });
});
