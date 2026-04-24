import { expect, test } from "@playwright/test";

test.describe("ink syntax - multi-list lists", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/syntax/lists-multi-list.html");
  });

  test("variable can hold values from multiple lists", async ({ page }) => {
    await page.getByText("Describe Ballroom").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Alfred is here.");
  });

  test("multi-list variable shows all values", async ({ page }) => {
    await page.getByText("Describe Ballroom").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Batman is here.");
    await expect(contents).toContainText("A newspaper lies here.");
  });

  test("different multi-list variables have different values", async ({ page }) => {
    await page.getByText("Describe Hallway").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Robin is here.");
    await expect(contents).toContainText("A champagne glass lies here.");
  });

  test("has operator works with multi-list variables", async ({ page }) => {
    await page.getByText("Check Ballroom has Batman").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Batman is in the Ballroom.");
  });
});