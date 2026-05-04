import { expect, test } from "@playwright/test";
import { gotoFixture } from "../helpers";

test.describe("ink syntax - conditional choices", () => {
  test.beforeEach(async ({ page }) => {
    await gotoFixture(page, "story=syntax/conditional-choices.ink");
    await page.waitForSelector("#inkweave-story");
  });

  test("initial choice displays when condition is true", async ({ page }) => {
    const choiceItems = page.locator(".inkweave-choice");
    await expect(choiceItems.first()).toContainText("Open the chest");
  });

  test("conditional choice hidden when condition not met", async ({ page }) => {
    const choiceItems = page.locator(".inkweave-choice");
    await expect(choiceItems.nth(1)).toContainText("Leave");
  });

  test("new choice appears after condition is met", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const choiceItems = page.locator(".inkweave-choice");
    await expect(choiceItems.first()).toContainText("Take gold");
  });

  test("original choice hidden after visiting knot", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const choiceItems = page.locator(".inkweave-choice");
    await expect(choiceItems.first()).not.toContainText("Open the chest");
  });
});
