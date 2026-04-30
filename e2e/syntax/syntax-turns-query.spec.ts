import { expect, test } from "@playwright/test";

test.describe("ink syntax - TURNS query", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=syntax/turns-query.ink");
    await page.waitForSelector("#inkweave-story");
  });

  test("TURNS returns current turn count", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Current turn:");
  });

  test("TURNS value increments across turns", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Turn:");
  });

  test("TURNS_SINCE returns 1 after leaving knot", async ({ page }) => {
    await page.locator(".inkweave-choice").nth(1).click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Turns since start: 1");
  });

  test("TURNS_SINCE increases after leaving knot", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    await page.locator(".inkweave-choice").nth(1).click();
    const contents = page.locator(".inkweave-contents");
    const text = await contents.textContent();
    const match = text?.match(/Turns since game_start: (\d+)/);
    expect(match).toBeTruthy();
    if (match?.[1]) {
      expect(parseInt(match[1], 10)).toBeGreaterThan(0);
    }
  });

  test("TURNS and TURNS_SINCE work together", async ({ page }) => {
    await page.locator(".inkweave-choice").first().click();
    await page.locator(".inkweave-choice").nth(1).click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Turn:");
    await expect(contents).toContainText("Turns since game_start:");
  });
});
