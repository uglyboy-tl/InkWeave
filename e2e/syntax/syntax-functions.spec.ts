import { expect, test } from "@playwright/test";

test.describe("ink syntax - functions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=syntax/functions.ink");
    await page.waitForSelector("#inkweave-story");
  });

  test("function call displays result", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("5");
  });

  test("function with different parameters", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("10");
  });

  test("function result persists in output", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("5");
    await expect(contents).toContainText("10");
  });
});