import { expect, test } from "@playwright/test";

test.describe("ink syntax - glue", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/syntax/glue.html");
  });

  test("glue joins text on same line", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("We hurried home to Savile Row as fast as we could.");
  });

  test("glue removes line breaks", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    const text = await contents.textContent();
    expect(text).not.toContain("home\nto");
  });

  test("complete sentence displays", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("We hurried home");
    await expect(contents).toContainText("to Savile Row");
    await expect(contents).toContainText("as fast as we could.");
  });
});