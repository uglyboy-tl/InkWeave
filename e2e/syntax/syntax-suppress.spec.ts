import { expect, test } from "@playwright/test";
import { gotoFixture } from "../helpers";

test.describe("ink syntax - suppress choice text", () => {
  test.beforeEach(async ({ page }) => {
    await gotoFixture(page, "story=syntax/suppress-choice.ink");
    await page.waitForSelector("#inkweave-story");
  });

  test("suppressed choice text not in output", async ({ page }) => {
    await page.locator(".inkweave-choice").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Nice to hear from you!");
    await expect(contents).not.toContainText("Hello back");
  });

  test("choice text shows in button", async ({ page }) => {
    const choice = page.locator(".inkweave-choice");
    await expect(choice).toContainText("Hello back!");
  });
});
