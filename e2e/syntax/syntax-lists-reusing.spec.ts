import { expect, test } from "@playwright/test";
import { gotoFixture } from "../helpers";

test.describe("ink syntax - reusing lists", () => {
  test.beforeEach(async ({ page }) => {
    await gotoFixture(page, "story=syntax/lists-reusing.ink");
    await page.waitForSelector("#inkweave-story");
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
