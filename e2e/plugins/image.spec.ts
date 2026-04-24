import { test, expect } from "@playwright/test";

test.describe("Image Plugin", () => {
  test("should compile without errors", async ({ page }) => {
    const consoleMessages: { type: string; text: string }[] = [];
    
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text()
      });
    });
    
    await page.goto("/e2e/fixtures/plugins/image.html");
    await page.waitForSelector(".inkweave-story");
    
    // Verify no compilation errors
    const hasCompilationError = consoleMessages.some(msg => 
      msg.text.includes('Failed to initialize') && 
      msg.text.includes('Compilation failed')
    );
    expect(hasCompilationError).toBe(false);
  });
  test("should not show image container when first image is non-existent", async ({ page }) => {
    await page.goto("/e2e/fixtures/plugins/image.html");
    
    // Wait for the story to load
    await page.waitForSelector(".inkweave-story");
    
    // Should not show image container (since first image doesn't exist)
    const initialImageContainer = page.locator("#inkweave-image");
    await expect(initialImageContainer).not.toBeVisible();
    
    // Verify that the original content is present
    const initialContents = page.locator(".inkweave-contents");
    await expect(initialContents).toContainText("This is a combined test for image plugin.");
  });

  test("should handle non-existent image gracefully in valid flow", async ({ page }) => {
    await page.goto("/e2e/fixtures/plugins/image.html");
    await page.waitForSelector(".inkweave-story");
    
    // Go to valid flow first
    await page.locator('.inkweave-choice:has-text("Go to valid image flow")').click();
    await page.locator(".inkweave-contents").waitFor({ state: "visible" });
    
    // Click on "Load non-existent image" choice
    const nonExistentChoice = page.locator('.inkweave-choice:has-text("Load non-existent image")');
    await nonExistentChoice.click();
    
    // Verify content and that original text is preserved
    const contentsAfterNonExistent = page.locator(".inkweave-contents");
    await expect(contentsAfterNonExistent).toContainText("The image should not display, but content should continue.");
    await expect(contentsAfterNonExistent).toContainText("This is a test for complete image flow.");
    
    // Image container should not be visible
    const imageAfterNonExistent = page.locator("#inkweave-image");
    await expect(imageAfterNonExistent).not.toBeVisible();
  });

  test("should replace image with different image when # image tag is used", async ({ page }) => {
    await page.goto("/e2e/fixtures/plugins/image.html");
    await page.waitForSelector(".inkweave-story");
    
    // Go to valid flow first
    await page.locator('.inkweave-choice:has-text("Go to valid image flow")').click();
    await page.locator(".inkweave-contents").waitFor({ state: "visible" });
    
    // Click on "Replace with different image" choice
    const replaceChoice = page.locator('.inkweave-choice:has-text("Replace with different image")');
    await replaceChoice.click();
    
    // Verify content and new image
    const contentsAfterReplace = page.locator(".inkweave-contents");
    await expect(contentsAfterReplace).toContainText("The original image should be replaced with a different one.");
    
    // Image container should be visible with the new image
    const imageAfterReplace = page.locator("#inkweave-image");
    await expect(imageAfterReplace).toBeVisible();
    const newImg = page.locator("#inkweave-image img");
    await expect(newImg).toBeVisible();
    await expect(newImg).toHaveAttribute("src", "assets/test-image2.png");
  });

  test("should handle complete image flow: show -> clear -> show again", async ({ page }) => {
    await page.goto("/e2e/fixtures/plugins/image.html");
    await page.waitForSelector(".inkweave-story");
    
    // Go to valid flow first
    await page.locator('.inkweave-choice:has-text("Go to valid image flow")').click();
    await page.locator(".inkweave-contents").waitFor({ state: "visible" });
    
    // Initially should show the image
    const initialImageContainer = page.locator("#inkweave-image");
    await expect(initialImageContainer).toBeVisible();
    const initialImg = page.locator("#inkweave-image img");
    await expect(initialImg).toBeVisible();
    await expect(initialImg).toHaveAttribute("src", "assets/test-image.png");
    
    // Click on "Clear the image" choice
    const clearChoice = page.locator('.inkweave-choice:has-text("Clear the image")');
    await clearChoice.click();
    
    // Verify content and that original text is cleared
    const contentsAfterClear = page.locator(".inkweave-contents");
    await expect(contentsAfterClear).toContainText("The image should be cleared.");
    await expect(contentsAfterClear).not.toContainText("This is a test for complete image flow.");
    
    // Image container should not be visible after clear
    const imageAfterClear = page.locator("#inkweave-image");
    await expect(imageAfterClear).not.toBeVisible();
    
    // Click on "Show image again" choice
    const showAgainChoice = page.locator('.inkweave-choice:has-text("Show image again")');
    await showAgainChoice.click();
    
    // Verify content and image restoration
    const contentsAfterShowAgain = page.locator(".inkweave-contents");
    await expect(contentsAfterShowAgain).toContainText("The image should appear again.");
    
    // Image container should be visible again with correct src
    const finalImageContainer = page.locator("#inkweave-image");
    await expect(finalImageContainer).toBeVisible();
    const finalImg = page.locator("#inkweave-image img");
    await expect(finalImg).toBeVisible();
    await expect(finalImg).toHaveAttribute("src", "assets/test-image.png");
  });

  test("should restore image state correctly after restart", async ({ page }) => {
    await page.goto("/e2e/fixtures/plugins/image.html");
    await page.waitForSelector(".inkweave-story");
    
    // Initially should not show image container (restart state)
    const restartInitialImageContainer = page.locator("#inkweave-image");
    await expect(restartInitialImageContainer).not.toBeVisible();
    
    // Click on "Go to valid image flow" choice after restart
    await page.locator('.inkweave-choice:has-text("Go to valid image flow")').click();
    
    // After restart and navigation, should show image container again
    const restartImageContainer = page.locator("#inkweave-image");
    await expect(restartImageContainer).toBeVisible();
    const restartImg = page.locator("#inkweave-image img");
    await expect(restartImg).toBeVisible();
    await expect(restartImg).toHaveAttribute("src", "assets/test-image.png");
  });
});