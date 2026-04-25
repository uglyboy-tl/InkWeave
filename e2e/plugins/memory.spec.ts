import { test, expect } from "@playwright/test";

test.describe("Memory Plugin", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=plugins/memory.ink&plugins=memory");
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

  test("should open save modal", async ({ page }) => {
    await page.getByRole("button", { name: "Save game" }).click();
    const modal = page.locator("dialog");
    await expect(modal).toBeVisible();
    await expect(modal).toContainText("Save Game");
  });

  test("should save and load game state", async ({ page }) => {
    const clickChoice = page.locator('.inkweave-choice:has-text("Click me")');
    await clickChoice.click();
    await clickChoice.click();
    await clickChoice.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Total: 3");

    await page.getByRole("button", { name: "Save game" }).click();
    const modal = page.locator("dialog");
    await expect(modal).toBeVisible();

    const slot1 = modal.getByRole("button", { name: /Slot 1/i });
    await slot1.click();

    await page.getByRole("button", { name: "Restart game" }).click();
    await expect(contents).toContainText("Start of the story.");
    await expect(contents).toContainText("You have clicked 0 times.");

    await page.getByRole("button", { name: "Restore saved game" }).click();
    const loadModal = page.locator("dialog");
    await expect(loadModal).toBeVisible();

    const loadSlot1 = loadModal.getByRole("button", { name: /Slot 1/i });
    await loadSlot1.click();

    await expect(contents).toContainText("Total: 3");
  });

  test("should show slot info correctly in save modal", async ({ page }) => {
    await page.getByRole("button", { name: "Save game" }).click();
    const modal = page.locator("dialog");
    await expect(modal).toBeVisible();

    await expect(modal.getByText("Empty")).toHaveCount(5);

    for (let i = 1; i <= 5; i++) {
      await expect(modal.getByRole("button", { name: `Slot ${i}` })).toBeVisible();
    }
  });

  test("should disable empty slots in load modal", async ({ page }) => {
    await page.getByRole("button", { name: "Restore saved game" }).click();
    const modal = page.locator("dialog");
    await expect(modal).toBeVisible();

    const slotButtons = modal.getByRole("button").and(modal.locator('[disabled]'));
    await expect(slotButtons).toHaveCount(5);
  });

  test("should save to different slots independently", async ({ page }) => {
    const clickChoice = page.locator('.inkweave-choice:has-text("Click me")');
    const contents = page.locator(".inkweave-contents");

    await clickChoice.click();
    await expect(contents).toContainText("Total: 1");

    await page.getByRole("button", { name: "Save game" }).click();
    const modal = page.locator("dialog");
    await expect(modal).toBeVisible();
    await modal.getByRole("button", { name: /Slot 1/i }).click();

    await clickChoice.click();
    await clickChoice.click();
    await expect(contents).toContainText("Total: 3");

    await page.getByRole("button", { name: "Save game" }).click();
    await expect(modal).toBeVisible();
    await modal.getByRole("button", { name: /Slot 2/i }).click();

    await page.getByRole("button", { name: "Restart game" }).click();
    await page.getByRole("button", { name: "Restore saved game" }).click();
    const loadModal = page.locator("dialog");
    await expect(loadModal).toBeVisible();
    await loadModal.getByRole("button", { name: /Slot 1/i }).click();

    await expect(contents).toContainText("Total: 1");

    await page.getByRole("button", { name: "Restart game" }).click();
    await page.getByRole("button", { name: "Restore saved game" }).click();
    await expect(loadModal).toBeVisible();
    await loadModal.getByRole("button", { name: /Slot 2/i }).click();

    await expect(contents).toContainText("Total: 3");
  });
});
