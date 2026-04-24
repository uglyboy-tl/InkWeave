import { expect, test } from "@playwright/test";

test.describe("ink syntax - sequences", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/syntax/sequences.html");
  });

  test("first sequence element displays", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Three!");
  });

  test("sequence advances on revisit", async ({ page }) => {
    await page.getByText("Continue").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Two!");
  });
});