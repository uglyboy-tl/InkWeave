import { expect, test } from "@playwright/test";

test.describe("ink syntax - advanced list operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/lists-advanced.html");
  });

  test("list value can be displayed", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Skills: strong");
  });

  test("list value can be reassigned", async ({ page }) => {
    await page.getByText("Add another skill").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Skills now:");
  });

  test("list value displays after reassignment", async ({ page }) => {
    await page.getByText("Add another skill").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("fast");
  });
});