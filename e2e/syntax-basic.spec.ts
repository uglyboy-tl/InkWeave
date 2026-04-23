import { expect, test } from "@playwright/test";

test.describe("ink syntax - basic content", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/basic-content.html");
  });

  test("text content displays", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Hello, World!");
    await expect(contents).toContainText("Second line.");
  });

  test("comments are not displayed", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).not.toContainText("This is a comment");
    await expect(contents).not.toContainText("block comment");
  });

  test("tags are present", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("This line has a tag.");
  });
});