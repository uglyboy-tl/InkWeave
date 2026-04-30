import { expect, test } from "@playwright/test";

test.describe("Auto Restore Plugin", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "/e2e/fixtures/index.html?story=plugins/auto-restore.ink&plugins=auto-restore,memory",
    );
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

  test("should increment counter on click", async ({ page }) => {
    const clickChoice = page.locator('.inkweave-choice:has-text("Click me")');
    await clickChoice.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Total: 1");
  });

  test("should auto-restore to last choice state after page reload", async ({ page }) => {
    const clickChoice = page.locator('.inkweave-choice:has-text("Click me")');
    await clickChoice.click();
    await clickChoice.click();
    await clickChoice.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Total: 3");

    // Reload page - should auto-restore to last choice state
    await page.reload();
    await page.waitForSelector("#inkweave-story");

    // Should restore to Total: 3 (last choice state), not initial state
    await expect(contents).toContainText("Total: 3");
  });

  test("should restore last choice state, not loaded save state", async ({ page }) => {
    const clickChoice = page.locator('.inkweave-choice:has-text("Click me")');
    await clickChoice.click();
    await clickChoice.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Total: 2");

    // Save to slot 1
    await page.getByRole("button", { name: "Save game" }).click();
    const modal = page.locator("dialog");
    await expect(modal).toBeVisible();
    await modal.getByRole("button", { name: /Slot 1/i }).click();

    // Click once more to update last choice state
    await clickChoice.click();
    await expect(contents).toContainText("Total: 3");

    // Load from slot 1
    await page.getByRole("button", { name: "Restore saved game" }).click();
    const loadModal = page.locator("dialog");
    await expect(loadModal).toBeVisible();
    await loadModal.getByRole("button", { name: /Slot 1/i }).click();
    await expect(contents).toContainText("Total: 2");

    // Reload page - should auto-restore to last choice state (Total: 3)
    await page.reload();
    await page.waitForSelector("#inkweave-story");

    // Should restore to Total: 3 (last choice state), not Total: 2 (slot 1 save)
    await expect(contents).toContainText("Total: 3");
  });

  test("should not restore if no previous choice state", async ({ page }) => {
    // Clear localStorage to ensure no previous state
    await page.evaluate(() => localStorage.clear());

    await page.reload();
    await page.waitForSelector("#inkweave-story");

    const contents = page.locator(".inkweave-contents");
    // Should show initial state
    await expect(contents).toContainText("Start of the story.");
    await expect(contents).toContainText("You have clicked 0 times.");
  });
});
