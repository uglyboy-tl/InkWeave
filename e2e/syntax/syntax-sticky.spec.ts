import { expect, test } from "@playwright/test";

test.describe("ink syntax - once-only choices", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=syntax/sticky-choices.ink");
    await page.waitForSelector("#inkweave-story");
  });

  test("choice disappears after selection", async ({ page }) => {
    const choices = page.locator(".inkweave-choice");
    await expect(choices).toHaveCount(2);

    await choices.first().click();

    const choicesAfter = page.locator(".inkweave-choice");
    await expect(choicesAfter).toHaveCount(0);
  });

  test("choice content displays after selection", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("The left path leads to a forest.");
  });

  test("both choices are clickable", async ({ page }) => {
    const choiceItems = page.locator(".inkweave-choice");
    await expect(choiceItems.first()).toContainText("Take the left path");
    await expect(choiceItems.nth(1)).toContainText("Take the right path");
  });
});
