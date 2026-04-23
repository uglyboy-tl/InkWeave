import { expect, test } from "@playwright/test";

test.describe("ink syntax - stitches", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/stitches.html");
  });

  test("knot with stitches displays header content", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("We boarded the train, but where?");
  });

  test("stitch choices are displayed", async ({ page }) => {
    const choiceItems = page.locator(".inkweave-choice");
    await expect(choiceItems).toHaveCount(2);
    await expect(choiceItems.first()).toContainText("First class");
    await expect(choiceItems.nth(1)).toContainText("Third class");
  });

  test("divert to first stitch works", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("You settle into the plush first class seat.");
  });

  test("divert to second stitch works", async ({ page }) => {
    await page.locator(".inkweave-choice").nth(1).click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("You find a seat in third class.");
  });

  test("local divert within knot works", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("We boarded the train");
    await expect(contents).toContainText("You settle into the plush first class seat.");
  });
});