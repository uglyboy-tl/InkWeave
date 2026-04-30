import { expect, test } from "@playwright/test";

test.describe("ink syntax - game queries", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=syntax/game-queries.ink");
    await page.waitForSelector("#inkweave-story");
  });

  test("CHOICE_COUNT can be assigned to temp variable", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Choice count:");
  });

  test("CHOICE_COUNT returns a value", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    const text = await contents.textContent();
    expect(text).toMatch(/Choice count: \d+/);
  });
});
