import { expect, test } from "@playwright/test";
import { gotoFixture } from "../helpers";

test.describe("ink syntax - sequences", () => {
  test.beforeEach(async ({ page }) => {
    await gotoFixture(page, "story=syntax/sequences.ink");
    await page.waitForSelector("#inkweave-story");
  });

  test("first sequence element displays", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Three!");
  });

  test("sequence advances on revisit", async ({ page }) => {
    await page.getByText("Continue").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Two!");
  });
});
