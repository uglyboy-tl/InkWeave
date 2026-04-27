import { expect, test } from "@playwright/test";

test.describe("ink syntax - list values", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=syntax/lists-values.ink");
    await page.waitForSelector("#inkweave-story");
  });

  test("list values with same name can be distinguished", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Colour: blue");
    await expect(contents).toContainText("Mood: blue");
  });

  test("list value can be changed using qualified name", async ({ page }) => {
    await page.getByText("Set colour to red").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Colour is now red.");
  });

  test("different list values display correctly after change", async ({ page }) => {
    await page.getByText("Set colour to red").click();
    await page.getByText("Set mood to happy").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Colour: red");
    await expect(contents).toContainText("Mood: happy");
  });

  test("list comparison works with qualified names", async ({ page }) => {
    await page.getByText("Check colour is blue").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Colour is blue.");
  });
});