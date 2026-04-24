import { expect, test } from "@playwright/test";

test.describe("classTag feature", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/plugins/classTag.html");
  });

  test("should apply CSS class 'highlight' to content", async ({ page }) => {
    const highlightedContent = page.locator(".inkweave-contents .highlight");
    await expect(highlightedContent).toBeVisible();
    await expect(highlightedContent).toContainText("Hello, this text should be highlighted!");
  });

  test("should apply multiple CSS classes to content", async ({ page }) => {
    const multiClassContent = page.locator(".inkweave-contents .bold.italic");
    await expect(multiClassContent).toBeVisible();
    await expect(multiClassContent).toContainText("This text should be bold and italic.");
  });

  test("should apply CSS class 'center' to content", async ({ page }) => {
    const centeredContent = page.locator(".inkweave-contents .center");
    await expect(centeredContent).toBeVisible();
    await expect(centeredContent).toContainText("This text should be centered.");
  });

  test("should render content without classes normally", async ({ page }) => {
    const plainContent = page.locator(".inkweave-contents .inkweave-content-line:not(.highlight):not(.bold):not(.italic):not(.center)");
    await expect(plainContent).toBeVisible();
    await expect(plainContent).toContainText("Plain text without classes.");
  });

  test("should have correct number of content lines", async ({ page }) => {
    const contentLines = page.locator(".inkweave-content-line");
    await expect(contentLines).toHaveCount(4); // 4 lines of content
  });

  test("should apply correct styles from CSS", async ({ page }) => {
    const highlightedElement = page.locator(".inkweave-contents .highlight");
    await expect(highlightedElement).toHaveCSS('color', 'rgb(255, 0, 0)'); // red
    await expect(highlightedElement).toHaveCSS('font-weight', '700'); // bold
  });
});