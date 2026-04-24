import { expect, test } from "@playwright/test";

test.describe("ink syntax - variables", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/syntax/variables.html");
  });

  test("initial variable value displays", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("You have 0 gold coins.");
  });

  test("variable updates after choice", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("You have 10 gold coins.");
  });

  test("variable persists across multiple choices", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("You have 10 gold coins.");
    await expect(contents).toContainText("You earned 10 gold!");
  });

  test("choice outcome displays", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("You earned 10 gold!");
  });
});