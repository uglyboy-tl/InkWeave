import { expect, test } from "@playwright/test";

test.describe("ink syntax - reusing lists", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e/fixtures/syntax/lists-reusing.html");
  });

  test("same list can be used for multiple variables", async ({ page }) => {
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Kettle: cold, Pot: cold");
  });

  test("each variable can be changed independently", async ({ page }) => {
    await page.getByText("Boil kettle").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Kettle: boiling");
  });

  test("second variable can also be changed", async ({ page }) => {
    await page.getByText("Boil pot").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Pot: boiling");
  });

  test("both variables can be queried separately", async ({ page }) => {
    await page.getByText("Boil kettle").click();
    await page.getByText("Check both cold").click();
    const contents = page.locator(".inkweave-contents");
    await expect(contents).toContainText("Kettle is hot.");
    await expect(contents).toContainText("Pot is cold.");
  });
});