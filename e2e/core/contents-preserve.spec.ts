import { expect, test } from "@playwright/test";
import { gotoFixture } from "../helpers";

test.describe("Content Preservation", () => {
  test.beforeEach(async ({ page }) => {
    await gotoFixture(page, "story=core/contents-preserve.ink&plugins=fade-effect");
    await page.waitForSelector("#inkweave-story");
  });

  test("should preserve existing content opacity after making a choice", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("This is the first line.");
    await expect(contents).toContainText("This is the second line.");

    const contentLines = page.locator(".inkweave-content-line");
    expect(await contentLines.count()).toBe(2);

    // Wait for initial fade-in animation to complete
    await expect(async () => {
      const opacity = await contentLines
        .nth(0)
        .evaluate((el) => window.getComputedStyle(el).opacity);
      expect(parseFloat(opacity)).toBeCloseTo(1, 0.1);
    }).toPass({ timeout: 3000 });

    // Confirm second line is also fully visible
    const firstOpacityBefore = await contentLines
      .nth(0)
      .evaluate((el) => window.getComputedStyle(el).opacity);
    expect(parseFloat(firstOpacityBefore)).toBeCloseTo(1, 0.1);

    // Click choice to trigger new content
    await page.locator(".inkweave-choice", { hasText: "Continue" }).click();
    await expect(contents).toContainText("This appears after clicking.");

    // Old content must NOT re-animate: first line opacity should still be 1.
    // In React/Svelte: DOM is preserved, animation doesn't restart → opacity stays 1.
    // In SolidJS (bug): DOM is recreated, animation restarts → opacity resets to ~0.
    const newLines = page.locator(".inkweave-content-line");
    expect(await newLines.count()).toBe(3);

    const firstLineOpacity = await newLines
      .nth(0)
      .evaluate((el) => window.getComputedStyle(el).opacity);
    expect(parseFloat(firstLineOpacity)).toBeCloseTo(1, 0.1);
  });
});
