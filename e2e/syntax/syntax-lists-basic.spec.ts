import { expect, test } from "@playwright/test";

test.describe("ink syntax - basic lists", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=syntax/lists-basic.ink");
    await page.waitForSelector("#inkweave-story");
  });

  test("list value can be assigned", async ({ page }) => {
    await page.getByText("Set kettle to cold").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Kettle is now:");
  });

  test("list value changes correctly", async ({ page }) => {
    await page.getByText("Set kettle to boiling").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Kettle is now: boiling");
  });

  test("list value comparison works", async ({ page }) => {
    await page.getByText("Set kettle to cold").click();
    await page.getByText("Check if cold").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Kettle is cold.");
  });

  test("list value comparison works for not equal", async ({ page }) => {
    await page.getByText("Set kettle to boiling").click();
    await page.getByText("Check if cold").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Kettle is not cold.");
  });
});