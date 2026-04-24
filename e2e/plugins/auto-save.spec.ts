import { test, expect } from "@playwright/test";

test.describe("Auto Save Plugin", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/plugins/auto-save.html");
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

  test("should show initial content", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Start of the story.");
  });

  test("should increment counter on click", async ({ page }) => {
    const clickChoice = page.locator('.inkweave-choice:has-text("Click me")');
    await clickChoice.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Total: 1");
  });

  test("should auto-save to slot 1 after clicking", async ({ page }) => {
    const clickChoice = page.locator('.inkweave-choice:has-text("Click me")');
    await clickChoice.click();

    await page.getByRole("button", { name: "Restore saved game" }).click();
    const modal = page.locator("dialog");
    await expect(modal).toBeVisible();

    const slot1Button = modal.getByRole("button", { name: /Slot 1/i });
    await expect(slot1Button).not.toBeDisabled();
  });

  test("should update auto-save with each click", async ({ page }) => {
    const clickChoice = page.locator('.inkweave-choice:has-text("Click me")');
    await clickChoice.click();

    await page.getByRole("button", { name: "Restore saved game" }).click();
    const modal = page.locator("dialog");
    await expect(modal).toBeVisible();
    const slot1Button = modal.getByRole("button", { name: /Slot 1/i });
    const firstText = await slot1Button.textContent();
    expect(firstText).not.toContain("Empty");
    await modal.getByRole("button", { name: /close|×|Close/i }).first().click();
    await expect(modal).not.toBeVisible();

    await clickChoice.click();

    await page.getByRole("button", { name: "Restore saved game" }).click();
    await expect(modal).toBeVisible();
    const updatedText = await slot1Button.textContent();
    expect(updatedText).not.toContain("Empty");
  });

  test("should restore auto-saved state correctly", async ({ page }) => {
    const clickChoice = page.locator('.inkweave-choice:has-text("Click me")');
    await clickChoice.click();
    await clickChoice.click();
    await clickChoice.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Total: 3");

    await page.reload();
    await page.waitForSelector(".inkweave-story");

    await page.getByRole("button", { name: "Restore saved game" }).click();
    const modal = page.locator("dialog");
    await expect(modal).toBeVisible();

    const slot1Button = modal.getByRole("button", { name: /Slot 1/i });
    await expect(slot1Button).not.toBeDisabled();
    await slot1Button.click();

    await expect(contents).toContainText("You have clicked 3 times.");
  });
});
