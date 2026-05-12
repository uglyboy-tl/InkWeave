import { expect, test } from "@playwright/test";
import { gotoFixture } from "../helpers";

test.describe("Scroll After Choice Plugin", () => {
  test.beforeEach(async ({ page }) => {
    await gotoFixture(page, "story=plugins/scroll-after-choice.ink&plugins=scroll-after-choice");
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
      (msg) => msg.text.includes("Failed to initialize") || msg.text.includes("Compilation failed"),
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
    const firstChoice = page.locator(".inkweave-choice", {
      hasText: "First Choice - Long Content",
    });
    await firstChoice.click();

    // Wait for content to load and scrolling to complete
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText(
      "You selected the first choice which generates a lot of content.",
    );

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
    const firstChoice = page.locator(".inkweave-choice", {
      hasText: "First Choice - Long Content",
    });
    await firstChoice.click();

    // Wait for new choices to appear
    const continueChoice = page.locator(".inkweave-choice", {
      hasText: "Continue with more content",
    });
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
    const firstChoice = page.locator(".inkweave-choice", {
      hasText: "First Choice - Long Content",
    });
    await firstChoice.click();

    // Wait for content and choices
    const continueChoice = page.locator(".inkweave-choice", {
      hasText: "Continue with more content",
    });
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

    const firstChoice = page.locator(".inkweave-choice", {
      hasText: "First Choice - Long Content",
    });
    await firstChoice.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText(
      "You selected the first choice which generates a lot of content.",
    );

    const firstFinalScroll = await page.evaluate(() => {
      const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
      return storyElement ? storyElement.scrollTop : 0;
    });

    // Should have scrolled during first playthrough
    expect(firstFinalScroll).toBeGreaterThan(firstInitialScroll + 100);

    // Click restart button
    await page.getByRole("button", { name: "Restart game" }).click();

    // Wait for restart to complete and initial content to appear
    await page.waitForSelector(".inkweave-choice", { state: "visible" });

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

    const secondChoice = page.locator(".inkweave-choice", {
      hasText: "First Choice - Long Content",
    });
    await secondChoice.click();

    await expect(contents).toContainText(
      "You selected the first choice which generates a lot of content.",
      { timeout: 5000 },
    );

    const secondFinalScroll = await page.evaluate(() => {
      const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
      return storyElement ? storyElement.scrollTop : 0;
    });

    // Should also scroll during second playthrough after restart
    expect(secondFinalScroll).toBeGreaterThan(secondInitialScroll + 100);
  });

  test("should scroll to bottom after clear tag", async ({ page }) => {
    // Scroll to top to ensure clean state
    await page.evaluate(() => {
      const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
      if (storyElement) storyElement.scrollTo({ top: 0 });
    });
    await page.waitForTimeout(100);

    const initialScrollTop = await page.evaluate(() => {
      const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
      return storyElement ? storyElement.scrollTop : 0;
    });

    // Click the choice that goes to clear_test section (has # clear tag)
    const clearChoice = page.locator(".inkweave-choice", {
      hasText: "Test clear functionality",
    });
    await clearChoice.click();

    // Wait for content after clear to appear
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Content after clear tag.");

    // Give time for smooth scroll to complete
    await page.waitForTimeout(100);

    const finalScrollTop = await page.evaluate(() => {
      const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
      return storyElement ? storyElement.scrollTop : 0;
    });

    // After clear, new content appears and should cause scrolling
    expect(finalScrollTop).toBeGreaterThan(initialScrollTop + 20);
  });

  test("should scroll to choices after clear tag with fade-effect enabled", async ({ page }) => {
    // Navigate with both scroll-after-choice and fade-effect plugins
    await gotoFixture(
      page,
      "story=plugins/scroll-after-choice.ink&plugins=scroll-after-choice,fade-effect",
    );
    await page.waitForSelector("#inkweave-story");

    // Wait for initial content + choices to fully appear (fade-in takes time)
    await page.waitForTimeout(2000);

    // Scroll to top
    await page.evaluate(() => {
      const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
      if (storyElement) storyElement.scrollTo({ top: 0 });
    });
    await page.waitForTimeout(100);

    const initialScrollTop = await page.evaluate(() => {
      const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
      return storyElement ? storyElement.scrollTop : 0;
    });

    // Click the clear-test choice
    const clearChoice = page.locator(".inkweave-choice", {
      hasText: "Test clear functionality",
    });
    await clearChoice.click();

    // Wait for content after clear to appear AND choices to become visible
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Content after clear tag.");

    // Wait for fade-effect to complete and choices to appear
    const choices = page.locator(".inkweave-choices");
    await expect(choices).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(500);

    const finalScrollTop = await page.evaluate(() => {
      const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
      return storyElement ? storyElement.scrollTop : 0;
    });

    // After clear with fade-effect, the page should scroll to show choices
    expect(finalScrollTop).toBeGreaterThan(initialScrollTop + 20);
  });
});

test("should scroll to bottom after loading a save", async ({ page }) => {
  // Navigate with scroll-after-choice + memory plugins
  await gotoFixture(
    page,
    "story=plugins/scroll-after-choice.ink&plugins=scroll-after-choice,memory",
  );
  await page.waitForSelector("#inkweave-story");

  const contents = page.locator(".inkweave-contents");

  // Click first choice to advance the story
  const firstChoice = page.locator(".inkweave-choice", {
    hasText: "First Choice - Long Content",
  });
  await firstChoice.click();
  await expect(contents).toContainText(
    "You selected the first choice which generates a lot of content.",
  );

  // Wait for content to load fully
  await page.waitForTimeout(500);

  // Save current state
  await page.getByRole("button", { name: "Save game" }).click();
  const saveModal = page.locator("dialog");
  await expect(saveModal).toBeVisible();
  await saveModal.getByRole("button", { name: /Slot 1/i }).click();

  // Go back to start
  const backChoice = page.locator(".inkweave-choice", {
    hasText: "Continue with more content",
  });
  await backChoice.click();
  await expect(contents).toContainText("Even more content to ensure scrolling is needed.");
  await page.waitForTimeout(500);

  // Scroll to top to reset position
  await page.evaluate(() => {
    const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
    if (storyElement) storyElement.scrollTo({ top: 0 });
  });
  await page.waitForTimeout(100);

  const initialScrollTop = await page.evaluate(() => {
    const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
    return storyElement ? storyElement.scrollTop : 0;
  });

  // Load the saved game
  await page.getByRole("button", { name: "Restore saved game" }).click();
  const loadModal = page.locator("dialog");
  await expect(loadModal).toBeVisible();
  await loadModal.getByRole("button", { name: /Slot 1/i }).click();

  // Wait for loaded content to appear
  await expect(contents).toContainText(
    "You selected the first choice which generates a lot of content.",
  );
  // Wait for smooth scroll to complete
  await page.waitForTimeout(500);

  const finalScrollTop = await page.evaluate(() => {
    const storyElement = document.querySelector('[data-inkweave="story"]') as HTMLElement;
    return storyElement ? storyElement.scrollTop : 0;
  });

  // After loading a save, content appears and should cause scrolling
  expect(finalScrollTop).toBeGreaterThan(initialScrollTop + 20);
});
