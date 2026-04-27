import { expect, test } from "@playwright/test";

test.describe("ink syntax - cycles", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=syntax/cycles.ink");
    await page.waitForSelector("#inkweave-story");
  });

  test("cycle displays first element", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Monday");
  });

  test("cycle advances to next element", async ({ page }) => {
    await page.getByText("Next day").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Tuesday");
  });
});