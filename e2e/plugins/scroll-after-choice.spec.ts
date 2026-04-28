import { test, expect } from "@playwright/test";

test.describe("Scroll After Choice Plugin", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=plugins/scroll-after-choice.ink&plugins=scroll-after-choice");
    await page.waitForSelector("#inkweave-story");
  });

  test("should compile without errors", async ({ page }) => {
    const consoleMessages: { type: string; text: string }[] = [];

    page.on("console", (msg) => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
      });
    });

    await page.reload();
    await page.waitForSelector("#inkweave-story");

    const hasCompilationError = consoleMessages.some(
      (msg) =>
        msg.text.includes("Failed to initialize") ||
        msg.text.includes("Compilation failed"),
    );
    expect(hasCompilationError).toBe(false);
  });

  test("should scroll to bottom after content changes", async ({ page }) => {
    // Get initial scroll position
    const initialScrollTop = await page.evaluate(() => {
      const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
      return storyElement ? storyElement.scrollTop : 0;
    });

    // Click first choice to generate more content
    const firstChoice = page.locator('.inkweave-choice', { hasText: "First Choice - Long Content" });
    await firstChoice.click();

    // Wait for content to load and scrolling to complete
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("You selected the first choice which generates a lot of content.");

    // Check that scroll position has changed (scrolled down)
    const finalScrollTop = await page.evaluate(() => {
      const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
      return storyElement ? storyElement.scrollTop : 0;
    });

    // Should have scrolled down significantly
    expect(finalScrollTop).toBeGreaterThan(initialScrollTop + 100);
  });

  test("should scroll to show new choices after selection", async ({ page }) => {
    // Get initial scroll position
    const initialScrollTop = await page.evaluate(() => {
      const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
      return storyElement ? storyElement.scrollTop : 0;
    });

    // Click first choice
    const firstChoice = page.locator('.inkweave-choice', { hasText: "First Choice - Long Content" });
    await firstChoice.click();

    // Wait for new choices to appear
    const continueChoice = page.locator('.inkweave-choice', { hasText: "Continue with more content" });
    await continueChoice.waitFor({ state: "visible" });

    // Get final scroll position
    const finalScrollTop = await page.evaluate(() => {
      const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
      return storyElement ? storyElement.scrollTop : 0;
    });

    // Should have scrolled down after selection
    expect(finalScrollTop).toBeGreaterThan(initialScrollTop);
  });

  test("should handle multiple consecutive scrolls correctly", async ({ page }) => {
    // First selection
    const firstChoice = page.locator('.inkweave-choice', { hasText: "First Choice - Long Content" });
    await firstChoice.click();

    // Wait for content and choices
    const continueChoice = page.locator('.inkweave-choice', { hasText: "Continue with more content" });
    await continueChoice.waitFor({ state: "visible" });

    // Get scroll position after first selection
    const scrollAfterFirst = await page.evaluate(() => {
      const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
      return storyElement ? storyElement.scrollTop : 0;
    });

    // Second selection
    await continueChoice.click();

    // Wait for final content
    const finalContents = page.locator(".inkweave-contents");
    await expect(finalContents).toContainText("Even more content to ensure scrolling is needed.");

    // Get scroll position after second selection
    const scrollAfterSecond = await page.evaluate(() => {
      const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
      return storyElement ? storyElement.scrollTop : 0;
    });

    // Should have scrolled further down
    expect(scrollAfterSecond).toBeGreaterThan(scrollAfterFirst);
  });

  test("should continue scrolling after restart", async ({ page }) => {
    // First playthrough - should scroll normally
    const firstInitialScroll = await page.evaluate(() => {
      const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
      return storyElement ? storyElement.scrollTop : 0;
    });

    const firstChoice = page.locator('.inkweave-choice', { hasText: "First Choice - Long Content" });
    await firstChoice.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("You selected the first choice which generates a lot of content.");

    const firstFinalScroll = await page.evaluate(() => {
      const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
      return storyElement ? storyElement.scrollTop : 0;
    });

    // Should have scrolled during first playthrough
    expect(firstFinalScroll).toBeGreaterThan(firstInitialScroll + 100);

    // Click restart button
    await page.getByRole("button", { name: "Restart game" }).click();
    
    // Wait for restart to complete and initial content to appear
    await page.waitForSelector('.inkweave-choice', { state: "visible" });

    // Ensure we start from top for second playthrough
    await page.evaluate(() => {
      const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
      if (storyElement) {
        storyElement.scrollTo({ top: 0 });
      }
    });
    
    await page.waitForTimeout(50);

    // Second playthrough after restart
    const secondInitialScroll = await page.evaluate(() => {
      const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
      return storyElement ? storyElement.scrollTop : 0;
    });

    const secondChoice = page.locator('.inkweave-choice', { hasText: "First Choice - Long Content" });
    await secondChoice.click();

    await expect(contents).toContainText("You selected the first choice which generates a lot of content.", { timeout: 5000 });

    const secondFinalScroll = await page.evaluate(() => {
      const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
      return storyElement ? storyElement.scrollTop : 0;
    });

    // Should also scroll during second playthrough after restart
    expect(secondFinalScroll).toBeGreaterThan(secondInitialScroll + 100);
  });
});