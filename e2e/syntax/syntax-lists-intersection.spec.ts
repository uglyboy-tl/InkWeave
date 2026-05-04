import { expect, test } from "@playwright/test";
import { gotoFixture } from "../helpers";

test.describe("ink syntax - list intersection", () => {
  test.beforeEach(async ({ page }) => {
    await gotoFixture(page, "story=syntax/lists-intersection.ink");
    await page.waitForSelector("#inkweave-story");
  });

  test("list intersection operator works", async ({ page }) => {
    await page.getByText("Check overlap").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Common values:");
  });

  test("intersection returns common values", async ({ page }) => {
    await page.getByText("Check overlap").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("self_belief");
  });

  test("intersection can be used in condition", async ({ page }) => {
    await page.getByText("Check has any common").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Has at least one common value.");
  });
});
