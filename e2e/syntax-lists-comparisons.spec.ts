import { expect, test } from "@playwright/test";

test.describe("ink syntax - list comparisons", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/lists-comparisons.html");
  });

  test("list greater than operator works", async ({ page }) => {
    await page.getByText("Check A > B").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("A is distinctly bigger than B.");
  });

  test("list greater than or equal operator works", async ({ page }) => {
    await page.getByText("Check A >= B").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("A is never smaller than B.");
  });

  test("list less than operator works", async ({ page }) => {
    await page.getByText("Check B < A").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("B is distinctly smaller than A.");
  });
});