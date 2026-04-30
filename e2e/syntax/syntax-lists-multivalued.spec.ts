import { expect, test } from "@playwright/test";

test.describe("ink syntax - multivalued lists", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/index.html?story=syntax/lists-multivalued.ink");
    await page.waitForSelector("#inkweave-story");
  });

  test("list can hold single value", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Skills: strong");
  });

  test("list values can be added", async ({ page }) => {
    await page.getByText("Add fast skill").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Now have:");
  });

  test("list can hold multiple values", async ({ page }) => {
    await page.getByText("Add fast skill").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("fast");
  });

  test("has operator checks membership", async ({ page }) => {
    await page.getByText("Check has strong").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Hero is strong.");
  });
});
