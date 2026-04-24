import { expect, test } from "@playwright/test";

test.describe("ink syntax - weave gathers", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/syntax/weave-gather.html");
  });

  test("multiple choices display", async ({ page }) => {
    const choiceItems = page.locator(".inkweave-choice");
    await expect(choiceItems).toHaveCount(3);
  });

  test("gather point content appears after choice", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("With that Monsieur Fogg left the room.");
  });

  test("all choices lead to same gather", async ({ page }) => {
    await page.locator(".inkweave-choice").nth(1).click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("With that Monsieur Fogg left the room.");
  });

  test("choice outcome displays correctly", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("\"Really,\" he responded.");
  });
});