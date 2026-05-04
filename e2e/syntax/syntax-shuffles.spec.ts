import { expect, test } from "@playwright/test";
import { gotoFixture } from "../helpers";

test.describe("ink syntax - shuffles", () => {
  test.beforeEach(async ({ page }) => {
    await gotoFixture(page, "story=syntax/shuffles.ink");
    await page.waitForSelector("#inkweave-story");
  });

  test("shuffle displays random element", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText(/Heads|Tails/);
  });

  test("shuffle produces output on repeat", async ({ page }) => {
    await page.getByText("Toss again").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText(/Heads|Tails/);
  });
});
