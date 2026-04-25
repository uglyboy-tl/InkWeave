import { expect, test } from "@playwright/test";

test.describe("ink syntax - OR operator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=syntax/or-operator.ink");
    await page.waitForSelector(".inkweave-story");
  });

  test("OR option hidden when both conditions false", async ({ page }) => {
    const choiceTexts = await page.locator(".inkweave-choice").allTextContents();
    expect(choiceTexts.some(t => t.includes("Open the door"))).toBe(false);
  });

  test("OR option shows when first condition true", async ({ page }) => {
    await page.getByText("Get key").click();
    const choiceTexts = await page.locator(".inkweave-choice").allTextContents();
    expect(choiceTexts.some(t => t.includes("Open the door"))).toBe(true);
  });

  test("OR option shows when second condition true", async ({ page }) => {
    await page.getByText("Get lockpick").click();
    const choiceTexts = await page.locator(".inkweave-choice").allTextContents();
    expect(choiceTexts.some(t => t.includes("Open the door"))).toBe(true);
  });

  test("OR option shows when both conditions true", async ({ page }) => {
    await page.getByText("Get key").click();
    await page.getByText("Get lockpick").click();
    const choiceTexts = await page.locator(".inkweave-choice").allTextContents();
    expect(choiceTexts.some(t => t.includes("Open the door"))).toBe(true);
  });

  test("OR with different variables works", async ({ page }) => {
    await page.getByText("Visit city").click();
    const choiceTexts = await page.locator(".inkweave-choice").allTextContents();
    expect(choiceTexts.some(t => t.includes("Report your travels"))).toBe(true);
  });

  test("OR option shows with either variable true", async ({ page }) => {
    await page.getByText("Visit town").click();
    const choiceTexts = await page.locator(".inkweave-choice").allTextContents();
    expect(choiceTexts.some(t => t.includes("Report your travels"))).toBe(true);
  });
});