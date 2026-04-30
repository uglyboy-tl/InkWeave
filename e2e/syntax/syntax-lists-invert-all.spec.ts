import { expect, test } from "@playwright/test";

test.describe("ink syntax - list invert and all", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=syntax/lists-invert-all.ink");
    await page.waitForSelector("#inkweave-story");
  });

  test("LIST_INVERT inverts list values", async ({ page }) => {
    await page.getByText("Change guard").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Now on duty:");
  });

  test("LIST_INVERT shows opposite values", async ({ page }) => {
    await page.getByText("Change guard").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Carter");
    await expect(contents).toContainText("Braithwaite");
  });

  test("LIST_ALL returns all possible values", async ({ page }) => {
    await page.getByText("List all guards").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("All guards:");
  });

  test("LIST_ALL shows complete list", async ({ page }) => {
    await page.getByText("List all guards").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Smith");
    await expect(contents).toContainText("Jones");
    await expect(contents).toContainText("Carter");
    await expect(contents).toContainText("Braithwaite");
  });

  test("LIST_COUNT returns number of values", async ({ page }) => {
    await page.getByText("Check onDuty count").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Guards on duty: 2");
  });
});
