import { expect, test } from "@playwright/test";

test.describe("ink syntax - fallback choices", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=syntax/fallback.ink");
    await page.waitForSelector("#inkweave-story");
  });

  test("fallback choice is not displayed", async ({ page }) => {
    const choiceItems = page.locator(".inkweave-choice");
    await expect(choiceItems).toHaveCount(2);
  });

  test("visible choices display correctly", async ({ page }) => {
    const choiceItems = page.locator(".inkweave-choice");
    await expect(choiceItems.first()).toContainText("helps you");
    await expect(choiceItems.nth(1)).toContainText("ignores you");
  });

  test("choices loop until fallback triggers", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("You collapse");
  });
});