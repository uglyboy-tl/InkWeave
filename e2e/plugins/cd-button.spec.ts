import { test, expect } from "@playwright/test";

test.describe("CD Button Plugin", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=plugins/cd-button.ink&plugins=cd-button");
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
      (msg) =>
        msg.text.includes("Failed to initialize") ||
        msg.text.includes("Compilation failed"),
    );
    expect(hasCompilationError).toBe(false);
  });

  test("should allow normal choice to work immediately", async ({ page }) => {
    const normalChoice = page.locator(
      '.inkweave-choice:has-text("Normal Choice")',
    );
    await normalChoice.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText(
      "This is a normal choice that works immediately.",
    );
  });

  test("should execute cd button and loop back", async ({ page }) => {
    const cdButton = page.locator('.inkweave-choice:has-text("CD Button")');
    await cdButton.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("You clicked the cooldown button!");
    await expect(contents).toContainText("Counter is now 1");
  });

  test("should prevent cd button clicks during cooldown", async ({ page }) => {
    const cdButton = page.locator('.inkweave-choice:has-text("CD Button")');
    await cdButton.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Counter is now 1");

    await cdButton.click();

    const finalContents = page.locator(".inkweave-contents");
    await expect(finalContents).toContainText("Counter is now 1");
  });

  test("should allow cd button click after cooldown expires", async ({ page }) => {
    const cdButton = page.locator('.inkweave-choice:has-text("CD Button")');
    await cdButton.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Counter is now 1");

    await expect(cdButton).toBeEnabled({ timeout: 1000 });
    await cdButton.click();

    await expect(contents).toContainText("Counter is now 2");
  });

  test("should increment counter correctly across multiple loops", async ({
    page,
  }) => {
    const cdButton = page.locator('.inkweave-choice:has-text("CD Button")');
    const contents = page.locator(".inkweave-contents");

    await cdButton.click();
    await expect(contents).toContainText("Counter is now 1");

    await expect(cdButton).toBeEnabled({ timeout: 1000 });
    await cdButton.click();
    await expect(contents).toContainText("Counter is now 2");

    await expect(cdButton).toBeEnabled({ timeout: 1000 });
    await cdButton.click();
    await expect(contents).toContainText("Counter is now 3");
  });
});
