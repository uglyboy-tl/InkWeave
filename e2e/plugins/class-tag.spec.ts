import { expect, test } from "@playwright/test";

test.describe("Class Tag Plugin", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=plugins/class-tag.ink&plugins=class-tag");
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

  test("should apply CSS class 'highlight' to content", async ({ page }) => {
    const highlightedContent = page.locator(".inkweave-contents .highlight");
    await expect(highlightedContent).toBeVisible();
    await expect(highlightedContent).toContainText(
      "Hello, this text should be highlighted!",
    );
  });

  test("should apply multiple CSS classes to content", async ({ page }) => {
    const multiClassContent = page.locator(".inkweave-contents .bold.italic");
    await expect(multiClassContent).toBeVisible();
    await expect(multiClassContent).toContainText(
      "This text should be bold and italic.",
    );
  });

  test("should apply CSS class 'center' to content", async ({ page }) => {
    const centeredContent = page.locator(".inkweave-contents .center");
    await expect(centeredContent).toBeVisible();
    await expect(centeredContent).toContainText("This text should be centered.");
  });

  test("should render content without classes normally", async ({ page }) => {
    const plainContent = page.locator(
      ".inkweave-contents .inkweave-content-line:not(.highlight):not(.bold):not(.italic):not(.center)",
    );
    await expect(plainContent).toBeVisible();
    await expect(plainContent).toContainText("Plain text without classes.");
  });

  test("should have correct number of content lines", async ({ page }) => {
    const contentLines = page.locator(".inkweave-content-line");
    await expect(contentLines).toHaveCount(4);
  });

  test("should apply correct styles from CSS", async ({ page }) => {
    const highlightedElement = page.locator(".inkweave-contents .highlight");
    await expect(highlightedElement).toHaveCSS("color", "rgb(255, 0, 0)");
    await expect(highlightedElement).toHaveCSS("font-weight", "700");
  });
});
