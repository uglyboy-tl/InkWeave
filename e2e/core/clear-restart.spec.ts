import { expect, test } from "@playwright/test";

test.describe("clear and restart tags", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=core/clear-restart.ink");
  });

  test("clear tag should clear previous content", async ({ page }) => {
    // Initially should show the initial content
    const initialContents = page.locator(".inkweave-contents");
    await expect(initialContents).toContainText("This is a test for clear and restart functionality.");
    
    // Click on "Test clear tag" choice
    const clearChoice = page.locator('.inkweave-choice:has-text("Test clear tag")');
    await clearChoice.click();
    
    // After clear, should only show "Content after clear." 
    // and NOT show the initial content
    const contentsAfterClear = page.locator(".inkweave-contents");
    await expect(contentsAfterClear).toContainText("Content after clear.");
    await expect(contentsAfterClear).not.toContainText("This is a test for clear and restart functionality.");
  });

  test("restart tag should restart the story and show initial content", async ({ page }) => {
    // Initially should show the initial content
    const initialContents = page.locator(".inkweave-contents");
    await expect(initialContents).toContainText("This is a test for clear and restart functionality.");
    
    // Click on "Test restart tag" choice
    const restartChoice = page.locator('.inkweave-choice:has-text("Test restart tag")');
    await restartChoice.click();
    
    // After restart, should show the initial content again
    const contentsAfterRestart = page.locator(".inkweave-contents");
    await expect(contentsAfterRestart).toContainText("This is a test for clear and restart functionality.");
    
    // Should have the same choices as initial state
    const choicesAfterRestart = page.locator(".inkweave-choice");
    await expect(choicesAfterRestart).toHaveCount(3);
  });

  test("normal choice without clear/restart should preserve content", async ({ page }) => {
    // Initially should show the initial content
    const initialContents = page.locator(".inkweave-contents");
    await expect(initialContents).toContainText("This is a test for clear and restart functionality.");
    
    // Click on "Normal choice" choice
    const normalChoice = page.locator('.inkweave-choice:has-text("Normal choice")');
    await normalChoice.click();
    
    // Should show both initial content and new content
    const contentsAfterNormal = page.locator(".inkweave-contents");
    await expect(contentsAfterNormal).toContainText("This is a test for clear and restart functionality.");
    await expect(contentsAfterNormal).toContainText("Normal content without clear or restart.");
  });
});