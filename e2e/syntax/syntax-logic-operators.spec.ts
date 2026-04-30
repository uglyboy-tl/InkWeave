import { expect, test } from "@playwright/test";

test.describe("ink syntax - logic operators", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=syntax/logic-operators.ink");
    await page.waitForSelector("#inkweave-story");
  });

  test("NOT operator shows option when condition is false", async ({ page }) => {
    const choiceItems = page.locator(".inkweave-choice");
    await expect(choiceItems.first()).toContainText("Visit London");
  });

  test("NOT operator hides option when condition is true", async ({ page }) => {
    await page.getByText("Visit London").click();
    const choiceTexts = await page.locator(".inkweave-choice").allTextContents();
    expect(choiceTexts).not.toContain(expect.stringContaining("Visit London"));
  });

  test("AND operator requires both conditions", async ({ page }) => {
    await page.getByText("Visit London").click();
    const choiceItems = page.locator(".inkweave-choice");
    await expect(choiceItems.first()).toContainText("Go to Paris");
  });

  test("AND operator hides option when first condition false", async ({ page }) => {
    const choiceTexts = await page.locator(".inkweave-choice").allTextContents();
    expect(choiceTexts).not.toContain(expect.stringContaining("Go to Paris"));
  });

  test("multiple AND conditions work correctly", async ({ page }) => {
    await page.getByText("Visit London").click();
    await page.getByText("Go to Paris").click();
    const choiceItems = page.locator(".inkweave-choice");
    await expect(choiceItems.first()).toContainText("Visit Rome");
  });

  test("all conditions met shows final option", async ({ page }) => {
    await page.getByText("Visit London").click();
    await page.getByText("Go to Paris").click();
    await page.getByText("Visit Rome").click();
    const choiceItems = page.locator(".inkweave-choice");
    await expect(choiceItems.first()).toContainText("All cities visited");
  });

  test("greater than comparison works", async ({ page }) => {
    const choiceTexts = await page.locator(".inkweave-choice").allTextContents();
    expect(choiceTexts.some((t) => t.includes("Low score option"))).toBe(true);
    expect(choiceTexts.some((t) => t.includes("High score option"))).toBe(false);
  });

  test("less than or equal comparison works", async ({ page }) => {
    const choiceTexts = await page.locator(".inkweave-choice").allTextContents();
    expect(choiceTexts.some((t) => t.includes("Low score option"))).toBe(true);
  });
});
