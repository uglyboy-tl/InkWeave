import { expect, test } from "@playwright/test";

test.describe("ink syntax - conditional blocks", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=syntax/conditional-blocks.ink");
    await page.waitForSelector(".inkweave-story");
  });

  test("conditional text shows false branch", async ({ page }) => {
    await page.locator(".inkweave-choice").nth(1).click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("You haven't met Blofeld yet.");
  });

  test("conditional text shows true branch after variable change", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("You have met Blofeld.");
  });

  test("conditional block displays correct content", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("You meet Blofeld.");
    await expect(contents).toContainText("You have met Blofeld.");
  });
});