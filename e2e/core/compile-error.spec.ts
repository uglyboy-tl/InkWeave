import { expect, test } from "@playwright/test";

test.describe("compile error handling", () => {
  test("should show error in console and not render story container when story has syntax errors", async ({ page }) => {
    // Capture console messages and errors
    const consoleMessages: { type: string; text: string }[] = [];
    const pageErrors: string[] = [];

    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text()
      });
    });

    page.on('pageerror', err => {
      pageErrors.push(err.toString());
    });

    await page.goto("/e2e/fixtures/core/compile-error.html");

    // Wait a bit for potential errors to appear
    await page.waitForTimeout(1000);

    // Check that there is a compilation error message in console
    const hasCompilationError = consoleMessages.some(msg =>
      msg.text.includes('Failed to initialize') &&
      msg.text.includes('Compilation failed')
    );
    expect(hasCompilationError).toBe(true);

    // Story container should not be rendered
    const storyContainer = page.locator(".inkweave-story");
    await expect(storyContainer).not.toBeVisible();

  });
});