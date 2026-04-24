import { expect, test } from "@playwright/test";

test.describe("ink syntax - tunnels", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/syntax/tunnels.html");
  });

  test("tunnel divert executes sub-knot", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("You travel to the store.");
  });

  test("tunnel returns after ->->", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("You are back home now.");
  });

  test("tunnel flow completes in correct order", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("You are at home.");
    await expect(contents).toContainText("You travel to the store.");
    await expect(contents).toContainText("You buy some groceries.");
    await expect(contents).toContainText("You are back home now.");
  });
});