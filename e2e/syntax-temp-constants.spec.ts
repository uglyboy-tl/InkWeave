import { expect, test } from "@playwright/test";

test.describe("ink syntax - temp variables and constants", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/temp-constants.html");
  });

  test("constant can be used as variable value", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Detective: Poirot");
  });

  test("temporary variable is created and used", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Score: 10");
  });

  test("temporary variable can be modified", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Score with bonus: 15");
  });

  test("temp variable scope is limited to knot", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Score: 10");
    await expect(contents).not.toContainText("bonus");
  });
});