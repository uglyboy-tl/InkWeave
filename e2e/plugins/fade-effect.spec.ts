import { test, expect } from "@playwright/test";

test.describe("Fade Effect Plugin", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=plugins/fade-effect.ink&plugins=fade-effect");
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

  test("should gradually reveal content lines with default delay", async ({ page }) => {
    // Wait for initial content to load
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("This is the beginning of a story to test the fade effect plugin.");

    const contentLines = page.locator(".inkweave-content-line");
    const lineCount = await contentLines.count();
    expect(lineCount).toBeGreaterThanOrEqual(6);

    // Wait for fade effect to start but not complete
    await page.waitForTimeout(300);

    // At this point, first few lines should be visible, last lines should not be fully visible
    const middleLineIndex = Math.floor((lineCount - 1) / 2);
    const middleLineOpacity = await contentLines.nth(middleLineIndex).evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });

    // Middle line should have some visibility but not be fully opaque
    expect(parseFloat(middleLineOpacity)).toBeGreaterThan(0.2);
    expect(parseFloat(middleLineOpacity)).toBeLessThan(0.8);

    // Wait for complete fade in
    await page.waitForTimeout(800);

    // All lines should now be fully visible
    const lastContentLineIndex = lineCount - 2;
    const lastLineOpacity = await contentLines.nth(lastContentLineIndex).evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });
    expect(parseFloat(lastLineOpacity)).toBeCloseTo(1, 0.1);
  });

  test("should apply custom line delay when specified", async ({ page }) => {
    // Go to custom delay section
    const customDelayChoice = page.locator('.inkweave-choice', { hasText: "Test with custom line delay" });
    await customDelayChoice.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Testing custom line delay of 100ms.");

    const contentLines = page.locator(".inkweave-content-line");
    const lineCount = await contentLines.count();
    expect(lineCount).toBeGreaterThanOrEqual(6);

    // With custom delay (0.1s vs default 0.05s), it should take longer
    // Wait for time that would be sufficient for default but not custom
    await page.waitForTimeout(600);

    // Last lines should still be fading in (not fully visible)
    const lastContentLineIndex = lineCount - 2;
    const lastLineOpacity = await contentLines.nth(lastContentLineIndex).evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });
    expect(parseFloat(lastLineOpacity)).toBeLessThan(0.7); // Not fully visible yet

    // Wait for full completion with custom delay
    await page.waitForTimeout(500);

    const lastLineOpacityFinal = await contentLines.nth(lastContentLineIndex).evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });
    expect(parseFloat(lastLineOpacityFinal)).toBeCloseTo(1, 0.1);
  });

  test("should display content immediately when linedelay is 0", async ({ page }) => {
    // Go to no fade section
    const noFadeChoice = page.locator('.inkweave-choice', { hasText: "Test with no fade effect" });
    await noFadeChoice.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Testing with no fade effect (instant display).");

    // Wait a moment for render
    await page.waitForTimeout(200);

    const contentLines = page.locator(".inkweave-content-line");
    const lineCount = await contentLines.count();
    expect(lineCount).toBeGreaterThanOrEqual(6);

    // All lines should be immediately visible (no fade animation)
    const firstLineOpacity = await contentLines.nth(0).evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });
    expect(parseFloat(firstLineOpacity)).toBeCloseTo(1, 0.1);

    const lastContentLineIndex = lineCount - 2;
    const lastLineOpacity = await contentLines.nth(lastContentLineIndex).evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });
    expect(parseFloat(lastLineOpacity)).toBeCloseTo(1, 0.1);
  });

  test("should work correctly after restart", async ({ page }) => {
    // Make a choice first to ensure we have content
    const continueChoice = page.locator('.inkweave-choice', { hasText: "Continue with more fade effect content" });
    await continueChoice.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Additional content after making a choice.");

    // Click restart button
    await page.getByRole("button", { name: "Restart game" }).click();

    // Wait for restart to complete
    await page.waitForSelector('.inkweave-choice', { state: "visible" });

    // After restart, make sure we can see the initial content
    await expect(contents).toContainText("This is the beginning of a story to test the fade effect plugin.");

    // The fade effect should work on the restarted content
    const contentLines = page.locator(".inkweave-content-line");
    const lineCount = await contentLines.count();
    expect(lineCount).toBeGreaterThanOrEqual(6);

    // Wait and verify that content becomes fully visible
    await page.waitForTimeout(1000);

    const lastContentLineIndex = lineCount - 2;
    const lastLineOpacity = await contentLines.nth(lastContentLineIndex).evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });
    expect(parseFloat(lastLineOpacity)).toBeCloseTo(1, 0.1);
  });

  test("should delay choices display until content fade-in completes", async ({ page }) => {
    // Wait for initial content to load completely
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("This is the beginning of a story to test the fade effect plugin.");

    // Wait for all content lines to be fully visible (wait for fade effect to complete)
    await page.waitForTimeout(1000);

    const contentLines = page.locator(".inkweave-content-line");
    const lineCount = await contentLines.count();
    expect(lineCount).toBeGreaterThanOrEqual(6);

    // Get the last content line (excluding divider)
    const lastContentLineIndex = lineCount - 2;
    const lastLineOpacity = await contentLines.nth(lastContentLineIndex).evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });

    const choices = page.locator(".inkweave-choices");
    const choicesOpacity = await choices.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });

    // Both should be fully visible now
    expect(parseFloat(lastLineOpacity)).toBeCloseTo(1, 0.1);
    expect(parseFloat(choicesOpacity)).toBeCloseTo(1, 0.1);

    // Verify choices are actually visible and interactive
    await expect(choices).toBeVisible();
    const choiceCount = await choices.locator("li").count();
    expect(choiceCount).toBeGreaterThanOrEqual(3);
  });

  test("should maintain sequential display after user interactions", async ({ page }) => {
    // Make a choice to trigger new content
    const continueChoice = page.locator('.inkweave-choice', { hasText: "Continue with more fade effect content" });
    await continueChoice.click();

    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Additional content after making a choice.");

    // Wait for new content to fully fade in
    await page.waitForTimeout(1000);

    const contentLines = page.locator(".inkweave-content-line");
    const newLineCount = await contentLines.count();
    expect(newLineCount).toBeGreaterThan(6);

    // The last new content line
    const lastNewLineIndex = newLineCount - 2;
    const lastNewLineOpacity = await contentLines.nth(lastNewLineIndex).evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });

    const choices = page.locator(".inkweave-choices");
    const choicesOpacity = await choices.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });

    // Both should be fully visible
    expect(parseFloat(lastNewLineOpacity)).toBeCloseTo(1, 0.1);
    expect(parseFloat(choicesOpacity)).toBeCloseTo(1, 0.1);
  });

  test("should persist linedelay settings through save and load", async ({ page }) => {
    // This test requires the memory plugin for save/load functionality
    await page.goto("/e2e/fixtures/index.html?story=plugins/fade-effect.ink&plugins=fade-effect,memory");
    await page.waitForSelector("#inkweave-story");

    // Go to no fade section (linedelay=0)
    const noFadeChoice = page.locator('.inkweave-choice', { hasText: "Test with no fade effect" });
    await noFadeChoice.click();
    
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Testing with no fade effect (instant display).");
    
    // Verify no fade effect: content appears immediately
    await page.waitForTimeout(200);
    const contentLines = page.locator(".inkweave-content-line");
    const lastContentLineIndex = (await contentLines.count()) - 2;
    const lastLineOpacity = await contentLines.nth(lastContentLineIndex).evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });
    expect(parseFloat(lastLineOpacity)).toBeCloseTo(1, 0.1);
    
    // Save the game
    await page.getByRole("button", { name: "Save game" }).click();
    const saveModal = page.locator("dialog");
    await expect(saveModal).toBeVisible();
    await saveModal.getByRole("button", { name: /Slot 1/i }).click();
    
    // Go to custom delay section (linedelay=0.1) to verify different behavior
    const backToMenu = page.locator('.inkweave-choice', { hasText: "Back to start" });
    await backToMenu.click();
    
    const customDelayChoice = page.locator('.inkweave-choice', { hasText: "Test with custom line delay" });
    await customDelayChoice.click();
    
    await expect(contents).toContainText("Testing custom line delay of 100ms.");
    
    // Verify custom delay: after 600ms, content should still be fading in
    await page.waitForTimeout(600);
    const contentLinesAfterCustom = page.locator(".inkweave-content-line");
    const lastContentLineIndexAfterCustom = (await contentLinesAfterCustom.count()) - 2;
    const lastLineOpacityCustom = await contentLinesAfterCustom.nth(lastContentLineIndexAfterCustom).evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });
    // With 100ms delay, should not be fully visible after 600ms
    expect(parseFloat(lastLineOpacityCustom)).toBeLessThan(0.8);
    
    // Load the saved game
    await page.getByRole("button", { name: "Restore saved game" }).click();
    const loadModal = page.locator("dialog");
    await expect(loadModal).toBeVisible();
    await loadModal.getByRole("button", { name: /Slot 1/i }).click();
    
    // After loading, we should be back in the no fade section
    await expect(contents).toContainText("Testing with no fade effect (instant display).");
    
    // Verify no fade effect is still active: content appears immediately
    await page.waitForTimeout(200);
    const contentLinesAfterLoad = page.locator(".inkweave-content-line");
    const lastContentLineIndexAfterLoad = (await contentLinesAfterLoad.count()) - 2;
    const lastLineOpacityAfterLoad = await contentLinesAfterLoad.nth(lastContentLineIndexAfterLoad).evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });
    expect(parseFloat(lastLineOpacityAfterLoad)).toBeCloseTo(1, 0.1);
  });
});