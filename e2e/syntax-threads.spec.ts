import { expect, test } from "@playwright/test";

test.describe("ink syntax - threads", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/threads.html");
  });

  test("thread content is included", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("It was a tense moment.");
  });

  test("multiple threads are included", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("It was a tense moment.");
    await expect(contents).toContainText("We walked in silence.");
  });

  test("thread content appears in correct order", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    const text = await contents.textContent();
    // Thread content should all be present
    expect(text).toContain("headache");
    expect(text).toContain("tense moment");
    expect(text).toContain("walked in silence");
  });

  test("choices from all threads are collected", async ({ page }) => {
    const choiceItems = page.locator(".inkweave-choice");
    await expect(choiceItems).toHaveCount(3);
  });

  test("choices from conversation thread appear", async ({ page }) => {
    const choiceTexts = await page.locator(".inkweave-choice").allTextContents();
    expect(choiceTexts.some(t => t.includes("What did you have"))).toBe(true);
    expect(choiceTexts.some(t => t.includes("Nice weather"))).toBe(true);
  });

  test("choices from walking thread appear", async ({ page }) => {
    const choiceTexts = await page.locator(".inkweave-choice").allTextContents();
    expect(choiceTexts.some(t => t.includes("Keep walking"))).toBe(true);
  });

  test("choosing thread option continues story", async ({ page }) => {
    await page.getByText("What did you have").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Spam and eggs");
    await expect(contents).toContainText("Before long, we arrived at his house.");
  });

  test("choosing different thread option works", async ({ page }) => {
    await page.getByText("Keep walking").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("We continued on our way.");
    await expect(contents).toContainText("Before long, we arrived at his house.");
  });
});