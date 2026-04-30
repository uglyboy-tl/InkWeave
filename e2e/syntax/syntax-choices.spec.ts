import { expect, test } from "@playwright/test";

test.describe("ink syntax - choices", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=syntax/choices.ink");
    await page.waitForSelector("#inkweave-story");
  });

  test("multiple choices render", async ({ page }) => {
    const choiceItems = page.locator(".inkweave-choice");
    await expect(choiceItems).toHaveCount(2);
  });

  test("choice text displays correctly", async ({ page }) => {
    const choiceItems = page.locator(".inkweave-choice");
    await expect(choiceItems.first()).toContainText("Choice A");
    await expect(choiceItems.nth(1)).toContainText("Choice B");
  });

  test("clicking choice shows result", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("You chose A.");
  });

  test("choice text is suppressed with brackets", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).not.toContainText("Choice A");
    await expect(contents).not.toContainText("Choice B");
  });
});
