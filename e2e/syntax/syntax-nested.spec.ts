import { expect, test } from "@playwright/test";

test.describe("ink syntax - nested weave", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/syntax/nested-weave.html");
  });

  test("first level choices display", async ({ page }) => {
    const choiceItems = page.locator(".inkweave-choice");
    await expect(choiceItems).toHaveCount(2);
    await expect(choiceItems.first()).toContainText("Murder!");
    await expect(choiceItems.nth(1)).toContainText("Suicide!");
  });

  test("selecting first choice shows nested choices", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const nestedChoices = page.locator(".inkweave-choice");
    await expect(nestedChoices).toHaveCount(2);
    await expect(nestedChoices.first()).toContainText("The butler!");
    await expect(nestedChoices.nth(1)).toContainText("The gardener!");
  });

  test("nested choice leads to gather", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Mrs. Christie lowered her manuscript.");
  });

  test("second first-level choice also shows nested choices", async ({ page }) => {
    await page.locator(".inkweave-choice").nth(1).click();
    const nestedChoices = page.locator(".inkweave-choice");
    await expect(nestedChoices).toHaveCount(2);
  });
});