import { expect, test } from "@playwright/test";

test.describe("ink syntax - international characters", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=syntax/international-chars.ink");
    await page.waitForSelector("#inkweave-story");
  });

  test("Cyrillic characters work in variable names", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Cyrillic variable:");
    await expect(contents).toContainText("Cyrillic greeting");
  });

  test("Greek characters work in variable names", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Greek variable:");
    await expect(contents).toContainText("Greek greeting");
  });

  test("Cyrillic knot names work", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Cyrillic variable:");
  });

  test("Cyrillic choice text displays correctly", async ({ page }) => {
    const choiceItems = page.locator(".inkweave-choice");
    await expect(choiceItems.first()).toContainText("Показать русский текст");
  });

  test("Greek choice text displays correctly", async ({ page }) => {
    const choiceItems = page.locator(".inkweave-choice");
    await expect(choiceItems.nth(1)).toContainText("Ελληνικό κείμενο");
  });

  test("Cyrillic content displays after choice", async ({ page }) => {
    await page.getByText("Показать русский текст").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Это русский текст.");
  });

  test("Greek content displays after choice", async ({ page }) => {
    await page.getByText("Ελληνικό κείμενο").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Αυτό είναι ελληνικό κείμενο.");
  });
});